'use client';

import { useRef, useEffect, useState } from 'react';
import { DetectedObject } from '@/services/ppe-detection.service';

type PPEResultOverlayProps = {
  imageDataUrl: string;
  detections: DetectedObject[];
};

export function PPEResultOverlay({
  imageDataUrl,
  detections,
}: PPEResultOverlayProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleLoad = () => {
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener('load', handleLoad);
      return () => img.removeEventListener('load', handleLoad);
    }
  }, [imageDataUrl]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-border">
      <img
        ref={imgRef}
        src={imageDataUrl}
        alt="Captured image"
        className="h-full w-full object-contain"
      />
      {imageDimensions.width > 0 && (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ pointerEvents: 'none' }}
        >
          {detections.map((detection, index) => {
            const [x1, y1, x2, y2] = detection.bbox;
            const width = x2 - x1;
            const height = y2 - y1;

            // Color based on detection type
            const isNegative = detection.class_name.startsWith('NO-');
            const color = isNegative ? '#ef4444' : '#22c55e'; // red-500 : green-500

            return (
              <g key={index}>
                <rect
                  x={x1}
                  y={y1}
                  width={width}
                  height={height}
                  fill="none"
                  stroke={color}
                  strokeWidth="4"
                />
                <text
                  x={x1}
                  y={y1 - 8}
                  fill={color}
                  fontSize="16"
                  fontWeight="bold"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  }}
                >
                  {detection.class_name}{' '}
                  {(detection.confidence * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
