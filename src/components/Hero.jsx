import { useEffect, useRef, useState } from "react";
import { publicAssetUrl } from "../utils/assetUrl";

function Hero({
  data,
  isUnlocked,
  reducedMotion,
  onComplete,
  onEnterMap,
}) {
  const videoRef = useRef(null);
  const endingVideoRef = useRef(null);
  const skipRequestedRef = useRef(false);
  const transitionTimerRef = useRef(null);
  const loadingCoverDismissedRef = useRef(false);
  const [skipLabel, setSkipLabel] = useState(data.skipIntroLabel);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) {
      return;
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => setSkipLabel("Enter"));
    }
  }, [reducedMotion]);

  useEffect(
    () => () => {
      window.clearTimeout(transitionTimerRef.current);
    },
    [],
  );

  function dismissLoadingCover() {
    if (loadingCoverDismissedRef.current) {
      return;
    }

    loadingCoverDismissedRef.current = true;
    setIsVideoReady(true);

    const cover = document.getElementById("initial-loading-cover");
    if (!cover) {
      return;
    }

    const removeCover = () => cover.remove();

    cover.classList.add("is-hidden");
    cover.addEventListener("transitionend", removeCover, { once: true });
    window.setTimeout(removeCover, 700);
  }

  function handleVideoError() {
    dismissLoadingCover();
    onComplete();
  }

  function skipIntro() {
    const video = videoRef.current;
    const endingVideo = endingVideoRef.current;

    if (!video || !endingVideo || skipRequestedRef.current) {
      onComplete();
      return;
    }

    skipRequestedRef.current = true;

    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      video.pause();
      onComplete();
      return;
    }

    let frameReady = false;

    const startCrossfade = () => {
      if (frameReady) {
        return;
      }

      frameReady = true;
      setIsCrossfading(true);
      transitionTimerRef.current = window.setTimeout(() => {
        video.pause();
        onComplete();
      }, 620);
    };

    const waitForFinalFrame = () => {
      if ("requestVideoFrameCallback" in endingVideo) {
        const fallback = window.setTimeout(startCrossfade, 180);

        endingVideo.requestVideoFrameCallback(() => {
          window.clearTimeout(fallback);
          startCrossfade();
        });
        return;
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(startCrossfade);
      });
    };

    const seekToFinalFrame = () => {
      endingVideo.pause();
      endingVideo.addEventListener("seeked", waitForFinalFrame, { once: true });
      endingVideo.currentTime = Math.max(0, video.duration - 0.04);
    };

    if (endingVideo.readyState >= 1) {
      seekToFinalFrame();
    } else {
      endingVideo.addEventListener("loadedmetadata", seekToFinalFrame, {
        once: true,
      });
      endingVideo.load();
    }
  }

  const posterUrl = publicAssetUrl(data.poster);

  return (
    <header
      className={`hero${isVideoReady ? " hero--video-ready" : ""}${
        isCrossfading ? " hero--crossfading" : ""
      }`}
      id="top"
      aria-label="Launch animation"
      tabIndex="-1"
      style={{ "--hero-poster": `url("${posterUrl}")` }}
    >
      <video
        className="hero__video hero__video--intro"
        ref={videoRef}
        autoPlay={!reducedMotion}
        muted
        playsInline
        preload="auto"
        poster={posterUrl}
        onEnded={onComplete}
        onError={handleVideoError}
        onLoadedData={dismissLoadingCover}
      >
        <source src={publicAssetUrl(data.video)} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <video
        className="hero__video hero__video--ending"
        ref={endingVideoRef}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={publicAssetUrl(data.video)} type="video/mp4" />
      </video>

      <button
        className="skip-intro"
        type="button"
        onClick={skipIntro}
        aria-hidden={isUnlocked ? "true" : undefined}
        tabIndex={isUnlocked ? -1 : undefined}
      >
        {skipLabel}
      </button>

      <div className="hero__overlay" aria-hidden={isUnlocked ? undefined : "true"}>
        <div className="hero__content">
          <h1>
            <span className="title-main">{data.titleMain}</span>
            <span className="title-sub">{data.titleSub}</span>
          </h1>

          <button
            className="hero__arrow"
            type="button"
            onClick={onEnterMap}
            aria-label={data.enterMapLabel}
            tabIndex={isUnlocked ? undefined : -1}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Hero;
