"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type WidgetStatus = "idle" | "loading" | "ready" | "unavailable";

export function useWidgetStatus(contentSelector: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<WidgetStatus>("idle");
  const reportError = useCallback(() => {
    setStatus((current) => current === "ready" ? current : "unavailable");
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ready = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const loadedFrames = new WeakSet<HTMLIFrameElement>();

    const checkContent = () => {
      const hasContent = Array.from(container.querySelectorAll(contentSelector)).some((element) => {
        if (element instanceof HTMLImageElement) {
          return element.complete && element.naturalWidth > 64 && element.naturalHeight > 64;
        }
        if (element instanceof HTMLVideoElement) return element.readyState >= 2;
        if (element instanceof HTMLIFrameElement) return loadedFrames.has(element);
        return Boolean(element.textContent?.trim());
      });

      if (hasContent && !ready) {
        ready = true;
        clearTimeout(timeout);
        setStatus("ready");
      }
    };

    const handleLoad = (event: Event) => {
      if (event.target instanceof HTMLIFrameElement) loadedFrames.add(event.target);
      checkContent();
    };

    const mutations = new MutationObserver(checkContent);
    mutations.observe(container, { childList: true, subtree: true, attributes: true, characterData: true });
    container.addEventListener("load", handleLoad, true);
    container.addEventListener("loadeddata", checkContent, true);

    const viewport = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      viewport.disconnect();
      checkContent();
      if (ready) return;
      setStatus((current) => current === "unavailable" ? current : "loading");
      timeout = setTimeout(() => {
        checkContent();
        if (!ready) setStatus("unavailable");
      }, 15_000);
    });

    viewport.observe(container);
    checkContent();

    return () => {
      clearTimeout(timeout);
      mutations.disconnect();
      viewport.disconnect();
      container.removeEventListener("load", handleLoad, true);
      container.removeEventListener("loadeddata", checkContent, true);
    };
  }, [contentSelector]);

  return { containerRef, status, reportError };
}
