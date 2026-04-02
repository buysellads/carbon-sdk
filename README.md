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

## Props

| Prop            | Type               | Default      | Description                                                          |
| --------------- | ------------------ | ------------ | -------------------------------------------------------------------- |
| `serve`         | `string`           | Demo key     | Your zone key from Carbon Ads                                        |
| `placement`     | `string`           | `"demo"`     | Placement identifier                                                 |
| `interactionId` | `string \| number` | **required** | When this changes, a new ad may be fetched if enough time has passed |
| `fallback`      | `CarbonAdFallback` | —            | House ad shown during loading and when no paid ad is available       |

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
