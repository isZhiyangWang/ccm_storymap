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
  const [skipLabel, setSkipLabel] = useState(data.skipIntroLabel);

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

  function skipIntro() {
    const video = videoRef.current;

    if (video) {
      try {
        if (Number.isFinite(video.duration) && video.duration > 0.5) {
          video.currentTime = Math.max(0, video.duration - 0.08);
        }
        video.pause();
      } catch {
        video.pause();
      }
    }

    onComplete();
  }

  const posterUrl = publicAssetUrl(data.poster);

  return (
    <header
      className="hero"
      id="top"
      aria-label="Launch animation"
      tabIndex="-1"
      style={{ "--hero-poster": `url("${posterUrl}")` }}
    >
      <video
        className="hero__video"
        ref={videoRef}
        autoPlay={!reducedMotion}
        muted
        playsInline
        preload="auto"
        poster={posterUrl}
        onEnded={onComplete}
        onError={onComplete}
      >
        <source src={publicAssetUrl(data.video)} type="video/mp4" />
        Your browser does not support the video tag.
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
