'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface FlipTextRevealProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
}

export default function FlipTextReveal({ lines, className, lineClassName }: FlipTextRevealProps) {
  return (
    <div
      className={cn("flip-text-container relative", className)}
      style={{ perspective: '1000px' }}
      aria-label={lines.join(' ')}
    >
      {lines.map((line, idx) => (
        <div
          key={idx}
          className="overflow-hidden block py-1"
          aria-hidden="true"
        >
          <div
            className={cn(
              "flip-line inline-block origin-bottom-center origin-bottom pb-1.5",
              lineClassName
            )}
            style={{
              transform: 'translateY(100%) rotateX(88deg)',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            {line}
          </div>
        </div>
      ))}
    </div>
  );
}
