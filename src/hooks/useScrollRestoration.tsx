import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const SCROLL_RESTORATION_KEY = "crockpot_browse_scroll_position";

export function useScrollRestoration() {
  const router = useRouter();
  const hasRestoredRef = useRef(false);

  // Save scroll position when navigating away
  const saveScrollPosition = () => {
    if (typeof window === "undefined") return;

    try {
      const scrollPosition = window.scrollY;
      sessionStorage.setItem(SCROLL_RESTORATION_KEY, scrollPosition.toString());
    } catch {
      // Ignore storage errors
    }
  };

  // Restore scroll position
  const restoreScrollPosition = () => {
    if (typeof window === "undefined" || hasRestoredRef.current) return;

    try {
      const savedPosition = sessionStorage.getItem(SCROLL_RESTORATION_KEY);
      if (savedPosition) {
        const position = parseInt(savedPosition, 10);
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          window.scrollTo(0, position);
        });
        hasRestoredRef.current = true;
        // Clear the saved position after using it
        sessionStorage.removeItem(SCROLL_RESTORATION_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  };

  // Navigate back to browse page with filter restoration
  const navigateBack = () => {
    router.push("/recipes");
  };

  useEffect(() => {
    // Restore scroll position on mount
    restoreScrollPosition();

    // Save scroll position when navigating away
    const handleBeforeUnload = () => saveScrollPosition();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveScrollPosition();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    navigateBack,
  };
}
