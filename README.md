# @carbonads/sdk

Carbon Ads SDK for terminal and web apps. Reach developers where they work.

## Quick Start

```bash
npm install @carbonads/sdk ink react
```

```tsx
import { render } from "ink";
import { CarbonAd } from "@carbonads/sdk/ink";

render(<CarbonAd interactionId="main" />);
```

Run it — a demo ad renders in your terminal immediately.

## Get Your Zone Key

The demo key is for testing only. To serve real ads and earn revenue:

1. Apply at **https://www.carbonads.net/join**
2. Receive your zone key
3. Pass it to the component:

```tsx
<CarbonAd serve="YOUR_ZONE_KEY" placement="your-app" interactionId="main" />
```

## Usage

### Ink Component (terminal apps)

Use `<CarbonAd />` inside any Ink application. Every ad needs an `interactionId` — it tells the SDK when to fetch a new ad.

For single-run tools, use a static value:

```tsx
import React from "react";
import { render, Box } from "ink";
import { CarbonAd } from "@carbonads/sdk/ink";

function App() {
  return (
    <Box flexDirection="column">
      {/* your app content */}
      <CarbonAd
        serve="YOUR_ZONE_KEY"
        placement="your-app"
        interactionId="main"
      />
    </Box>
  );
}

render(<App />);
```

For interactive apps (chat UIs, REPLs, multi-step wizards), pass a value that changes at natural breakpoints — a new conversation, command, or session. The SDK enforces a 30-second minimum display window, so rapid changes keep the current ad.

```tsx
<CarbonAd serve="YOUR_ZONE_KEY" interactionId={conversationId} />
```

### Fallback Ads

Provide a `fallback` to show your own house ad while loading and when no paid ad is available. A skeleton placeholder matching the fallback's shape is shown during the fetch.

```tsx
<CarbonAd
  serve="YOUR_ZONE_KEY"
  interactionId={conversationId}
  fallback={{
    company: "Acme CLI",
    description: "Build faster with our developer toolkit for the terminal.",
    companyTagline: "Dev tools for the terminal",
    callToAction: "Learn More",
    link: "https://acme.dev",
  }}
/>
```

### Standalone (no Ink app needed)

Render an ad to the terminal as a one-liner:

```ts
import { renderCarbonAd } from "@carbonads/sdk/ink";

await renderCarbonAd({ serve: "YOUR_ZONE_KEY", placement: "your-app" });
```

### Core API (custom integrations)

Fetch ad data directly for custom rendering:

```ts
import { fetchAd } from "@carbonads/sdk";

const ad = await fetchAd({
  serve: "YOUR_ZONE_KEY",
  placement: "your-app",
});

if (ad) {
  console.log(ad.company, ad.description, ad.callToAction);
}
```

### Styling the Box

Customize the ad container's width and border color with the `style` prop:

```tsx
<CarbonAd
  serve="YOUR_ZONE_KEY"
  interactionId="main"
  style={{ width: 60, borderColor: "gray" }}
/>
```

This also works with the standalone helper:

```ts
await renderCarbonAd({
  serve: "YOUR_ZONE_KEY",
  style: { width: 60, borderColor: "cyan" },
});
```

## Props

| Prop            | Type               | Default      | Description                                                          |
| --------------- | ------------------ | ------------ | -------------------------------------------------------------------- |
| `serve`         | `string`           | Demo key     | Your zone key from Carbon Ads                                        |
| `placement`     | `string`           | `"demo"`     | Placement identifier                                                 |
| `interactionId` | `string \| number` | **required** | When this changes, a new ad may be fetched if enough time has passed |
| `fallback`      | `CarbonAdFallback` | —            | House ad shown during loading and when no paid ad is available       |
| `style`         | `CarbonBoxStyle`   | —            | Style overrides for the box container (see below)                    |

### `CarbonBoxStyle`

| Key           | Type     | Default    | Description                               |
| ------------- | -------- | ---------- | ----------------------------------------- |
| `width`       | `number` | `78`       | Fixed column count for the ad box         |
| `borderColor` | `string` | Dim (gray) | Border color (any Ink/chalk color string) |

#### Why a fixed-width default?

The box defaults to **78 columns** rather than stretching to fill its parent. This is deliberate: a full-bleed box reflows into more visual rows when the terminal is resized narrower, which exposes an upstream Ink rendering bug that leaves stale fragments on screen (see [Known Limitations](#known-limitations) below). A fixed width that fits any modern terminal (≥80 cols is effectively universal) sidesteps the problem for the common case — the box simply doesn't reflow when the user resizes the window.

If you need a different size — for instance, to match a constrained parent container, or because your users are on narrower terminals — pass your own `width`:

```tsx
<CarbonAd serve="YOUR_ZONE_KEY" interactionId="main" style={{ width: 60 }} />
```

## Known Limitations

### Ghost fragments when shrinking the terminal

Dragging the terminal window **narrower than the box width** while an ad is on screen can leave stale line fragments above the ad. Growing the terminal is unaffected, and the next render cycle clears the fragments.

This is an upstream Ink issue, not specific to this SDK — any Ink-rendered content is affected the same way. The root cause is that terminals which soft-wrap on resize (iTerm2, kitty, Windows Terminal) end up displaying more visual rows than Ink tracked when it emitted the frame, so Ink's erase pass under-clears. Terminals that don't reflow on resize (xterm and similar) are not affected.

The [default fixed width](#why-a-fixed-width-default) (78 cols) is the primary mitigation — as long as the terminal stays wider than the box, no reflow can happen. You'll only see the artifact if the terminal is dragged narrower than the configured `style.width`.

The Ink maintainers [explicitly declined](https://github.com/vadimdemedes/ink/pull/916) to patch this because no reliable way exists to detect whether the host terminal reflows, so any fix regresses the other camp. Tracked in [vadimdemedes/ink#907](https://github.com/vadimdemedes/ink/issues/907) and documented in [vadimdemedes/ink#920](https://github.com/vadimdemedes/ink/pull/920).

## Requirements

- Node.js >= 18
- `ink` >= 6.0.0
- `react` >= 19.0.0

## Development

This project uses [pnpm](https://pnpm.io/) as its package manager.

```bash
pnpm install     # install dependencies
pnpm build       # build to dist/
pnpm dev         # build in watch mode
pnpm lint        # run ESLint
pnpm format      # format with Prettier
```

### Testing

```bash
pnpm test:fetch  # test core API (requires build)
pnpm test:ink    # test Ink component (requires build)
```

## License

MIT
