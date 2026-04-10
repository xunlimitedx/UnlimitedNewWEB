'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ZoomIn, ZoomOut, X, RotateCcw } from 'lucide-react';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageZoom({ src, alt, className = '' }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isZoomed) return;

    if (isDragging.current && scale > 1) {
      const dx = e.clientX - lastPosition.current.x;
      const dy = e.clientY - lastPosition.current.y;
      lastPosition.current = { x: e.clientX, y: e.clientY };
      setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      return;
    }

    if (scale === 1) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * -100;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -100;
    setPosition({ x, y });
  }, [isZoomed, scale]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isZoomed) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    setScale((prev) => Math.max(1, Math.min(5, prev + delta)));
  }, [isZoomed]);

  return (
    <>
      <div
        className={`cursor-zoom-in ${className}`}
        onClick={() => setIsZoomed(true)}
      >
        <Image src={src} alt={alt} fill className="object-contain p-4" sizes="(max-width: 1024px) 100vw, 50vw" priority />
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
          <ZoomIn className="w-3.5 h-3.5" /> Click to zoom
        </div>
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => { setIsZoomed(false); setScale(1); setPosition({ x: 0, y: 0 }); }}
        >
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); setScale((s) => Math.min(5, s + 0.5)); }}
              className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setScale((s) => Math.max(1, s - 0.5)); }}
              className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setScale(1); setPosition({ x: 0, y: 0 }); }}
              className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setIsZoomed(false); setScale(1); setPosition({ x: 0, y: 0 }); }}
              className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            ref={containerRef}
            className="relative w-full h-full max-w-4xl max-h-[80vh] cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
            onMouseMove={handleMouseMove}
            onMouseDown={(e) => { isDragging.current = true; lastPosition.current = { x: e.clientX, y: e.clientY }; }}
            onMouseUp={() => { isDragging.current = false; }}
            onWheel={handleWheel}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain transition-transform duration-100"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              }}
              sizes="100vw"
              quality={100}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full">
            {Math.round(scale * 100)}% · Scroll to zoom · Drag to pan
          </div>
        </div>
      )}
    </>
  );
}
