import React, { memo } from "react";
import { Text, Transform } from "ink";
import type { CarbonAd, CarbonBoxStyle } from "../../core/types.js";
import { AdLink } from "../components/AdLink.js";
import { CarbonBox } from "../components/CarbonBox.js";

interface CardProps {
  ad: CarbonAd;
  /** Show "ads via Carbon" attribution. Defaults to true. */
  showAttribution?: boolean;
  /** Style overrides for the box container. */
  style?: CarbonBoxStyle;
}

/** Trim leading whitespace left by wrap-ansi (trim: false) on continuation lines.
 *  ANSI-aware: skips escape sequences so bold/color codes don't block the trim. */
const trimStart = (line: string) =>
  // eslint-disable-next-line no-control-regex
  line.replace(/^((?:\x1b\[[0-9;]*m)*)\s+/, "$1");

function CardContent({ ad }: CardProps) {
  const tagline = ad.companyTagline || "";
  const separator = ad.company && tagline ? " — " : "";
  const headline = `${ad.company}${separator}${tagline}`;

  return (
    <>
      {headline ? (
        <Transform transform={trimStart}>
          <Text bold>{headline}</Text>
        </Transform>
      ) : null}
      <Transform transform={trimStart}>
        <Text>{ad.description.trim()}</Text>
      </Transform>
      {ad.callToAction ? (
        <AdLink url={ad.link} label={`${ad.callToAction} →`} />
      ) : null}
    </>
  );
}

/**
 * Ad card inside a CarbonBox border.
 *
 * ╭──────────────────────────────────────────────────────────────────────────╮
 * │ Acme Dev Tools — Build faster with AI                                    │
 * │ Powered by the latest ML models for code generation and review.          │
 * │ Get Started →                                                            │
 * ╰──────────────────────────────────────────────────── ads via Carbon ──────╯
 */
export const Card = memo(function Card({
  ad,
  showAttribution,
  style,
}: CardProps) {
  return (
    <CarbonBox showAttribution={showAttribution} style={style}>
      <CardContent ad={ad} />
    </CarbonBox>
  );
});
