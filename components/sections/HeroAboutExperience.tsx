'use client';

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsapPlugins } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import Hero from './Hero';
import About from './About';
import { PortraitFlipCard } from '../ui/PortraitFlipCard';

type MeasuredBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function HeroAboutExperience() {
  const wrapperRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const movingCardRef = useRef<HTMLDivElement>(null);

  const heroPlaceholderRef = useRef<HTMLDivElement>(null);
  const heroPlaceholderMobileRef = useRef<HTMLDivElement>(null);

  const aboutPlaceholderRef = useRef<HTMLDivElement>(null);
  const aboutPlaceholderMobileRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsapPlugins();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const refresh = () => ScrollTrigger.refresh();

    window.addEventListener('load', refresh);
    window.addEventListener('orientationchange', refresh);

    document.fonts?.ready.then(refresh).catch(() => undefined);

    return () => {
      window.removeEventListener('load', refresh);
      window.removeEventListener('orientationchange', refresh);
    };
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;

    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    const movingCard = movingCardRef.current;
    const cardInner =
      movingCard?.querySelector<HTMLElement>('.portrait-card');

    if (!wrapper || !stage || !movingCard || !cardInner) return;

    const measureElement = (
      element: HTMLDivElement,
      stageRect: DOMRect
    ): MeasuredBox => {
      const rect = element.getBoundingClientRect();

      return {
        x: rect.left - stageRect.left,
        y: rect.top - stageRect.top,
        width: rect.width,
        height: rect.height,
      };
    };

    const measureCoords = (compact: boolean) => {
      const heroPlaceholder = compact
        ? heroPlaceholderMobileRef.current
        : heroPlaceholderRef.current;

      const aboutPlaceholder = compact
        ? aboutPlaceholderMobileRef.current
        : aboutPlaceholderRef.current;

      if (!heroPlaceholder || !aboutPlaceholder) return null;

      const stageRect = stage.getBoundingClientRect();

      return {
        hero: measureElement(heroPlaceholder, stageRect),
        about: measureElement(aboutPlaceholder, stageRect),
      };
    };

    const media = gsap.matchMedia();
    let refreshFrame = 0;

    const context = gsap.context(() => {
      media.add(
        {
          compact: '(max-width: 1023px)',
          desktop: '(min-width: 1024px)',
        },
        (mediaContext) => {
          const conditions = mediaContext.conditions as {
            compact?: boolean;
            desktop?: boolean;
          };

          const compact = Boolean(conditions.compact);
          const initial = measureCoords(compact);

          if (!initial) return;

          const heroLayer = wrapper.querySelector<HTMLElement>('.hero-layer');
          const aboutLayer = wrapper.querySelector<HTMLElement>('.about-layer');
          const mobilePrimary =
            wrapper.querySelector<HTMLElement>('.about-mobile-primary');
          const mobileDetails =
            wrapper.querySelector<HTMLElement>('.about-mobile-details');
          const leftColumn =
            wrapper.querySelector<HTMLElement>('.about-col-left');
          const rightColumn =
            wrapper.querySelector<HTMLElement>('.about-col-right');

          if (!heroLayer || !aboutLayer) return;

          const mobileGreetingLines = gsap.utils.toArray<HTMLElement>(
            wrapper.querySelectorAll('.about-mobile-greeting-line')
          );
          const mobileIntroLines = gsap.utils.toArray<HTMLElement>(
            wrapper.querySelectorAll('.about-mobile-intro-line')
          );
          const mobileDetailLines = gsap.utils.toArray<HTMLElement>(
            wrapper.querySelectorAll('.about-mobile-detail-line')
          );
          const mobileCtaLines = gsap.utils.toArray<HTMLElement>(
            wrapper.querySelectorAll('.about-mobile-cta-line')
          );

          const desktopGreetingLines = gsap.utils.toArray<HTMLElement>(
            wrapper.querySelectorAll('.about-desktop-greeting-line')
          );
          const desktopLeftLines = gsap.utils.toArray<HTMLElement>(
            wrapper.querySelectorAll('.about-desktop-left-line')
          );
          const desktopRightLines = gsap.utils.toArray<HTMLElement>(
            wrapper.querySelectorAll('.about-desktop-right-line')
          );
          const desktopCtaLines = gsap.utils.toArray<HTMLElement>(
            wrapper.querySelectorAll('.about-desktop-cta-line')
          );

          const duration = {
            move: reducedMotion ? 0.001 : compact ? 0.34 : 0.52,
            flip: reducedMotion ? 0.001 : compact ? 0.3 : 0.4,
            fade: reducedMotion ? 0.001 : 0.25,
            reveal: reducedMotion ? 0.001 : 0.12,
          };

          const targetX = () => {
            const fresh = measureCoords(compact);
            if (!fresh) return 0;

            return (
              fresh.about.x +
              fresh.about.width / 2 -
              fresh.hero.width / 2
            );
          };

          const targetY = () => {
            const fresh = measureCoords(compact);
            if (!fresh) return 0;

            return (
              fresh.about.y +
              fresh.about.height / 2 -
              fresh.hero.height / 2
            );
          };

          const targetScale = () => {
            const fresh = measureCoords(compact);

            if (!fresh || fresh.hero.width === 0) return 1;

            return fresh.about.width / fresh.hero.width;
          };

          /*
           * Explicit reversible starting state.
           * Returning the ScrollTrigger to progress 0 restores the Hero.
           */
          gsap.set(stage, { backgroundColor: '#F2EFE7' });

          gsap.set(heroLayer, {
            yPercent: 0,
            autoAlpha: 1,
            pointerEvents: 'auto',
          });

          gsap.set(aboutLayer, {
            autoAlpha: 0,
            pointerEvents: 'none',
          });

          gsap.set(movingCard, {
            visibility: 'visible',
            opacity: 1,
            zIndex: 2,
            transformOrigin: 'center center',
          });

          gsap.set(cardInner, {
            rotateY: 0,
            transformOrigin: '50% 50%',
          });

          if (compact) {
            if (!mobilePrimary || !mobileDetails) return;

            gsap.set(mobilePrimary, {
              yPercent: 0,
              autoAlpha: 1,
            });

            gsap.set(mobileDetails, {
              yPercent: 100,
              autoAlpha: 0,
              pointerEvents: 'none',
            });

            gsap.set(
              [...mobileGreetingLines, ...mobileIntroLines],
              {
                rotateX: 82,
                yPercent: 105,
                opacity: 0,
                transformOrigin: '50% 100%',
              }
            );

            gsap.set(
              [...mobileDetailLines, ...mobileCtaLines],
              {
                y: 24,
                opacity: 0,
              }
            );
          } else {
            if (!leftColumn || !rightColumn) return;

            gsap.set(leftColumn, {
              y: '22vh',
              autoAlpha: 1,
            });

            gsap.set(rightColumn, {
              y: '14vh',
              autoAlpha: 1,
            });

            gsap.set(
              [...desktopGreetingLines, ...desktopLeftLines],
              {
                rotateX: 82,
                yPercent: 105,
                opacity: 0,
                transformOrigin: '50% 100%',
              }
            );

            gsap.set(
              [...desktopRightLines, ...desktopCtaLines],
              {
                y: 24,
                opacity: 0,
              }
            );
          }

          const timeline = gsap.timeline({
            defaults: {
              overwrite: 'auto',
            },
            scrollTrigger: {
              trigger: wrapper,
              start: 'top top',
              end: 'bottom bottom',
              scrub: reducedMotion ? true : 0.8,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          timeline.fromTo(
            movingCard,
            {
              x: () => measureCoords(compact)?.hero.x ?? initial.hero.x,
              y: () => measureCoords(compact)?.hero.y ?? initial.hero.y,
              width: () =>
                measureCoords(compact)?.hero.width ?? initial.hero.width,
              height: () =>
                measureCoords(compact)?.hero.height ?? initial.hero.height,
              scale: 1,
              opacity: 1,
            },
            {
              x: targetX,
              y: targetY,
              scale: targetScale,
              opacity: 1,
              duration: duration.move,
              ease: reducedMotion ? 'none' : 'sine.inOut',
              immediateRender: true,
            },
            0.03
          );

          timeline.to(
            cardInner,
            {
              rotateY: 180,
              duration: duration.flip,
              ease: reducedMotion ? 'none' : 'power1.inOut',
            },
            0.08
          );

          timeline.to(
            stage,
            {
              backgroundColor: '#EEE9DE',
              duration: reducedMotion ? 0.001 : 0.32,
              ease: reducedMotion ? 'none' : 'power1.inOut',
            },
            0.12
          );

          timeline.to(
            heroLayer,
            {
              yPercent: compact ? -48 : -100,
              autoAlpha: 0,
              duration: duration.fade,
              ease: reducedMotion ? 'none' : 'sine.inOut',
            },
            0.04
          );

          timeline.set(
            heroLayer,
            {
              pointerEvents: 'none',
            },
            0.28
          );

          if (compact) {
            if (!mobilePrimary || !mobileDetails) return;

            timeline.to(
              aboutLayer,
              {
                autoAlpha: 1,
                duration: reducedMotion ? 0.001 : 0.16,
              },
              0.17
            );

            timeline.set(
              aboutLayer,
              {
                pointerEvents: 'auto',
              },
              0.2
            );

            timeline.to(
              mobileGreetingLines,
              {
                rotateX: 0,
                yPercent: 0,
                opacity: 1,
                stagger: reducedMotion ? 0 : 0.025,
                duration: duration.reveal,
                ease: reducedMotion ? 'none' : 'power3.out',
              },
              0.23
            );

            timeline.to(
              mobileIntroLines,
              {
                rotateX: 0,
                yPercent: 0,
                opacity: 1,
                stagger: reducedMotion ? 0 : 0.026,
                duration: duration.reveal,
                ease: reducedMotion ? 'none' : 'power3.out',
              },
              0.3
            );

            /*
             * The first compact About frame stays readable before the
             * supporting-copy frame replaces it.
             */
            timeline.to(
              mobilePrimary,
              {
                yPercent: -10,
                autoAlpha: 0,
                duration: reducedMotion ? 0.001 : 0.15,
                ease: reducedMotion ? 'none' : 'power2.inOut',
              },
              0.67
            );

            timeline.to(
              movingCard,
              {
                autoAlpha: 0,
                duration: reducedMotion ? 0.001 : 0.14,
                ease: reducedMotion ? 'none' : 'power2.inOut',
              },
              0.67
            );

            timeline.to(
              mobileDetails,
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: reducedMotion ? 0.001 : 0.18,
                ease: reducedMotion ? 'none' : 'power3.out',
              },
              0.67
            );

            timeline.set(
              mobileDetails,
              {
                pointerEvents: 'auto',
              },
              0.71
            );

            timeline.to(
              mobileDetailLines,
              {
                y: 0,
                opacity: 1,
                stagger: reducedMotion ? 0 : 0.04,
                duration: duration.reveal,
                ease: reducedMotion ? 'none' : 'power3.out',
              },
              0.74
            );

            timeline.to(
              mobileCtaLines,
              {
                y: 0,
                opacity: 1,
                duration: duration.reveal,
                ease: reducedMotion ? 'none' : 'power3.out',
              },
              0.84
            );
          } else {
            if (!leftColumn || !rightColumn) return;

            timeline.to(
              aboutLayer,
              {
                autoAlpha: 1,
                duration: reducedMotion ? 0.001 : 0.2,
              },
              0.3
            );

            timeline.set(
              aboutLayer,
              {
                pointerEvents: 'auto',
              },
              0.34
            );

            timeline.to(
              leftColumn,
              {
                y: 0,
                duration: reducedMotion ? 0.001 : 0.32,
                ease: reducedMotion ? 'none' : 'sine.out',
              },
              0.25
            );

            timeline.to(
              rightColumn,
              {
                y: 0,
                duration: reducedMotion ? 0.001 : 0.3,
                ease: reducedMotion ? 'none' : 'sine.out',
              },
              0.31
            );

            timeline.to(
              desktopGreetingLines,
              {
                rotateX: 0,
                yPercent: 0,
                opacity: 1,
                duration: duration.reveal,
                ease: reducedMotion ? 'none' : 'power3.out',
              },
              0.38
            );

            timeline.to(
              desktopLeftLines,
              {
                rotateX: 0,
                yPercent: 0,
                opacity: 1,
                stagger: reducedMotion ? 0 : 0.035,
                duration: duration.reveal,
                ease: reducedMotion ? 'none' : 'power3.out',
              },
              0.45
            );

            timeline.to(
              desktopRightLines,
              {
                y: 0,
                opacity: 1,
                stagger: reducedMotion ? 0 : 0.05,
                duration: reducedMotion ? 0.001 : 0.18,
                ease: reducedMotion ? 'none' : 'power3.out',
              },
              0.47
            );

            timeline.to(
              desktopCtaLines,
              {
                y: 0,
                opacity: 1,
                duration: reducedMotion ? 0.001 : 0.16,
                ease: reducedMotion ? 'none' : 'power3.out',
              },
              0.58
            );
          }

          /*
           * Quiet resolved hold. It also gives the timeline a deterministic
           * final duration without changing the visible composition.
           */
          timeline.to({}, { duration: 0.12 }, 0.88);

          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
          };
        }
      );

      refreshFrame = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, wrapper);

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      media.revert();
      context.revert();
    };
  }, [mounted, reducedMotion]);

  return (
    <section
      ref={wrapperRef}
      id="about-story"
      data-nav-theme="light"
      className="hero-about-story relative h-[220svh] w-full bg-paper lg:h-[240svh]"
    >
      <div
        id="about"
        className="pointer-events-none absolute left-0 top-[50svh] h-px w-full lg:top-[76svh]"
      />

      <div
        ref={stageRef}
        className="hero-about-stage sticky top-0 h-[100svh] w-full overflow-hidden bg-paper"
      >
        <div className="hero-layer absolute inset-0 z-[4] h-full w-full">
          <Hero
            portraitPlaceholderRef={heroPlaceholderRef}
            portraitPlaceholderMobileRef={heroPlaceholderMobileRef}
          />
        </div>

        <div className="about-layer pointer-events-none absolute inset-0 z-[8] h-full w-full opacity-0">
          <About
            portraitPlaceholderRef={aboutPlaceholderRef}
            portraitPlaceholderMobileRef={aboutPlaceholderMobileRef}
          />
        </div>

        {mounted && (
          <div className="pointer-events-none absolute inset-0 z-[2] h-full w-full select-none">
            <div
              ref={movingCardRef}
              className="pointer-events-none absolute left-0 top-0 h-[300px] w-[200px]"
              style={{
                visibility: 'hidden',
                transformOrigin: 'center center',
                willChange: 'transform, opacity',
              }}
            >
              <PortraitFlipCard
                imageSrc="/yameen.png"
                shadowImageSrc="/shadow2.png"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}