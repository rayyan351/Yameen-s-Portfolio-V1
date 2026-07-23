'use client';

import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const NAV_LOGO_SELECTOR = '[data-loader-logo-target]';

export default function EntranceLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const openLabelRef = useRef<HTMLSpanElement>(null);
  const ymLabelRef = useRef<HTMLSpanElement>(null);
  const cornerRef = useRef<HTMLSpanElement>(null);
  const innerBorderRef = useRef<HTMLSpanElement>(null);
  const sweepRef = useRef<HTMLSpanElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const yameenWordRef = useRef<HTMLSpanElement>(null);
  const munirWordRef = useRef<HTMLSpanElement>(null);

  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const exitTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const completedRef = useRef(false);
  const scrollLockCleanupRef = useRef<(() => void) | null>(null);
  const previousOverscrollRef = useRef('');

  const [visible, setVisible] = useState(true);
  const [entering, setEntering] = useState(false);
  const reducedMotion = useReducedMotion();

  const unlockPage = useCallback(() => {
    scrollLockCleanupRef.current?.();
    scrollLockCleanupRef.current = null;
    document.documentElement.style.overscrollBehavior =
      previousOverscrollRef.current;
  }, []);

  const completeEntrance = useCallback(() => {
    const navLogo =
      document.querySelector<HTMLElement>(NAV_LOGO_SELECTOR);

    if (navLogo) {
      gsap.set(navLogo, {
        clearProps:
          'opacity,visibility,pointerEvents,transition',
      });
    }

    completedRef.current = true;
    unlockPage();

    window.dispatchEvent(
      new CustomEvent('portfolio:entrance-complete')
    );

    setVisible(false);
  }, [unlockPage]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const root = rootRef.current;
    const mark = markRef.current;
    const button = buttonRef.current;
    const openLabel = openLabelRef.current;
    const ymLabel = ymLabelRef.current;
    const corner = cornerRef.current;
    const innerBorder = innerBorderRef.current;
    const sweep = sweepRef.current;
    const aura = auraRef.current;

    if (
      !root ||
      !mark ||
      !button ||
      !openLabel ||
      !ymLabel ||
      !corner ||
      !innerBorder ||
      !sweep ||
      !aura
    ) {
      setVisible(false);
      return;
    }

    /*
     * Keep the browser scrollbar exactly as it is and block scrolling through
     * non-passive event listeners instead. Hiding/restoring the scrollbar was
     * the source of the temporary white strip and the final horizontal reflow.
     */
    previousOverscrollRef.current =
      document.documentElement.style.overscrollBehavior;
    document.documentElement.style.overscrollBehavior = 'none';

    const preventScroll = (event: Event) => {
      event.preventDefault();
    };

    const preventScrollKeys = (event: KeyboardEvent) => {
      if (
        ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(
          event.key
        )
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventScrollKeys);

    scrollLockCleanupRef.current = () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventScrollKeys);
    };

    const navLogo =
      document.querySelector<HTMLElement>(NAV_LOGO_SELECTOR);

    if (navLogo) {
      gsap.set(navLogo, {
        autoAlpha: 0,
        pointerEvents: 'none',
        transition: 'none',
      });
    }

    gsap.set(openLabel, {
      yPercent: 0,
      autoAlpha: 1,
    });

    gsap.set(ymLabel, {
      yPercent: 125,
      autoAlpha: 0,
    });

    gsap.set(corner, {
      scale: 0,
      transformOrigin: 'bottom right',
    });

    gsap.set(innerBorder, {
      autoAlpha: 0.7,
    });

    gsap.set(sweep, {
      xPercent: -140,
      rotate: -18,
    });

    gsap.set(aura, {
      autoAlpha: 0,
      scale: 0.72,
    });

    gsap.set([yameenWordRef.current, munirWordRef.current], {
      autoAlpha: 0,
    });

    introTimelineRef.current = gsap
      .timeline()
      .fromTo(
        mark,
        {
          autoAlpha: 0,
          y: 14,
          scale: 0.92,
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.58,
          ease: 'power3.out',
        }
      )
      .to(
        corner,
        {
          scale: 1,
          duration: 0.34,
          ease: 'back.out(1.45)',
        },
        0.2
      )
      .to(
        aura,
        {
          autoAlpha: 0.7,
          scale: 1,
          duration: 0.85,
          ease: 'power2.out',
        },
        0.05
      )
      .to(
        [yameenWordRef.current, munirWordRef.current],
        {
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power2.out',
        },
        0.08
      )
      .fromTo(
        button,
        {
          boxShadow: '0 8px 22px rgba(27, 27, 24, 0.08)',
        },
        {
          boxShadow:
            '0 22px 55px rgba(27, 27, 24, 0.18)',
          duration: 0.8,
          ease: 'power2.out',
        },
        0
      );

    const focusTimer = window.setTimeout(() => {
      button.focus({ preventScroll: true });
    }, 120);

    return () => {
      window.clearTimeout(focusTimer);

      introTimelineRef.current?.kill();
      exitTimelineRef.current?.kill();
      hoverTimelineRef.current?.kill();

      if (!completedRef.current) {
        unlockPage();

        if (navLogo) {
          gsap.set(navLogo, {
            clearProps:
              'opacity,visibility,pointerEvents,transition',
          });
        }
      }
    };
  }, [unlockPage]);

  const handlePointerEnter = useCallback(() => {
    if (entering || reducedMotion) return;

    const button = buttonRef.current;
    const innerBorder = innerBorderRef.current;
    const sweep = sweepRef.current;
    const aura = auraRef.current;
    const openLabel = openLabelRef.current;

    if (
      !button ||
      !innerBorder ||
      !sweep ||
      !aura ||
      !openLabel
    ) {
      return;
    }

    hoverTimelineRef.current?.kill();

    hoverTimelineRef.current = gsap
      .timeline()
      .to(button, {
        scale: 1.055,
        y: -3,
        rotateX: 2,
        rotateY: -2,
        boxShadow:
          '0 30px 70px rgba(27, 27, 24, 0.24)',
        duration: 0.42,
        ease: 'power3.out',
      })
      .to(
        innerBorder,
        {
          inset: 5,
          borderColor:
            'rgba(245, 241, 232, 0.22)',
          duration: 0.42,
          ease: 'power3.out',
        },
        0
      )
      .to(
        openLabel,
        {
          y: -1,
          letterSpacing: '0.16em',
          duration: 0.42,
          ease: 'power3.out',
        },
        0
      )
      .to(
        aura,
        {
          autoAlpha: 1,
          scale: 1.16,
          duration: 0.55,
          ease: 'power3.out',
        },
        0
      )
      .fromTo(
        sweep,
        {
          xPercent: -140,
        },
        {
          xPercent: 145,
          duration: 0.72,
          ease: 'power2.inOut',
        },
        0.04
      )
      .to(
        yameenWordRef.current,
        {
          x: -14,
          duration: 0.7,
          ease: 'power3.out',
        },
        0
      )
      .to(
        munirWordRef.current,
        {
          x: 14,
          duration: 0.7,
          ease: 'power3.out',
        },
        0
      );
  }, [entering, reducedMotion]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (entering || reducedMotion) return;

      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const normalizedX =
        (event.clientX - rect.left) / rect.width - 0.5;
      const normalizedY =
        (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(button, {
        rotateY: normalizedX * 7,
        rotateX: normalizedY * -7,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    [entering, reducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    if (entering || reducedMotion) return;

    hoverTimelineRef.current?.kill();

    gsap.to(buttonRef.current, {
      scale: 1,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      boxShadow:
        '0 22px 55px rgba(27, 27, 24, 0.18)',
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    gsap.to(innerBorderRef.current, {
      inset: 7,
      borderColor: 'rgba(245, 241, 232, 0.10)',
      duration: 0.5,
      ease: 'power3.out',
    });

    gsap.to(openLabelRef.current, {
      y: 0,
      letterSpacing: '0.12em',
      duration: 0.5,
      ease: 'power3.out',
    });

    gsap.to(auraRef.current, {
      autoAlpha: 0.7,
      scale: 1,
      duration: 0.55,
      ease: 'power3.out',
    });

    gsap.to(
      [yameenWordRef.current, munirWordRef.current],
      {
        x: 0,
        duration: 0.7,
        ease: 'power3.out',
      }
    );
  }, [entering, reducedMotion]);

  const enterPortfolio = useCallback(() => {
    if (entering || typeof window === 'undefined') return;

    const root = rootRef.current;
    const paper = paperRef.current;
    const mark = markRef.current;
    const button = buttonRef.current;
    const openLabel = openLabelRef.current;
    const ymLabel = ymLabelRef.current;
    const corner = cornerRef.current;
    const innerBorder = innerBorderRef.current;
    const aura = auraRef.current;

    if (
      !root ||
      !paper ||
      !mark ||
      !button ||
      !openLabel ||
      !ymLabel ||
      !corner ||
      !innerBorder ||
      !aura
    ) {
      completeEntrance();
      return;
    }

    setEntering(true);

    introTimelineRef.current?.kill();
    hoverTimelineRef.current?.kill();

    gsap.killTweensOf([
      mark,
      button,
      openLabel,
      ymLabel,
      corner,
      innerBorder,
      aura,
      yameenWordRef.current,
      munirWordRef.current,
    ]);

    gsap.set(root, {
      pointerEvents: 'none',
    });

    const navLogo =
      document.querySelector<HTMLElement>(NAV_LOGO_SELECTOR);

    if (reducedMotion) {
      if (navLogo) {
        gsap.set(navLogo, {
          clearProps:
            'opacity,visibility,pointerEvents',
        });
      }

      gsap.to(root, {
        autoAlpha: 0,
        duration: 0.18,
        ease: 'power1.out',
        onComplete: completeEntrance,
      });

      return;
    }

    /*
     * Freeze the mark at its exact viewport coordinates. The wrapper travels
     * and physically resizes to the target badge instead of scaling the entire
     * button. That preserves the final 12px navbar typography rather than
     * shrinking the loader's larger YM text to a visibly smaller size.
     */
    const markRect = mark.getBoundingClientRect();

    gsap.set(mark, {
      position: 'fixed',
      left: markRect.left,
      top: markRect.top,
      width: markRect.width,
      height: markRect.height,
      margin: 0,
      x: 0,
      y: 0,
      scale: 1,
      transform: 'none',
      zIndex: 100001,
    });

    gsap.set(button, {
      width: '100%',
      height: '100%',
      scale: 1,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      transform: 'none',
    });

    let destinationRect = {
      left: 28,
      top: 28,
      width: 32,
      height: 32,
    };

const targetStyles: {
  badge: CSSStyleDeclaration | null;
  text: CSSStyleDeclaration | null;
} = {
  badge: null,
  text: null,
};

let hasNavbarDestination = false;

    const measureNavbarTarget = () => {
      if (!navLogo) return;

      const targetRect = navLogo.getBoundingClientRect();
      const targetText =
        navLogo.querySelector<HTMLElement>('span') ?? navLogo;

      destinationRect = {
        left: targetRect.left,
        top: targetRect.top,
        width: targetRect.width,
        height: targetRect.height,
      };

targetStyles.badge = window.getComputedStyle(navLogo);
targetStyles.text = window.getComputedStyle(targetText);
      hasNavbarDestination = true;
    };

    measureNavbarTarget();

    if (!hasNavbarDestination) {
      console.warn(
        `EntranceLoader: no navbar target found for ${NAV_LOGO_SELECTOR}`
      );
    }

    const deltaX = destinationRect.left - markRect.left;
    const deltaY = destinationRect.top - markRect.top;
    const travelDistance = Math.hypot(deltaX, deltaY);
    const settleDistance = Math.min(13, travelDistance * 0.04);

    const approachRatio =
      travelDistance > 0
        ? Math.max(
            0,
            (travelDistance - settleDistance) / travelDistance
          )
        : 1;

    const approachLeft =
      markRect.left + deltaX * approachRatio;
    const approachTop =
      markRect.top + deltaY * approachRatio;
    const approachWidth = destinationRect.width + 3;
    const approachHeight = destinationRect.height + 3;

const targetFontSize =
  targetStyles.text?.fontSize ?? '12px';

const targetLetterSpacing =
  targetStyles.text?.letterSpacing ?? '-0.05em';

const targetLineHeight =
  targetStyles.text?.lineHeight ?? 'normal';

const targetFontWeight =
  targetStyles.text?.fontWeight ?? '900';

const targetColor =
  targetStyles.text?.color ?? 'rgb(242, 239, 231)';

const targetBackground =
  targetStyles.badge?.backgroundColor ?? 'rgb(27, 27, 24)';

const targetRadius =
  targetStyles.badge?.borderRadius ?? '2px';

    exitTimelineRef.current = gsap.timeline({
      defaults: {
        overwrite: 'auto',
      },
      onComplete: completeEntrance,
    });

    exitTimelineRef.current
      .to(openLabel, {
        yPercent: -130,
        autoAlpha: 0,
        duration: 0.22,
        ease: 'power3.in',
      })
      .to(
        ymLabel,
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.32,
          ease: 'power3.out',
        },
        0.1
      )
      .to(
        corner,
        {
          scale: 1.14,
          duration: 0.15,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        },
        0.1
      )
      .to(
        innerBorder,
        {
          autoAlpha: 0,
          duration: 0.26,
          ease: 'power2.out',
        },
        0.18
      )
      .to(
        aura,
        {
          autoAlpha: 0,
          scale: 1.35,
          duration: 0.4,
          ease: 'power2.out',
        },
        0.12
      )
      .to(
        [yameenWordRef.current, munirWordRef.current],
        {
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        0.18
      )
      .to(
        paper,
        {
          yPercent: -101,
          duration: 0.92,
          ease: 'power4.inOut',
        },
        0.4
      )
      .to(
        mark,
        {
          left: approachLeft,
          top: approachTop,
          width: approachWidth,
          height: approachHeight,
          duration: 0.78,
          ease: 'power3.inOut',
        },
        0.38
      )
      .to(
        ymLabel,
        {
          fontSize: targetFontSize,
          letterSpacing: targetLetterSpacing,
          lineHeight: targetLineHeight,
          fontWeight: targetFontWeight,
          color: targetColor,
          duration: 0.78,
          ease: 'power3.inOut',
        },
        0.38
      )
      .to(
        button,
        {
          backgroundColor: targetBackground,
          borderRadius: targetRadius,
          duration: 0.78,
          ease: 'power3.inOut',
        },
        0.38
      )
      .to(
        corner,
        {
          width: 6,
          height: 6,
          duration: 0.78,
          ease: 'power3.inOut',
        },
        0.38
      )
      /*
       * Re-measure at the last possible moment because the fixed navbar may
       * finish its own entrance motion beneath the paper layer.
       */
      .call(
        () => {
          measureNavbarTarget();
        },
        [],
        1.14
      )
      .to(
        mark,
        {
          left: () => destinationRect.left,
          top: () => destinationRect.top,
          width: () => destinationRect.width,
          height: () => destinationRect.height,
          duration: 0.26,
          ease: 'power2.out',
        },
        1.15
      )
      .to(
        button,
        {
          boxShadow:
            '0 2px 8px rgba(27, 27, 24, 0.055)',
          duration: 0.26,
          ease: 'power2.out',
        },
        1.15
      );

    if (hasNavbarDestination && navLogo) {
      exitTimelineRef.current
        .to(
          navLogo,
          {
            autoAlpha: 1,
            duration: 0.18,
            ease: 'power1.out',
          },
          1.32
        )
        .to(
          mark,
          {
            autoAlpha: 0,
            duration: 0.16,
            ease: 'power1.out',
          },
          1.32
        );
    } else {
      exitTimelineRef.current.to(
        mark,
        {
          autoAlpha: 0,
          duration: 0.18,
          ease: 'power2.out',
        },
        1.34
      );
    }

    exitTimelineRef.current.to(
      root,
      {
        autoAlpha: 0,
        duration: 0.1,
        ease: 'power1.out',
      },
      1.52
    );
  }, [
    completeEntrance,
    entering,
    reducedMotion,
  ]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio entrance"
      className="
        fixed left-0 top-0 z-[99999]
        grid h-[100dvh] w-[100vw]
        place-items-center overflow-hidden
        [perspective:900px]
      "
    >
      <div
        ref={paperRef}
        className="
          absolute left-0 top-0
          h-[100dvh] w-[100vw] overflow-hidden
          bg-[#F2EFE7] will-change-transform
        "
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 50% 48%,
              rgba(196, 124, 90, 0.085) 0%,
              rgba(196, 124, 90, 0.028) 22%,
              transparent 48%
            ),
            linear-gradient(
              135deg,
              rgba(255,255,255,0.32) 0%,
              transparent 38%,
              rgba(27,27,24,0.025) 100%
            )
          `,
        }}
      >
        <span
          ref={yameenWordRef}
          aria-hidden="true"
          className="
            pointer-events-none absolute
            -left-[0.04em] top-[-0.22em]
            select-none whitespace-nowrap
            font-sans text-[clamp(7rem,17vw,21rem)]
            font-black uppercase leading-none
            tracking-[-0.085em]
            text-[#1B1B18]/[0.025]
            will-change-transform
          "
        >
          YAMEEN
        </span>

        <span
          ref={munirWordRef}
          aria-hidden="true"
          className="
            pointer-events-none absolute
            -bottom-[0.26em] right-[-0.04em]
            select-none whitespace-nowrap
            font-sans text-[clamp(7rem,17vw,21rem)]
            font-black uppercase leading-none
            tracking-[-0.085em]
            text-[#1C2822]/[0.028]
            will-change-transform
          "
        >
          MUNIR
        </span>

        <span
          aria-hidden="true"
          className="
            absolute inset-x-0 bottom-0 h-px
            bg-[#C47C5A]/42
          "
        />
      </div>

      <div
        ref={auraRef}
        aria-hidden="true"
        className="
          pointer-events-none absolute z-[5]
          h-[260px] w-[260px]
          rounded-full
          bg-[radial-gradient(circle,rgba(196,124,90,0.12)_0%,rgba(196,124,90,0.035)_34%,transparent_70%)]
          blur-[2px] will-change-transform
          sm:h-[340px] sm:w-[340px]
        "
      />

      <div
        ref={markRef}
        className="
          relative z-10
          h-[76px] w-[76px]
          will-change-transform
          sm:h-[88px] sm:w-[88px]
        "
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={enterPortfolio}
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          disabled={entering}
          aria-label="Open Yameen Munir's portfolio"
          className="
            relative grid h-full w-full
            place-items-center overflow-hidden
            rounded-[3px] bg-[#1B1B18]
            text-[#F5F1E8] outline-none
            [transform-style:preserve-3d]
            will-change-transform
            focus-visible:ring-2
            focus-visible:ring-[#C47C5A]
            focus-visible:ring-offset-4
            focus-visible:ring-offset-[#F2EFE7]
            disabled:cursor-default
          "
        >
          <span
            ref={innerBorderRef}
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-[7px]
              rounded-[1px]
              border border-[#F5F1E8]/10
            "
          />

          <span
            ref={sweepRef}
            aria-hidden="true"
            className="
              pointer-events-none absolute
              -inset-y-7 left-[-28%]
              w-[38%]
              bg-gradient-to-r
              from-transparent
              via-[#F5F1E8]/16
              to-transparent
              blur-[1px]
            "
          />

          <span
            ref={openLabelRef}
            className="
              absolute inset-0 flex flex-col
              items-center justify-center
              font-sans text-[9px] font-bold
              uppercase leading-[1.16]
              tracking-[0.12em]
              sm:text-[10px]
            "
          >
            <span>Open</span>
            <span>Work</span>
          </span>

          <span
            ref={ymLabelRef}
            className="
              absolute inset-0 grid place-items-center
              font-sans text-[17px] font-black
              tracking-[-0.075em]
              sm:text-[19px]
            "
          >
            YM
          </span>

          <span
            ref={cornerRef}
            aria-hidden="true"
            className="
              absolute bottom-0 right-0
              h-[13px] w-[13px]
              bg-[#C47C5A]
              sm:h-[15px] sm:w-[15px]
            "
          />
        </button>
      </div>
    </div>
  );
}