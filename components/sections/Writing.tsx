'use client';

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsapPlugins } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { writingPosts, WritingPost } from '@/data/writing';

export default function Writing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1); // ARTICLE 02 (restaurant website) is initially active
  const [liftedIndex, setLiftedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const reducedMotion = useReducedMotion();
  const isTransitioning = useRef(false);
  const [showWritingHint, setShowWritingHint] = useState(true);

  useEffect(() => {
    setMounted(true);
    registerGsapPlugins();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer to fade out hint after a few seconds of mounting
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        setShowWritingHint(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  useLayoutEffect(() => {
    if (!mounted || reducedMotion || isMobile) return;

    const ctx = gsap.context(() => {
      // Scroll-scrubbed background color transition from Testimonials forest-green to Writing cream
      gsap.fromTo(containerRef.current,
        { backgroundColor: '#1C2822' },
        {
          backgroundColor: '#F5F1E8',
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'top 30%',
            scrub: true,
          }
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 55%',
        },
      });

      // 1. Horizontal divider line stretches
      tl.fromTo('.transition-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power2.out' }
      );

      // 2. Intro text reveals
      tl.fromTo('.writing-intro-element',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.5'
      );

      // 3. Card stack elements reveal
      tl.fromTo('.stack-base-element',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );

      tl.fromTo('.paper-sheet-element',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );

      // 4. Tilt stack container slightly (standard desktop tilt value)
      tl.fromTo('.stack-container-3d',
        { rotateX: 0, rotateY: 0, rotateZ: 0 },
        { rotateX: 6.5, rotateY: -7.5, rotateZ: 1.8, duration: 0.8, ease: 'power1.out' },
        '-=0.3'
      );

      // 5. Active sheet content fades in
      tl.fromTo('.active-sheet-content',
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'sine.out' },
        '-=0.2'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [mounted, reducedMotion, isMobile]);

  // Article selection change trigger (Tactile card lifts & swaps)
  const changeArticle = (index: number) => {
    if (isTransitioning.current || index === activeIndex) return;
    isTransitioning.current = true;
    setShowWritingHint(false);

    // 1. Lift the active top sheet
    setLiftedIndex(activeIndex);

    // 2. Mid-way: Shift index layering
    setTimeout(() => {
      setActiveIndex(index);
      setLiftedIndex(null);
    }, 300);

    // 3. Settle and release block lock
    setTimeout(() => {
      isTransitioning.current = false;
    }, 800);
  };

  // Swipe and Drag gesture detection
  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);
  const isSwiping = useRef(false);

  const handleSwipeStart = (x: number, y: number) => {
    swipeStartX.current = x;
    swipeStartY.current = y;
    isSwiping.current = true;
  };

  const handleSwipeEnd = (x: number, y: number) => {
    if (!isSwiping.current || swipeStartX.current === null || swipeStartY.current === null) return;

    const diffX = x - swipeStartX.current;
    const diffY = y - swipeStartY.current;

    if (Math.abs(diffX) > 40 || Math.abs(diffY) > 40) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          changeArticle((activeIndex + 1) % writingPosts.length);
        } else {
          changeArticle((activeIndex - 1 + writingPosts.length) % writingPosts.length);
        }
      } else {
        if (diffY < 0) {
          changeArticle((activeIndex + 1) % writingPosts.length);
        } else {
          changeArticle((activeIndex - 1 + writingPosts.length) % writingPosts.length);
        }
      }
    }
    isSwiping.current = false;
    swipeStartX.current = null;
    swipeStartY.current = null;
  };

  // Keyboard navigation arrow keys support inside stack area
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      changeArticle(index);
    }
  };

  const handleStackKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      changeArticle((activeIndex - 1 + writingPosts.length) % writingPosts.length);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      changeArticle((activeIndex + 1) % writingPosts.length);
    }
  };

  const activePost = writingPosts[activeIndex];

  // Title highlighter helper to align word-breaks and printed color block exactly as designed
  const renderTitle = (post: WritingPost) => {
    if (post.id === 'post-1') {
      return (
        <>
          Awarded the <br />
          <span className="relative inline-block px-1.5 py-0.5 bg-[#9BA68F]/25 text-[#1B1B18] font-black uppercase tracking-tight">
            Student Inclusivity Award
          </span>{' '}
          <br />
          at LSBU
        </>
      );
    }
    if (post.id === 'post-2') {
      return (
        <>
          Building a Restaurant <br />
          <span className="relative inline-block px-1.5 py-0.5 bg-[#9BA68F]/25 text-[#1B1B18] font-black uppercase tracking-tight">
            Website That Transformed
          </span>{' '}
          <br />
          a Local Business
        </>
      );
    }
    // post-3
    return (
      <>
        A Full-Stack Homestay <br />
        Exchange Platform, <br />
        <span className="relative inline-block px-1.5 py-0.5 bg-[#9BA68F]/25 text-[#1B1B18] font-black uppercase tracking-tight">
          Built Ethically
        </span>
      </>
    );
  };

  const getSheetStyle = (index: number): React.CSSProperties => {
    const totalPosts = writingPosts.length;
    const relativeIndex = (index - activeIndex + totalPosts) % totalPosts;
    const isActive = relativeIndex === 0;
    const isLifted = index === liftedIndex;

    /*
     * Mobile must still receive an explicit stacking order.
     *
     * Previously this function returned an empty object on mobile. Because every
     * paper sheet is absolutely positioned at the same coordinates, the last
     * sheet in the DOM could sit above the newly active sheet as an opaque white
     * layer. The active article was updating correctly, but its content was
     * hidden underneath that inactive sheet, which made the card look blank.
     */
    if (isMobile || reducedMotion) {
      let transform = 'translate3d(0, 0, 0)';

      if (isLifted) {
        transform = 'translate3d(0, -14px, 36px) rotateZ(-0.6deg)';
      } else if (!isActive && relativeIndex === 1) {
        transform = 'translate3d(0, 8px, 0) rotateZ(0.25deg) scale(0.992)';
      } else if (!isActive) {
        transform = 'translate3d(0, 16px, 0) rotateZ(-0.25deg) scale(0.984)';
      }

      return {
        zIndex: isLifted ? 40 : isActive ? 30 : relativeIndex === 1 ? 20 : 10,
        transform,
        pointerEvents: isActive ? 'auto' : 'none',
      };
    }

    let transformStr = '';
    if (isLifted) {
      transformStr = 'translate3d(0, -20px, 80px)';
    } else if (isActive) {
      transformStr = 'translate3d(0, 0, 20px)';
    } else if (relativeIndex === 1) {
      const hoverShift = hoveredIndex === index ? -6 : 0;
      transformStr = `translate3d(0, ${44 + hoverShift}px, 10px)`;
    } else {
      const hoverShift = hoveredIndex === index ? -6 : 0;
      transformStr = `translate3d(0, ${88 + hoverShift}px, 0px)`;
    }

    return {
      zIndex: isActive ? 30 : relativeIndex === 1 ? 20 : 10,
      transform: transformStr,
    };
  };

  return (
    <section
      id="writing"
      ref={containerRef}
      data-nav-theme="light"
     className="
  relative w-full select-text bg-[#F5F1E8] text-[#1B1B18]
  pb-0
  pt-[calc(var(--nav-height)+var(--nav-offset)+24px)]

  md:pt-14

  lg:pb-10
  xl:pb-0
"
    >
      {/* STICKY CONTAINER FOR SMOOTH CHROMATIC TRANSITION */}
      <div
        className="relative w-full flex flex-col justify-center"
        style={{
          paddingInline: 'clamp(28px, 5vw, 92px)',
        }}
      >

        {/* Horizontal transition boundary rule */}
        <div className="transition-line w-full h-[1px] bg-[#1B1B18]/15 origin-left mb-12" />

        <div className="max-w-[1240px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-16 md:gap-24 relative">

          {/* LEFT: SECTION INTRODUCTION */}
          <div className="writing-intro-element w-full md:w-[32%] flex flex-col items-start select-text">
            <span className="font-mono text-xs text-[#C47C5A] block relative font-bold tracking-widest uppercase">
              WRITING & RESEARCH
              <span className="absolute bottom-[-4px] left-0 w-8 h-[2px] bg-[#C47C5A]" />
            </span>
            <h2
              className="font-sans font-black text-[#1B1B18] tracking-tighter uppercase mt-6 leading-[0.92] text-left"
              style={{ fontSize: 'clamp(2.6rem, 4.2vw, 4.8rem)' }}
            >
              Case studies
              <br />
              & write-ups
            </h2>
            <p className="font-sans text-[#1B1B18]/70 text-[14px] md:text-[15px] leading-relaxed mt-6 max-w-[280px]">
              Project stories I&apos;ve shared, with the original posts a tap away.
            </p>
          </div>

          {/* RIGHT: PUBLICATION STACK VIEWPORT */}
          <div className="w-full md:w-[62%] flex flex-col justify-center items-center">

            {/* 3D PERSPECTIVE CONTAINER */}
            <div
              className="stack-stage w-full max-w-[520px] select-text cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C47C5A]/30 rounded-[4px]"
              tabIndex={0}
              onKeyDown={handleStackKeyDown}
              style={{
                perspective: '1900px',
                transformStyle: 'preserve-3d',
              }}
              onTouchStart={(e) => handleSwipeStart(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchEnd={(e) => handleSwipeEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
              onMouseDown={(e) => handleSwipeStart(e.clientX, e.clientY)}
              onMouseUp={(e) => handleSwipeEnd(e.clientX, e.clientY)}
              onMouseLeave={() => { isSwiping.current = false; }}
            >
              <div
                ref={stackRef}
                className="stack-container-3d relative h-[478px] w-full md:h-[520px]"
                style={{
                  transformStyle: 'preserve-3d',
                  // Static base values for mobile, dynamic transitions handle rotates on desktop scroll
                  transform: isMobile || reducedMotion ? 'rotateX(4deg) rotateZ(0.8deg)' : undefined,
                }}
              >
                {/* Visual support base slab */}
                <div
                  className="
                    stack-base-element absolute left-0 top-0
                    h-[420px] w-full rounded-[4px] bg-[#1C2822]
                    md:h-[400px]
                  "
                  style={{
                    transform: 'translate3d(0, 0, -4px)',
                    boxShadow: '0 25px 50px rgba(27, 27, 24, 0.16)',
                  }}
                />

                {/* Stacking Sheets */}
                {writingPosts.map((post, index) => {
                  const relativeIndex = (index - activeIndex + writingPosts.length) % writingPosts.length;
                  const isActive = relativeIndex === 0;

                  return (
                    <div
                      key={post.id}
                      className={`paper-sheet-element absolute left-0 top-0 h-[450px] w-full rounded-[2px] border border-[#1B1B18]/10 bg-white select-none shadow-[0_4px_16px_rgba(27,27,24,0.05),_0_1px_2px_rgba(27,27,24,0.03)] transition-all duration-[800ms] ease-in-out md:h-[450px] ${!isActive ? 'cursor-pointer' : ''
                        }`}
                      style={{
                        ...getSheetStyle(index),
                        transformStyle: 'preserve-3d',
                      }}
                      onClick={!isActive ? () => changeArticle(index) : undefined}
                    >
                      {/* ACTIVE PAGE CONTENT GRID */}
                      <div
                        className={`active-sheet-content flex h-full w-full flex-col justify-between p-6 select-text transition-all duration-[600ms] ease-out md:p-8 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                          }`}
                        style={{
                          clipPath: isActive ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
                        }}
                      >
                        {/* Categories bar */}
                        <div className="flex min-h-7 w-full items-center justify-between border-b border-[#1B1B18]/5 pb-2.5">
                          <span className="font-mono text-[9px] font-semibold uppercase leading-relaxed tracking-[0.09em] text-[#C47C5A] md:text-[10px]">
                            {post.categories.join(' \u00B7 ')}
                          </span>
                        </div>

                        {/* Title & Summary */}
                        <div className="flex flex-1 flex-col items-start justify-center gap-3 py-3 select-text md:gap-4 md:py-4">
                          <h3
                            className="font-sans font-black text-[#1B1B18] uppercase tracking-tight leading-[0.94] text-left hover:text-[#C47C5A] transition-colors duration-300 cursor-pointer"
                            style={{ fontSize: 'clamp(1.6rem, 2.8vw, 3.4rem)' }}
                            onClick={() => window.open(post.articleUrl, '_blank')}
                          >
                            {renderTitle(post)}
                          </h3>
                          <p className="max-w-[420px] select-text text-left font-sans text-[13px] leading-[1.55] text-[#1B1B18]/80 md:text-[14.5px] md:leading-relaxed">
                            {post.summary}
                          </p>
                        </div>

                        {/* Bottom Actions Bar */}
                        <footer
                          className="
                            flex w-full flex-col gap-3
                            border-t border-[#1B1B18]/10 pt-3
                            select-none
                            md:flex-row md:items-end md:justify-between
                            md:gap-5 md:pt-4
                          "
                        >
                          {/* Publication metadata and external article link */}
                          <div
                            className="
                              flex items-center justify-between gap-3
                            font-mono text-[9px] text-[#1B1B18]/65
                            md:flex-col md:items-start md:justify-start
                            md:gap-1 md:text-[10px]
                            "
                          >
                            <span className="whitespace-nowrap">
                              {post.date} &middot; {post.readingTime}
                            </span>

                            <a
                              href={post.linkedInUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(event) => event.stopPropagation()}
                              className="
                                inline-flex min-h-7 items-center gap-1
                                whitespace-nowrap font-bold text-[#C47C5A]
                                transition-colors hover:text-[#1B1B18]
                                focus-visible:outline-none
                                focus-visible:ring-1
                                focus-visible:ring-[#C47C5A]/60
                              "
                            >
                              View on LinkedIn
                              <span aria-hidden="true">↗</span>
                            </a>
                          </div>

                          {/* Navigation gets its own full-width row on narrow screens */}
                          <nav
                            className="
                              grid w-full
                              grid-cols-[1fr_auto_1fr] items-center gap-2
                              border-t border-[#1B1B18]/8 pt-2.5
                              font-mono text-[10px] font-bold
                              tracking-[0.09em] text-[#1B1B18]
                              md:flex md:w-auto md:border-t-0 md:pt-0
                              md:text-[11px] md:tracking-[0.1em]
                            "
                            aria-label="Article navigation"
                          >
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                changeArticle((activeIndex - 1 + writingPosts.length) % writingPosts.length);
                              }}
                              className="
                                min-h-8 justify-self-start px-1
                                transition-colors hover:text-[#C47C5A]
                                focus-visible:outline-none
                                focus-visible:ring-1
                                focus-visible:ring-[#C47C5A]/60
                              "
                              aria-label="Previous article"
                            >
                              [ PREV ]
                            </button>

                            <span
                              className="
                                justify-self-center whitespace-nowrap
                                text-[#C47C5A]
                              "
                              aria-live="polite"
                            >
                              {String(activeIndex + 1).padStart(2, '0')}{' '}
                              <span className="text-[#1B1B18]/45">/ {String(writingPosts.length).padStart(2, '0')}</span>
                            </span>

                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                changeArticle((activeIndex + 1) % writingPosts.length);
                              }}
                              className="
                                min-h-8 justify-self-end px-1
                                transition-colors hover:text-[#C47C5A]
                                focus-visible:outline-none
                                focus-visible:ring-1
                                focus-visible:ring-[#C47C5A]/60
                              "
                              aria-label="Next article"
                            >
                              [ NEXT ]
                            </button>
                          </nav>
                        </footer>
                      </div>

                      {/* EXPOSED BOTTOM TAB SELECTOR FOR INACTIVE SHEETS */}
                      {!isActive && (
                        <button
                          onClick={() => changeArticle(index)}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          className="absolute bottom-0 left-0 w-full h-[36px] bg-[#FAF8F5] hover:bg-[#F2EFE7] border-t border-[#1B1B18]/10 px-8 flex items-center justify-start text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#C47C5A]/50 transition-colors"
                          aria-label={`Show article: ${post.title}`}
                          aria-current={isActive ? 'true' : undefined}
                        >
                          <span className="font-sans text-[11px] font-bold uppercase tracking-tight text-[#1B1B18]/68 truncate w-full group-hover:text-[#1B1B18]">
                            {post.title}
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Restrained controls and hint (centered directly beneath the stack) */}
            <div className="flex flex-col items-center gap-3 mt-3 w-full max-w-[520px]">
              {/* Usage Hint */}
              <div
                className={`font-mono text-[8.5px] font-bold text-[#1B1B18]/40 tracking-widest uppercase transition-opacity duration-700 select-none ${showWritingHint ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
              >
                CLICK A PAGE TO BRING IT FORWARD &darr;
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}