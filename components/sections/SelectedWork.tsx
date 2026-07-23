'use client';

import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { registerGsapPlugins } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { projects } from '@/data/projects';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function SelectedWork() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const handsRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const wordWorkRef = useRef<HTMLHeadingElement>(null);
  const previewZoomRef = useRef<HTMLDivElement>(null);

  // SVG Filter element refs
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);

  // Dynamic arrays of refs for multiple projects
  const previewImgsRef = useRef<(HTMLImageElement | null)[]>([]);
  const previewEdgeImgsRef = useRef<(HTMLImageElement | null)[]>([]);
  const contentWrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const detailPanelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const particlesContainersRef = useRef<(HTMLDivElement | null)[]>([]);

  // Animation multipliers for displacement scale
  const scaleObj = useRef({ value: 15 });

  const [isOrbGlowed, setIsOrbGlowed] = useState(false);
  const isReducedMotion = useReducedMotion();

  const handleReadCaseStudy = (
    e: React.MouseEvent<HTMLAnchorElement>,
    idx: number
  ) => {
    e.preventDefault();

    const section = sectionRef.current;
    if (!section) return;

    const sectionTop =
      window.scrollY + section.getBoundingClientRect().top;

    // ScrollTrigger runs from "top top" to "bottom bottom",
    // so this is the real scrollable distance.
    const scrollableDistance = Math.max(
      section.offsetHeight - window.innerHeight,
      0
    );

    // Detail panel for project idx should be fully visible around its specific timeline progress.
    const N = projects.length;
    const revealEnd = 0.12;
    const exitStart = 0.92;
    const segmentWidth = (exitStart - revealEnd) / N;

    // We target the mid-point of the detail reveal segment (approx 0.69 of segment)
    const detailProgress = revealEnd + idx * segmentWidth + 0.69 * segmentWidth;

    const targetScroll =
      sectionTop + scrollableDistance * detailProgress;

    window.scrollTo({
      top: targetScroll,
      behavior: isReducedMotion ? 'auto' : 'smooth',
    });
  };

  useLayoutEffect(() => {
    registerGsapPlugins();

    if (isReducedMotion) {
      // Reduced motion fallback: instantly reveal layout
      gsap.set([handsRef.current, orbRef.current], {
        opacity: 1,
        y: 0,
        scale: 1,
      });
      projects.forEach((_, idx) => {
        if (idx === 0) {
          if (previewImgsRef.current[idx]) gsap.set(previewImgsRef.current[idx], { opacity: 1 });
          if (previewEdgeImgsRef.current[idx]) gsap.set(previewEdgeImgsRef.current[idx], { opacity: 1 });
          if (contentWrappersRef.current[idx]) {
            gsap.set(contentWrappersRef.current[idx], { opacity: 1, y: 0, pointerEvents: 'auto', display: 'flex' });
          }
          if (labelsRef.current[idx]) gsap.set(labelsRef.current[idx], { opacity: 1, display: 'block' });
          if (particlesContainersRef.current[idx]) {
            gsap.set(particlesContainersRef.current[idx], { opacity: 1, display: 'flex' });
          }
        } else {
          if (previewImgsRef.current[idx]) gsap.set(previewImgsRef.current[idx], { opacity: 0 });
          if (previewEdgeImgsRef.current[idx]) gsap.set(previewEdgeImgsRef.current[idx], { opacity: 0 });
          if (contentWrappersRef.current[idx]) {
            gsap.set(contentWrappersRef.current[idx], { opacity: 0, y: 0, pointerEvents: 'none', display: 'none' });
          }
          if (labelsRef.current[idx]) gsap.set(labelsRef.current[idx], { opacity: 0, display: 'none' });
          if (particlesContainersRef.current[idx]) {
            gsap.set(particlesContainersRef.current[idx], { opacity: 0, pointerEvents: 'none', display: 'none' });
          }
        }
        if (detailPanelsRef.current[idx]) {
          gsap.set(detailPanelsRef.current[idx], { opacity: 0, y: 0, pointerEvents: 'none', display: 'none' });
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Initial Styles Configuration
      gsap.set(stageRef.current, { backgroundColor: '#F2EFE7' });
      gsap.set(wordWorkRef.current, { y: 60, opacity: 0 });
      gsap.set(handsRef.current, {
        scale: 0.96,
        opacity: 0,
        transformOrigin: '50% 100%'
      });
      gsap.set(orbRef.current, { scale: 0.85, opacity: 0 });

      // Initialize all project elements styles
      projects.forEach((_, idx) => {
        if (previewImgsRef.current[idx]) gsap.set(previewImgsRef.current[idx], { opacity: 0 });
        if (previewEdgeImgsRef.current[idx]) gsap.set(previewEdgeImgsRef.current[idx], { opacity: 0 });
        if (contentWrappersRef.current[idx]) {
          gsap.set(contentWrappersRef.current[idx], { y: 30, opacity: 0, pointerEvents: 'none', display: 'none' });
        }
        if (detailPanelsRef.current[idx]) {
          gsap.set(detailPanelsRef.current[idx], { y: 40, opacity: 0, pointerEvents: 'none', display: 'none' });
        }
        if (labelsRef.current[idx]) gsap.set(labelsRef.current[idx], { opacity: 0, display: 'none' });
        if (particlesContainersRef.current[idx]) {
          gsap.set(particlesContainersRef.current[idx], { opacity: 0, pointerEvents: 'none', display: 'none' });
        }
      });

      // Reset base scale target
      scaleObj.current.value = 15;

      // Create scroll-driven master timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
        }
      });

      // PHASE 1 — SECTION ARRIVAL (0.00–0.12)
      tl.to(stageRef.current, {
        backgroundColor: '#1C2822',
        duration: 0.12,
        ease: 'none',
      }, 0);
      tl.to(wordWorkRef.current, {
        y: 0,
        opacity: 0.05,
        duration: 0.12,
        ease: 'power3.out',
      }, 0);

      // PHASE 2 — SCULPTURAL REVEAL (0.00–0.12)
      tl.to(handsRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.12,
        ease: 'power3.out',
      }, 0);
      tl.to(orbRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.12,
        ease: 'power3.out',
      }, 0);

      // Increase liquid displacement scale toward 19 during reveal
      tl.to(scaleObj.current, {
        value: 19,
        duration: 0.12,
        ease: 'none',
      }, 0);

      // PHASE 3 — DYNAMIC MULTI-PROJECT SEQUENCE (0.12–0.92)
      const N = projects.length;
      const revealEnd = 0.12;
      const exitStart = 0.92;
      const segmentWidth = (exitStart - revealEnd) / N;

      projects.forEach((_, idx) => {
        const start = revealEnd + idx * segmentWidth;

        // Target base scale for liquid wobble during activation
        tl.to(scaleObj.current, {
          value: 16,
          duration: 0.05 * segmentWidth,
          ease: 'none',
        }, start);

        // Image Fade In
        tl.to([previewImgsRef.current[idx], previewEdgeImgsRef.current[idx]], {
          opacity: 1,
          duration: 0.12 * segmentWidth,
          ease: 'power2.out',
        }, start);

        // Particle container display flex and fade in

        // Reveal the orbiting project seals
        tl.set(
          particlesContainersRef.current[idx],
          {
            display: 'flex',
          },
          start
        );

        tl.to(
          particlesContainersRef.current[idx],
          {
            opacity: 1,
            duration: 0.12 * segmentWidth,
            ease: 'power2.out',
          },
          start
        );


        // Label display block and reveal
        tl.set(labelsRef.current[idx], { display: 'block' }, start);
        tl.to(labelsRef.current[idx], {
          opacity: 1,
          duration: 0.12 * segmentWidth,
          ease: 'power2.out',
        }, start);

        // Content Wrapper display flex and reveal
        tl.set(contentWrappersRef.current[idx], { display: 'flex' }, start + 0.02 * segmentWidth);
        tl.to(contentWrappersRef.current[idx], {
          y: 0,
          opacity: 1,
          duration: 0.16 * segmentWidth,
          ease: 'power3.out',
        }, start + 0.02 * segmentWidth);
        tl.set(contentWrappersRef.current[idx], { pointerEvents: 'auto' }, start + 0.02 * segmentWidth);

        // Transition from content wrapper to detail panel (at 0.45 of segment)
        tl.to(contentWrappersRef.current[idx], {
          opacity: 0,
          y: -25,
          duration: 0.10 * segmentWidth,
          ease: 'power3.in',
        }, start + 0.45 * segmentWidth);
        tl.set(contentWrappersRef.current[idx], { pointerEvents: 'none', display: 'none' }, start + 0.55 * segmentWidth);

        // Detail Panel Reveal (at 0.50 of segment)
        tl.set(detailPanelsRef.current[idx], { display: 'flex' }, start + 0.50 * segmentWidth);
        tl.to(detailPanelsRef.current[idx], {
          y: 0,
          opacity: 1,
          duration: 0.15 * segmentWidth,
          ease: 'power4.out',
        }, start + 0.50 * segmentWidth);
        tl.set(detailPanelsRef.current[idx], { pointerEvents: 'auto' }, start + 0.50 * segmentWidth);

        // If it's NOT the last project, fade out detail panel and image to prepare for the next project
        if (idx < N - 1) {
          tl.to(detailPanelsRef.current[idx], {
            opacity: 0,
            y: -30,
            duration: 0.10 * segmentWidth,
            ease: 'power3.in',
          }, start + 0.88 * segmentWidth);
          tl.set(detailPanelsRef.current[idx], { pointerEvents: 'none', display: 'none' }, start + 0.98 * segmentWidth);

          // Fade out image
          tl.to([previewImgsRef.current[idx], previewEdgeImgsRef.current[idx]], {
            opacity: 0,
            duration: 0.10 * segmentWidth,
            ease: 'power2.in',
          }, start + 0.88 * segmentWidth);

          // Fade out particles
          tl.to(particlesContainersRef.current[idx], {
            opacity: 0,
            duration: 0.10 * segmentWidth,
            ease: 'power2.in',
          }, start + 0.88 * segmentWidth);

          tl.set(
            particlesContainersRef.current[idx],
            {
              display: 'none',
            },
            start + 0.98 * segmentWidth
          );


          // Fade out label
          tl.to(labelsRef.current[idx], {
            opacity: 0,
            duration: 0.10 * segmentWidth,
            ease: 'power2.in',
          }, start + 0.88 * segmentWidth);
          tl.set(labelsRef.current[idx], { display: 'none' }, start + 0.98 * segmentWidth);
        } else {
          // Last project: fades out with the exit of the section
          tl.to(detailPanelsRef.current[idx], {
            opacity: 0,
            y: -30,
            duration: 0.08,
            ease: 'power3.in',
          }, exitStart);
          tl.set(detailPanelsRef.current[idx], { pointerEvents: 'none', display: 'none' }, exitStart);

          tl.to([previewImgsRef.current[idx], previewEdgeImgsRef.current[idx]], {
            opacity: 0,
            duration: 0.08,
            ease: 'power2.in',
          }, exitStart);

          tl.to(particlesContainersRef.current[idx], {
            opacity: 0,
            duration: 0.08,
            ease: 'power2.in',
          }, exitStart);


          tl.to(labelsRef.current[idx], {
            opacity: 0,
            duration: 0.08,
            ease: 'power2.in',
          }, exitStart);
          tl.set(labelsRef.current[idx], { display: 'none' }, exitStart);
        }
      });

      // PHASE 4 — SECTION EXIT (0.92–1.00)
      tl.to(orbRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.08,
        ease: 'power3.in',
      }, exitStart);
      tl.to(handsRef.current, {
        opacity: 0,
        duration: 0.08,
        ease: 'power3.in',
      }, exitStart);
      tl.to(wordWorkRef.current, {
        opacity: 0,
        duration: 0.08,
        ease: 'power3.in',
      }, exitStart);
      // Reduce displacement scale slightly during exit
      tl.to(scaleObj.current, {
        value: 8,
        duration: 0.08,
        ease: 'none',
      }, exitStart);

    }, sectionRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  // Infinite liquid current loop using requestAnimationFrame
  useEffect(() => {
    if (isReducedMotion || typeof window === 'undefined') return;

    let animId: number;
    let time = 0;

    const tick = () => {
      // Pause updates when section is completely outside the viewport
      const rect = sectionRef.current?.getBoundingClientRect();
      const isVisible = rect ? (rect.top < window.innerHeight && rect.bottom > 0) : false;

      if (!isVisible) {
        animId = requestAnimationFrame(tick);
        return;
      }

      time += 0.016; // Slow continuous water movement

      // Opposing sine waves to simulate two-directional liquid currents
      const freqX = 0.0045 + Math.sin(time * 0.55) * 0.0018;
      const freqY = 0.009 + Math.cos(time * 0.42) * 0.0028;

      // Wobble displacement scale slightly around the target base scale using a slow organic 8-12s cycle (time * 0.6)
      let wobbleScale = scaleObj.current.value + Math.sin(time * 0.7) * 3 + Math.cos(time * 0.43) * 1.5;

      // Apply responsive limits (constraining displacement scale to 4–8px maximum on desktop)
      if (window.innerWidth < 768) {
        wobbleScale = Math.min(Math.max(wobbleScale * 0.65, 7), 12);
      } else if (window.innerWidth < 1100) {
        wobbleScale = Math.min(Math.max(wobbleScale * 0.82, 10), 17);
      } else {
        wobbleScale = Math.min(Math.max(wobbleScale, 12), 22);
      }

      if (turbulenceRef.current) {
        turbulenceRef.current.setAttribute('baseFrequency', `${freqX} ${freqY}`);
      }
      if (displacementRef.current) {
        displacementRef.current.setAttribute('scale', `${wobbleScale}`);
      }

      // Apply transform to all edge images
      previewEdgeImgsRef.current.forEach((img) => {
        if (!img) return;
        const edgeX = Math.sin(time * 0.72) * 3;
        const edgeY = 0;
        const edgeScale = 1.035 + Math.sin(time * 0.61) * 0.012;
        img.style.transform = `translate3d(${edgeX}px, ${edgeY}px, 0) scale(${edgeScale})`;
      });

      // Translucent wave reflection animation
      if (waveRef.current) {
        const waveY = Math.sin(time * 0.4) * 8; // move by 8px
        waveRef.current.style.transform = `translateY(${waveY}px)`;
      }

      // Force a subtle breathing zoom (scale 1.02 -> 1.045 -> 1.02)
      if (previewZoomRef.current) {
        const microTranslation = Math.sin(time * 0.5) * 0.02;
        const breathingScale = 1.0325 + Math.sin(time * 0.6) * 0.0125;
        previewZoomRef.current.style.transform = `scale(${breathingScale}) translate3d(${microTranslation}px, 0, 0)`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, [isReducedMotion]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative w-full h-[600svh] md:h-[700svh] lg:h-[800svh] bg-forest text-cream overflow-visible select-none"
      data-nav-theme="dark"
    >
      {/* Sticky Stage Container */}
      <div
        ref={stageRef}
        className="sticky top-0 left-0 w-full h-[100svh] overflow-hidden flex flex-col justify-between pt-[calc(var(--nav-height)+var(--nav-offset)+24px)] pb-8 px-6 md:px-12 lg:px-24 z-10 transition-colors duration-500"
        style={{ perspective: '1000px' }}
      >
        {/* Decorative Giant "WORK" text background */}
        <h2
          ref={wordWorkRef}
          aria-hidden="true"
          className="absolute top-[-3vw] left-[-3vw] font-sans font-black text-[clamp(7rem,15vw,16rem)] leading-none text-cream pointer-events-none select-none tracking-tighter opacity-0 z-[1] uppercase"
        >
          WORK
        </h2>

        {/* Small dynamic editorial label (Top Right) */}
        <div className="absolute top-12 right-6 md:right-12 lg:right-24 font-mono text-[10px] md:text-xs tracking-widest text-cream/50 select-none z-[10] w-[220px] h-6 overflow-hidden">
          {projects.map((project, idx) => (
            <div
              key={`label-${project.id}`}
              ref={(el) => { labelsRef.current[idx] = el; }}
              className="absolute top-0 right-0 opacity-0 pointer-events-none whitespace-nowrap text-right text-cream/50"
            >
              {project.index} / SELECTED PROJECT
            </div>
          ))}
        </div>
{/* Sculptural Hands */}
<div
  ref={handsRef}
  className="
    absolute inset-x-0 bottom-0 z-[4]
    w-full pointer-events-none
    origin-bottom
  "
>
  {/* MOBILE — separately positioned left and right hands */}
 <div
  className="
    relative h-[43svh] w-full
    overflow-hidden
    md:hidden
    -translate-x-[1.5vw]
  "
>
    {/* Left hand */}
    <div
      className="
        absolute inset-0
        translate-x-[7vw]
        scale-[1.28]
        origin-bottom
      "
      style={{
        WebkitClipPath: 'inset(0 50% 0 0)',
        clipPath: 'inset(0 50% 0 0)',
      }}
    >
      <Image
        src="/hands.png"
        alt=""
        fill
        priority
        sizes="128vw"
        className="object-contain object-bottom"
      />
    </div>

    {/* Right hand */}
    <div
      className="
        absolute inset-0
        -translate-x-[8vw]
        scale-[1.28]
        origin-bottom
      "
      style={{
        WebkitClipPath: 'inset(0 0 0 50%)',
        clipPath: 'inset(0 0 0 50%)',
      }}
    >
      <Image
        src="/hands.png"
        alt=""
        fill
        priority
        sizes="128vw"
        className="object-contain object-bottom"
      />
    </div>
  </div>

  {/* TABLET AND DESKTOP — preserve the approved composition */}
<div
  className="
    relative mx-auto hidden
    aspect-[16/9]

    w-[94vw]
    max-w-[920px]

    md:block
    md:origin-bottom
    md:translate-y-[2svh]
    md:scale-[1.12]

    lg:w-[82vw]
    lg:max-w-[960px]
    lg:translate-y-[1.8svh]
    lg:scale-[1.10]

    xl:w-[58vw]
    xl:max-w-[760px]
    xl:translate-y-0
    xl:scale-100
  "
>
    <Image
      src="/hands.png"
      alt=""
      fill
      priority
      sizes="(max-width: 1023px) 78vw, 760px"
      className="object-contain object-bottom"
    />
  </div>
</div>

        {/* Central Visual Stage: Glass Orb */}
        <div className=" absolute inset-0 z-[5] flex items-center justify-center pointer-events-none -translate-y-[4svh] md:translate-y-0">
          <div className="relative w-full h-full max-w-[85vw] max-h-[85vh] flex items-center justify-center">

            {/* Translucent Glass Orb */}
            <div
              ref={orbRef}
className="
  project-orb relative z-[5] shrink-0 pointer-events-auto
  aspect-square rounded-full
  flex items-center justify-center
  transition-shadow duration-500

  w-[74vw] max-w-[300px]

  md:w-[46vw]
  md:max-w-[430px]

  lg:w-[36vw]
  lg:max-w-[460px]

  xl:w-[28vw]
"
              style={{
                boxShadow: isOrbGlowed
                  ? '0 0 50px rgba(196,124,90,0.35), inset 0 0 30px rgba(245,241,232,0.2)'
                  : '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(245,241,232,0.1)'
              }}
            >
              {/* Orb Inner Black/Deep Background Mask */}
              <div className="absolute inset-[1px] rounded-full bg-[#111713] overflow-hidden z-[1]" />

              {/* Circular Mask Container */}
              <div className="project-orb-mask absolute inset-[2px] rounded-full overflow-hidden z-[2] isolate flex items-center justify-center">

                {/* Preview Image Breathing Wrapper */}
                <div
                  ref={previewZoomRef}
                  className=" preview-breathing-layer relative w-[84%] md:w-[78%] aspect-[16/9] flex items-center justify-center"
                  style={{
                    transform: 'scale(1.0325)',
                    transformOrigin: 'center'
                  }}
                >
                  {projects.map((project, idx) => (
                    <React.Fragment key={`images-${project.id}`}>
                      <Image
                        ref={(el) => { previewImgsRef.current[idx] = el; }}
                        src={project.image}
                        alt={`${project.client} Preview Base`}
                        fill
                        sizes="(max-width: 768px) 300px, 460px"
                        priority
                        className="orb-project-preview object-contain object-top w-full h-full will-change-transform opacity-0 absolute inset-0"
                      />

                      <div
                        className="preview-liquid-edges absolute inset-0 overflow-hidden pointer-events-none z-[2]"
                        style={{
                          WebkitMaskImage:
                            'radial-gradient(ellipse 72% 62% at center, transparent 0%, transparent 46%, rgba(0,0,0,0.15) 56%, rgba(0,0,0,0.7) 69%, black 82%)',
                          maskImage:
                            'radial-gradient(ellipse 72% 62% at center, transparent 0%, transparent 46%, rgba(0,0,0,0.15) 56%, rgba(0,0,0,0.7) 69%, black 82%)',
                          clipPath: 'polygon(0 11%, 100% 11%, 100% 100%, 0 100%)',
                        }}
                      >
                        <Image
                          ref={(el) => { previewEdgeImgsRef.current[idx] = el; }}
                          src={project.image}
                          alt={`${project.client} Preview Edge`}
                          fill
                          sizes="(max-width: 768px) 300px, 460px"
                          priority
                          className="object-contain object-top w-full h-full will-change-transform opacity-0 absolute inset-0"
                          style={{
                            filter: isReducedMotion
                              ? 'none'
                              : 'url(#project-liquid-wobble)',
                            transformOrigin: 'center center',
                          }}
                        />
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                {/* Curved gloss edge highlight */}
                <div className="absolute inset-[4px] rounded-full border-t-2 border-l border-cream/15 pointer-events-none z-[4]" />

                {/* Translucent wave reflection */}
                {!isReducedMotion && (
                  <div
                    ref={waveRef}
                    className="absolute bottom-[20%] left-[-10%] w-[120%] h-[35%] bg-gradient-to-b from-cream/5 to-transparent filter blur-[2px] pointer-events-none z-[5]"
                  />
                )}

              </div>

              {/* Glass Rim highlight border */}
              <div
                className="absolute inset-0 rounded-full border border-cream/20 pointer-events-none z-[3] transition-colors duration-300"
                style={{ borderColor: isOrbGlowed ? 'rgba(245, 241, 232, 0.45)' : 'rgba(245, 241, 232, 0.2)' }}
              />

              {/* Glass surface highlights & inner curved reflection */}
              <div className="orb-glass-highlight absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-[4]" />
              <div className="orb-inner-reflection absolute top-[10%] left-[10%] w-[32%] h-[32%] rounded-full bg-gradient-to-br from-white/15 to-transparent filter blur-[1px] pointer-events-none z-[5]" />
            </div>

            {/* Orbiting Ceramic Project Seals */}
            {projects.map((project, idx) => (
              <div
                key={`particles-${project.id}`}
                ref={(el) => {
                  particlesContainersRef.current[idx] = el;
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-[30] opacity-0"
              >
                {project.liveUrl && (
                  <div className="orbit-carrier orbit-carrier-live">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${project.client} live website`}
                      className="orbiting-seal orbiting-seal-live"
                      onMouseEnter={() => setIsOrbGlowed(true)}
                      onMouseLeave={() => setIsOrbGlowed(false)}
                      onFocus={() => setIsOrbGlowed(true)}
                      onBlur={() => setIsOrbGlowed(false)}
                    >
                      <span className="orbiting-seal-label">
                        LIVE SITE
                      </span>

                      <span
                        aria-hidden="true"
                        className="orbiting-seal-arrow"
                      >
                        ↗
                      </span>
                    </a>
                  </div>
                )}

                {project.codeUrl && (
                  <div
                    className={cn(
                      'orbit-carrier',
                      project.liveUrl
                        ? 'orbit-carrier-code'
                        : 'orbit-carrier-live'
                    )}
                  >
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View source code for ${project.client}`}
                      className="orbiting-seal orbiting-seal-code"
                      onMouseEnter={() => setIsOrbGlowed(true)}
                      onMouseLeave={() => setIsOrbGlowed(false)}
                      onFocus={() => setIsOrbGlowed(true)}
                      onBlur={() => setIsOrbGlowed(false)}
                    >
                      <span className="orbiting-seal-label">
                        VIEW CODE
                      </span>

                      <span
                        aria-hidden="true"
                        className="orbiting-seal-arrow"
                      >
                        ↗
                      </span>
                    </a>
                  </div>
                )}
              </div>
            ))}

          </div>
        </div>

        {/* Primary Project Information Content Wrappers */}
        {projects.map((project, idx) => (
          <div
            key={`content-${project.id}`}
            ref={(el) => { contentWrappersRef.current[idx] = el; }}
            className="
  absolute bottom-10 left-6 right-6 z-[7]
  flex flex-col gap-6
  opacity-0 pointer-events-none

  md:bottom-[clamp(88px,9svh,124px)]
  md:left-12 md:right-12
  md:flex-row
  md:items-end
  md:justify-between
  md:gap-8

  lg:left-16 lg:right-16
  lg:gap-10

  xl:bottom-10
  xl:left-24 xl:right-24
  xl:gap-6
"
          >
            {/* Lower Left - Client title & details */}
            <div className="w-full md:w-[46%] lg:w-[43%] xl:w-[42%] flex flex-col gap-1 text-left pointer-events-auto">
              <span className="font-mono text-[10px] md:text-[13px] xl:text-xs tracking-widest text-clay font-bold uppercase select-none">
                {project.year} / {project.index}
              </span>
              <h3
                className="
  font-sans font-extrabold
  text-[clamp(2.2rem,5vw,4.5rem)]
  md:text-[clamp(2.7rem,5.7vw,4.1rem)]
  xl:text-[clamp(2.2rem,5vw,4.5rem)]
  text-cream leading-[1.02]
  tracking-tight uppercase
  cursor-pointer
"

              >
                {project.client}
              </h3>
              <h4 className="font-sans font-medium text-cream/85 text-[13px] md:text-[15px] lg:text-[16px] xl:text-base mt-1">
                {project.subtitle}
              </h4>
            </div>

            {/* Lower Right - Short Description, tags and CTAs */}
           <div
  className="
    w-full
    md:w-[46%]
    lg:w-[44%]
    xl:w-[35%]

    md:ml-auto
    lg:relative lg:left-0
    xl:left-[clamp(24px,4vw,72px)]

    flex flex-col gap-4
    text-left items-start
    pointer-events-auto
  "
>
              <p className="font-sans text-cream/92 text-[13px] md:text-[15px] lg:text-[16px] xl:text-[15px] leading-[1.55] max-w-[470px]">
                {project.description}
              </p>

              {/* Editorial tags */}
              <div className="flex flex-wrap gap-1.5 select-none">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9.5px] md:text-[11px] xl:text-[10.5px] uppercase border border-cream/25 px-2 py-0.5 rounded-[4px] text-cream/90 bg-transparent tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-1 pointer-events-auto">
                <a
                  href="#case-study"
                  onClick={(e) => handleReadCaseStudy(e, idx)}
                  className="group/cta relative inline-flex items-center gap-1.5 text-clay font-mono text-[11px] md:text-[12.5px] xl:text-xs tracking-widest font-extrabold uppercase transition-colors duration-300 pointer-events-auto"
                  onMouseEnter={() => setIsOrbGlowed(true)}
                  onMouseLeave={() => setIsOrbGlowed(false)}
                >
                  READ THE CASE STUDY ↓
                  <span className="absolute bottom-[-2px] left-0 h-[1.5px] bg-clay w-0 group-hover/cta:w-full transition-all duration-300 ease-out" />
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Secondary Editorial Reveal Details Panels */}
        {projects.map((project, idx) => (
          <div
            key={`detail-${project.id}`}
            ref={(el) => { detailPanelsRef.current[idx] = el; }}
            className="
  absolute bottom-0 left-0 right-0 z-[8]
  flex flex-col gap-3
  px-6 pb-5 pt-16
  bg-gradient-to-t from-forest via-forest/95 to-transparent
  opacity-0 pointer-events-none

  md:bottom-[clamp(72px,7.5svh,108px)]
  md:left-12 md:right-12
  md:px-0 md:pb-0 md:pt-0
  md:bg-none md:gap-4

  lg:left-16 lg:right-16

  xl:bottom-8
  xl:left-24 xl:right-24
" >
            {/* Header line & divider */}
            <div className="w-full">
              <div className="w-full h-[1px] bg-cream/10 mb-3" />
              <div className="flex justify-between items-center select-none">
                <span className="font-mono text-[10px] md:text-[11px] tracking-widest text-clay font-bold uppercase">
                  CASE STUDY
                </span>
                <span className="font-mono text-[10px] md:text-[11px] text-cream/72">
                  {project.client} — {project.year}
                </span>
              </div>
            </div>

            {/* Detailed two column copy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-16 text-cream/92 text-[13px] md:text-[14px] lg:text-[15px] leading-relaxed font-light text-left pointer-events-auto">
              {project.detailedCopy.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}

      </div>

      {/* Invisible SVG filter definitions */}
      {!isReducedMotion && (
        <svg
          aria-hidden="true"
          width="0"
          height="0"
          style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
          className="liquid-filter-definitions"
        >
          <defs>
            <filter
              id="project-liquid-wobble"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                ref={turbulenceRef}
                type="fractalNoise"
                baseFrequency="0.0045 0.009"
                numOctaves="1"
                seed="8"
                result="liquidNoise"
              />
              <feDisplacementMap
                ref={displacementRef}
                in="SourceGraphic"
                in2="liquidNoise"
                scale="16"
                xChannelSelector="R"
                yChannelSelector="B"
              />
            </filter>
          </defs>
        </svg>
      )}
    </section>
  );
}
