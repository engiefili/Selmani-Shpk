"use client";

import { useRef, useState } from "react";

export default function TiltDragImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [rotateY, setRotateY] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, y: 0, rotateY: 0, rotateX: 0 });

  function onPointerDown(e: React.PointerEvent) {
    setDragging(true);
    start.current = { x: e.clientX, y: e.clientY, rotateY, rotateX };
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    setRotateY(
      Math.min(45, Math.max(-45, start.current.rotateY + dx * 0.4))
    );
    setRotateX(
      Math.min(20, Math.max(-20, start.current.rotateX - dy * 0.3))
    );
  }

  function onPointerUp() {
    setDragging(false);
    setRotateY(0);
    setRotateX(0);
  }

  return (
    <div
      className="flex h-full w-full items-center justify-center [perspective:1000px]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={`h-full w-full cursor-grab touch-none object-cover select-none active:cursor-grabbing ${
          dragging ? "" : "transition-transform duration-500 ease-out"
        }`}
        style={{
          transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
          transformStyle: "preserve-3d",
        }}
      />
    </div>
  );
}
