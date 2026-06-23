import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import BackToTopButton from "./components/BackToTopButton";
import GuidedMap from "./components/GuidedMap";
import Hero from "./components/Hero";
import SkipLink from "./components/SkipLink";
import StorySections from "./components/StorySections";
import useReducedMotion from "./hooks/useReducedMotion";
import useStoryScroll from "./hooks/useStoryScroll";
import { publicAssetUrl } from "./utils/assetUrl";

function App() {
  const reducedMotion = useReducedMotion();
  const { scrollToId } = useStoryScroll(reducedMotion);
  const [pageData, setPageData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [introComplete, setIntroComplete] = useState(false);
  const [requestedStoryId, setRequestedStoryId] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const dataUrl = publicAssetUrl("data/mapData.json");

    async function loadPageData() {
      try {
        const response = await fetch(dataUrl, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Could not load map data (${response.status}).`);
        }

        setPageData(await response.json());
      } catch (error) {
        if (error.name !== "AbortError") {
          setLoadError(error.message);
        }
      }
    }

    loadPageData();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setIntroComplete(true);
    }
  }, [reducedMotion]);

  useLayoutEffect(() => {
    document.body.classList.toggle("is-locked", !introComplete);
    document.body.classList.toggle("is-unlocked", introComplete);

    return () => {
      document.body.classList.remove("is-locked", "is-unlocked");
    };
  }, [introComplete]);

  const completeIntro = useCallback(() => {
    setIntroComplete(true);
  }, []);

  const unlockAndScrollTo = useCallback(
    (targetId) => {
      document.body.classList.remove("is-locked");
      document.body.classList.add("is-unlocked");
      setIntroComplete(true);
      window.requestAnimationFrame(() => scrollToId(targetId));
    },
    [scrollToId],
  );

  const handleStorySelect = useCallback(
    (storyId) => {
      setRequestedStoryId(storyId);
      scrollToId(storyId);
    },
    [scrollToId],
  );

  if (loadError) {
    return (
      <main className="app-message" role="alert">
        <h1>Critical Counter Map</h1>
        <p>{loadError}</p>
        <p>Run the page through Vite and check public/data/mapData.json.</p>
      </main>
    );
  }

  if (!pageData) {
    return (
      <div className="app-message app-message--loading" role="status">
        Loading Critical Counter Map…
      </div>
    );
  }

  return (
    <>
      <SkipLink onActivate={() => unlockAndScrollTo("guided-map")} />

      <Hero
        data={pageData.hero}
        isUnlocked={introComplete}
        reducedMotion={reducedMotion}
        onComplete={completeIntro}
        onEnterMap={() => scrollToId("guided-map")}
      />

      <div
        className="post-hero-content"
        aria-hidden={introComplete ? undefined : "true"}
      >
        <main>
          <GuidedMap
            data={pageData.guidedMap}
            stories={pageData.stories}
            onStorySelect={handleStorySelect}
          />

          <StorySections
            ariaLabel={pageData.storySectionsLabel}
            stories={pageData.stories}
            embedDefaults={pageData.embedDefaults}
            requestedStoryId={requestedStoryId}
          />
        </main>

        <BackToTopButton onActivate={() => scrollToId("top")} />

        <footer className="site-footer">
          <p>{pageData.site.footerText}</p>
        </footer>
      </div>
    </>
  );
}

export default App;
