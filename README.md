# Critical Counter Map

Vite + React landing page for **Colonial Networks: A Critical Counter Map**. The page combines an opening video, a guided Leaflet overview, and lazy-loaded ArcGIS StoryMaps.

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

Edit `public/data/mapData.json`. Its `_editingNote` lists the fields that should be reviewed after the next supervisor meeting.

Important story fields:

- `sectionName`: heading above the embedded StoryMap
- `toolbarLabel`: label shown in the guided-map toolbar
- `sectionDescription`: short text above the StoryMap
- `markerPosition`: accurate `[latitude, longitude]` anchor
- `markerOffset`: small `[x, y]` pixel offset that keeps nearby markers tappable
- `storyMapUrl`: ArcGIS StoryMaps URL
- `tileLayer`: verified MapWarper tile configuration

The four MapWarper layers use normal XYZ mode (`tms: false`). Their `tileBounds` values come from MapWarper metadata and only limit unnecessary tile requests; the tile service itself controls geographic placement.

## GitHub Pages

The default Vite base path is `/`, which works for local development and a future custom domain.

For a GitHub Pages project site, build with the repository name as the base path:

```bash
VITE_BASE_PATH=/ccm_storymap/ npm run build
```

Deploy the generated `dist/` directory with GitHub Actions or another GitHub Pages workflow. Do not set a custom domain in the code; configure it later in the repository Pages settings.

## External services

The base map, historical MapWarper tiles, and ArcGIS StoryMap embeds require an internet connection. The large overview image and opening video are served locally from `public/assets/`.
