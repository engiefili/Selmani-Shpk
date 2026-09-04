"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";

/**
 * Wraps a photo card so it tilts in 3D toward the cursor and picks up a
 * soft light-glare highlight — the kind of "notices you're there" touch
 * used on gallery/portfolio cards, rather than a generic scroll fade.
 *
 * Desktop-only by design (gated on hover+fine-pointer) and skipped
 * entirely under prefers-reduced-motion. On touch devices, or when
 * reduced motion is requested, this renders as a plain wrapper with none
 * of the pointer machinery attached.
 */
export default function TiltCard({
  children,
  className = "",
  as: Tag = "div",
  onClick,
  type,
  "aria-label": ariaLabel,
  max = 10,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "button";
  onClick?: () => void;
  type?: "button" | "submit";
  "aria-label"?: string;
  /** Max rotation in degrees. */
  max?: number;
  /** Show a cursor-following light highlight over the card. */
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement & HTMLButtonElement>(null);
  const [transform, setTransform] = useState("");
  const [transition, setTransition] = useState("transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)");
  const [glareStyle, setGlareStyle] = useState<{ opacity: number; background?: string }>({
    opacity: 0,
  });
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const onMouseMove = enabled
    ? (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 2 * max;
        const rotateX = (0.5 - py) * 2 * max;

        setTransition("transform 0.1s linear");
        setTransform(
          `perspective(800px) scale3d(1.03, 1.03, 1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
        );
        if (glare) {
          setGlareStyle({
            opacity: 0.16,
            background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, white, transparent 55%)`,
          });
        }
      }
    : undefined;

  const onMouseLeave = enabled
    ? () => {
        setTransition("transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)");
        setTransform("perspective(800px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)");
        setGlareStyle({ opacity: 0 });
      }
    : undefined;

  return (
    <Tag
      ref={ref}
      type={Tag === "button" ? (type ?? "button") : undefined}
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`[transform-style:preserve-3d] will-change-transform ${className}`}
      style={{ transform: transform || undefined, transition }}
    >
      {children}
      {glare && enabled && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{ opacity: glareStyle.opacity, background: glareStyle.background }}
        />
      )}
    </Tag>
  );
}
