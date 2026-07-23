import React from 'react';

interface SectionLabelProps {
  number: string;
  text: string;
}

export default function SectionLabel({ number, text }: SectionLabelProps) {
  return (
    <div className="font-mono text-xs uppercase tracking-widest text-clay mb-6 flex items-center gap-2">
      <span className="opacity-60">{number}</span>
      <span className="w-4 h-[1px] bg-clay opacity-40"></span>
      <span>{text}</span>
    </div>
  );
}
