import React from "react";
import { Box, Text } from "ink";
import type { CarbonAd } from "../../core/types.js";
import { AdLink } from "../components/AdLink.js";

interface CardProps {
  ad: CarbonAd;
}

/**
 * Inline ad with top/bottom borders. Fills terminal width.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Acme Dev Tools — Build faster with AI
 * Powered by the latest ML models for code generation and review. Get Started
 * ───────────────────────────────────────────────────────────── ads via Carbon
 */
export function Card({ ad }: CardProps) {
  const width = process.stdout.columns || 80;
  const rule = "─".repeat(width);

  const tagline = ad.companyTagline || "";

  const viaText = " ads via Carbon ";
  const trailingRule = "──";
  const leadingLen = width - viaText.length - trailingRule.length;
  const leadingRule = "─".repeat(Math.max(leadingLen, 0));

  return (
    <Box flexDirection="column" width={width}>
      <Text dimColor>{rule}</Text>
      <Text>
        {ad.company ? <Text bold>{ad.company}</Text> : null}
        {ad.company && tagline ? <Text dimColor> — </Text> : null}
        {tagline ? <Text>{tagline}</Text> : null}
      </Text>
      <Text>{ad.description.trim()}</Text>
      <AdLink url={ad.link} label={`${ad.callToAction} →`} />
      <Text dimColor>
        {leadingRule}
        <Text dimColor inverse>
          {viaText}
        </Text>
        {trailingRule}
      </Text>
    </Box>
  );
}
