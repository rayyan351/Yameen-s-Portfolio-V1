'use client';

import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsapPlugins } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { pressRecords } from '@/data/press';

export default function Press() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    registerGsapPlugins();
  }, []);

  useLayoutEffect(() => {
    if (!mounted || reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      });

      // 1. Horizontal divider stretches
      tl.fromTo('.press-divider',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power2.out' }
      );

      // 2. Press header and items fade/slide in gently
      tl.fromTo('.press-reveal',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 },
        '-=0.4'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [mounted, reducedMotion]);

  return (
    <section
      id="press"
      ref={sectionRef}
      data-nav-theme="light"
      className="w-full bg-[#F5F1E8] text-[#1B1B18] relative select-text"
      style={{
        paddingInline: 'clamp(28px, 5vw, 92px)',
        paddingTop: 'clamp(16px, 2vh, 24px)',
        paddingBottom: 'clamp(90px, 11vh, 150px)',
      }}
    >
      {/* 1. Horizontal base line/divider */}
      <div className="press-divider w-full h-[1px] bg-[#1B1B18]/15 origin-left mb-8 md:mb-12" />

      <div className="max-w-[1240px] mx-auto w-full">
        {/* Asymmetric Desktop 3-Column Grid */}
        <div
          className="grid gap-12 md:gap-16 items-start"
          style={{
            gridTemplateColumns: '1fr', // Mobile stacks
          }}
        >
          {/* Responsive grid styles using Tailwind classes for md screen */}
          <div
  className="
    grid w-full min-w-0 grid-cols-1
    gap-y-10

    md:grid-cols-2
    md:gap-x-10
    md:gap-y-12

    xl:grid-cols-[minmax(220px,_0.7fr)_minmax(0,_1fr)_minmax(0,_1fr)]
    xl:gap-16
  "
>
            
            {/* Column 01: Press Introduction */}
            <header
  className="
    press-reveal
    flex flex-col items-start gap-3
    pt-2

    md:col-span-2
    md:max-w-[380px]
    md:pb-2

    xl:col-span-1
    xl:max-w-none
    xl:pt-6
    xl:pb-0
  "
>
              <span className="font-mono text-xs text-[#C47C5A] block relative font-bold tracking-widest uppercase">
                PRESS
                <span className="absolute bottom-[-4px] left-0 w-8 h-[2px] bg-[#C47C5A]" />
              </span>
              <h2 className="font-sans font-bold text-[#1B1B18] uppercase tracking-tight text-lg md:text-xl mt-2.5 leading-snug">
                As featured by LSBU
              </h2>
              <p className="font-mono text-[10.5px] md:text-[11px] uppercase tracking-[0.07em] text-[#1B1B18]/65 mt-1 max-w-[220px] leading-relaxed">
                Selected features from London South Bank University.
              </p>
            </header>

            {/* Column 02 & 03: Press Features */}
            {pressRecords.map((record) => (
              <article
                key={record.id}
                className="
  press-reveal group
  relative flex h-full min-w-0 flex-col
  items-start justify-between
  border-t border-[#1B1B18]/10
  pt-6
  min-h-[190px]
  md:min-h-[220px]
  xl:min-h-[190px]
  select-text
"
              >
                <div className="w-full flex flex-col items-start gap-3">
                  {/* Category label */}
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#C47C5A] font-semibold">
                    {record.category}
                  </span>
                  
                  {/* Title */}
                  <h3
                    className="
  max-w-full break-words
  font-sans font-bold uppercase
  leading-[1.08] tracking-tight
  text-[#1B1B18]
  transition-colors duration-300
  group-hover:text-[#1B1B18]/85
"
                    style={{ fontSize: 'clamp(1.15rem, 1.4vw, 1.6rem)' }}
                  >
                    {record.title}
                  </h3>

                  {/* Description */}
                  <p
  className="
    mt-1 max-w-none
    text-wrap-pretty break-words
    font-sans text-[14px] leading-relaxed
    text-[#1B1B18]/78
    md:text-[14.5px]
    xl:max-w-[350px]
  "
>
                    {record.description}
                  </p>
                </div>

                {/* Read Link */}
                <a
                  href={record.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-6 font-mono text-[10.5px] text-[#C47C5A] uppercase tracking-wider font-bold pb-0.5 transition-all duration-300"
                  aria-label={`Read article: ${record.title}`}
                >
                  <span className="relative">
                    Read article
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C47C5A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </span>
                  <span className="text-xs transform group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
                </a>
              </article>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
