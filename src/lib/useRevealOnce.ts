import { useEffect, useRef, useState } from "react";

export type RevealOnceOptions = {
  threshold?: number | number[];
  rootMargin?: string;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Toggle visibility from viewport intersection; replays motion when scrolling back. */
export function useRevealOnce<T extends HTMLElement>(options: RevealOnceOptions = {}) {
  const { threshold = 0.15, rootMargin = "40px 0px" } = options;
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return { ref, visible };
}

/** Toggle a class on enter/exit so scroll-in motion can replay. */
export function observeRevealOnce(
  nodes: HTMLElement[],
  className: string,
  options: RevealOnceOptions = {},
) {
  const { threshold = 0.08, rootMargin = "0px 0px -6% 0px" } = options;
  if (!nodes.length) return () => {};

  if (prefersReducedMotion()) {
    nodes.forEach((el) => el.classList.add(className));
    return () => {};
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add(className);
        } else {
          entry.target.classList.remove(className);
        }
      }
    },
    { threshold, rootMargin },
  );

  nodes.forEach((el) => io.observe(el));
  return () => io.disconnect();
}
