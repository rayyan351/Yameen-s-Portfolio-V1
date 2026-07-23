import React, { forwardRef } from 'react';

interface AboutProps {
  portraitPlaceholderRef: React.RefObject<HTMLDivElement | null>;
  portraitPlaceholderMobileRef: React.RefObject<HTMLDivElement | null>;
}

function WorkLink({ mobile = false }: { mobile?: boolean }) {
  return (
    <a
      href="#work"
      className={[
        'group inline-flex items-center gap-2 text-ink font-sans font-semibold',
        'relative pb-1 transition-colors duration-300',
        mobile ? 'about-mobile-cta-line text-base sm:text-lg' : 'about-desktop-cta-line text-base md:text-lg',
      ].join(' ')}
    >
      <span className="relative">
        Explore selected work
        <span className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left bg-clay transition-transform duration-300 ease-out group-hover:scale-x-110" />
      </span>

      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-dark transition-all duration-300 group-hover:border-clay group-hover:bg-cream">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
          aria-hidden="true"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </span>
    </a>
  );
}

export const About = forwardRef<HTMLDivElement, AboutProps>(
  (
    {
      portraitPlaceholderRef,
      portraitPlaceholderMobileRef,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
       className="
  absolute inset-0 z-[5] h-full w-full overflow-hidden bg-transparent
  px-4 pb-[calc(18px+env(safe-area-inset-bottom))]
  pt-[calc(var(--nav-height)+var(--nav-offset)+16px)]

  sm:px-6

  md:px-10
  md:pb-10

  lg:flex
  lg:items-start
  lg:justify-center
  lg:px-12
  lg:pb-10
  lg:pt-[calc(var(--nav-height)+var(--nav-offset)+28px)]

  xl:items-center
  xl:px-24
  xl:pb-12
  xl:pt-[calc(var(--nav-height)+var(--nav-offset)+40px)]
"
      >
        {/* Compact layout: phones and tablets */}
        <div
  className="
    about-mobile-layout relative h-full w-full
    md:mx-auto md:max-w-[920px]
    lg:hidden
  "
>
          {/* Frame 01: greeting, portrait and primary statement */}
          {/* Frame 01: greeting, portrait and primary statement */}
<div
  className="
    about-mobile-primary
    absolute inset-0
    grid grid-rows-[auto_minmax(0,1fr)_auto]

    md:block
  "
>
  {/* Greeting */}
<div
  className="
    overflow-hidden pb-3 -mb-3

    md:absolute
    md:left-0
    md:top-[2svh]
  "
>
    <div
      className="
        about-mobile-greeting-line
        font-sans font-extrabold text-ink
        text-[clamp(3.7rem,16vw,5.8rem)]
        md:text-[clamp(4.9rem,9vw,6rem)]
        leading-[0.94]
        tracking-[-0.055em]
      "
    >
      Hey!
    </div>
  </div>

  {/* Portrait landing area */}
{/* Portrait landing area */}
<div
  className="
    flex min-h-0 items-center justify-center
    -translate-y-1

    md:absolute
    md:left-[46%]
    md:top-[48%]
    md:translate-x-[-50%]
    md:translate-y-[-50%]
  "
>
  <div
    ref={portraitPlaceholderMobileRef}
    className="
      about-portrait-placeholder-mobile
      h-[clamp(250px,43svh,430px)]
      aspect-[2/3]
      overflow-hidden
      bg-transparent

      md:h-[clamp(390px,46svh,500px)]
    "
  />
</div>

  {/* Primary introduction */}
<div
  className="
    about-mobile-intro
    w-full max-w-[470px]
    -translate-y-2
    pb-[calc(48px+env(safe-area-inset-bottom))]

    md:absolute
    md:right-0
    md:bottom-[4svh]
    md:w-[clamp(310px,43vw,370px)]
    md:max-w-none
    md:translate-y-0
    md:pb-0
  "
>
    {[
      "I'm a First Class BSc (Hons)",
      'Computer Science graduate specialising in',
      'AI & Data Science, and a freelance developer',
      'who ships production software for real clients.',
    ].map((line) => (
      <div key={line} className="overflow-hidden py-[1px]">
        <div
          className="
            about-mobile-intro-line
            font-sans font-semibold
            text-left text-ink
            text-[clamp(1rem,4.3vw,1.38rem)]
            leading-[1.2]
            tracking-[-0.035em]
            md:text-[clamp(1rem,1.9vw,1.16rem)]
            md:leading-[1.25]
            md:tracking-[-0.025em]
          "
        >
          {line}
        </div>
      </div>
    ))}
  </div>
</div>

          {/* Frame 02: supporting copy and CTA */}
          <div
            className="
              about-mobile-details absolute inset-0
              flex flex-col justify-center
              bg-[#EEE9DE]
              pointer-events-none
                md:items-center
                md:px-8
            "
          >
            <div className="w-full max-w-[760px]">
              <div
                className="
                  about-mobile-copy flex flex-col gap-6
                  font-sans font-light text-stone/90
                  text-[clamp(0.95rem,4vw,1.08rem)]
                  leading-[1.58]
                    md:grid md:grid-cols-2
                 md:gap-10
                md:text-[clamp(0.98rem,1.8vw,1.08rem)]
                "
              >
                <div className="overflow-hidden">
                  <p className="about-mobile-detail-line">
                    I graduated with a First Class degree from London South
                    Bank University in 2026, working in machine learning,
                    analytics, and full-stack development. Alongside classes,
                    I ran client projects end-to-end — from initial discovery
                    to deployment.
                  </p>
                </div>

                <div className="overflow-hidden">
                  <p className="about-mobile-detail-line">
                    I build technically honest, useful tools: well-evaluated
                    models, clear dashboards, and fast, accessible interfaces.
                    I&apos;ve also served as a Student Research Lead and Tech
                    Ambassador, mentoring peers.
                  </p>
                </div>
              </div>

              <div className="about-mobile-cta mt-8 overflow-hidden py-2 md:mt-10">
                <WorkLink mobile />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div
          className="
            hidden w-full max-w-[1600px]
  items-stretch

lg:grid
lg:h-full
lg:min-h-0
lg:max-h-none
lg:grid-cols-[31fr_38fr_31fr]
lg:gap-8

xl:h-[72svh]
xl:max-h-[640px]
xl:grid-cols-[29fr_36fr_30fr]
xl:gap-16
          "
        >
          {/* Left column */}
          <div
  className="
    about-col-left
    relative flex h-full flex-col
    lg:justify-start lg:pb-0
    xl:justify-between xl:pb-12
  "
>
            <div className="overflow-hidden pb-3 -mb-3 lg:translate-y-[2svh] xl:translate-y-0">
              <div
                className="
                  about-desktop-greeting-line
                  font-sans font-extrabold text-ink
                  text-[clamp(4rem,7vw,8rem)]
                  leading-[0.94] tracking-tight
                  xl:leading-none
                "
              >
                Hey!
              </div>
            </div>

            <div
  className="
    about-intro-left

    lg:absolute
    lg:left-0
    lg:top-[53%]
    lg:mt-0
    lg:-translate-y-1/2

    xl:static
    xl:mt-auto
    xl:translate-y-0
  "
>
              {[
                "I'm a First Class BSc (Hons) Computer Science",
                'graduate specialising in AI & Data Science,',
                'and a freelance developer who ships',
                'production software for real clients.',
              ].map((line) => (
                <div key={line} className="overflow-hidden">
                  <div
                    className="
                      about-desktop-left-line
                      font-sans font-semibold text-left text-ink
                      text-[clamp(1.08rem,1.75vw,1.45rem)]
                      xl:text-[clamp(1.05rem,1.8vw,1.9rem)]
                      leading-[1.25] tracking-tight
                    "
                  >
                    {line}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portrait landing area */}
          <div
  className="
    flex h-full justify-center

    lg:items-center
    lg:pb-0
    lg:-translate-y-[4svh]

    xl:items-end
    xl:translate-y-0
    xl:pb-12
  "
>
            <div
              ref={portraitPlaceholderRef}
              className="
                 about-portrait-placeholder
  aspect-[2/3]
  overflow-hidden
  bg-transparent

  lg:h-auto
  lg:w-full
  lg:max-w-[390px]

  xl:h-full
  xl:w-auto
  xl:max-w-none
  xl:max-h-[640px]
              "
            />
          </div>

          {/* Right column */}
          <div
  className="
    about-col-right
    flex h-full flex-col justify-center
    pl-0

    lg:pb-0
    lg:pl-2
    lg:-translate-y-[6svh]

    xl:translate-y-0
    xl:pb-12
    xl:pl-8
  "
>
            <div
              className="
                about-intro-right mb-6 flex max-w-[480px] flex-col gap-5
                font-sans font-light text-left text-stone/85
                text-[13.5px] leading-[1.58]
                xl:mb-8 xl:text-[15px] xl:leading-relaxed
              "
            >
              <div className="overflow-hidden">
                <p className="about-desktop-right-line">
                  I graduated with a First Class degree from London South Bank
                  University in 2026, working in machine learning, analytics,
                  and full-stack development. Alongside classes, I ran client
                  projects end-to-end — from initial discovery to deployment.
                </p>
              </div>

              <div className="overflow-hidden">
                <p className="about-desktop-right-line">
                  I build technically honest, useful tools: well-evaluated
                  models, clear dashboards, and fast, accessible interfaces.
                  I&apos;ve also served as a Student Research Lead and Tech
                  Ambassador, mentoring peers.
                </p>
              </div>
            </div>

            <div className="about-desktop-cta overflow-hidden py-2">
              <WorkLink />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

About.displayName = 'About';
export default About;