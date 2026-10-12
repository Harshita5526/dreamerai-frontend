# DreamerAI Frontend

A responsive animated React + Vite + Tailwind CSS v4 concept site.

## Run locally

1. Install Node.js 20+.
2. Extract this ZIP.
3. Open a terminal in the `dreamerai-frontend` folder.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL Vite prints (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

## Included interactions

- Animated purple/pink ambient gradients and marquee
- Floating hero art cards with continuous motion and mouse-based 3D tilt on gallery cards
- Hero scroll parallax
- Framer Motion page/section reveals
- Prompt lab with sample prompts and a local demo preview state
- Responsive gallery search and category filters
- Image zoom, overlay, artwork modal, save/like interactions
- Recharts interactive area chart
- Animated circular progress indicators
- Toast feedback, mobile navigation, reduced-motion accessibility styles

## Important

This is a frontend demo. The "Create concept" interaction updates the preview locally; it does not call a real AI image-generation API. Gallery artwork uses remote Unsplash image URLs and Google Fonts, so internet access is needed for those assets. Connect your own image API/backend to generate real images.
