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

The site is served at `https://criticalcountermap.colonialnetworks.org/`. The default Vite base path and the GitHub Actions build use `/` so scripts, styles, and public assets load from the custom domain's root.

If switching back to a GitHub Pages project URL without a custom domain, change `VITE_BASE_PATH` in `.github/workflows/pages.yml` to `/ccm_storymap/`. For a local build targeting that project URL, use:

```bash
VITE_BASE_PATH=/ccm_storymap/ npm run build
```

Deploy the generated `dist/` directory with GitHub Actions. Manage the custom domain in the repository Pages settings. At the DNS provider, the `criticalcountermap` CNAME record should point to `iszhiyangwang.github.io` (without the repository name or a URL scheme).

## External services

ArcGIS StoryMap embeds require an internet connection. The clickable contents image and opening video are served locally from `public/assets/`.
