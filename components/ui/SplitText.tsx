import React from 'react';
import { cn } from '@/lib/utils';

interface SplitTextProps {
  text: string;
  className?: string;
}

export default function SplitText({ text, className }: SplitTextProps) {
  return (
    <span className={cn('inline-block', className)}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
          <span className="inline-block transform transition-transform duration-500">
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
