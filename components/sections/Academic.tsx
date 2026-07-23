'use client';

import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsapPlugins } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { educationItems, credentialItems, recognitionItems } from '@/data/academic';

export default function Academic() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const credentialsRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeChapter, setActiveChapter] = useState<'education' | 'credentials' | 'recognition'>('education');
  const [activeCredIndex, setActiveCredIndex] = useState<number>(0);
  const [activeCertificateUrl, setActiveCertificateUrl] = useState<string | null>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState<number>(0);
  const [mobileDirection, setMobileDirection] = useState<1 | -1>(1);
  const mobileTouchStart = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useReducedMotion();

  // Drag to scroll logic variables
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    setMounted(true);
    registerGsapPlugins();
  }, []);

  useLayoutEffect(() => {
    if (!mounted || reducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Scroll-scrubbed background color fade from Press cream (#F5F1E8) to sage (#38463D)
      gsap.fromTo(sectionRef.current,
        { backgroundColor: '#F5F1E8' },
        {
          backgroundColor: '#38463D',
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top 30%',
            scrub: true,
          }
        }
      );

      // 2. Entrance reveal timeline for suspended elements
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 55%',
        },
      });

      // Rail expands horizontally
      tl.fromTo('.suspension-rail',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.0, ease: 'power2.out' }
      );

      // Left-side intro heading and labels slide & fade in
      tl.fromTo('.academic-intro-reveal',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.6'
      );

      // Education panels descend
      tl.fromTo('.education-panel',
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.12 },
        '-=0.5'
      );

      // Credential strips descend next
      tl.fromTo('.credential-strip',
        { y: -120, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.03 },
        '-=0.7'
      );

      // Recognition panels arrive last
      tl.fromTo('.recognition-panel',
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.15 },
        '-=0.6'
      );

      // Mobile archive entrance — a compact interpretation of the suspended desktop gallery.
      const mobileMedia = gsap.matchMedia();

      mobileMedia.add('(max-width: 767px)', () => {
        const mobileTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '.mobile-academic-shell',
            start: 'top 82%',
            end: 'top 34%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        mobileTimeline
          .fromTo(
            '.mobile-academic-header',
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.22, ease: 'power2.out' },
            0
          )
          .fromTo(
            '.mobile-academic-tabs',
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.18, ease: 'power2.out' },
            0.08
          )
          .fromTo(
            '.mobile-archive-watermark',
            { y: 26, opacity: 0 },
            { y: 0, opacity: 0.055, duration: 0.24, ease: 'sine.out' },
            0.08
          )
          .fromTo(
            '.mobile-archive-deck',
            {
              y: 46,
              rotateX: 8,
              rotateY: -3,
              scale: 0.965,
              opacity: 0,
              transformPerspective: 1200,
            },
            {
              y: 0,
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              opacity: 1,
              duration: 0.34,
              ease: 'power3.out',
            },
            0.16
          )
          .fromTo(
            '.mobile-archive-controls',
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.18, ease: 'power2.out' },
            0.38
          );

        return () => {
          mobileTimeline.scrollTrigger?.kill();
          mobileTimeline.kill();
        };
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [mounted, reducedMotion]);

  // Scroll to horizontal section offset
  const scrollToSection = (chapter: 'education' | 'credentials' | 'recognition') => {
    if (!scrollContainerRef.current) return;

    let targetOffset = 0;
    if (chapter === 'education' && educationRef.current) {
      targetOffset = educationRef.current.offsetLeft - 24;
    } else if (chapter === 'credentials' && credentialsRef.current) {
      targetOffset = credentialsRef.current.offsetLeft - 24;
    } else if (chapter === 'recognition' && recognitionRef.current) {
      targetOffset = recognitionRef.current.offsetLeft - 24;
    }

    scrollContainerRef.current.scrollTo({
      left: targetOffset,
      behavior: 'smooth',
    });
    setActiveChapter(chapter);
  };

  // Synchronize horizontal scroll offset back to activeChapter labels
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isDragging.current) return;
      const scrollPos = container.scrollLeft;
      const credOffset = credentialsRef.current ? credentialsRef.current.offsetLeft - 100 : 0;
      const recOffset = recognitionRef.current ? recognitionRef.current.offsetLeft - 100 : 0;

      if (scrollPos >= recOffset) {
        setActiveChapter('recognition');
      } else if (scrollPos >= credOffset) {
        setActiveChapter('credentials');
      } else {
        setActiveChapter('education');
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  // Keyboard navigation support for credentials
  const handleCredentialKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveCredIndex((prev) => (prev + 1) % credentialItems.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveCredIndex((prev) => (prev - 1 + credentialItems.length) % credentialItems.length);
    }
  };

  const mobileItemCount =
    activeChapter === 'education'
      ? educationItems.length
      : activeChapter === 'credentials'
        ? credentialItems.length
        : recognitionItems.length;

  const activeEducationItem =
    educationItems[activeMobileIndex % educationItems.length]!;
  const activeCredentialItem =
    credentialItems[activeMobileIndex % credentialItems.length]!;
  const activeRecognitionItem =
    recognitionItems[activeMobileIndex % recognitionItems.length]!;

  const mobileProgress =
    mobileItemCount > 0
      ? ((activeMobileIndex + 1) / mobileItemCount) * 100
      : 0;

  const changeMobileChapter = (
    chapter: 'education' | 'credentials' | 'recognition'
  ) => {
    setMobileDirection(1);
    setActiveMobileIndex(0);
    setActiveChapter(chapter);
  };

  const changeMobileRecord = (direction: 1 | -1) => {
    setMobileDirection(direction);
    setActiveMobileIndex((current) => {
      const next = current + direction;
      return (next + mobileItemCount) % mobileItemCount;
    });
  };

  const handleMobileTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;

    mobileTouchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleMobileTouchEnd = (event: React.TouchEvent) => {
    const start = mobileTouchStart.current;
    const touch = event.changedTouches[0];
    mobileTouchStart.current = null;

    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.15) {
      return;
    }

    changeMobileRecord(deltaX < 0 ? 1 : -1);
  };

useEffect(() => {
  if (
    !mounted ||
    reducedMotion ||
    typeof window === 'undefined' ||
    window.innerWidth >= 768
  ) {
    return;
  }

  const cardContent =
    sectionRef.current?.querySelector<HTMLElement>(
      '.mobile-academic-card-content'
    );

  if (!cardContent) return;

  const animation = gsap.fromTo(
    cardContent,
    {
      x: mobileDirection * 20,
      rotateY: mobileDirection * -3,
      opacity: 0,
      transformPerspective: 1000,
    },
    {
      x: 0,
      rotateY: 0,
      opacity: 1,
      duration: 0.42,
      ease: 'power3.out',
      clearProps: 'transform',
    }
  );

  return () => {
    animation.kill();
  };
}, [
  activeChapter,
  activeMobileIndex,
  mobileDirection,
  mounted,
  reducedMotion,
]);

  return (
    <section
      id="academic"
      ref={sectionRef}
      data-nav-theme="dark"
      className="
        relative w-full overflow-hidden bg-[#38463D] text-[#FAF8F5] select-text
        pb-20 pt-[calc(var(--nav-height)+var(--nav-offset)+28px)]
        md:py-28
      "
    >
      <div
        className="w-full flex flex-col"
        style={{
          paddingInline: 'clamp(28px, 5vw, 92px)',
        }}
      >
        {/* DESKTOP GALLERY GRID */}
        <div className="hidden md:grid md:grid-cols-[32%_68%] gap-12 max-w-[1440px] mx-auto w-full relative">

          {/* LEFT SIDE: SECTION INTRO */}
          <div className="academic-intro-reveal w-full flex flex-col items-start select-text pt-16">
            <span className="font-mono text-xs text-[#C47C5A] block relative font-bold tracking-widest uppercase">
              EDUCATION
              <span className="absolute bottom-[-4px] left-0 w-8 h-[2px] bg-[#C47C5A]" />
            </span>
            <h2 className="font-sans font-bold text-[#FAF8F5] uppercase tracking-tight text-4xl mt-6 leading-[0.95]">
              ACADEMIC <br />
              BACKGROUND
            </h2>
            <p className="font-sans text-[#FAF8F5]/70 text-[14px] leading-relaxed mt-6 max-w-[280px]">
              Formal study, continued learning and recognition across technology, research and community.
            </p>

            <ul className="font-mono text-[9px] font-bold tracking-widest text-[#FAF8F5]/40 mt-12 space-y-4 select-none">
              <li
                onClick={() => scrollToSection('education')}
                className={`cursor-pointer hover:text-[#FAF8F5] transition-colors duration-300 ${activeChapter === 'education' ? 'text-[#C47C5A]' : ''}`}
              >
                08 / EDUCATION
              </li>
              <li
                onClick={() => scrollToSection('credentials')}
                className={`cursor-pointer hover:text-[#FAF8F5] transition-colors duration-300 ${activeChapter === 'credentials' ? 'text-[#C47C5A]' : ''}`}
              >
                09 / CREDENTIALS
              </li>
              <li
                onClick={() => scrollToSection('recognition')}
                className={`cursor-pointer hover:text-[#FAF8F5] transition-colors duration-300 ${activeChapter === 'recognition' ? 'text-[#C47C5A]' : ''}`}
              >
                10 / RECOGNITION
              </li>
            </ul>

            {/* Visual drag/swipe guide */}
            <div className="font-mono text-[8.5px] font-bold text-[#C47C5A]/85 tracking-widest uppercase mt-16 select-none animate-pulse">
              [ DRAG &amp; SWIPE GALLERY TO EXPLORE &rarr; ]
            </div>
          </div>

          {/* RIGHT SIDE: SUSPENDED GALLERY WORKSPACE */}
          <div className="w-full relative flex flex-col justify-start">

            {/* Horizontal Rail spanning the full virtual canvas */}
            <div className="suspension-rail absolute top-6 left-0 h-[1.5px] bg-[#FAF8F5]/10 w-[2400px] origin-left" />

            {/* Scrollable / Draggable Panels Row */}
            <div
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className="w-full overflow-x-auto select-none flex gap-6 pl-6 pr-24 pt-6 cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{
                WebkitMaskImage: 'linear-gradient(to right, black 82%, transparent 98%)',
                maskImage: 'linear-gradient(to right, black 82%, transparent 98%)'
              }}
            >

              {/* --- CHAPTER 08: EDUCATION --- */}
              <div
                ref={educationRef}
                className="flex gap-6 flex-shrink-0"
                onMouseEnter={() => setActiveChapter('education')}
              >
                {educationItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="education-panel flex flex-col items-center flex-shrink-0 relative group"
                  >
                    {/* Architectural suspension wire */}
                    <div className="w-[1px] bg-[#FAF8F5]/15 h-16 transition-colors duration-300 group-hover:bg-[#C47C5A]/45" />

                    {/* Education Card */}
                    <div className="w-[250px] h-[290px] bg-[#FAF8F5] text-[#1B1B18] p-7 rounded-[3px] border border-[#1B1B18]/10 flex flex-col justify-between relative shadow-[0_15px_35px_rgba(0,0,0,0.12)]">
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center font-mono text-[9px] text-[#1B1B18]/45 select-none">
                          <span>08 / EDUCATION</span>
                          <span>0{index + 1}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#C47C5A]">{item.year}</span>
                        <h3 className="font-sans font-bold text-base uppercase tracking-tight leading-tight mt-1">
                          {item.degree}
                        </h3>
                        <p className="font-sans text-[13px] text-[#1B1B18]/70 leading-relaxed">
                          {item.school}
                        </p>
                      </div>

                      <div className="flex justify-start items-center">
                        <span className="font-mono text-[9px] uppercase tracking-wider bg-[#1B1B18]/5 px-2 py-0.5 rounded-[2px] font-bold text-[#1B1B18]/60">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- CHAPTER 09: CREDENTIALS --- */}
              <div
                ref={credentialsRef}
                className="flex gap-4 flex-shrink-0"
                onMouseEnter={() => setActiveChapter('credentials')}
              >
                {credentialItems.map((item, index) => {
                  const isActive = activeCredIndex === index;
                  return (
                    <div
                      key={item.id}
                      className="credential-strip flex flex-col items-center flex-shrink-0 relative group"
                      onMouseEnter={() => setActiveCredIndex(index)}
                      tabIndex={0}
                      onKeyDown={(e) => handleCredentialKeyDown(e, index)}
                    >
                      {/* Wire */}
                      <div className={`w-[1px] h-16 transition-colors duration-500 ${isActive ? 'bg-[#C47C5A]' : 'bg-[#FAF8F5]/15'
                        }`} />

                      {/* Strip / Card content */}
                      <div
                        className={`h-[290px] transition-all duration-500 ease-out border rounded-[3px] flex flex-col relative select-text ${isActive
                            ? 'w-[270px] bg-[#FAF8F5] border-[#1B1B18]/10 text-[#1B1B18] p-7 justify-between shadow-[0_15px_35px_rgba(0,0,0,0.15)] z-20'
                            : 'w-[44px] bg-[#1C2822]/60 border border-[#FAF8F5]/15 text-[#FAF8F5]/85 hover:bg-[#1C2822]/85 hover:border-[#C47C5A]/30 justify-between py-6 items-center cursor-pointer'
                          }`}
                      >
                        {isActive ? (
                          <>
                            <div className="flex flex-col gap-4">
                              <div className="flex justify-between items-center font-mono text-[9px] text-[#1B1B18]/45">
                                <span>09 / CREDENTIALS</span>
                                <span>{String(index + 1).padStart(2, '0')}</span>
                              </div>
                              <span className="font-mono text-xs font-bold text-[#C47C5A]">{item.provider}</span>
                              <h3 className="font-sans font-bold text-sm uppercase tracking-tight leading-snug">
                                {item.title}
                              </h3>
                            </div>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#1B1B18]/50">
                              {item.date}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-mono text-[9px] text-[#C47C5A] font-extrabold">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <div className="h-[180px] flex items-center justify-center relative overflow-visible">
                              <span
                                className="font-mono text-[10px] uppercase tracking-[0.18em] font-extrabold -rotate-90 whitespace-nowrap block text-[#FAF8F5]/85 group-hover:text-[#C47C5A] transition-colors"
                                style={{ transformOrigin: 'center center' }}
                              >
                                {item.shortName}
                              </span>
                            </div>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FAF8F5]/20" />
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* --- CHAPTER 10: RECOGNITION --- */}
              <div
                ref={recognitionRef}
                className="flex gap-6 flex-shrink-0"
                onMouseEnter={() => setActiveChapter('recognition')}
              >
                {recognitionItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="recognition-panel flex flex-col items-center flex-shrink-0 relative group"
                  >
                    {/* Hanging wire */}
                    <div className="w-[1px] bg-[#FAF8F5]/15 h-12 transition-colors duration-300 group-hover:bg-[#C47C5A]/45" />

                    {/* Recognition Card */}
                    <div className="w-[320px] h-[340px] bg-[#FAFDF9] text-[#1B1B18] p-7 rounded-[3px] border border-[#C47C5A]/20 flex flex-col justify-between relative shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center font-mono text-[9px] text-[#1B1B18]/45 select-none">
                          <span className="text-[#C47C5A] font-bold">10 / RECOGNITION</span>
                          <span>0{index + 1}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#C47C5A]/85 uppercase tracking-wide">{item.provider}</span>
                        <h3 className="font-sans font-black text-sm uppercase tracking-tight leading-snug mt-0.5 text-[#1B1B18]">
                          {item.title}
                        </h3>
                        <p className="font-sans text-[12.5px] text-[#1B1B18]/75 leading-relaxed mt-1.5 select-text">
                          {item.description}
                        </p>
                      </div>

                      <div className="border-t border-[#1B1B18]/10 pt-3 select-none flex justify-between items-center">
                        <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#C47C5A] font-bold">
                          {item.date}
                        </span>
                        <button
                          onClick={() => setActiveCertificateUrl(index === 0 ? '/award 1.png' : '/award 2.jpg')}
                          className="font-mono text-[9.5px] text-[#C47C5A] hover:text-[#1B1B18] uppercase tracking-wider font-bold transition-colors cursor-pointer"
                        >
                          [ VIEW CERTIFICATE ]
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* MOBILE ACADEMIC ARCHIVE */}
        <div className="mobile-academic-shell mx-auto block w-full max-w-[430px] md:hidden">
          <header className="mobile-academic-header flex flex-col items-start">
            <span className="relative block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#C47C5A]">
              ACADEMIC ARCHIVE
              <span className="absolute -bottom-1 left-0 h-[2px] w-8 bg-[#C47C5A]" />
            </span>

            <div className="relative mt-5 w-full pr-[58px]">
              <h2 className="font-sans text-[clamp(2.1rem,9.8vw,3.05rem)] font-bold uppercase leading-[0.88] tracking-[-0.055em] text-[#FAF8F5]">
                Academic
                <br />
                Background
              </h2>

              <span className="absolute bottom-[2px] right-0 whitespace-nowrap font-mono text-[9px] font-semibold uppercase leading-none tracking-[0.06em] text-[#FAF8F5]/62">
                2020—2026
              </span>
            </div>

            <p className="mt-5 max-w-[330px] font-sans text-[12.5px] leading-[1.55] text-[#FAF8F5]/68">
              Formal study, continued learning and recognition across technology,
              research and community.
            </p>
          </header>

          <div
            className="
              mobile-academic-tabs mt-7 grid grid-cols-3
              overflow-hidden rounded-[3px]
              border border-[#FAF8F5]/12 bg-[#1C2822]/28
            "
            role="tablist"
            aria-label="Academic archive chapters"
          >
            {[
              { id: 'education' as const, number: '08', label: 'Education' },
              { id: 'credentials' as const, number: '09', label: 'Credentials' },
              { id: 'recognition' as const, number: '10', label: 'Recognition' },
            ].map((chapter) => {
              const isActive = activeChapter === chapter.id;

              return (
                <button
                  key={chapter.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => changeMobileChapter(chapter.id)}
                  className={[
                    'relative flex min-h-[54px] flex-col items-start justify-center px-3',
                    'border-r border-[#FAF8F5]/10 last:border-r-0',
                    'text-left transition-colors duration-300',
                    isActive
                      ? 'bg-[#F5F1E8] text-[#1B1B18]'
                      : 'text-[#FAF8F5]/65 hover:text-[#FAF8F5]/90',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'font-mono text-[9px] font-bold',
                      isActive ? 'text-[#C47C5A]' : 'text-current',
                    ].join(' ')}
                  >
                    {chapter.number}
                  </span>

                  <span className="mt-1 font-mono text-[8.5px] font-bold uppercase tracking-[0.055em]">
                    {chapter.label}
                  </span>

                  {isActive && (
                    <span className="absolute inset-x-3 bottom-0 h-[2px] bg-[#C47C5A]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative mt-7">
            <div
              className="
                mobile-archive-watermark pointer-events-none
                absolute inset-x-[-10vw] top-1/2 -translate-y-1/2
                overflow-hidden text-center
                font-sans text-[clamp(5.6rem,27vw,8rem)]
                font-black uppercase leading-[0.78]
                tracking-[-0.075em] text-[#FAF8F5] opacity-0
              "
              aria-hidden="true"
            >
              ARCHIVE
            </div>

            <div
              className={[
                'mobile-archive-deck relative mx-auto w-full max-w-[330px]',
                'touch-pan-y select-none transition-[height] duration-500 ease-out',
                activeChapter === 'recognition' ? 'h-[432px]' : 'h-[390px]',
              ].join(' ')}
              onTouchStart={handleMobileTouchStart}
              onTouchEnd={handleMobileTouchEnd}
            >
              <div
                className={[
                  'pointer-events-none absolute inset-x-5 top-4 rotate-[-2.2deg]',
                  'rounded-[3px] border border-[#FAF8F5]/10 bg-[#1C2822]/45',
                  'shadow-[0_20px_45px_rgba(0,0,0,0.15)] transition-[height] duration-500 ease-out',
                  activeChapter === 'recognition' ? 'h-[392px]' : 'h-[350px]',
                ].join(' ')}
              />
              <div
                className={[
                  'pointer-events-none absolute inset-x-3 top-2 rotate-[1.3deg]',
                  'rounded-[3px] border border-[#FAF8F5]/12 bg-[#C8CEC3]/35',
                  'shadow-[0_18px_38px_rgba(0,0,0,0.13)] transition-[height] duration-500 ease-out',
                  activeChapter === 'recognition' ? 'h-[402px]' : 'h-[360px]',
                ].join(' ')}
              />

              <article
                className={[
                  'mobile-academic-card absolute inset-x-0 top-0',
                  'overflow-hidden rounded-[3px] border',
                  'shadow-[0_24px_55px_rgba(0,0,0,0.22)]',
                  'transition-[height] duration-500 ease-out',
                  activeChapter === 'recognition' ? 'h-[410px]' : 'h-[365px]',
                  activeChapter === 'credentials'
                    ? 'border-[#FAF8F5]/14 bg-[#1C2822] text-[#FAF8F5]'
                    : 'border-[#1B1B18]/10 bg-[#FAF8F5] text-[#1B1B18]',
                ].join(' ')}
                aria-live="polite"
              >
                <div className="mobile-academic-card-content flex h-full min-h-0 flex-col p-6">
                  {activeChapter === 'education' && (
                    <>
                      <div className="flex items-center justify-between border-b border-[#1B1B18]/10 pb-3 font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-[#1B1B18]/58">
                        <span>08 / Education</span>
                        <span>
                          {String(activeMobileIndex + 1).padStart(2, '0')} /{' '}
                          {String(educationItems.length).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col justify-center py-6">
                        <span className="font-mono text-[11px] font-bold text-[#C47C5A]">
                          {activeEducationItem.year}
                        </span>

                        <h3 className="mt-5 max-w-[270px] font-sans text-[clamp(1.8rem,9vw,2.45rem)] font-black uppercase leading-[0.94] tracking-[-0.045em]">
                          {activeEducationItem.degree}
                        </h3>

                        <p className="mt-5 max-w-[250px] font-sans text-[13.5px] leading-relaxed text-[#1B1B18]/74">
                          {activeEducationItem.school}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#1B1B18]/10 pt-4">
                        <span className="rounded-[2px] bg-[#1B1B18]/5 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.06em] text-[#1B1B18]/68">
                          {activeEducationItem.status}
                        </span>

                        <span className="font-mono text-[8.5px] uppercase tracking-[0.07em] text-[#1B1B18]/52">
                          Academic Record
                        </span>
                      </div>
                    </>
                  )}

                  {activeChapter === 'credentials' && (
                    <>
                      <div className="flex items-center justify-between border-b border-[#FAF8F5]/12 pb-3 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-[#FAF8F5]/58">
                        <span>09 / Credentials</span>
                        <span>
                          {String(activeMobileIndex + 1).padStart(2, '0')} /{' '}
                          {String(credentialItems.length).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="relative flex flex-1 flex-col justify-center py-6">
                        <span
                          className="
                            pointer-events-none absolute -right-2 bottom-0
                            font-sans text-[7rem] font-black leading-none
                            tracking-[-0.08em] text-[#FAF8F5]/[0.035]
                          "
                          aria-hidden="true"
                        >
                          {String(activeMobileIndex + 1).padStart(2, '0')}
                        </span>

                        <span className="relative z-10 font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-[#C47C5A]">
                          {activeCredentialItem.provider}
                        </span>

                        <h3 className="relative z-10 mt-5 max-w-[270px] font-sans text-[clamp(1.75rem,8.5vw,2.35rem)] font-black uppercase leading-[0.95] tracking-[-0.045em]">
                          {activeCredentialItem.title}
                        </h3>

                        <div className="relative z-10 mt-6 h-px w-12 bg-[#C47C5A]" />

                        <p className="relative z-10 mt-5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-[#FAF8F5]/65">
                          {activeCredentialItem.date}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#FAF8F5]/12 pt-4">
                        <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-[#FAF8F5]/55">
                          Credential Archive
                        </span>

                        <span className="font-mono text-[9px] font-bold text-[#C47C5A]">
                          {activeCredentialItem.shortName}
                        </span>
                      </div>
                    </>
                  )}

                  {activeChapter === 'recognition' && (
                    <>
                      <div
                        className="absolute right-0 top-0 h-8 w-8 bg-[#C47C5A]"
                        style={{
                          clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
                        }}
                        aria-hidden="true"
                      />

                      <div className="flex items-center justify-between border-b border-[#1B1B18]/10 pb-3 pr-4 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-[#1B1B18]/58">
                        <span className="font-bold text-[#C47C5A]">
                          10 / Recognition
                        </span>
                        <span>
                          {String(activeMobileIndex + 1).padStart(2, '0')} /{' '}
                          {String(recognitionItems.length).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="flex min-h-0 flex-1 flex-col justify-center py-4">
                        <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.08em] text-[#C47C5A]">
                          {activeRecognitionItem.provider}
                        </span>

                        <h3 className="mt-3 max-w-[270px] font-sans text-[clamp(1.42rem,6.8vw,1.9rem)] font-black uppercase leading-[0.94] tracking-[-0.045em]">
                          {activeRecognitionItem.title}
                        </h3>

                        <p className="mt-4 max-w-[275px] font-sans text-[12px] leading-[1.5] text-[#1B1B18]/74">
                          {activeRecognitionItem.description}
                        </p>
                      </div>

                      <div
                        className="
                          grid w-full grid-cols-[auto_minmax(0,1fr)]
                          items-center gap-3
                          border-t border-[#1B1B18]/10
                          px-2 pb-2 pt-3.5
                        "
                      >
                        <span
                          className="
                            justify-self-start whitespace-nowrap
                            pl-0.5 font-sans text-[9px]
                            font-bold uppercase leading-none
                            tracking-[0.025em] text-[#C47C5A]
                          "
                        >
                          {activeRecognitionItem.date}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveCertificateUrl(
                              activeMobileIndex === 0
                                ? '/award 1.png'
                                : '/award 2.jpg'
                            )
                          }
                          className="
                            min-h-8 min-w-0 max-w-full
                            justify-self-end whitespace-nowrap
                            px-1 font-sans text-[9px]
                            font-bold uppercase leading-none
                            tracking-[0.02em] text-[#C47C5A]
                            transition-colors hover:text-[#1B1B18]
                            focus-visible:outline-none
                            focus-visible:ring-1
                            focus-visible:ring-[#C47C5A]/60
                          "
                        >
                          [ View certificate ]
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </article>
            </div>
          </div>

          <div className="mobile-archive-controls mt-5">
            <nav
              className="
                grid grid-cols-[1fr_auto_1fr] items-center
                border-y border-[#FAF8F5]/10 py-2
                font-sans text-[10px] font-bold uppercase
                tracking-[0.045em] text-[#FAF8F5]
              "
              aria-label="Academic record navigation"
            >
              <button
                type="button"
                onClick={() => changeMobileRecord(-1)}
                className="min-h-9 justify-self-start transition-colors hover:text-[#C47C5A]"
              >
                [ Prev ]
              </button>

              <span className="justify-self-center text-[#C47C5A]">
                {String(activeMobileIndex + 1).padStart(2, '0')}
                <span className="text-[#FAF8F5]/58">
                  {' '}
                  / {String(mobileItemCount).padStart(2, '0')}
                </span>
              </span>

              <button
                type="button"
                onClick={() => changeMobileRecord(1)}
                className="min-h-9 justify-self-end transition-colors hover:text-[#C47C5A]"
              >
                [ Next ]
              </button>
            </nav>

            <div className="mt-4 h-[2px] w-full overflow-hidden rounded-full bg-[#FAF8F5]/10">
              <div
                className="h-full bg-[#C47C5A] transition-[width] duration-500 ease-out"
                style={{ width: `${mobileProgress}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between font-sans text-[7.5px] font-semibold uppercase tracking-[0.07em] text-[#FAF8F5]/58">
              <span>Swipe card</span>
              <span>{activeChapter}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox certificate viewer modal */}
      {activeCertificateUrl && (
        <div
          onClick={() => setActiveCertificateUrl(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-4 cursor-pointer select-none"
        >
          {/* Close button */}
          <button
            onClick={() => setActiveCertificateUrl(null)}
            className="absolute top-6 right-6 font-mono text-xs font-bold text-white tracking-widest uppercase hover:text-[#C47C5A] transition-colors cursor-pointer bg-black/40 px-3 py-1.5 rounded-[3px] border border-white/10"
          >
            [ CLOSE ]
          </button>

          {/* Certificate Image */}
          <div className="max-w-[90vw] max-h-[80vh] relative flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeCertificateUrl}
              alt="Certificate"
              className="max-w-full max-h-full object-contain rounded-[4px] shadow-[0_30px_70px_rgba(0,0,0,0.5)] border border-white/10 select-text"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking the image itself
            />
          </div>

          {/* Click to dismiss helper hint */}
          <span className="font-mono text-[9px] font-bold text-white/50 tracking-widest uppercase mt-6">
            CLICK ANYWHERE OUTSIDE TO DISMISS
          </span>
        </div>
      )}
    </section>
  );
}