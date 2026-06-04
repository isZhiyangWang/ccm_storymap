import { useEffect, useState } from "react";

function BackToTopButton({ onActivate }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.45);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <button
      className={`back-to-top${isVisible ? " is-visible" : ""}`}
      type="button"
      onClick={onActivate}
      aria-label="Back to top"
      tabIndex={isVisible ? undefined : -1}
    >
      <span aria-hidden="true" />
    </button>
  );
}

export default BackToTopButton;
