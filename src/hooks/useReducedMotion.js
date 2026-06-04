import { useEffect, useState } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function getInitialPreference() {
  return typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia(reducedMotionQuery).matches
    : false;
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(getInitialPreference);

  useEffect(() => {
    const mediaQuery = window.matchMedia(reducedMotionQuery);
    const updatePreference = (event) => setReducedMotion(event.matches);

    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}

export default useReducedMotion;
