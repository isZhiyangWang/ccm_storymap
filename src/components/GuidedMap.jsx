import { publicAssetUrl } from "../utils/assetUrl";

function getPositionStyle(point) {
  const [left, top] = point;

  return {
    left: `${left}%`,
    top: `${top}%`,
  };
}

function ContentsMap({ overview, stories, onStorySelect }) {
  const clickableStories = stories.filter((story) => story.contentsMap);
  const calloutStories = clickableStories.filter(
    (story) => story.contentsMap.callout,
  );

  if (!overview?.image || clickableStories.length === 0) {
    return null;
  }

  return (
    <figure className="contents-map" aria-label={overview.title}>
      <div className="contents-map__frame">
        <img
          className="contents-map__image"
          src={publicAssetUrl(overview.image)}
          alt={overview.alt || overview.title}
        />

        <svg
          className="contents-map__callouts"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {calloutStories.map((story) => {
            const { anchor, target } = story.contentsMap.callout;

            return (
              <line
                key={story.id}
                x1={target[0]}
                y1={target[1]}
                x2={anchor[0]}
                y2={anchor[1]}
                stroke={story.contentsMap.color}
              />
            );
          })}
        </svg>

        {calloutStories.map((story) => {
          const { target } = story.contentsMap.callout;

          return (
            <span
              className="contents-map__target"
              key={`${story.id}-target`}
              style={{
                ...getPositionStyle(target),
                "--hotspot-color": story.contentsMap.color,
              }}
              aria-hidden="true"
            />
          );
        })}

        {clickableStories.map((story) => {
          const location = story.contentsMap;
          const [left, top, width, fallbackHeight] = location.box;
          const level = location.callout ? "secondary" : "primary";
          const sizeStyle = location.aspectRatio
            ? { aspectRatio: String(location.aspectRatio) }
            : { height: `${fallbackHeight}%` };

          return (
            <button
              className={`contents-map__hotspot contents-map__hotspot--${level}`}
              key={story.id}
              type="button"
              style={{
                "--hotspot-color": location.color,
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                ...sizeStyle,
              }}
              onClick={() => onStorySelect(story.id)}
              aria-label={`Open ${story.sectionName}`}
              title={story.sectionName}
            >
              <img src={publicAssetUrl(location.image)} alt="" aria-hidden="true" />

              <span className="contents-map__number" aria-hidden="true">
                {story.number}
              </span>
              <span
                className={`contents-map__label contents-map__label--${location.labelPosition || "below"}`}
                aria-hidden="true"
              >
                {story.sectionName}
              </span>
            </button>
          );
        })}
      </div>
    </figure>
  );
}

function GuidedMap({ data, stories, onStorySelect }) {
  return (
    <section
      className="guided section-pad"
      id="guided-map"
      aria-label={data.sectionLabel}
      tabIndex="-1"
    >
      <div className="guided__content content-wide">
        <div className="map-intro__copy content-narrow">
          <p className="lead">{data.introText}</p>
        </div>

        <ContentsMap
          overview={data.overview}
          stories={stories}
          onStorySelect={onStorySelect}
        />
      </div>
    </section>
  );
}

export default GuidedMap;
