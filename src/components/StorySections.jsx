import { useEffect, useMemo, useRef, useState } from "react";
import { normalizeStoryMapUrl } from "../utils/storyMapUrl";

function StoryCard({ story, embedDefaults, loadRequested }) {
  const articleRef = useRef(null);
  const storyUrl = useMemo(
    () => normalizeStoryMapUrl(story.storyMapUrl, embedDefaults),
    [embedDefaults, story.storyMapUrl],
  );
  const [shouldLoad, setShouldLoad] = useState(loadRequested);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (loadRequested) {
      setShouldLoad(true);
    }
  }, [loadRequested]);

  useEffect(() => {
    const article = articleRef.current;
    if (!article || !storyUrl || shouldLoad) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "700px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(article);
    return () => observer.disconnect();
  }, [shouldLoad, storyUrl]);

  const placeholderTitle = storyUrl
    ? "Loading StoryMap…"
    : "StoryMap URL not added yet";

  return (
    <article
      className={`story-card${isLoaded ? " is-loaded" : ""}`}
      id={story.id}
      ref={articleRef}
      tabIndex="-1"
    >
      <div className="story-card__header">
        <p className="eyebrow">Story {story.number}</p>
        <h2>{story.sectionName}</h2>
        <p>{story.sectionDescription}</p>
      </div>

      <div className="story-card__frame-wrap">
        <div className="story-card__placeholder">
          <div className="story-card__placeholder-inner">
            <h3>{placeholderTitle}</h3>
            <p>
              {storyUrl
                ? "The embedded StoryMap will appear here."
                : "Add this module’s final ArcGIS StoryMaps URL in public/data/mapData.json."}
            </p>
          </div>
        </div>

        {shouldLoad && storyUrl ? (
          <>
            {!isLoaded ? <div className="loading-bar" aria-hidden="true" /> : null}
            <iframe
              title={`${story.sectionName} StoryMap`}
              src={storyUrl}
              loading="lazy"
              allow={embedDefaults.allowGeolocation ? "geolocation" : undefined}
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setIsLoaded(true)}
            />
          </>
        ) : null}
      </div>
    </article>
  );
}

function StorySections({
  ariaLabel,
  stories,
  embedDefaults,
  requestedStoryId,
}) {
  return (
    <section className="stories" aria-label={ariaLabel}>
      <div className="story-stack">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            embedDefaults={embedDefaults}
            loadRequested={requestedStoryId === story.id}
          />
        ))}
      </div>
    </section>
  );
}

export default StorySections;
