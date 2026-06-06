# Critical Counter Map

Vite + React landing page for **Colonial Networks: A Critical Counter Map**. The page combines an opening video, a clickable contents map, and lazy-loaded ArcGIS StoryMaps.

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
```

The production files are written to `dist/`.

## Preview the production build

```bash
npm run preview
```

## Update map and story content

Edit `public/data/mapData.json`. Its `_editingNote` lists the fields intended for routine content updates.

Important story fields:

- `sectionName`: heading above the embedded StoryMap
- `toolbarLabel`: label shown in clickable map and story navigation affordances
- `sectionDescription`: short text above the StoryMap
- `storyMapUrl`: ArcGIS StoryMaps URL
- `contentsMap`: inset position, source-image aspect ratio, badge/label placement, and optional callout line for the clickable contents map

`1_SaintDomingue.jpg` is used as a static clickable contents image. Each story's `contentsMap.box` and `contentsMap.callout` values are expressed as percentages of that image; `contentsMap.aspectRatio` stores the inset source image ratio so the preview window is not distorted.

## GitHub Pages

The default Vite base path is `/`, which works for local development and a future custom domain.

For a GitHub Pages project site, build with the repository name as the base path:

```bash
VITE_BASE_PATH=/ccm_storymap/ npm run build
```

Deploy the generated `dist/` directory with GitHub Actions or another GitHub Pages workflow. Do not set a custom domain in the code; configure it later in the repository Pages settings.

## External services

ArcGIS StoryMap embeds require an internet connection. The clickable contents image and opening video are served locally from `public/assets/`.
