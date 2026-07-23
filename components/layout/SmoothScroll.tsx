'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsapPlugins } from '@/lib/animations';

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    registerGsapPlugins();

    /*
     * Mobile browser address bars repeatedly change the visual viewport height.
     * Prevent every tiny browser-chrome resize from rebuilding pinned scenes.
     */
    ScrollTrigger.config({
      ignoreMobileResize: true,
    });

    const isTouchFirstDevice =
      window.matchMedia('(pointer: coarse)').matches ||
      navigator.maxTouchPoints > 0;

    /*
     * Phones and tablets:
     * use native touch scrolling while GSAP listens normally.
     */
    if (isTouchFirstDevice) {
      let refreshFrame = 0;

      const refreshScrollTriggers = () => {
        window.cancelAnimationFrame(refreshFrame);

        refreshFrame = window.requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      };

      window.addEventListener(
        'orientationchange',
        refreshScrollTriggers
      );

      window.addEventListener(
        'resize',
        refreshScrollTriggers,
        { passive: true }
      );

      document.fonts?.ready
        .then(refreshScrollTriggers)
        .catch(() => undefined);

      refreshScrollTriggers();

      return () => {
        window.cancelAnimationFrame(refreshFrame);

        window.removeEventListener(
          'orientationchange',
          refreshScrollTriggers
        );

        window.removeEventListener(
          'resize',
          refreshScrollTriggers
        );
      };
    }

    /*
     * Desktop:
     * preserve the approved Lenis smooth-wheel experience.
     */
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) =>
        Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    document.fonts?.ready
      .then(() => ScrollTrigger.refresh())
      .catch(() => undefined);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}