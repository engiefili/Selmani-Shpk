"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades + slides a block in the first time it scrolls into view.
 * Dependency-free (plain IntersectionObserver, no animation library) so it
 * matches how the rest of the site is built. Reveals once and stays —
 * scrolling back up doesn't hide it again, which reads as more polished
 * than a repeating scroll-jack effect.
 *
 * Respects prefers-reduced-motion twice over: the observer is skipped
 * entirely (content just renders in its final state), and the
 * motion-reduce: classes are a CSS-level safety net in case JS runs before
 * that check, or the media query changes mid-session.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 36,
  as: Tag = "div",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  /** Extra delay (ms) once in view — use to stagger a group of siblings. */
  delay?: number;
  /** Distance (px) the content travels in from. */
  y?: number;
  /** Render as a different element — e.g. "li" inside a <ul>/<ol>, so the
   * animated wrapper doesn't break list semantics. */
  as?: "div" | "li";
  /** Extra inline styles, merged with the animation's own. */
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  // Lazy-init from the media query so the reduced-motion case never has to
  // call setState from inside the effect below — it's just already true.
  const [visible, setVisible] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -18% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // Intentionally excludes `visible`: it only flips false -> true via
    // this same effect's observer callback, so re-running on that change
    // would just immediately no-op (the `if (... || visible) return`
    // guard above) after a pointless disconnect/reconnect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tag
      ref={ref}
      className={`transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:!transition-none motion-reduce:!transform-none motion-reduce:!opacity-100 ${className}`}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </Tag>
  );
}
