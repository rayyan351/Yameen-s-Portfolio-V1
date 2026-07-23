'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsapPlugins } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SkillGroup {
  number: string;
  title: string;
  dominant: string[];
  tools: string[];
  tone: 'forest' | 'sage' | 'sageLight';
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    number: '01',
    title: 'AI & Machine Learning',
    dominant: ['PYTHON'],
    tools: ['Pandas', 'NumPy', 'scikit-learn', 'Matplotlib', 'Jupyter'],
    tone: 'forest',
  },
  {
    number: '02',
    title: 'Data & Analytics',
    dominant: ['POWER BI'],
    tools: ['SQL', 'Statistical modelling', 'Data visualisation', 'Excel'],
    tone: 'sage',
  },
  {
    number: '03',
    title: 'Languages',
    dominant: ['PYTHON'],
    tools: ['Java', 'C#', 'R', 'SQL', 'JavaScript'],
    tone: 'forest',
  },
  {
    number: '04',
    title: 'Web & Tools',
    dominant: ['REACT'],
    tools: ['Node.js', 'Supabase', 'Tailwind CSS', 'WordPress', 'Git', 'REST APIs'],
    tone: 'sageLight',
  },
];

function toneClasses(group: SkillGroup) {
  if (group.tone === 'forest') {
    return {
      background: 'bg-[#1C2822]',
      text: 'text-[#F5F1E8]',
      border: 'border-[#F5F1E8]/12',
      divider: 'border-[#F5F1E8]/15',
    };
  }

  if (group.tone === 'sage') {
    return {
      background: 'bg-[#9BA68F]',
      text: 'text-[#1B1B18]',
      border: 'border-[#1C2822]/14',
      divider: 'border-[#1C2822]/15',
    };
  }

  return {
    background: 'bg-[#C8CEC3]',
    text: 'text-[#1B1B18]',
    border: 'border-[#1C2822]/14',
    divider: 'border-[#1C2822]/15',
  };
}

function MobileBand({
  group,
  index,
  animated,
}: {
  group: SkillGroup;
  index: number;
  animated: boolean;
}) {
  const tone = toneClasses(group);
  const dominant =
    group.number === '03' ? 'PYTHON / JS' : group.dominant[0];
  const supportingTools =
    group.number === '03'
      ? group.tools.filter((tool) => tool !== 'JavaScript')
      : group.tools;

  return (
    <article
      className={[
        animated ? 'mobile-skill-band' : '',
        `mobile-skill-band-${index + 1}`,
        'relative w-full overflow-hidden rounded-[2px] border',
        'shadow-[0_8px_22px_rgba(27,27,24,0.09)]',
        tone.background,
        tone.text,
        tone.border,
      ].join(' ')}
      style={{
        height: 'clamp(82px, 13.2svh, 94px)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className={[
          animated ? 'mobile-band-content' : '',
          `mobile-band-content-${index + 1}`,
          'grid h-full grid-cols-[minmax(0,1fr)_minmax(104px,0.72fr)]',
          'grid-rows-[auto_minmax(0,1fr)] px-4 py-3',
        ].join(' ')}
      >
        <div
          className={[
            'col-span-2 flex items-center justify-between border-b pb-2',
            tone.divider,
          ].join(' ')}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 font-mono text-[8.5px] font-bold text-[#C47C5A]">
              {group.number}
            </span>
            <span className="truncate font-mono text-[8.5px] font-bold uppercase tracking-[0.075em]">
              {group.title}
            </span>
          </div>

          <span
            className="ml-3 shrink-0 font-mono text-[11px] text-[#C47C5A]"
            aria-hidden="true"
          >
            →
          </span>
        </div>

        <div className="flex min-w-0 items-end pr-3 pt-2">
          <h3
            className="
              whitespace-nowrap font-sans font-black uppercase
              text-[clamp(1.55rem,7.25vw,2rem)]
              leading-none tracking-[-0.055em]
            "
          >
            {dominant}
          </h3>
        </div>

        <div
          className={[
            'flex min-w-0 items-center border-l pl-3 pt-2',
            tone.divider,
          ].join(' ')}
        >
          <p className="font-mono text-[9px] font-medium leading-[1.4] opacity-90">
            {supportingTools.join('  /  ')}
          </p>
        </div>
      </div>

      <div
        className="
          pointer-events-none absolute inset-x-0 top-0 h-px
          bg-gradient-to-r from-transparent via-white/22 to-transparent
        "
      />
    </article>
  );
}

export default function Skills() {
  const wrapperRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsapPlugins();
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted || reducedMotion || !wrapperRef.current) return;

    const media = gsap.matchMedia();

    const context = gsap.context(() => {
      media.add('(min-width: 768px)', () => {
        gsap.set('.handoff-sheet', {
          yPercent: -18,
          rotateX: 12,
          rotateY: -2,
          rotateZ: -8,
          transformPerspective: 1800,
          opacity: 1,
          scale: 1,
        });

        gsap.set('.skills-bg-text', { y: 35, opacity: 0 });
        gsap.set('.skills-header-reveal', { opacity: 0 });
        gsap.set('.skills-footer-reveal', { opacity: 0 });
        gsap.set('.skill-band-item', {
          clipPath: 'inset(0% 100% 0% 0%)',
        });
        gsap.set('.band-content-reveal', { opacity: 0, y: 15 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(
          '.handoff-sheet',
          {
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            yPercent: 0,
            scale: 1.1,
            duration: 0.12,
            ease: 'power2.out',
          },
          0
        );

        timeline.to(
          '.handoff-sheet',
          {
            opacity: 0,
            duration: 0.06,
            ease: 'none',
          },
          0.12
        );

        timeline.to(
          '.skills-bg-text',
          {
            y: 0,
            opacity: 0.08,
            duration: 0.12,
            ease: 'sine.out',
          },
          0.18
        );

        timeline.to(
          '.skills-header-reveal',
          {
            opacity: 1,
            duration: 0.12,
            ease: 'sine.out',
          },
          0.18
        );

        SKILL_GROUPS.forEach((_, index) => {
          const start = 0.3 + index * 0.12;

          timeline.to(
            `.skill-band-${index + 1}`,
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.08,
              ease: 'power2.inOut',
            },
            start
          );

          timeline.to(
            `.skill-band-content-${index + 1}`,
            {
              opacity: 1,
              y: 0,
              duration: 0.04,
              ease: 'power2.out',
            },
            start + 0.08
          );
        });

        timeline.to(
          '.skills-footer-reveal',
          {
            opacity: 1,
            duration: 0.1,
            ease: 'sine.out',
          },
          0.78
        );

        timeline.to({}, { duration: 0.08 }, 0.92);

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });

      media.add('(max-width: 767px)', () => {
        const bands = gsap.utils.toArray<HTMLElement>('.mobile-skill-band');
        const contents = gsap.utils.toArray<HTMLElement>('.mobile-band-content');

        gsap.set('.mobile-skills-handoff', {
          yPercent: 0,
          rotateX: 0,
          rotateZ: -1.5,
          scale: 1.015,
          opacity: 1,
          transformPerspective: 1200,
          transformOrigin: 'top center',
        });

        gsap.set('.mobile-skills-bg', {
          y: 28,
          opacity: 0,
        });

        gsap.set('.mobile-skills-header', {
          y: 14,
          opacity: 0,
        });

        gsap.set('.mobile-skills-footer', {
          y: 10,
          opacity: 0,
        });

        bands.forEach((band, index) => {
          const fromLeft = index % 2 === 0;

          gsap.set(band, {
            clipPath: fromLeft
              ? 'inset(0% 100% 0% 0%)'
              : 'inset(0% 0% 0% 100%)',
            x: fromLeft ? -24 : 24,
            y: 18,
            rotateX: 6,
            rotateY: fromLeft ? -2.5 : 2.5,
            scale: 0.978,
            opacity: 0.16,
            transformPerspective: 1200,
            transformOrigin: 'center center',
          });
        });

        gsap.set(contents, {
          y: 12,
          opacity: 0,
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.85,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(
          '.mobile-skills-handoff',
          {
            yPercent: -112,
            rotateX: 18,
            rotateZ: -5,
            scale: 0.985,
            opacity: 0,
            duration: 0.13,
            ease: 'power2.inOut',
          },
          0
        );

        timeline.to(
          '.mobile-skills-bg',
          {
            y: 0,
            opacity: 0.052,
            duration: 0.12,
            ease: 'sine.out',
          },
          0.11
        );

        timeline.to(
          '.mobile-skills-header',
          {
            y: 0,
            opacity: 1,
            duration: 0.11,
            ease: 'power2.out',
          },
          0.13
        );

        bands.forEach((band, index) => {
          const start = 0.24 + index * 0.135;

          timeline.to(
            band,
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              x: 0,
              y: 0,
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              opacity: 1,
              duration: 0.1,
              ease: 'power3.out',
            },
            start
          );

          timeline.to(
            contents[index],
            {
              y: 0,
              opacity: 1,
              duration: 0.055,
              ease: 'power2.out',
            },
            start + 0.065
          );
        });

        timeline.to(
          '.mobile-skills-footer',
          {
            y: 0,
            opacity: 1,
            duration: 0.09,
            ease: 'sine.out',
          },
          0.8
        );

        timeline.to({}, { duration: 0.1 }, 0.9);

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });
    }, wrapperRef);

    window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      media.revert();
      context.revert();
    };
  }, [mounted, reducedMotion]);

  return (
    <section
      id="skills"
      ref={wrapperRef}
      data-nav-theme="light"
      className={[
        'relative w-full bg-[#F5F1E8]',
        reducedMotion ? 'h-auto py-24' : 'h-[250svh] md:h-[200vh]',
      ].join(' ')}
    >
      {!reducedMotion && (
        <>
          <div
            className="
              sticky top-0 flex h-[100svh] w-full flex-col overflow-hidden
              bg-[#F5F1E8] md:hidden
            "
            style={{
              background:
                'radial-gradient(circle at 50% 46%, #FAF6EE 0%, #F4F0E6 72%, #E8E2D5 100%)',
            }}
          >
            <div
              className="
                mobile-skills-handoff pointer-events-none absolute inset-3 z-50
                bg-[#F5F1E8]
                shadow-[0_24px_70px_rgba(27,27,24,0.18)]
              "
              style={{
                clipPath:
                  'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%, 0 16px)',
              }}
            >
              <div
                className="absolute left-0 top-0 h-4 w-4 bg-[#C47C5A]"
                style={{
                  clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
                }}
              />
              <div
                className="absolute right-0 top-0 h-4 w-4 bg-[#C47C5A]"
                style={{
                  clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
                }}
              />
            </div>

            <div
              className="
                pointer-events-none absolute inset-x-0 top-1/2 z-0
                -translate-y-1/2 overflow-hidden px-3
              "
            >
              <div
                className="
                  mobile-skills-bg mx-auto flex w-full max-w-[360px]
                  flex-col items-center text-center
                  font-sans font-black uppercase text-[#1C2822]
                  leading-[0.78] tracking-[-0.075em] opacity-0
                "
              >
                <span
                  className="block whitespace-nowrap"
                  style={{ fontSize: 'clamp(4.55rem, 22vw, 6.25rem)' }}
                >
                  SKILLS
                </span>
                <span
                  className="block whitespace-nowrap"
                  style={{ fontSize: 'clamp(4.15rem, 20.5vw, 5.85rem)' }}
                >
                  &amp; STACK
                </span>
              </div>
            </div>

            <div
              className="
                relative z-10 flex h-full w-full flex-col
                px-5
                pb-[calc(12px+env(safe-area-inset-bottom))]
                pt-[calc(var(--nav-height)+var(--nav-offset)+16px)]
              "
            >
              <header
                className="
                  mobile-skills-header flex shrink-0 items-start
                  justify-between gap-5 opacity-0
                "
              >
                <span className="relative mt-0.5 block shrink-0 font-mono text-[9.5px] font-bold tracking-[0.16em] text-[#C47C5A]">
                  SKILLS
                  <span className="absolute -bottom-1 left-0 h-[2px] w-8 bg-[#C47C5A]" />
                </span>

                <p className="max-w-[220px] text-right font-serif text-[12.5px] italic leading-[1.5] text-[#1B1B18]/82">
                  The tools I reach for across machine learning, data and the web.
                </p>
              </header>

              <div
                className="
                  flex min-h-0 flex-1 flex-col justify-center
                  gap-2 py-3
                "
              >
                {SKILL_GROUPS.map((group, index) => (
                  <MobileBand
                    key={group.number}
                    group={group}
                    index={index}
                    animated
                  />
                ))}
              </div>

              <footer
                className="
                  mobile-skills-footer shrink-0 border-t border-[#1B1B18]/10
                  pt-2 text-center opacity-0
                "
              >
                <span className="font-mono text-[6.5px] uppercase tracking-[0.145em] text-[#1B1B18]/44">
                  BUILDING SYSTEMS / SOLVING REAL PROBLEMS / SHIPPING IMPACT
                </span>
              </footer>
            </div>
          </div>

          <div
            className="
              sticky top-0 hidden h-[100svh] w-full select-none
              flex-col items-center justify-start overflow-hidden
              bg-[#F5F1E8] md:flex
            "
            style={{
              background:
                'radial-gradient(circle at 50% 50%, #FAF6EE 0%, #F4F0E6 70%, #E8E2D5 100%)',
            }}
          >
            <div
              className="handoff-sheet pointer-events-none absolute z-50 bg-[#F5F1E8]"
              style={{
                width: '104vw',
                height: 'clamp(58vh, 66vh, 72vh)',
                top: '48vh',
                left: '-2vw',
                transformOrigin: 'top center',
                clipPath:
                  'polygon(32px 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 0 100%, 0 32px)',
                boxShadow:
                  '0 -10px 30px rgba(0,0,0,0.05), 0 25px 50px rgba(0,0,0,0.16)',
              }}
            >
              <div
                className="absolute left-0 top-0 h-8 w-8 bg-[#C47C5A]"
                style={{
                  clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
                }}
              />
              <div
                className="absolute right-0 top-0 h-8 w-8 bg-[#C47C5A]"
                style={{
                  clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
                }}
              />
            </div>

            <div className="pointer-events-none absolute inset-0 z-0 flex select-none flex-col items-start justify-center px-[clamp(28px,4vw,76px)]">
              <div
                className="
                  skills-bg-text font-sans font-black uppercase
                  leading-[0.72] tracking-tighter text-[#1C2822] opacity-0
                "
                style={{
                  fontSize: 'clamp(8rem, 18vw, 20rem)',
                  letterSpacing: '-0.07em',
                }}
              >
                SKILLS
                <br />
                &amp; STACK
              </div>
            </div>

            <div
              className="relative z-10 flex h-full w-full flex-col justify-between"
              style={{
                paddingInline: 'clamp(28px,4vw,76px)',
                paddingTop: 'clamp(80px,8vh,110px)',
                paddingBottom: 'clamp(24px,3vh,48px)',
              }}
            >
              <header className="skills-header-reveal flex w-full items-start justify-between opacity-0">
                <span className="relative block font-mono text-xs font-bold tracking-widest text-[#C47C5A]">
                  SKILLS
                  <span className="absolute -bottom-1 left-0 h-[2px] w-8 bg-[#C47C5A]" />
                </span>

                <p className="max-w-[240px] text-right font-serif text-[13px] font-normal italic leading-relaxed text-[#1B1B18]/80 md:text-sm">
                  The tools I reach for across machine learning, data and the web.
                </p>
              </header>

              <div className="relative my-auto flex w-full flex-1 items-center justify-start">
                <div
                  className="group/container flex w-full flex-col justify-start"
                  style={{
                    gap: 'clamp(14px,2vh,26px)',
                    maxWidth: 'min(1180px,100%)',
                  }}
                >
                  {SKILL_GROUPS.map((group, index) => {
                    const tone = toneClasses(group);

                    return (
                      <div
                        key={group.number}
                        className={[
                          'skill-band-item',
                          `skill-band-${index + 1}`,
                          'group/band relative flex w-full items-center rounded-[2px] border shadow-sm',
                          'transition-all duration-300',
                          'group-hover/container:opacity-[0.76] hover:!opacity-100',
                          tone.border,
                        ].join(' ')}
                        style={{
                          height: 'clamp(90px,11.5vh,132px)',
                        }}
                      >
                        <div
                          className={[
                            'band-content-reveal',
                            `skill-band-content-${index + 1}`,
                            'grid h-full w-full items-center opacity-0',
                            tone.text,
                          ].join(' ')}
                          style={{
                            gridTemplateColumns:
                              'clamp(190px,18vw,260px) clamp(220px,22vw,340px) minmax(0,1fr)',
                          }}
                        >
                          <div
                            className={[
                              'flex h-2/3 items-center gap-4 border-r px-6',
                              tone.divider,
                            ].join(' ')}
                          >
                            <span className="font-mono text-xs font-semibold text-[#C47C5A]">
                              {group.number}
                            </span>

                            <div>
                              <span className="block font-mono text-[10.5px] font-bold uppercase leading-tight tracking-[0.065em]">
                                {group.title}
                              </span>
                              <span className="mt-0.5 block font-mono text-[9px] text-[#C47C5A]">
                                →
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center px-6">
                            <span
                              className="
                                whitespace-nowrap font-sans font-black
                                leading-none tracking-tighter
                                transition-transform duration-300
                                group-hover/band:translate-x-2
                              "
                              style={{
                                fontSize: 'clamp(2.5rem,4.5vw,5.2rem)',
                              }}
                            >
                              {group.dominant[0]}
                            </span>
                          </div>

                          <div className="flex items-center px-6 font-mono text-[11px] font-medium opacity-90 lg:text-[12px] xl:text-[13px]">
                            {group.number === '03' ? (
                              <div className="flex w-full items-center justify-between">
                                <span className="leading-relaxed">
                                  {group.tools
                                    .filter((tool) => tool !== 'JavaScript')
                                    .join('  /  ')}
                                </span>

                                <span
                                  className="
                                    ml-4 shrink-0 whitespace-nowrap
                                    font-sans font-black leading-none tracking-tighter
                                    transition-transform duration-300
                                    group-hover/band:-translate-x-2
                                  "
                                  style={{
                                    fontSize: 'clamp(2.2rem,3.8vw,4.4rem)',
                                  }}
                                >
                                  JAVASCRIPT
                                </span>
                              </div>
                            ) : (
                              <span className="leading-relaxed">
                                {group.tools.join('  /  ')}
                                {group.number === '04' && (
                                  <span className="ml-2 inline-block text-[#C47C5A] transition-transform group-hover/band:translate-x-1">
                                    →
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          className={[
                            'absolute inset-0 z-[-1] rounded-[2px]',
                            tone.background,
                          ].join(' ')}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <footer className="skills-footer-reveal flex w-full items-center justify-center border-t border-[#1B1B18]/10 pt-4 opacity-0">
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#1B1B18]/50 md:text-[9px]">
                  BUILDING SYSTEMS / SOLVING REAL PROBLEMS / SHIPPING IMPACT
                </span>
              </footer>
            </div>
          </div>
        </>
      )}

      {reducedMotion && (
        <div
          className="relative mx-auto w-full max-w-[1180px] px-5 md:px-12"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, #FAF6EE 0%, #F4F0E6 70%, #E8E2D5 100%)',
          }}
        >
          <header className="mb-10">
            <span className="relative block font-mono text-xs font-bold tracking-widest text-[#C47C5A]">
              SKILLS
              <span className="absolute -bottom-1 left-0 h-[2px] w-8 bg-[#C47C5A]" />
            </span>

            <p className="mt-4 max-w-sm font-serif text-[14px] italic leading-relaxed text-[#1B1B18]/80">
              The tools I reach for across machine learning, data and the web.
            </p>
          </header>

          <div className="space-y-3">
            {SKILL_GROUPS.map((group, index) => (
              <MobileBand
                key={group.number}
                group={group}
                index={index}
                animated={false}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}