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
    let discovery: ReturnType<typeof setInterval> | undefined;
    const loadedFrames = new WeakSet<HTMLIFrameElement>();
    const observedRoots = new Set<Element | ShadowRoot>();

    const checkContent = () => {
      if (ready) return;
      const roots: (Element | ShadowRoot)[] = [container];
      for (let index = 0; index < roots.length; index++) {
        const root = roots[index];
        if (!observedRoots.has(root)) {
          observedRoots.add(root);
          mutations.observe(root, { childList: true, subtree: true, attributes: true, characterData: true });
          root.addEventListener("load", handleLoad, true);
          root.addEventListener("loadeddata", checkContent, true);
        }
        root.querySelectorAll("*").forEach((element) => {
          if (element.shadowRoot) roots.push(element.shadowRoot);
        });
      }

      const hasContent = roots.some((root) => Array.from(root.querySelectorAll(contentSelector)).some((element) => {
        if (element instanceof HTMLImageElement) {
          return element.complete && element.naturalWidth > 64 && element.naturalHeight > 64;
        }
        if (element instanceof HTMLVideoElement) return element.readyState >= 2;
        if (element instanceof HTMLIFrameElement) return loadedFrames.has(element);
        return Boolean(element.textContent?.trim());
      }));

      if (hasContent && !ready) {
        ready = true;
        clearTimeout(timeout);
        clearInterval(discovery);
        setStatus("ready");
      }
    };

    const handleLoad = (event: Event) => {
      if (event.target instanceof HTMLIFrameElement) loadedFrames.add(event.target);
      checkContent();
    };

    const mutations = new MutationObserver(checkContent);

    const viewport = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      viewport.disconnect();
      checkContent();
      if (ready) return;
      setStatus((current) => current === "unavailable" ? current : "loading");
      discovery = setInterval(checkContent, 500);
      timeout = setTimeout(() => {
        checkContent();
        clearInterval(discovery);
        if (!ready) setStatus("unavailable");
      }, 15_000);
    });

    viewport.observe(container);
    checkContent();

    return () => {
      clearTimeout(timeout);
      clearInterval(discovery);
      mutations.disconnect();
      viewport.disconnect();
      observedRoots.forEach((root) => {
        root.removeEventListener("load", handleLoad, true);
        root.removeEventListener("loadeddata", checkContent, true);
      });
    };
  }, [contentSelector]);

  return { containerRef, status, reportError };
}
