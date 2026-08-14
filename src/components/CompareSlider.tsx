"use client";

import { useRef, useState } from "react";

export default function CompareSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  const [percent, setPercent] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function updateFromClientX(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.min(100, Math.max(0, next)));
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[320px] w-full touch-none select-none overflow-hidden"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) updateFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beforeSrc}
        alt={beforeAlt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${percent}%)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterSrc}
          alt={afterAlt}
          draggable={false}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Drag handle */}
      <div
        className="absolute top-0 bottom-0 z-10 w-0.5 cursor-ew-resize bg-white"
        style={{ left: `${percent}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg">
          <span className="text-xs">↔</span>
        </div>
      </div>

      <span
        className="absolute top-1/2 z-10 -translate-x-full -translate-y-1/2 whitespace-nowrap rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white"
        style={{ left: `calc(${percent}% - 28px)` }}
      >
        {beforeLabel}
      </span>
      <span
        className="absolute top-1/2 z-10 -translate-y-1/2 whitespace-nowrap rounded-md bg-neutral-900/70 px-4 py-2.5 text-sm font-medium text-white"
        style={{ left: `calc(${percent}% + 28px)` }}
      >
        {afterLabel}
      </span>
    </div>
  );
}
