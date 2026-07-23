'use client';

import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsapPlugins } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Custom inline SVG Paper Plane component matching design specifications
const PaperPlane = ({ className, strokeColor = '#1C2822' }: { className?: string; strokeColor?: string }) => (
  <svg
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Main folded wing */}
    <path
      d="M54 6L6 28L26 34L54 6Z"
      fill="#FAF8F5"
      stroke={strokeColor}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Folded body keel */}
    <path
      d="M54 6L26 34L32 54L54 6Z"
      fill="#FAF8F5"
      stroke={strokeColor}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Clay folded accent at the bottom */}
    <path
      d="M26 34L29 42L32 39"
      fill="#C47C5A"
      stroke={strokeColor}
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Internal crease helper line */}
    <line
      x1="26"
      y1="34"
      x2="54"
      y2="6"
      stroke={strokeColor}
      strokeWidth="1"
      strokeDasharray="2 2"
    />
  </svg>
);

export default function Contact() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const startPlaceholderRef = useRef<HTMLSpanElement>(null);
  const endPlaceholderRef = useRef<HTMLSpanElement>(null);
  const animatedPlaneRef = useRef<HTMLDivElement>(null);
  const trailPathRef = useRef<SVGPathElement>(null);

  // Mobile cinematic transition refs. These are kept separate so the approved
  // desktop sequence remains completely untouched.
  const mobileWrapperRef = useRef<HTMLDivElement>(null);
  const mobileStickyRef = useRef<HTMLDivElement>(null);
  const mobileIntroRef = useRef<HTMLDivElement>(null);
  const mobileBgOverlayRef = useRef<HTMLDivElement>(null);
  const mobileContactPreviewRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ startX: 0, startY: 0, endX: 0, endY: 0, pathLength: 0 });

  // Form submission states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    lookingToBuild: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    registerGsapPlugins();
  }, []);

  // Measure start and end coordinates relative to the sticky viewport
  const calculateCoordinates = () => {
    if (!stickyRef.current || !startPlaceholderRef.current || !endPlaceholderRef.current) return;

    const parentRect = stickyRef.current.getBoundingClientRect();
    const startRect = startPlaceholderRef.current.getBoundingClientRect();
    const endRect = endPlaceholderRef.current.getBoundingClientRect();

    // Center coordinates relative to the sticky viewport container
    const startX = startRect.left - parentRect.left + (startRect.width / 2) - 12;
    const startY = startRect.top - parentRect.top + (startRect.height / 2) - 12;
    const endX = endRect.left - parentRect.left + (endRect.width / 2) - 12;
    const endY = endRect.top - parentRect.top + (endRect.height / 2) - 12;

    // Approximate bezier path arc length
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const pathLength = distance * 1.15;

    setCoords({ startX, startY, endX, endY, pathLength });
  };

  useLayoutEffect(() => {
    if (!mounted) return;

    const measure = () => {
      calculateCoordinates();
      ScrollTrigger.refresh();
    };

    const animationFrame = window.requestAnimationFrame(measure);

    const handleResize = () => {
      window.requestAnimationFrame(measure);
    };

    window.addEventListener('resize', handleResize);

    // Web-font settling can change both plane anchor positions.
    document.fonts?.ready.then(measure).catch(() => undefined);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, [mounted]);

  // Master GSAP ScrollTrigger timeline for desktop animations
  useLayoutEffect(() => {
    if (!mounted || reducedMotion || coords.startX === 0) return;

    const ctx = gsap.context(() => {
      const isMobileSize = window.innerWidth < 768;
      if (isMobileSize) return;

      if (!introRef.current || !contactRef.current || !animatedPlaneRef.current || !wrapperRef.current || !stickyRef.current) return;

      // 1. Initial State Settings
      gsap.set(animatedPlaneRef.current, {
        x: coords.startX,
        y: coords.startY,
        rotation: 0,
        opacity: 0,
        scale: 1,
      });

      // Hide submit button's local plane initially
      gsap.set('.submit-btn-plane', { opacity: 0 });

      // 2. Setup Paused Timeline
      const tl = gsap.timeline({ paused: true });

      // Part A: Academic background transitions to pre-contact message overlay (0 -> 0.16)
      if (bgOverlayRef.current) {
        tl.fromTo(bgOverlayRef.current,
          { opacity: 0 },
          { opacity: 1, ease: 'none', duration: 0.16 },
          0
        );
      }

      // Part B: Staggered Tonal Text Reveal (0.12 -> 0.40)
      const textLayers = introRef.current.querySelectorAll('.text-reveal-line');
      textLayers.forEach((layer, idx) => {
        const start = 0.12 + idx * 0.07;
        tl.fromTo(layer,
          { backgroundPosition: '100% 0', y: 14 },
          { backgroundPosition: '0% 0', y: 0, ease: 'power1.out', duration: 0.16 },
          start
        );
      });

      // Part C: Trigger underline expands under "Send it my way." (0.38 -> 0.46)
      tl.fromTo('.trigger-underline',
        { scaleX: 0 },
        { scaleX: 1, ease: 'power2.out', duration: 0.08 },
        0.38
      );

      // Part D: Paper plane launches and flies along a curved path (0.46 -> 0.64)
      tl.to(animatedPlaneRef.current, { opacity: 1, duration: 0.02 }, 0.46);

      // Parabolic flight path: x has smooth ease, y curves down
      tl.to(animatedPlaneRef.current, {
        x: coords.endX,
        ease: 'power1.inOut',
        duration: 0.18,
      }, 0.46);

      tl.to(animatedPlaneRef.current, {
        y: coords.endY,
        ease: 'power2.in',
        duration: 0.18,
      }, 0.46);

      // Rotate plane to align with flight angle
      tl.to(animatedPlaneRef.current, {
        rotation: 25,
        duration: 0.09,
        ease: 'power2.out',
      }, 0.46);

      tl.to(animatedPlaneRef.current, {
        rotation: 0,
        duration: 0.09,
        ease: 'power1.in',
      }, 0.55);

      // Draw paper plane trail SVG line
      if (trailPathRef.current) {
        tl.fromTo(trailPathRef.current,
          { strokeDashoffset: coords.pathLength, opacity: 0.8 },
          { strokeDashoffset: 0, opacity: 0, duration: 0.18, ease: 'power1.inOut' },
          0.46
        );
      }

      // Part E: Forest wipe circular cover reveals contact room (0.46 -> 0.64)
      tl.fromTo(contactRef.current,
        { clipPath: `circle(0% at ${coords.startX + 12}px ${coords.startY + 12}px)`, opacity: 1, 'pointer-events': 'none' },
        { clipPath: `circle(150% at ${coords.startX + 12}px ${coords.startY + 12}px)`, opacity: 1, 'pointer-events': 'auto', duration: 0.18, ease: 'power2.inOut' },
        0.46
      );

      // Hide absolute flying plane once flight finishes
      tl.to(animatedPlaneRef.current, { opacity: 0, duration: 0.01 }, 0.64);

      // Show local submit button plane
      tl.to('.submit-btn-plane', { opacity: 1, duration: 0.01 }, 0.64);

      // Part F: Clean upward reveal for contact layout content (0.60 -> 0.68)
      tl.fromTo('.contact-reveal-element',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.08, stagger: 0.02 },
        0.60
      );

      // Draw active lines under form elements
      tl.fromTo('.form-input-baseline',
        { scaleX: 0 },
        { scaleX: 1, ease: 'power2.out', duration: 0.08, stagger: 0.02 },
        0.62
      );

      // 3. Create ScrollTrigger to drive the timeline forward-only
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: '+=120%',
        pin: stickyRef.current,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (wrapperRef.current) {
            const currentTheme = self.progress > 0.58 ? 'dark' : 'light';
            if (wrapperRef.current.getAttribute('data-nav-theme') !== currentTheme) {
              wrapperRef.current.setAttribute('data-nav-theme', currentTheme);
            }
          }

          // Unidirectional scrub: only update timeline progress when scrolling forward
          if (self.progress > tl.progress()) {
            gsap.to(tl, { progress: self.progress, duration: 0.4, ease: 'power1.out', overwrite: 'auto' });
          }
        }
      });

    }, wrapperRef);

    return () => ctx.revert();
  }, [mounted, reducedMotion, coords]);

  // Mobile adaptation: preserve the editorial text reveal, then transition
  // cleanly into the forest contact preview. The flying plane is intentionally
  // desktop-only because the narrow mobile layout does not provide a reliable,
  // non-duplicated destination for it.
  useLayoutEffect(() => {
    if (
      !mounted ||
      reducedMotion ||
      typeof window === 'undefined' ||
      window.innerWidth >= 768
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      if (
        !mobileWrapperRef.current ||
        !mobileStickyRef.current ||
        !mobileIntroRef.current ||
        !mobileBgOverlayRef.current ||
        !mobileContactPreviewRef.current
      ) {
        return;
      }

      const introLines =
        mobileIntroRef.current.querySelectorAll<HTMLElement>(
          '.mobile-contact-intro-line'
        );

      const contactRevealElements =
        mobileContactPreviewRef.current.querySelectorAll<HTMLElement>(
          '.mobile-contact-preview-reveal'
        );

      gsap.set(mobileBgOverlayRef.current, { opacity: 0 });

      gsap.set(introLines, {
        y: 20,
        opacity: 0,
        clipPath: 'inset(0% 0% 100% 0%)'
      });

      gsap.set('.mobile-trigger-underline', {
        scaleX: 0,
        transformOrigin: 'left center'
      });

      gsap.set(mobileContactPreviewRef.current, {
        clipPath: 'circle(0% at 50% 72%)',
        opacity: 1
      });

      gsap.set(contactRevealElements, {
        y: 20,
        opacity: 0
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: mobileWrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.75,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!wrapperRef.current) return;

            const theme = self.progress > 0.56 ? 'dark' : 'light';

            if (wrapperRef.current.getAttribute('data-nav-theme') !== theme) {
              wrapperRef.current.setAttribute('data-nav-theme', theme);
            }
          }
        }
      });

      // Academic forest gives way to the warm-paper pre-contact scene.
      timeline.to(
        mobileBgOverlayRef.current,
        {
          opacity: 1,
          duration: 0.14,
          ease: 'none'
        },
        0
      );

      // Editorial line-by-line reveal.
      timeline.to(
        introLines,
        {
          y: 0,
          opacity: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.2,
          stagger: 0.048,
          ease: 'power2.out'
        },
        0.08
      );

      timeline.to(
        '.mobile-trigger-underline',
        {
          scaleX: 1,
          duration: 0.09,
          ease: 'power2.out'
        },
        0.37
      );

      // Clean circular transition into the contact room—no flying plane and no
      // decorative duplicate submit button.
      timeline.to(
        mobileContactPreviewRef.current,
        {
          clipPath: 'circle(170% at 50% 72%)',
          duration: 0.28,
          ease: 'power2.inOut'
        },
        0.49
      );

      timeline.to(
        contactRevealElements,
        {
          y: 0,
          opacity: 1,
          duration: 0.12,
          stagger: 0.028,
          ease: 'power2.out'
        },
        0.62
      );

      // Let the finished composition settle before the real form enters normal flow.
      timeline.to({}, { duration: 0.16 }, 0.84);

      const formElements = gsap.utils.toArray<HTMLElement>(
        '.mobile-contact-form-reveal'
      );

      const formBaselines = gsap.utils.toArray<HTMLElement>(
        '.mobile-contact-form-baseline'
      );

      gsap.fromTo(
        formElements,
        {
          y: 20,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.055,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.mobile-contact-form-room',
            start: 'top 82%',
            once: true
          }
        }
      );

      gsap.fromTo(
        formBaselines,
        {
          scaleX: 0,
          transformOrigin: 'left center'
        },
        {
          scaleX: 1,
          stagger: 0.06,
          duration: 0.42,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.mobile-contact-form-room',
            start: 'top 76%',
            once: true
          }
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, [mounted, reducedMotion]);

  // Form submission handler
  const validateForm = () => {
    const tempErrors: { email?: string; message?: string } = {};
    if (!formData.email.trim()) {
      tempErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      tempErrors.message = 'Please write a brief message describing your request.';
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = 'Message should be at least 10 characters long.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSending(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');

        // Keep the plane launch as a desktop flourish only.
        if (typeof window !== 'undefined' && window.innerWidth >= 768) {
          gsap.to('.submit-btn-plane', {
            x: 220,
            y: -220,
            rotation: -15,
            opacity: 0,
            duration: 0.9,
            ease: 'power2.inOut',
          });
        }

        // Clear form fields
        setFormData({ name: '', email: '', lookingToBuild: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <section
        id="contact"
        ref={wrapperRef}
        className="relative w-full overflow-visible h-auto"
        data-nav-theme="light"
      >
        {/* Viewport Pinned Container (for large screens) */}
        <div
          ref={stickyRef}
          className="hidden md:block md:sticky md:top-0 md:h-screen md:w-full md:overflow-hidden relative bg-[#38463D]"
        >
          {/* Base Background is #38463D */}

          {/* Fade Overlay for transition to #F2EFE7 (Composite-only hardware-accelerated overlay) */}
          <div
            ref={bgOverlayRef}
            className="absolute inset-0 bg-[#F2EFE7] opacity-0 z-0 pointer-events-none"
            style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
          />

          {/* Pre-Contact Screen */}
          <div
            ref={introRef}
            className="absolute inset-0 w-full h-full flex flex-col justify-between px-6 md:px-12 lg:px-[clamp(28px,5vw,92px)] py-20 md:py-24 z-10 select-none"
          >
            <div className="h-4" /> {/* Spacer under fixed nav */}

            {/* Centered Typography layout */}
            <div className="flex-1 flex flex-col justify-center max-w-[1300px]">
              <h2 className="font-sans font-black text-left uppercase tracking-tighter text-[clamp(2.5rem,5.5vw,7.5rem)] leading-[0.92]">
                <span className="text-reveal-line block">GOOD WORK USUALLY STARTS</span>
                <span className="text-reveal-line block mt-2">WITH A CLEAR CONVERSATION.</span>
              </h2>

              <div className="mt-12 flex flex-col items-start gap-6">
                <p className="text-reveal-line font-serif font-light text-xl leading-relaxed text-left max-w-[500px]">
                  Have a project, an idea, or a problem worth solving?
                </p>
                <p className="text-reveal-line font-serif text-xl italic font-semibold text-clay flex items-center gap-4 relative">
                  <span>Send it my way.</span>
                  <span ref={startPlaceholderRef} className="inline-block w-6 h-6 relative" />
                  <span className="trigger-underline absolute bottom-[-4px] left-0 w-[calc(100%-40px)] h-[1.5px] bg-clay scale-x-0 origin-left" />
                </p>
              </div>
            </div>

            <div className="h-4" />
          </div>

          {/* Curved Trail SVG path */}
          {coords.startX > 0 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-40 hidden md:block">
              <path
                ref={trailPathRef}
                d={`M ${coords.startX + 12} ${coords.startY + 12} Q ${coords.startX + (coords.endX - coords.startX) * 0.6} ${coords.startY - 30} ${coords.endX + 12} ${coords.endY + 12}`}
                stroke="#C47C5A"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray={coords.pathLength}
                strokeDashoffset={coords.pathLength}
                className="opacity-50"
              />
            </svg>
          )}

          {/* Contact form room revealed on wipe */}
          <div
            ref={contactRef}
            className="absolute inset-0 w-full h-full bg-forest select-text opacity-0 pointer-events-none hidden md:block z-30"
            style={{
              clipPath: 'circle(0% at 0px 0px)',
              transform: 'translate3d(0,0,0)',
              backfaceVisibility: 'hidden',
              willChange: 'clip-path'
            }}
          >
            <div className="h-full w-full flex flex-col justify-center px-6 md:px-12 lg:px-[clamp(28px,5vw,92px)] py-[5vh] max-w-[1600px] mx-auto relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-[45%_50%] gap-x-[5%] items-center">
                {/* Left Details column */}
                <div className="flex flex-col items-start text-cream">

                  <h2 className="contact-reveal-element font-sans font-black tracking-tighter text-[clamp(2.2rem,4.5vw,5.5rem)] leading-[0.92] mb-8 uppercase text-left">
                    LET’S BUILD SOMETHING <br /> WORTH SHIPPING.
                  </h2>
                  <p className="contact-reveal-element font-serif font-light text-base leading-relaxed text-cream/70 mb-10 max-w-[480px] text-left">
                    Have a project, freelance opportunity or research collaboration in mind? Share a few details and I’ll get back to you.
                  </p>

                  <div className="contact-reveal-element w-full text-left select-none">
                    <span className="font-mono text-[9px] uppercase text-[#FAF8F5]/40 tracking-widest block mb-3">AVAILABLE FOR</span>
                    <p className="font-sans text-xs tracking-wider text-cream/90 leading-relaxed uppercase border-t border-b border-cream/10 py-3.5">
                      Freelance projects · Product collaborations · Research opportunities
                    </p>
                  </div>
                </div>

                {/* Right Form column (added pt-10 to align it perfectly on desktop layout) */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col text-left pt-0 md:pt-20">
                  <div className="relative group mb-7">
                    <label className="font-mono text-[10px] uppercase text-cream/40 tracking-widest block mb-2 select-none">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-cream/20 py-2.5 text-cream placeholder-cream/30 focus:outline-none font-sans text-base transition-colors"
                    />
                    <span className="form-input-baseline absolute bottom-0 left-0 w-full h-[1.5px] bg-clay scale-x-0 origin-left transition-transform duration-300 ease-out group-focus-within:scale-x-100" />
                  </div>

                  <div className="relative group mb-7">
                    <label className="font-mono text-[10px] uppercase text-cream/40 tracking-widest block mb-2 select-none">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-cream/20 py-2.5 text-cream placeholder-cream/30 focus:outline-none font-sans text-base transition-colors"
                    />
                    <span className="form-input-baseline absolute bottom-0 left-0 w-full h-[1.5px] bg-clay scale-x-0 origin-left transition-transform duration-300 ease-out group-focus-within:scale-x-100" />
                    {errors.email && <span className="text-clay text-xs mt-1.5 block font-mono">{errors.email}</span>}
                  </div>

                  <div className="relative group mb-7">
                    <label className="font-mono text-[10px] uppercase text-cream/40 tracking-widest block mb-2 select-none">
                      What are you looking to build?
                    </label>
                    <div className="relative">
                      <select
                        name="lookingToBuild"
                        required
                        value={formData.lookingToBuild}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-cream/20 py-3.5 pr-10 text-cream focus:outline-none font-sans text-base appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-[#1C2822] text-cream/40">Select an option...</option>
                        <option value="Freelance Project" className="bg-[#1C2822] text-cream">Freelance Project</option>
                        <option value="Product Collaboration" className="bg-[#1C2822] text-cream">Product Collaboration</option>
                        <option value="Research Initiative" className="bg-[#1C2822] text-cream">Research Initiative</option>
                        <option value="Other Enquiry" className="bg-[#1C2822] text-cream">Other Enquiry</option>
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-cream/60 group-hover:text-cream transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <span className="form-input-baseline absolute bottom-0 left-0 w-full h-[1.5px] bg-clay scale-x-0 origin-left transition-transform duration-300 ease-out group-focus-within:scale-x-100" />
                    </div>
                  </div>

                  <div className="relative group mb-7">
                    <label className="font-mono text-[10px] uppercase text-cream/40 tracking-widest block mb-2 select-none">Message</label>
                    <textarea
                      name="message"
                      required
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-cream/20 py-2.5 text-cream placeholder-cream/30 focus:outline-none font-sans text-base transition-colors resize-none"
                    />
                    <span className="form-input-baseline absolute bottom-0 left-0 w-full h-[1.5px] bg-clay scale-x-0 origin-left transition-transform duration-300 ease-out group-focus-within:scale-x-100" />
                    {errors.message && <span className="text-clay text-xs mt-1.5 block font-mono">{errors.message}</span>}
                  </div>

                  {/* Submit button container */}
                  <div className="flex flex-wrap items-center gap-6 mt-2 relative">
                    <button
                      type="submit"
                      disabled={isSending || submitStatus === 'success'}
                      className="submit-btn group/btn flex items-center gap-5 px-8 py-4 rounded-none bg-cream text-forest hover:bg-clay hover:text-ink font-sans font-black text-xs tracking-widest uppercase transition-all duration-300 select-none cursor-pointer border border-transparent focus:outline-none focus:ring-2 focus:ring-clay/50 disabled:opacity-85"
                    >
                      <span>
                        {isSending ? 'SENDING' : submitStatus === 'success' ? 'MESSAGE SENT' : 'SEND MESSAGE'}
                      </span>

                      {/* Plane anchor spot inside button */}
                      <span ref={endPlaceholderRef} className="inline-block w-6 h-6 relative select-none">
                        <PaperPlane
                          className="submit-btn-plane absolute inset-0 w-6 h-6 transition-transform duration-300 ease-out group-hover/btn:translate-x-1 group-active/btn:-translate-x-0.5"
                          strokeColor="#1C2822"
                        />
                      </span>
                    </button>

                    <div aria-live="polite" className="text-sm font-sans max-w-xs">
                      {submitStatus === 'success' && (
                        <p className="text-cream font-medium leading-relaxed">
                          Your message is on its way. I’ll be in touch soon.
                        </p>
                      )}
                      {submitStatus === 'error' && (
                        <p className="text-clay font-medium leading-relaxed">
                          Something went wrong. Please try again or email me directly.
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Absolutely animated paper plane driven by timeline */}
          <div
            ref={animatedPlaneRef}
            className="absolute z-[120] pointer-events-none w-6 h-6 opacity-0 hidden md:block"
            style={{
              left: 0,
              top: 0,
              transform: 'translate3d(0,0,0)',
              willChange: 'transform'
            }}
          >
            <PaperPlane strokeColor="#1C2822" />
          </div>
        </div>

        {/* MOBILE CONTACT — cinematic transition followed by a natural-height form */}
        <div className="block w-full md:hidden">
          {!reducedMotion ? (
            <div
              ref={mobileWrapperRef}
              className="relative h-[168svh] w-full bg-[#38463D]"
            >
              <div
                ref={mobileStickyRef}
                className="
                  sticky top-0 h-[100svh] min-h-[620px] w-full
                  overflow-hidden bg-[#38463D]
                "
              >
                {/* Warm-paper overlay entering from the Academic section */}
                <div
                  ref={mobileBgOverlayRef}
                  className="pointer-events-none absolute inset-0 z-0 bg-[#F2EFE7] opacity-0"
                  style={{
                    transform: 'translate3d(0,0,0)',
                    backfaceVisibility: 'hidden'
                  }}
                />

                {/* Pre-contact message */}
                <div
                  ref={mobileIntroRef}
                  className="
                    absolute inset-0 z-10 flex h-full w-full flex-col
                    justify-between px-6
                    pb-[clamp(26px,5svh,42px)]
                    pt-[calc(var(--nav-height)+var(--nav-offset)+32px)]
                    text-left text-[#1B1B18]
                  "
                >
                  <span className="mobile-contact-intro-line font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#C47C5A]">
                    11 / Contact
                  </span>

                  <div className="flex flex-1 flex-col justify-center">
                    <h2
                      className="
                        font-sans text-[clamp(2.35rem,11.5vw,3.7rem)]
                        font-black uppercase leading-[0.9]
                        tracking-[-0.055em]
                      "
                    >
                      <span className="mobile-contact-intro-line block">
                        Good work
                      </span>
                      <span className="mobile-contact-intro-line block">
                        usually starts
                      </span>
                      <span className="mobile-contact-intro-line block">
                        with a clear
                      </span>
                      <span className="mobile-contact-intro-line block text-[#C47C5A]">
                        conversation.
                      </span>
                    </h2>

                    <p className="mobile-contact-intro-line mt-8 max-w-[300px] font-serif text-[17px] font-bold leading-relaxed text-[#1B1B18]/66">
                      Have a project, an idea, or a problem worth solving?
                    </p>

                    <p
                      className="
                        mobile-contact-intro-line relative mt-7
                        inline-flex w-fit items-center gap-3
                        font-serif text-[18px] font-semibold italic
                        text-[#C47C5A]
                      "
                    >
                      <span>Send it my way.</span>

                      <span
                        className="
                          mobile-trigger-underline absolute -bottom-1 left-0
                          h-[1.5px] w-full
                          origin-left bg-[#C47C5A]
                        "
                      />
                    </p>
                  </div>

                  <div className="mobile-contact-intro-line flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.12em] text-[#1B1B18]/36">
                    <span>Scroll to continue</span>
                    <span>Conversation to details</span>
                  </div>
                </div>

                {/* Forest contact-room preview revealed by the circular wipe */}
                <div
                  ref={mobileContactPreviewRef}
                  className="
                    pointer-events-none absolute inset-0 z-30
                    h-full w-full bg-[#1C2822] text-[#F5F1E8]
                  "
                  style={{
                    clipPath: 'circle(0% at 50% 50%)',
                    transform: 'translate3d(0,0,0)',
                    backfaceVisibility: 'hidden',
                    willChange: 'clip-path'
                  }}
                >
                  <div
                    className="
                      flex h-full w-full flex-col justify-between px-6
                      pb-[clamp(28px,5svh,44px)]
                      pt-[calc(var(--nav-height)+var(--nav-offset)+32px)]
                    "
                  >
                    <span className="mobile-contact-preview-reveal font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#C47C5A]">
                      11 / Contact
                    </span>

                    <div className="flex flex-1 flex-col justify-center">
                      <h2
                        className="
                          mobile-contact-preview-reveal
                          font-sans text-[clamp(2.35rem,11vw,3.6rem)]
                          font-black uppercase leading-[0.9]
                          tracking-[-0.055em]
                        "
                      >
                        Let’s build
                        <br />
                        something worth
                        <br />
                        <span className="text-[#C47C5A]">shipping.</span>
                      </h2>

                      <p className="mobile-contact-preview-reveal mt-7 max-w-[310px] font-serif text-[15px] leading-[1.6] text-[#F5F1E8]/64">
                        Freelance work, product collaboration or research—start
                        with a few clear details.
                      </p>

                      <div className="mobile-contact-preview-reveal mt-8">
                        <span className="mb-2 block font-mono text-[8px] uppercase tracking-[0.14em] text-[#F5F1E8]/34">
                          Available for
                        </span>

                        <p className="border-y border-[#F5F1E8]/10 py-3 font-sans text-[10px] uppercase leading-relaxed tracking-[0.08em] text-[#F5F1E8]/76">
                          Freelance projects · Product collaborations · Research
                          opportunities
                        </p>
                      </div>
                    </div>

                    <div
                      className="
                        mobile-contact-preview-reveal flex items-center
                        justify-between border-t border-[#F5F1E8]/10 pt-4
                      "
                    >
                      <span className="font-mono text-[7px] uppercase tracking-[0.12em] text-[#F5F1E8]/38">
                        Continue to the form
                      </span>

                      <span
                        className="
                          flex h-8 w-8 items-center justify-center
                          rounded-full border border-[#F5F1E8]/14
                          font-mono text-[14px] text-[#C47C5A]
                        "
                        aria-hidden="true"
                      >
                        ↓
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="
                w-full bg-[#F2EFE7] px-6 pb-16
                pt-[calc(var(--nav-height)+var(--nav-offset)+40px)]
                text-[#1B1B18]
              "
            >
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#C47C5A]">
                11 / Contact
              </span>

              <h2 className="mt-8 font-sans text-[2.65rem] font-black uppercase leading-[0.9] tracking-[-0.055em]">
                Good work usually starts with a clear conversation.
              </h2>

              <p className="mt-7 font-serif text-[17px] leading-relaxed text-[#1B1B18]/66">
                Have a project, an idea, or a problem worth solving?
              </p>
            </div>
          )}

          {/* Full form continues in natural document flow after the cinematic handoff */}
          <div
            id="contact-mobile"
            className="
              mobile-contact-form-room w-full bg-[#1C2822]
              px-6 pb-20
              pt-[calc(var(--nav-height)+var(--nav-offset)+34px)]
              text-left text-[#F5F1E8]
            "
          >
            <div className="mobile-contact-form-reveal">
              <span className="mb-5 block font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#C47C5A]">
                Project details
              </span>

              <h3 className="font-sans text-[clamp(2rem,9.5vw,2.8rem)] font-black uppercase leading-[0.92] tracking-[-0.045em]">
                Start with a
                <br />
                few details.
              </h3>

              <p className="mt-5 max-w-[320px] font-serif text-[14px] leading-[1.6] text-[#F5F1E8]/60">
                I’ll use this to understand the scope before getting back to you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8">
              <div className="mobile-contact-form-reveal group relative">
                <label className="mb-2 block select-none font-mono text-[9px] uppercase tracking-[0.14em] text-[#F5F1E8]/38">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="
                    w-full border-b border-[#F5F1E8]/18 bg-transparent
                    py-3 font-sans text-[15px] text-[#F5F1E8]
                    outline-none
                  "
                />

                <span className="mobile-contact-form-baseline absolute bottom-0 left-0 h-[1.5px] w-full origin-left bg-[#C47C5A] group-focus-within:scale-x-100" />
              </div>

              <div className="mobile-contact-form-reveal group relative">
                <label className="mb-2 block select-none font-mono text-[9px] uppercase tracking-[0.14em] text-[#F5F1E8]/38">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="
                    w-full border-b border-[#F5F1E8]/18 bg-transparent
                    py-3 font-sans text-[15px] text-[#F5F1E8]
                    outline-none
                  "
                />

                <span className="mobile-contact-form-baseline absolute bottom-0 left-0 h-[1.5px] w-full origin-left bg-[#C47C5A] group-focus-within:scale-x-100" />

                {errors.email && (
                  <span className="mt-2 block font-mono text-[9px] text-[#C47C5A]">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="mobile-contact-form-reveal group relative">
                <label className="mb-2 block select-none font-mono text-[9px] uppercase tracking-[0.14em] text-[#F5F1E8]/38">
                  What are you looking to build?
                </label>

                <div className="relative">
                  <select
                    name="lookingToBuild"
                    required
                    value={formData.lookingToBuild}
                    onChange={handleChange}
                    className="
                      w-full appearance-none border-b
                      border-[#F5F1E8]/18 bg-transparent
                      py-3 pr-9 font-sans text-[15px]
                      text-[#F5F1E8] outline-none
                    "
                  >
                    <option value="" disabled className="bg-[#1C2822]">
                      Select an option...
                    </option>
                    <option value="Freelance Project" className="bg-[#1C2822]">
                      Freelance Project
                    </option>
                    <option
                      value="Product Collaboration"
                      className="bg-[#1C2822]"
                    >
                      Product Collaboration
                    </option>
                    <option
                      value="Research Initiative"
                      className="bg-[#1C2822]"
                    >
                      Research Initiative
                    </option>
                    <option value="Other Enquiry" className="bg-[#1C2822]">
                      Other Enquiry
                    </option>
                  </select>

                  <svg
                    className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F5F1E8]/48"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>

                  <span className="mobile-contact-form-baseline absolute bottom-0 left-0 h-[1.5px] w-full origin-left bg-[#C47C5A] group-focus-within:scale-x-100" />
                </div>
              </div>

              <div className="mobile-contact-form-reveal group relative">
                <label className="mb-2 block select-none font-mono text-[9px] uppercase tracking-[0.14em] text-[#F5F1E8]/38">
                  Message
                </label>

                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="
                    w-full resize-none border-b
                    border-[#F5F1E8]/18 bg-transparent
                    py-3 font-sans text-[15px]
                    text-[#F5F1E8] outline-none
                  "
                />

                <span className="mobile-contact-form-baseline absolute bottom-0 left-0 h-[1.5px] w-full origin-left bg-[#C47C5A] group-focus-within:scale-x-100" />

                {errors.message && (
                  <span className="mt-2 block font-mono text-[9px] text-[#C47C5A]">
                    {errors.message}
                  </span>
                )}
              </div>

              <div className="mobile-contact-form-reveal pt-2">
                <button
                  type="submit"
                  disabled={isSending || submitStatus === 'success'}
                  className="
                    group/btn flex w-full items-center justify-between
                    bg-[#F5F1E8] px-5 py-4
                    font-sans text-[11px] font-black uppercase
                    tracking-[0.14em] text-[#1C2822]
                    transition-colors active:bg-[#C47C5A]
                    disabled:opacity-80
                  "
                >
                  <span>
                    {isSending
                      ? 'SENDING'
                      : submitStatus === 'success'
                        ? 'MESSAGE SENT'
                        : 'SEND MESSAGE'}
                  </span>

                  <span className="relative h-6 w-6">
                    <PaperPlane
                      className="
                        submit-btn-plane absolute inset-0 h-6 w-6
                        transition-transform duration-300
                        group-active/btn:translate-x-1
                        group-active/btn:-translate-y-1
                      "
                      strokeColor="#1C2822"
                    />
                  </span>
                </button>

                <div
                  aria-live="polite"
                  className="mt-4 font-sans text-[12px] leading-relaxed"
                >
                  {submitStatus === 'success' && (
                    <p className="text-[#F5F1E8]">
                      Your message is on its way. I’ll be in touch soon.
                    </p>
                  )}

                  {submitStatus === 'error' && (
                    <p className="text-[#C47C5A]">
                      Something went wrong. Please try again or email me.
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Integrated Footer - Placed directly outside the pinned wrapper so it flows naturally after the pinned section ends */}
      <footer className="relative bg-forest text-cream select-text pt-24 pb-12 w-full">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-[clamp(28px,5vw,92px)] relative">

          {/* Divider */}
         

          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[40%_35%_25%] gap-y-12 gap-x-[5%] items-start text-left mb-20 relative z-10">

            {/* Left side brand info */}
            <div className="flex flex-col gap-3">
              <span className="font-serif font-medium text-2xl tracking-tight text-cream">
                Yameen Munir
              </span>
              <span className="font-mono text-xs text-cream/50 tracking-wider">
                AI, data and software.
              </span>
            </div>

            {/* Center navigation links */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <a href="#about" className="font-sans text-sm text-cream/70 hover:text-cream transition-colors text-left">About</a>
              <a href="#work" className="font-sans text-sm text-cream/70 hover:text-cream transition-colors text-left">Work</a>
              <a href="#experience" className="font-sans text-sm text-cream/70 hover:text-cream transition-colors text-left">Experience</a>
              <a href="#skills" className="font-sans text-sm text-cream/70 hover:text-cream transition-colors text-left">Skills</a>
              <a href="#testimonials" className="font-sans text-sm text-cream/70 hover:text-cream transition-colors text-left">Testimonials</a>
              <a href="#writing" className="font-sans text-sm text-cream/70 hover:text-cream transition-colors text-left">Writing</a>
              <a href="#academic" className="font-sans text-sm text-cream/70 hover:text-cream transition-colors text-left">Academic</a>
              <a href="#contact" className="font-sans text-sm text-cream/70 hover:text-cream transition-colors text-left">Contact</a>
            </div>

            {/* Right side contact links & top anchor */}
            <div className="flex flex-col gap-4 items-start select-none">
              <a href="https://www.linkedin.com/in/yameen-munir/" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-cream/70 hover:text-cream transition-colors flex items-center gap-1">
                <span>LinkedIn</span> <span className="text-[10px] opacity-50">↗</span>
              </a>
              <a href="https://github.com/YameenMunir" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-cream/70 hover:text-cream transition-colors flex items-center gap-1">
                <span>GitHub</span> <span className="text-[10px] opacity-50">↗</span>
              </a>
              <a href="mailto:yameenmunir05@gmail.com" className="font-sans text-sm text-cream/70 hover:text-cream transition-colors">
                Email
              </a>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="font-mono text-[10px] text-clay hover:text-cream uppercase tracking-widest mt-4 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Back to top</span>
                <span>↑</span>
              </button>
            </div>
          </div>

          {/* Elegant oversized background wordmark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
            <span className="font-sans font-black text-[30vw] leading-none text-[#FAF8F5]/[0.02] tracking-tighter uppercase select-none">
              YM
            </span>
          </div>

          {/* Bottom Copyright & Location Metadata */}
          <div className="border-t border-cream/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[13px] text-[#FAF8F5]/40 w-full relative z-10">
            <span>&copy; 2026 Yameen Munir. All rights reserved.</span>
            <span>London, United Kingdom</span>
          </div>

        </div>
      </footer>
    </>
  );
}