'use client';

import { DetectedObject } from '@/services/ppe-detection.service';

type PPEResultOverlayProps = {
  imageDataUrl: string;
  detections: DetectedObject[];
};

export function PPEResultOverlay({
  imageDataUrl,
  detections,
}: PPEResultOverlayProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-border">
      <img
        src={imageDataUrl}
        alt="Captured image"
        className="h-full w-full object-contain"
      />
      <svg
        className="absolute inset-0 h-full w-full"
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
                strokeWidth="3"
              />
              <text
                x={x1}
                y={y1 - 5}
                fill={color}
                fontSize="14"
                fontWeight="bold"
                className="drop-shadow-lg"
              >
                {detection.class_name} {(detection.confidence * 100).toFixed(0)}
                %
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
