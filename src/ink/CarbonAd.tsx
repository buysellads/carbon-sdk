import React, { memo, useEffect, useState } from "react";
import { Box, Text } from "ink";
import { fetchAd } from "../core/fetch-ad.js";
import { SIGNUP_URL } from "../core/defaults.js";
import type {
  CarbonAd as CarbonAdData,
  CarbonAdFallback,
} from "../core/types.js";
import { Card } from "./formats/Card.js";
import { CarbonBox } from "./components/CarbonBox.js";

interface CarbonAdProps {
  /** Zone key. Defaults to demo key. */
  serve?: string;
  /** Placement identifier. */
  placement?: string;
  /** Identifies the current interaction (e.g. conversation, session, command).
   *  When this value changes, a new ad may be fetched if enough time has passed.
   *  Use a static value like "main" for single-run CLI tools. */
  interactionId: string | number;
  /** Fallback ad shown when no paid ad is available. */
  fallback?: CarbonAdFallback;
}

function fallbackToAd(fallback: CarbonAdFallback): CarbonAdData {
  return {
    company: fallback.company,
    description: fallback.description,
    companyTagline: fallback.companyTagline || "",
    callToAction: fallback.callToAction || "",
    link: fallback.link,
    statlink: "",
    statviewUrl: "",
    image: "",
    smallImage: "",
    largeImage: "",
    logo: "",
    backgroundColor: "",
    adViaLink: "",
    pixel: "",
  };
}

function Skeleton({ fallback }: { fallback: CarbonAdFallback }) {
  const [dim, setDim] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setDim((d) => !d);
    }, 600);
    return () => clearInterval(timer);
  }, []);

  const tagline = fallback.companyTagline || "";
  const separator = fallback.company && tagline ? " — " : "";
  const headline = `${fallback.company}${separator}${tagline}`;

  return (
    <Box flexDirection="column">
      {headline ? (
        <Text dimColor={dim} color="gray">
          {"▒".repeat(headline.length)}
        </Text>
      ) : null}
      <Text dimColor={dim} color="gray">
        {"▒".repeat(fallback.description.length)}
      </Text>
      {fallback.callToAction ? (
        <Text dimColor={dim} color="gray">
          {"▒".repeat(`${fallback.callToAction} →`.length)}
        </Text>
      ) : null}
    </Box>
  );
}

export const CarbonAd = memo(function CarbonAd({
  serve,
  placement,
  interactionId,
  fallback,
}: CarbonAdProps) {
  // undefined = initial load, null = error/empty, CarbonAdData = resolved
  const [ad, setAd] = useState<CarbonAdData | null | undefined>(undefined);
  const showNotice = ad && !serve;

  useEffect(() => {
    let cancelled = false;

    fetchAd({ serve, placement })
      .then((result) => {
        if (cancelled) return;
        setAd(result ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setAd(null);
      });

    return () => {
      cancelled = true;
    };
  }, [serve, placement, interactionId]);

  // Loading: show skeleton matching house ad shape
  if (ad === undefined) {
    if (fallback) {
      return (
        <CarbonBox>
          <Skeleton fallback={fallback} />
        </CarbonBox>
      );
    }
    return null;
  }

  // Error/empty: show fallback house ad if provided
  if (!ad) {
    if (fallback) {
      return (
        <Box flexDirection="column">
          <Card ad={fallbackToAd(fallback)} showAttribution={false} />
        </Box>
      );
    }
    return null;
  }

  return (
    <Box flexDirection="column">
      <Card ad={ad} />
      {showNotice ? (
        <Text dimColor>Using demo zone key. Get yours at {SIGNUP_URL}</Text>
      ) : null}
    </Box>
  );
});
