import type { CarbonAd, RawAd } from "./types.js";
import { DEFAULTS, SDK_CLIENT, SDK_VERSION, SRV_HOST } from "./defaults.js";
import { applyTimestamp, ensureHttps, htmlDecode } from "./utils.js";

export interface FetchAdOptions {
  serve?: string;
  placement?: string;
}

function buildHeaders(options: Required<FetchAdOptions>): Record<string, string> {
  const config = `(serve:${encodeURIComponent(options.serve)};placement:${encodeURIComponent(options.placement)})`;

  // x-origin is required — the ad server uses it to determine which ad fields to return.
  // In browsers, this would be window.location. In Node/CLI, we use a placeholder.
  const origin =
    typeof globalThis.window !== "undefined"
      ? globalThis.window.location.toString()
      : "https://localhost:3000";

  return {
    "x-origin": origin,
    "x-client": `${SDK_CLIENT}/${SDK_VERSION} ${config}`,
  };
}

function processAd(raw: RawAd, placement: string): CarbonAd {
  const statlink = raw.statlink || raw.fallbackLink || "";
  const link = statlink ? applyTimestamp(ensureHttps(statlink)) : "";

  const statviewUrl =
    raw.should_record_viewable === "1" && raw.statview
      ? `${raw.statview}?segment=placement:${placement}`
      : "";

  // Standard ads only have `description`, no `company` field.
  // For terminal display, description is the primary text.
  const description = htmlDecode(raw.description || raw.title || "");
  const company = htmlDecode(raw.company || "");

  return {
    company,
    description,
    link,
    statlink,
    statviewUrl,
    image: raw.image || "",
    smallImage: raw.smallImage || "",
    largeImage: raw.largeImage || "",
    logo: raw.logo || "",
    backgroundColor: raw.backgroundColor || "",
    callToAction: htmlDecode(raw.callToAction || "Learn More"),
    companyTagline: htmlDecode(raw.companyTagline || ""),
    adViaLink: raw.ad_via_link || "",
    pixel: raw.pixel || "",
  };
}

/** Fetch an ad from the Carbon Ads API */
export async function fetchAd(options?: FetchAdOptions): Promise<CarbonAd | null> {
  const serve = options?.serve || DEFAULTS.serve;
  const placement = options?.placement || DEFAULTS.placement;

  const url = `https://${SRV_HOST}/ads/${encodeURIComponent(serve)}.json?segment=placement:${encodeURIComponent(placement)}`;
  const headers = buildHeaders({ serve, placement });

  try {
    const response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return null;

    const data = await response.json();

    if (!data || !Array.isArray(data.ads) || data.ads.length === 0) {
      return null;
    }

    return processAd(data.ads[0], placement);
  } catch {
    return null;
  }
}
