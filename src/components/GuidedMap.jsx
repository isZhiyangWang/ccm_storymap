import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { publicAssetUrl } from "../utils/assetUrl";
import escapeHtml from "../utils/escapeHtml";

function createMarkerIcon(story) {
  const [offsetX = 0, offsetY = 0] = story.markerOffset || [];
  const label = `Go to ${story.sectionName}`;
  const markerSize = 30;
  const markerAnchor = markerSize / 2;

  return L.divIcon({
    className: "story-number-marker-wrap",
    html: `
      <div
        class="story-number-marker-positioner"
        style="--marker-offset-x: ${Number(offsetX)}px; --marker-offset-y: ${Number(offsetY)}px;"
      >
        <button
          class="story-number-marker"
          type="button"
          aria-label="${escapeHtml(label)}"
        >
          ${escapeHtml(story.number)}
        </button>
      </div>
    `,
    iconSize: [markerSize, markerSize],
    iconAnchor: [markerAnchor, markerAnchor],
  });
}

function GuidedMap({
  data,
  isActive,
  stories,
  onOverviewSelect,
  onStorySelect,
}) {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const onStorySelectRef = useRef(onStorySelect);
  const [status, setStatus] = useState(data.loadingMessage);

  useEffect(() => {
    onStorySelectRef.current = onStorySelect;
  }, [onStorySelect]);

  useEffect(() => {
    if (!isActive || !mapElementRef.current || mapRef.current) {
      return;
    }

    const mapSettings = data.map;
    const overview = data.overview;
    const breakpoint = data.draggingBreakpoint || 760;
    const narrowScreen = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const map = L.map(mapElementRef.current, {
      center: mapSettings.center,
      zoom: mapSettings.zoom,
      minZoom: mapSettings.minZoom,
      maxZoom: mapSettings.maxZoom,
      maxBounds: mapSettings.maxBounds,
      maxBoundsViscosity: 0.8,
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      dragging: !narrowScreen.matches,
      inertia: true,
      attributionControl: true,
      zoomSnap: 0.25,
    });

    mapRef.current = map;

    const showTileError = () => {
      setStatus(data.tileErrorMessage);
    };

    const basemap = L.tileLayer(mapSettings.basemap.url, {
      maxZoom: mapSettings.basemap.maxZoom,
      attribution: mapSettings.basemap.attribution,
    });
    basemap.on("tileerror", showTileError).addTo(map);

    const overviewPane = map.createPane("overview-image-pane");
    overviewPane.style.zIndex = "280";
    overviewPane.style.pointerEvents = "none";

    L.imageOverlay(publicAssetUrl(overview.image), overview.bounds, {
      alt: overview.title,
      interactive: false,
      opacity: overview.opacity,
      pane: "overview-image-pane",
    }).addTo(map);

    stories.forEach((story, index) => {
      const paneName = `historical-map-pane-${index}`;
      const pane = map.createPane(paneName);
      pane.style.zIndex = String(320 + index);
      pane.style.pointerEvents = "none";

      const layer = story.tileLayer;
      const tileLayer = L.tileLayer(layer.url, {
        attribution: layer.attribution,
        bounds: layer.tileBounds,
        opacity: layer.opacity,
        pane: paneName,
        tms: layer.tms === true,
      });

      tileLayer.on("tileerror", showTileError).addTo(map);
    });

    stories.forEach((story) => {
      const marker = L.marker(story.markerPosition, {
        icon: createMarkerIcon(story),
        keyboard: false,
        title: story.sectionName,
        zIndexOffset: 1000 + story.number,
      }).addTo(map);

      marker.bindTooltip(story.toolbarLabel, {
        direction: "top",
        offset: [0, -20],
      });

      marker.on("click", () => onStorySelectRef.current(story.id));
    });

    const fitOverview = () => {
      map.setMinZoom(mapSettings.minZoom);
      map.setMaxZoom(mapSettings.maxZoom);
      map.fitBounds(overview.bounds, {
        animate: false,
        padding: overview.fitPadding,
      });

      const responsiveZoomBoost = narrowScreen.matches ? 0 : 0.15;
      const fixedOverviewZoom = Math.min(
        mapSettings.maxZoom,
        map.getZoom() + responsiveZoomBoost,
      );

      map.setZoom(fixedOverviewZoom, { animate: false });
      map.setMinZoom(fixedOverviewZoom);
      map.setMaxZoom(fixedOverviewZoom);
    };

    const syncLayout = (event) => {
      if (event.matches) {
        map.dragging.disable();
      } else {
        map.dragging.enable();
      }

      fitOverview();
    };

    narrowScreen.addEventListener("change", syncLayout);

    const frameId = window.requestAnimationFrame(() => {
      map.invalidateSize();
      fitOverview();
      setStatus("");
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      narrowScreen.removeEventListener("change", syncLayout);
      map.remove();
      mapRef.current = null;
    };
  }, [data, isActive, stories]);

  return (
    <section
      className="guided section-pad"
      id="guided-map"
      aria-label={data.sectionLabel}
      tabIndex="-1"
    >
      <div className="content-wide">
        <div className="map-shell">
          <div
            className="map-toolbar"
            role="group"
            aria-label={data.toolbarLabel}
          >
            <button type="button" onClick={onOverviewSelect}>
              {data.overviewButtonLabel}
            </button>

            {stories.map((story) => (
              <button
                key={story.id}
                type="button"
                onClick={() => onStorySelect(story.id)}
              >
                {story.number}. {story.toolbarLabel}
              </button>
            ))}
          </div>

          <div
            className={`map-status${status ? " is-visible" : ""}`}
            role="status"
          >
            {status}
          </div>

          <div
            className="leaflet-map"
            id="guidedLeafletMap"
            ref={mapElementRef}
            role="region"
            aria-label={data.mapAriaLabel}
          />
        </div>
      </div>

      <div className="map-intro content-narrow">
        <p className="lead">{data.introText}</p>
      </div>
    </section>
  );
}

export default GuidedMap;
