import React, { forwardRef } from 'react';

interface HeroProps {
  portraitPlaceholderRef: React.RefObject<HTMLDivElement | null>;
  portraitPlaceholderMobileRef: React.RefObject<HTMLDivElement | null>;
}

export const Hero = forwardRef<HTMLDivElement, HeroProps>(
  ({ portraitPlaceholderRef, portraitPlaceholderMobileRef }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute inset-0 w-full h-full flex flex-col justify-between px-6 md:px-12 lg:px-24 select-none z-[4] bg-transparent"
        style={{
        paddingTop: 'calc(var(--nav-offset) + var(--nav-height) + clamp(14px, 2.4vw, 44px))',
        paddingBottom: 'calc(clamp(16px, 2.5vw, 42px) + env(safe-area-inset-bottom))',
      }}
      >
        {/* Upper Metadata */}
        <div className="hero-metadata-top flex justify-between items-start w-full">
        <div className="font-mono text-sm font-bold uppercase tracking-wider text-ink/80">
  AI & Data Science / Web Development
</div>
          {/* Star */}
          <div className="hero-star relative w-6 h-6 flex items-center justify-center opacity-70 hidden md:flex" aria-hidden="true">
            <svg className="w-5 h-5 text-forest" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
            </svg>
          </div>
        </div>

        {/* Monumental Headline */}
        <div className="flex flex-col items-center justify-center w-full flex-1 my-4">
          {/* Desktop Layout */}
          <div className="hidden lg:flex flex-col items-center justify-center w-full relative pb-10 xl:pb-12">
            {/* Portrait placeholder sitting at bottom center, overlapping line 2 from behind */}
            <div
  ref={portraitPlaceholderRef}
  className="hero-portrait-placeholder absolute z-10 aspect-[2/3] bg-transparent pointer-events-none"
  style={{
    width: 'clamp(230px, 15.5vw, 310px)',
    bottom: 'clamp(-155px, -7.2vw, -112px)',
    left: '50%',
    transform: 'translateX(-50%)',
  }}
/>

            {/* Monumental text lines overlapping the portrait */}
            <h1
              className="hero-line-1 font-sans font-black text-center text-ink uppercase leading-[0.95] tracking-tight relative z-30 whitespace-nowrap"
              style={{ fontSize: 'clamp(4.2rem, 8.15vw, 10.8rem)' }}
            >
              Data into decisions.
            </h1>
            <h1
              className="hero-line-2 font-sans font-black text-center text-ink uppercase leading-[0.95] tracking-tight relative z-30 mt-6 lg:mt-8 xl:mt-10 whitespace-nowrap"
              style={{ fontSize: 'clamp(4.2rem, 8.15vw, 10.8rem)' }}
            >
              Ideas into softwares.
            </h1>
          </div>

          {/* Mobile Layout */}
          <div
  className="flex lg:hidden flex-col items-center justify-center w-full max-w-[520px] relative pb-12"
  style={{
    transform: 'translateY(clamp(-58px, -6vh, -28px))',
  }}
>
            {/* Mobile portrait placeholder aligned at bottom center */}
           <div
  ref={portraitPlaceholderMobileRef}
  className="hero-portrait-placeholder-mobile absolute z-10 aspect-[2/3] bg-transparent pointer-events-none"
  style={{
    width: 'clamp(122px, 32vw, 148px)',
    bottom: 'clamp(-94px, -19vw, -74px)',
    left: '50%',
    transform: 'translateX(-50%)',
  }}
/>

            <h1 className="hero-line-1-mob font-sans font-black text-center text-ink uppercase leading-[0.9] tracking-[-0.045em] text-[clamp(2.45rem,12vw,4.75rem)] relative z-30 whitespace-nowrap">
              Data into
            </h1>
            <h1 className="hero-line-2-mob font-sans font-black text-center text-ink uppercase leading-[0.9] tracking-[-0.045em] text-[clamp(2.45rem,12vw,4.75rem)] relative z-30 whitespace-nowrap">
              decisions.
            </h1>
            <h1 className="hero-line-3-mob font-sans font-black text-center text-ink uppercase leading-[0.9] tracking-[-0.045em] text-[clamp(2.45rem,12vw,4.75rem)] mt-3 relative z-30 whitespace-nowrap">
              Ideas into
            </h1>
            <h1 className="hero-line-4-mob font-sans font-black text-center text-ink uppercase leading-[0.9] tracking-[-0.045em] text-[clamp(2.45rem,12vw,4.75rem)] relative z-30 whitespace-nowrap">
              softwares.
            </h1>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="hero-metadata-bottom flex justify-between items-end w-full">
          <div className="font-mono text-sm font-bold text-ink/80">
            © 2026
          </div>
          <div className="font-mono text-sm font-bold text-ink/80 flex items-center gap-2">
            <span>Scroll to meet Yameen</span>
            <svg className="w-3.5 h-3.5 animate-bounce text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
);

Hero.displayName = 'Hero';
export default Hero;
