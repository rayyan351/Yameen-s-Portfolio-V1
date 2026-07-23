'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function MagneticButton({ children, className, ...props }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // We will implement the premium magnetic hover effect in subsequent prompts using GSAP.
  return (
    <button
      ref={buttonRef}
      className={cn('relative inline-flex items-center justify-center transition-transform duration-300 active:scale-95', className)}
      {...props}
    >
      {children}
    </button>
  );
}
