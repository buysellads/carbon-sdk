import React from "react";
import { render } from "ink";
import { CarbonAd } from "./CarbonAd.js";

export { CarbonAd } from "./CarbonAd.js";
export { Card } from "./formats/Card.js";
export { PoweredBy } from "./components/PoweredBy.js";
export { AdLink } from "./components/AdLink.js";

interface RenderOptions {
  serve?: string;
  placement?: string;
}

/**
 * Standalone one-liner: renders a Carbon Ad to the terminal and exits.
 *
 * ```ts
 * import { renderCarbonAd } from '@carbonads/sdk/ink';
 * await renderCarbonAd();
 * ```
 */
export async function renderCarbonAd(options?: RenderOptions): Promise<void> {
  const { waitUntilExit } = render(
    React.createElement(CarbonAd, {
      serve: options?.serve,
      placement: options?.placement,
    }),
  );
  await waitUntilExit();
}
