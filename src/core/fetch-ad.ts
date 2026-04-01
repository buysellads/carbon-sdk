import type { CarbonAd, RawAd } from "./types.js";
import { DEFAULTS, SDK_CLIENT, SDK_VERSION, SRV_HOST } from "./defaults.js";
import { applyTimestamp, ensureHttps, htmlDecode } from "./utils.js";

export interface FetchAdOptions {
  serve?: string;
  placement?: string;
}

function buildHeaders(
  options: Required<FetchAdOptions>,
): Record<string, string> {
  const config = `(serve:${encodeURIComponent(options.serve)};placement:${encodeURIComponent(options.placement)})`;

  // x-origin tells the ad server which site is requesting the ad, so it can
  // select the right campaign and return the correct fields. In browsers this
  // is window.location. In Node/CLI there is no location, so we send a
  // placeholder — the server still returns ads, but targeting is zone-based only.
  const origin =
    typeof globalThis.window !== "undefined"
      ? globalThis.window.location.toString()
      : "https://localhost:3000";

  return {
    "x-origin": origin,
    "x-client": `${SDK_CLIENT}/${SDK_VERSION} ${config}`,
  };
}

/** Map raw API response to a normalized CarbonAd object.
 *  Fallback chains reflect how the ad server populates fields:
 *  - statlink → fallbackLink: click-tracking URL with fallback
 *  - description → title: some campaigns only set title
 *  - callToAction passes through as-is (empty string if not set by campaign)
 */
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
    callToAction: htmlDecode(raw.callToAction || ""),
    companyTagline: htmlDecode(raw.companyTagline || ""),
    adViaLink: raw.ad_via_link || "",
    pixel: raw.pixel || "",
  };
}

/** Fetch an ad from the Carbon Ads API */
export async function fetchAd(
  options?: FetchAdOptions,
): Promise<CarbonAd | null> {
  const serve = options?.serve || DEFAULTS.serve;
  const placement = options?.placement || DEFAULTS.placement;

  const url = `https://${SRV_HOST}/ads/${encodeURIComponent(serve)}.json?segment=placement:${encodeURIComponent(placement)}`;
  const headers = buildHeaders({ serve, placement });

  try {
    const response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.warn(`[carbon-sdk] ad server returned ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.ads) || data.ads.length === 0) {
      return null;
    }

    return processAd(data.ads[0], placement);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[carbon-sdk] failed to fetch ad: ${message}`);
    return null;
  }
}
