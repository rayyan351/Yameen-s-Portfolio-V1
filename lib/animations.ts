import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Safely registers GSAP plugins on the client.
 */
export function registerGsapPlugins() {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
}

/**
 * Standard cubic-bezier easing recommended by the design guidelines.
 * Equivalent to cubic-bezier(0.22, 1, 0.36, 1) or 'power4.out' in GSAP.
 */
export const EDITORIAL_EASE = 'power4.out';
