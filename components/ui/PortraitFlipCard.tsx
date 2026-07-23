'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';

interface PortraitFlipCardProps {
  className?: string;
  imageSrc: string;
  shadowImageSrc?: string;
}

export const PortraitFlipCard = forwardRef<HTMLDivElement, PortraitFlipCardProps>(
  ({ className, imageSrc, shadowImageSrc = '/shadow2.png' }, ref) => {
    return (
      <div
        ref={ref}
        className={`portrait-scene w-full h-full ${className || ''}`}
        style={{
          perspective: '1400px', // perspective on scene container
        }}
      >
        <div
          className="portrait-card relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front Face: Silhouette / Locked Character with Transparent Background */}
          <div
            className="portrait-face portrait-front absolute inset-0 w-full h-full overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
          >
            <img
              src={`${shadowImageSrc}?v=2`}
              alt="Yameen Munir - Silhouette Shadow"
              className="object-contain w-full h-full"
            />
          </div>

          {/* Back Face: Full Natural Colors with Transparent Background */}
          <div
            className="portrait-face portrait-back absolute inset-0 w-full h-full overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <Image
              src={imageSrc}
              alt="Yameen Munir - Back Portrait"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      </div>
    );
  }
);

PortraitFlipCard.displayName = 'PortraitFlipCard';
