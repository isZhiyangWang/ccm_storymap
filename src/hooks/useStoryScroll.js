import { useCallback } from "react";

function focusTarget(target) {
  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }

  try {
    target.focus({ preventScroll: true });
  } catch {
    target.focus();
  }
}

function useStoryScroll(reducedMotion) {
  const scrollToId = useCallback(
    (targetId) => {
      const target = document.getElementById(targetId);
      if (!target) {
        return;
      }

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
      focusTarget(target);
    },
    [reducedMotion],
  );

  return { scrollToId };
}

export default useStoryScroll;
