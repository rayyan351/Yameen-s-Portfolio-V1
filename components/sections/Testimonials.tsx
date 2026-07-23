'use client';

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsapPlugins } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { testimonials, Testimonial } from '@/data/testimonials';

export default function Testimonials() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const reducedMotion = useReducedMotion();
  const isTransitioning = useRef(false);

  // Swipe gesture trackers
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Reference index refs for auto-scrolling the list rail
  const railRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    registerGsapPlugins();
  }, []);

  // Auto fade out hint after a brief delay
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  // Smooth scroll active index item into view if it overflows the index container on shorter screens
  useEffect(() => {
    if (activeItemRef.current && railRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeIndex]);

  useLayoutEffect(() => {
    if (!mounted || reducedMotion) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        // State setups for Skills-to-Testimonials transition
        gsap.set('.forest-bridge', {
          width: 'min(1180px, calc(100vw - clamp(56px, 8vw, 152px)))',
          height: 'clamp(90px, 11.5vh, 132px)',
          left: '50%',
          xPercent: -50,
          yPercent: 0,
          top: '52svh',
          borderRadius: '2px',
          opacity: 1,
        });

        gsap.set('.listening-room-content', { opacity: 0 });
        gsap.set('.testimonials-bg-quote', { opacity: 0, x: -30 });
        gsap.set('.testimonials-bg-title', { opacity: 0, y: 30 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        // 0.00 - 0.15: Maintain Skills final frame
        tl.to({}, { duration: 0.15 });

        // 0.15 - 0.65: Forest band expands horizontally and vertically to fill screen
        tl.to('.forest-bridge', {
          width: '100vw',
          left: '0vw',
          xPercent: 0,
          borderRadius: '0px',
          duration: 0.20,
          ease: 'power2.inOut',
        }, 0.20);

        tl.to('.forest-bridge', {
          height: '100vh',
          top: '0svh',
          duration: 0.25,
          ease: 'power2.inOut',
        }, 0.35);

        tl.to(wrapperRef.current, {
          backgroundColor: '#1C2822',
          duration: 0.25,
          ease: 'power2.inOut',
        }, 0.35);

        // 0.60 - 0.85: Show Quote mark, header, stage backdrop elements
        tl.to('.testimonials-bg-quote', {
          opacity: 0.04,
          x: 0,
          duration: 0.18,
          ease: 'power2.out',
        }, 0.58);

        tl.to('.testimonials-bg-title', {
          opacity: 0.06,
          y: 0,
          duration: 0.18,
          ease: 'power2.out',
        }, 0.62);

        tl.to('.listening-room-content', {
          opacity: 1,
          duration: 0.20,
          ease: 'sine.out',
        }, 0.68);

        // 0.85 - 1.00: Settle state
        tl.to(wrapperRef.current, { duration: 0.10 }, 0.90);
      });

      mm.add('(max-width: 767px)', () => {
        const mobileStage =
          wrapperRef.current?.querySelector<HTMLElement>(
            '.mobile-testimonials-stage'
          );

        if (!mobileStage) return;

        gsap.set('.mobile-testimonials-handoff', {
          yPercent: 0,
          rotateX: 0,
          rotateZ: -1.4,
          scale: 1.015,
          opacity: 1,
          transformPerspective: 1200,
          transformOrigin: 'top center',
        });

        gsap.set('.mobile-testimonials-shell', {
          y: 44,
          rotateX: 7,
          scale: 0.985,
          opacity: 0,
          transformPerspective: 1200,
          transformOrigin: 'top center',
        });

        gsap.set('.mobile-testimonials-meta', {
          x: -18,
          opacity: 0,
        });

        gsap.set('.mobile-testimonial-quote', {
          clipPath: 'inset(0% 0% 100% 0%)',
          y: 18,
          opacity: 0.2,
        });

        gsap.set('.mobile-testimonial-author', {
          y: 16,
          opacity: 0,
        });

        gsap.set('.mobile-testimonial-controls', {
          y: 14,
          opacity: 0,
        });

        gsap.set('.mobile-testimonial-rail', {
          y: 18,
          opacity: 0,
        });

        const mobileTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: mobileStage,
            start: 'top 88%',
            end: 'top 16%',
            scrub: 0.85,
            invalidateOnRefresh: true,
          },
        });

        // The final Skills sheet peels upward and reveals the Listening Room.
        mobileTimeline.to(
          '.mobile-testimonials-handoff',
          {
            yPercent: -112,
            rotateX: 16,
            rotateZ: -4,
            scale: 0.985,
            opacity: 0,
            duration: 0.32,
            ease: 'power2.inOut',
          },
          0
        );

        // The dark testimonial surface settles forward into the viewport.
        mobileTimeline.to(
          '.mobile-testimonials-shell',
          {
            y: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            duration: 0.32,
            ease: 'power3.out',
          },
          0.12
        );

        mobileTimeline.to(
          '.mobile-testimonials-meta',
          {
            x: 0,
            opacity: 1,
            duration: 0.12,
            ease: 'power2.out',
          },
          0.27
        );

        // Reveal the quote as one editorial block instead of fading everything at once.
        mobileTimeline.to(
          '.mobile-testimonial-quote',
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            opacity: 1,
            duration: 0.34,
            ease: 'power3.out',
          },
          0.32
        );

        mobileTimeline.to(
          '.mobile-testimonial-author',
          {
            y: 0,
            opacity: 1,
            duration: 0.16,
            ease: 'power2.out',
          },
          0.57
        );

        mobileTimeline.to(
          '.mobile-testimonial-controls',
          {
            y: 0,
            opacity: 1,
            duration: 0.14,
            ease: 'power2.out',
          },
          0.68
        );

        mobileTimeline.to(
          '.mobile-testimonial-rail',
          {
            y: 0,
            opacity: 1,
            duration: 0.16,
            ease: 'power2.out',
          },
          0.76
        );

        mobileTimeline.to({}, { duration: 0.08 }, 0.92);

        return () => {
          mobileTimeline.scrollTrigger?.kill();
          mobileTimeline.kill();
        };
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [mounted, reducedMotion]);

  // Testimonial stage slide transitions
  const changeTestimonial = (index: number) => {
    // Hide interaction hint on any switcher navigation action
    setShowHint(false);

    if (isTransitioning.current || index === activeIndex) return;
    isTransitioning.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex(index);
        // Animate the incoming elements
        gsap.fromTo('.testimonial-quote',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }
        );
        gsap.fromTo('.testimonial-author',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: 0.08 }
        );
        gsap.fromTo('.testimonial-cat',
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'sine.out' }
        );
        isTransitioning.current = false;
      }
    });

    // Animate the outgoing elements
    tl.to('.testimonial-cat', { opacity: 0, duration: 0.15 });
    tl.to('.testimonial-quote', { opacity: 0, y: -20, duration: 0.25 }, 0);
    tl.to('.testimonial-author', { opacity: 0, y: -12, duration: 0.2 }, 0.05);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % testimonials.length;
    changeTestimonial(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + testimonials.length) % testimonials.length;
    changeTestimonial(prevIdx);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  // Touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  // Trackpad horizontal swipe (via deltaX on wheel event)
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 40) {
      if (e.deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section
      id="testimonials"
      ref={wrapperRef}
      className={`relative w-full ${reducedMotion ? 'h-auto py-24 bg-[#1C2822]' : 'md:h-[135vh] h-auto bg-[#1C2822] md:bg-[#F5F1E8] overflow-visible'}`}
      data-nav-theme="dark"
    >
      {/* DESKTOP STICKY STAGE CONTAINER */}
      {!reducedMotion && (
        <div
          ref={stageRef}
          className="hidden md:flex sticky top-0 w-full h-[100svh] overflow-hidden flex-col justify-start items-center bg-transparent select-none z-10"
        >
          {/* VISUALLY IDENTICAL HANDOFF OVERLAY LAYER */}
          <div
            className="forest-bridge absolute bg-[#1C2822] z-0 pointer-events-none"
            style={{
              boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
            }}
          />

          {/* DECORATIVE QUOTATION MARK */}
          <div
            className="testimonials-bg-quote absolute left-[5vw] top-[30vh] font-serif text-[38rem] text-[#F5F1E8] opacity-0 select-none pointer-events-none leading-none z-0 font-black"
            style={{ letterSpacing: '-0.1em' }}
          >
            “
          </div>

          {/* MONUMENTAL BACKGROUND DISPLAY TITLE */}
          <div className="absolute inset-0 flex justify-center items-center select-none pointer-events-none z-0">
            <div
              className="testimonials-bg-title font-sans font-black text-[#F5F1E8] tracking-tighter uppercase leading-[0.78] opacity-0 text-center"
              style={{ fontSize: 'clamp(6rem, 11.5vw, 13.5rem)', letterSpacing: '-0.07em' }}
            >
              WHAT PEOPLE
              <br />
              SAY
            </div>
          </div>

          {/* INTERACTIVE STAGE & AUTHOR INDEX CONTAINER */}
          <div
            className="listening-room-content relative w-full h-full grid select-text z-10 opacity-0"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            style={{
              gridTemplateColumns: 'minmax(0, 1fr) clamp(240px, 20vw, 340px)',
              paddingInline: 'clamp(28px, 5vw, 92px)',
              paddingTop: 'clamp(100px, 9.5vh, 120px)',
              paddingBottom: 'clamp(32px, 4vh, 60px)',
            }}
          >
            {/* Left Area: Active Testimonial stage */}
            <div className="flex flex-col justify-between items-start h-full pr-8">
              {/* Spacer replacing header to clear the navbar */}
              <div className="w-full h-4" />

              {/* Blockquote stage (fixed height to prevent jumping) */}
              <div
                className="w-full flex-1 flex flex-col justify-center items-start text-left select-text"
                style={{
                  minHeight: 'clamp(320px, 42vh, 440px)',
                  maxWidth: '92%',
                }}
              >
                <span className="testimonial-cat font-mono text-[10px] text-[#FAF6EE]/40 uppercase tracking-widest block mb-4">
                  {activeTestimonial.category}
                </span>

                <blockquote
                  className="testimonial-quote font-serif text-[#F5F1E8] italic font-normal leading-[1.32] tracking-tight relative mb-8"
                  style={{
                    fontSize: activeTestimonial.quote.length > 300 ? 'clamp(1.4rem, 2.1vw, 2.3rem)' : 'clamp(1.65rem, 2.6vw, 3.2rem)',
                    textWrap: 'pretty',
                  }}
                >
                  <span className="text-[#C47C5A] mr-1 inline-block select-none font-serif leading-none">“</span>
                  {activeTestimonial.quote}
                </blockquote>

                {/* Author Name and role */}
                <div className="testimonial-author flex items-start gap-4 select-text">
                  {/* Left Clay line marker */}
                  <span className="w-6 h-[1.5px] bg-[#C47C5A] shrink-0 mt-3" />
                  <div>
                    <h3
                      className="font-sans font-black text-[#F5F1E8] uppercase tracking-tight leading-none"
                      style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.8rem)' }}
                    >
                      {activeTestimonial.name}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.07em] text-[#FAF6EE]/65 mt-2">
                      {activeTestimonial.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Controls and metadata bottom bar */}
              <footer className="w-full flex justify-between items-center select-none pt-4 border-t border-[#FAF6EE]/10">
                {/* Temporary Interaction hint */}
                <div
                  className={`font-mono text-[8px] tracking-wider text-[#FAF6EE]/35 transition-opacity duration-700 ease-out uppercase ${
                    showHint ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  [ Swipe horizontally or use arrow keys to navigate ]
                </div>

                {/* Switcher Navigation */}
                <nav className="flex items-center gap-6 font-mono text-[11px] text-[#FAF6EE]/82 font-semibold" aria-label="Testimonial Navigation">
                  <button
                    onClick={handlePrev}
                    className="hover:text-[#C47C5A] transition-colors cursor-pointer"
                    aria-label="Previous testimonial"
                  >
                    [ PREV ]
                  </button>
                  <span className="text-[#FAF6EE]/30 font-light">
                    <span className="text-[#C47C5A]">{String(activeIndex + 1).padStart(2, '0')}</span> / {String(testimonials.length).padStart(2, '0')}
                  </span>
                  <button
                    onClick={handleNext}
                    className="hover:text-[#C47C5A] transition-colors cursor-pointer"
                    aria-label="Next testimonial"
                  >
                    [ NEXT ]
                  </button>
                </nav>
              </footer>
            </div>

            {/* Right Area: Vertical index rail */}
            <div
              ref={railRef}
              className="border-l border-[#FAF6EE]/15 pl-8 flex flex-col justify-between h-full max-h-[680px] overflow-y-auto no-scrollbar scroll-smooth my-auto"
            >
              <div className="flex flex-col gap-2 relative">
                {testimonials.map((item, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={item.id}
                      ref={isActive ? activeItemRef : null}
                      onClick={() => changeTestimonial(index)}
                      className={`flex items-center text-left py-1 w-full transition-all duration-300 group cursor-pointer focus:outline-none ${
                        isActive
                          ? 'text-[#F5F1E8] translate-x-2 font-bold'
                          : 'text-[#FAF6EE]/45 hover:text-[#FAF6EE]/80'
                      }`}
                      aria-current={isActive ? 'true' : undefined}
                      aria-label={`Show testimonial from ${item.name}`}
                    >
                      {/* Monospace 2-digit number */}
                      <span className={`font-mono text-[10px] w-7 shrink-0 ${isActive ? 'text-[#C47C5A]' : 'text-current/60'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {/* Clay rule for active item */}
                      {isActive && (
                        <span className="w-4 h-[1.5px] bg-[#C47C5A] shrink-0 mr-2 transition-all" />
                      )}

                      {/* Author Name */}
                      <span className="font-sans text-[12px] md:text-[13px] tracking-tight uppercase truncate">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Index Footer spacer */}
              <div className="pt-6 border-t border-[#FAF6EE]/10 mt-6" />
            </div>
          </div>
        </div>
      )}

      {/* MOBILE LAYOUT WITH A SCROLL-DRIVEN ENTRANCE */}
      {(reducedMotion || mounted) && (
        <div
          className="
            mobile-testimonials-stage relative block w-full overflow-hidden
            text-[#FAF6EE] select-text md:hidden
          "
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* A temporary Skills-coloured sheet creates the mobile handoff.
              It disappears completely once the entrance resolves. */}
          {!reducedMotion && (
            <div
              className="
                mobile-testimonials-handoff pointer-events-none
                absolute inset-x-0 top-0 z-30 h-[100svh]
                bg-[#F5F1E8]
                shadow-[0_24px_70px_rgba(27,27,24,0.18)]
              "
              style={{
                clipPath:
                  'polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%, 0 14px)',
              }}
            >
              <div
                className="absolute left-0 top-0 h-4 w-4 bg-[#C47C5A]"
                style={{
                  clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
                }}
              />

              <div
                className="
                  absolute inset-0 flex items-center justify-center
                  overflow-hidden px-5
                "
              >
                <div
                  className="
                    text-center font-sans font-black uppercase
                    leading-[0.78] tracking-[-0.07em]
                    text-[#1C2822]/[0.055]
                  "
                  style={{
                    fontSize: 'clamp(4.8rem, 22vw, 6.4rem)',
                  }}
                >
                  SKILLS
                  <br />
                  &amp; STACK
                </div>
              </div>

              <span
                className="
                  absolute bottom-5 left-1/2 -translate-x-1/2
                  whitespace-nowrap font-mono text-[6px]
                  uppercase tracking-[0.14em] text-[#1B1B18]/35
                "
              >
                BUILDING SYSTEMS / SOLVING REAL PROBLEMS / SHIPPING IMPACT
              </span>
            </div>
          )}

          <div
            className={[
              'mobile-testimonials-shell relative z-10 w-full px-6',
              reducedMotion ? '' : 'opacity-0',
            ].join(' ')}
          >
            {/* Top padding buffer */}
            <div className="h-8 w-full" />

            {/* Active quote card block */}
            <div className="mb-8 flex flex-col gap-6 select-text">
              <div
                className="
                  mobile-testimonials-meta flex items-center justify-between
                  border-b border-[#FAF6EE]/10 pb-2
                "
              >
                <span className="testimonial-cat font-mono text-[10px] font-semibold uppercase tracking-wider text-[#C47C5A]">
                  {activeTestimonial.category}
                </span>

                <span className="font-mono text-[10.5px] font-medium text-[#FAF6EE]/65">
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(testimonials.length).padStart(2, '0')}
                </span>
              </div>

              <blockquote
                className="
                  testimonial-quote mobile-testimonial-quote
                  font-serif text-xl italic leading-relaxed
                  text-[#F5F1E8]
                "
              >
                <span className="mr-1 select-none leading-none text-[#C47C5A]">
                  “
                </span>
                {activeTestimonial.quote}
              </blockquote>

              <div
                className="
                  testimonial-author mobile-testimonial-author
                  mt-2 flex items-start gap-3
                  border-t border-[#FAF6EE]/10 pt-4
                "
              >
                <span className="mt-2 h-[1.5px] w-4 shrink-0 bg-[#C47C5A]" />

                <div>
                  <h3 className="font-sans text-lg font-bold uppercase tracking-tight text-[#F5F1E8]">
                    {activeTestimonial.name}
                  </h3>

                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.07em] text-[#FAF6EE]/65">
                    {activeTestimonial.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div
              className="
                mobile-testimonial-controls flex items-center justify-between
                border-t border-[#FAF6EE]/10 pt-4 select-none
              "
            >
              <nav
                className="
                  flex w-full items-center justify-between
                  font-mono text-[11px] font-semibold
                "
                aria-label="Mobile Navigation"
              >
                <button
                  onClick={handlePrev}
                  className="
                    rounded-[2px] border border-[#FAF6EE]/20
                    bg-ink/20 px-3 py-1.5
                    transition-colors hover:text-[#C47C5A]
                  "
                >
                  [ PREVIOUS ]
                </button>

                <button
                  onClick={handleNext}
                  className="
                    rounded-[2px] border border-[#FAF6EE]/20
                    bg-ink/20 px-3 py-1.5
                    transition-colors hover:text-[#C47C5A]
                  "
                >
                  [ NEXT ]
                </button>
              </nav>
            </div>

            {/* Compact Author voice rail at the bottom */}
            <div
              className="
                mobile-testimonial-rail mt-12
                border-t border-[#FAF6EE]/10 pt-6
              "
            >
              <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.1em] text-[#FAF6EE]/58">
                SELECT VOICE
              </span>

              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-4">
                {testimonials.map((testimonial, index) => {
                  const isSelected = index === activeIndex;

                  return (
                    <button
                      key={testimonial.id}
                      onClick={() => changeTestimonial(index)}
                      className={[
                        'shrink-0 rounded-[2px] border px-3 py-1.5',
                        'font-sans text-[11px] uppercase tracking-tight',
                        'transition-all',
                        isSelected
                          ? 'border-[#C47C5A] bg-[#C47C5A]/10 font-bold text-[#F5F1E8]'
                          : 'border-[#FAF6EE]/10 text-[#FAF6EE]/62 hover:text-[#FAF6EE]/75',
                      ].join(' ')}
                    >
                      {testimonial.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATIC FINAL DESKTOP COMPOSITION FOR REDUCED MOTION */}
      {reducedMotion && mounted && (
        <div className="hidden md:flex w-full min-h-[100svh] flex-col justify-start items-center bg-[#1C2822] relative py-20 px-12 select-text">
          {/* DECORATIVE QUOTATION MARK */}
          <div
            className="absolute left-[5vw] top-[30vh] font-serif text-[38rem] text-[#F5F1E8] opacity-[0.04] select-none pointer-events-none leading-none z-0 font-black"
            style={{ letterSpacing: '-0.1em' }}
          >
            “
          </div>

          {/* BACKGROUND TITLE */}
          <div className="absolute inset-0 flex justify-center items-center select-none pointer-events-none z-0">
            <div
              className="font-sans font-black text-[#F5F1E8] tracking-tighter uppercase leading-[0.78] opacity-[0.06] text-center"
              style={{ fontSize: 'clamp(6rem, 11.5vw, 13.5rem)', letterSpacing: '-0.07em' }}
            >
              WHAT PEOPLE
              <br />
              SAY
            </div>
          </div>

          <div
            className="relative w-full h-full grid select-text z-10 min-h-[70vh]"
            style={{
              gridTemplateColumns: 'minmax(0, 1fr) clamp(240px, 20vw, 340px)',
              paddingInline: 'clamp(28px, 5vw, 92px)',
            }}
          >
            <div className="flex flex-col justify-between items-start h-full pr-8">
              <div className="w-full h-4" />

              <div
                className="w-full flex-1 flex flex-col justify-center items-start text-left select-text my-8"
                style={{
                  minHeight: 'clamp(320px, 42vh, 440px)',
                  maxWidth: '92%',
                }}
              >
                <span className="font-mono text-[10px] text-[#FAF6EE]/40 uppercase tracking-widest block mb-4">
                  {activeTestimonial.category}
                </span>

                <blockquote
                  className="font-serif text-[#F5F1E8] italic font-normal leading-[1.32] tracking-tight relative mb-8"
                  style={{
                    fontSize: activeTestimonial.quote.length > 300 ? 'clamp(1.4rem, 2.1vw, 2.3rem)' : 'clamp(1.65rem, 2.6vw, 3.2rem)',
                    textWrap: 'pretty',
                  }}
                >
                  <span className="text-[#C47C5A] mr-1 inline-block select-none font-serif leading-none">“</span>
                  {activeTestimonial.quote}
                </blockquote>

                <div className="flex items-start gap-4 select-text">
                  <span className="w-6 h-[1.5px] bg-[#C47C5A] shrink-0 mt-3" />
                  <div>
                    <h3
                      className="font-sans font-black text-[#F5F1E8] uppercase tracking-tight leading-none"
                      style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.8rem)' }}
                    >
                      {activeTestimonial.name}
                    </h3>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-[#FAF6EE]/50 mt-2">
                      {activeTestimonial.role}
                    </p>
                  </div>
                </div>
              </div>

              <footer className="w-full flex justify-end items-center select-none pt-4 border-t border-[#FAF6EE]/10">
                <nav className="flex items-center gap-6 font-mono text-[10px] text-[#FAF6EE]/70 font-semibold" aria-label="Testimonial Navigation">
                  <button onClick={handlePrev} className="hover:text-[#C47C5A] transition-colors cursor-pointer">[ PREV ]</button>
                  <span className="text-[#FAF6EE]/30 font-light">
                    <span className="text-[#C47C5A]">{String(activeIndex + 1).padStart(2, '0')}</span> / {String(testimonials.length).padStart(2, '0')}
                  </span>
                  <button onClick={handleNext} className="hover:text-[#C47C5A] transition-colors cursor-pointer">[ NEXT ]</button>
                </nav>
              </footer>
            </div>

            <div className="border-l border-[#FAF6EE]/15 pl-8 flex flex-col justify-between h-full max-h-[580px] overflow-y-auto no-scrollbar scroll-smooth my-auto">
              <div className="flex flex-col gap-2 relative">
                {testimonials.map((item, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={item.id}
                      onClick={() => changeTestimonial(index)}
                      className={`flex items-center text-left py-1 w-full transition-all duration-300 group cursor-pointer focus:outline-none ${
                        isActive
                          ? 'text-[#F5F1E8] translate-x-2 font-bold'
                          : 'text-[#FAF6EE]/60 hover:text-[#FAF6EE]/80'
                      }`}
                    >
                      <span className={`font-mono text-[10px] w-7 shrink-0 ${isActive ? 'text-[#C47C5A]' : 'text-current/60'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {isActive && <span className="w-4 h-[1.5px] bg-[#C47C5A] shrink-0 mr-2" />}
                      <span className="font-sans text-[11px] md:text-[12px] tracking-tight uppercase truncate">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-[#FAF6EE]/10 mt-6" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}