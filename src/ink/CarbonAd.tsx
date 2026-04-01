import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import { fetchAd } from "../core/fetch-ad.js";
import { SIGNUP_URL } from "../core/defaults.js";
import type { CarbonAd as CarbonAdData } from "../core/types.js";
import { Card } from "./formats/Card.js";

interface CarbonAdProps {
  /** Zone key. Defaults to demo key. */
  serve?: string;
  /** Placement identifier. */
  placement?: string;
}

export function CarbonAd({ serve, placement }: CarbonAdProps) {
  const [ad, setAd] = useState<CarbonAdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showNotice, setShowNotice] = useState(false);


  useEffect(() => {
    let cancelled = false;

    fetchAd({ serve, placement })
      .then((result) => {
        if (cancelled) return;
        setAd(result);
        setLoading(false);
        if (!result) setError(true);
        // isDemo is derived from serve, but inlined here to avoid
        // a redundant dependency that would cause unnecessary refetches.
        if (result && !serve) setShowNotice(true);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
        setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [serve, placement]);

  if (loading) {
    return (
      <Box>
        <Text dimColor>Loading ad...</Text>
      </Box>
    );
  }

  if (error || !ad) {
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
}
