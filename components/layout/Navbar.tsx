'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';
import Link from 'next/link';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('about');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Monitor active section & page theme via scroll position (fully deterministic and resolves tall section bugs)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = document.querySelectorAll('section[id]');
      let currentActive = 'about';
      let currentTheme: 'light' | 'dark' = 'light';

      const viewportCenter = window.scrollY + window.innerHeight * 0.45; // 45% down the viewport

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        const absoluteBottom = rect.bottom + window.scrollY;

        if (viewportCenter >= absoluteTop && viewportCenter <= absoluteBottom) {
          const id = sec.getAttribute('id');
          if (id) {
            if (id === 'about-story') {
              const scrollRange = rect.height - window.innerHeight;
              const relativeScroll = window.scrollY - absoluteTop;
              if (relativeScroll < scrollRange * 0.45) {
                currentActive = '';
              } else {
                currentActive = 'about';
              }
            } else {
              currentActive = id;
            }
            const themeAttr = sec.getAttribute('data-nav-theme');
            if (themeAttr === 'light' || themeAttr === 'dark') {
              currentTheme = themeAttr;
            }
          }
        }
      });

      setActiveSection(currentActive);
      setTheme(currentTheme);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on mount to establish correct initial themes
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Support closing mobile overlay with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header
        className="fixed left-0 right-0 w-full z-[100] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          top: scrolled ? 'calc(var(--nav-offset) / 2)' : 'var(--nav-offset)',
        }}
      >
        <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-12 flex justify-between items-center">
          {/* Logo / Wordmark with custom YM badge */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 group relative select-none",
              theme === 'dark' ? "text-cream" : "text-ink"
            )}
          >
            {/* Theme-aware minimalistic YM Badge */}
            <div
              data-loader-logo-target
              className={cn(
                "relative w-8 h-8 flex items-center justify-center rounded-sm font-sans text-xs tracking-tighter overflow-hidden transition-all duration-500 ease-out group-hover:rotate-[360deg]",
                theme === 'dark'
                  ? "bg-cream text-ink"
                  : "bg-ink text-paper"
              )}
            >
              {/* Text YM */}
              <span
                className={cn(
                  "relative z-10 font-black transition-colors duration-300",
                  theme === 'dark'
                    ? "text-ink group-hover:text-cream"
                    : "text-paper group-hover:text-ink"
                )}
              >
                YM
              </span>

              {/* Sliding hover block overlay */}
              <div
                className={cn(
                  "absolute inset-0 transition-transform duration-300 ease-out group-hover:translate-y-0 translate-y-full bg-clay"
                )}
              />
            </div>

            {/* Brand Wordmark Text */}
            <div className="flex items-center gap-1">
              <span className="font-serif font-medium text-[1.35rem] sm:text-2xl lg:text-3xl tracking-tight transition-transform duration-300 group-hover:translate-x-0.5 whitespace-nowrap">
                Yameen Munir
              </span>
              <span
                className={cn(
                  "inline-block w-1.5 h-1.5 rounded-full ml-0.5 transition-all duration-300 group-hover:scale-150",
                  theme === 'dark'
                    ? "bg-clay group-hover:bg-cream"
                    : "bg-clay group-hover:bg-forest"
                )}
              />
            </div>
          </Link>

          {/* Floating Desktop Navigation Panel */}
          <nav
            aria-label="Desktop Navigation"
            className={cn(
              "hidden lg:flex items-center gap-4 xl:gap-8 pl-5 xl:pl-8 pr-2 py-2 rounded-2xl border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              theme === 'dark'
                ? scrolled
                  ? "bg-forest/90 border-line-light/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                  : "bg-forest-glass border-line-light shadow-[0_4px_24px_rgba(28,40,34,0.1)]"
                : scrolled
                  ? "bg-paper/90 border-line-dark/20 shadow-[0_8px_32px_rgba(27,27,24,0.08)]"
                  : "bg-paper-glass border-line-dark shadow-[0_4px_24px_rgba(27,27,24,0.02)]"
            )}
          >
            <div className="flex items-center gap-3 xl:gap-6">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className="relative py-1 group font-sans font-medium text-sm tracking-wide"
                  >
                    <span
                      className={cn(
                        "transition-colors duration-500 block",
                        theme === 'dark'
                          ? isActive
                            ? "text-cream font-semibold"
                            : "text-taupe/60 hover:text-cream"
                          : isActive
                            ? "text-ink font-semibold"
                            : "text-stone hover:text-ink"
                      )}
                    >
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 w-full h-[2px] bg-clay origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </a>
                );
              })}
            </div>

            {/* Strongly contrasting Contact CTA */}
            <a
              href="#contact"
              className={cn(
                "group flex items-center gap-2.5 px-4 xl:px-5 py-2.5 rounded-xl font-sans font-medium text-sm transition-all duration-300 active:scale-95",
                theme === 'dark'
                  ? "bg-cream text-forest hover:bg-clay hover:text-ink"
                  : "bg-forest text-cream hover:bg-clay hover:text-ink"
              )}
            >
              <span>Let’s talk</span>
              <span
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300",
                  theme === 'dark'
                    ? "bg-forest/10 text-forest group-hover:bg-ink/10"
                    : "bg-cream/10 text-cream group-hover:bg-ink/10"
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-3 h-3 transform transition-transform duration-300 group-hover:rotate-45"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </span>
            </a>
          </nav>

          {/* Compact Mobile Menu Trigger Button */}
          <button
  type="button"
  onClick={() => setMobileOpen((open) => !open)}
  aria-expanded={mobileOpen}
  aria-controls="mobile-navigation-panel"
  aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={cn(
              "flex lg:hidden items-center gap-2.5 px-3.5 sm:px-4 py-2 border rounded-full font-sans font-medium text-sm transition-all duration-300 z-50 select-none",
              theme === 'dark' && !mobileOpen
                ? "bg-forest border-line-light text-cream hover:bg-forest/80"
                : "bg-paper border-line-dark text-ink hover:bg-cream"
            )}
          >
            <span>{mobileOpen ? 'Close' : 'Menu'}</span>
            <span className="relative w-3.5 h-3 flex items-center justify-center">
              <span
                className={cn(
                  "absolute w-3.5 h-[1.5px] bg-current transition-transform duration-300",
                  mobileOpen ? "rotate-45" : "translate-y-[-2px]"
                )}
              />
              <span
                className={cn(
                  "absolute w-3.5 h-[1.5px] bg-current transition-transform duration-300",
                  mobileOpen ? "-rotate-45" : "translate-y-[2px]"
                )}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen Warm Paper Mobile Navigation Overlay */}
     {/* Floating Mobile Navigation */}
<div
  aria-hidden={!mobileOpen}
  onClick={() => setMobileOpen(false)}
  className={cn(
    "fixed inset-0 z-[90] lg:hidden transition-[opacity,visibility] duration-300",
    mobileOpen
      ? "visible opacity-100 pointer-events-auto"
      : "invisible opacity-0 pointer-events-none"
  )}
>
  {/* Clickable backdrop */}
  <div
    className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
    aria-hidden="true"
  />

  {/* Floating editorial menu panel */}
  <div
    id="mobile-navigation-panel"
    role="dialog"
    aria-modal="true"
    aria-label="Mobile navigation"
    onClick={(event) => event.stopPropagation()}
    className={cn(
      "absolute left-3 right-3 sm:left-auto sm:right-4 sm:w-[420px]",
      "overflow-y-auto no-scrollbar",
      "rounded-[24px] border border-line-dark/80",
      "bg-paper/95 backdrop-blur-xl",
      "px-5 sm:px-6 pt-5",
      "shadow-[0_24px_80px_rgba(27,27,24,0.22)]",
      "transition-[transform,opacity] duration-500",
      "ease-[cubic-bezier(0.22,1,0.36,1)]",
      mobileOpen
        ? "translate-y-0 scale-100 opacity-100"
        : "-translate-y-4 scale-[0.98] opacity-0"
    )}
    style={{
      top: 'calc(var(--nav-offset) + var(--nav-height) + 10px)',
      maxHeight:
        'calc(100svh - var(--nav-offset) - var(--nav-height) - 22px)',
      paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
    }}
  >
    {/* Menu metadata */}


    <nav
      aria-label="Mobile Navigation"
      className="flex flex-col  gap-0.5 sm:gap-1"
    >
      {NAV_ITEMS.concat({
        label: 'Contact',
        href: '#contact',
        id: 'contact',
      }).map((item, idx) => {
        const isActive = activeSection === item.id;

        return (
          <a
            key={item.id}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "group flex items-center justify-between",
              "border-b border-line-dark/70 last:border-b-0",
              "py-3.5 sm:py-4",
              "transition-[color,transform,opacity] duration-500",
              mobileOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            )}
            style={{
              transitionDelay: mobileOpen
                ? `${80 + idx * 45}ms`
                : '0ms',
            }}
          >
            <div className="flex items-baseline gap-3 sm:gap-4">
              <span
                className={cn(
                  "w-5 font-mono text-[10px] font-bold",
                  isActive ? "text-clay" : "text-stone"
                )}
              >
                0{idx + 1}
              </span>

           <span
  className={cn(
    "font-sans font-semibold",
    "text-[clamp(1.8rem,7.2vw,2.4rem)]",
    "leading-none tracking-[-0.04em]",
    "transition-colors duration-300",
    isActive
      ? "text-clay"
      : "text-ink group-hover:text-clay"
  )}
>
  {item.label}
</span>
            </div>

            <span
              aria-hidden="true"
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center",
                "rounded-full border transition-all duration-300",
                isActive
                  ? "border-clay bg-clay text-paper"
                  : "border-line-dark text-ink group-hover:border-clay group-hover:text-clay"
              )}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </a>
        );
      })}
    </nav>

    {/* Compact menu footer */}
    <div
      className={cn(
        "mt-4 grid grid-cols-1 min-[380px]:grid-cols-2 gap-4",
        "border-t border-line-dark pt-4",
        "transition-opacity duration-500",
        mobileOpen ? "opacity-100" : "opacity-0"
      )}
      style={{ transitionDelay: mobileOpen ? '320ms' : '0ms' }}
    >
      <div className="min-w-0">
        <span className="mb-1 block font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-stone">
          Email
        </span>

        <a
          href="mailto:yameenmunir05@gmail.com"
          className="block truncate font-serif text-base text-ink transition-colors hover:text-clay"
        >
          yameenmunir05@gmail.com
        </a>
      </div>

      <div>
        <span className="mb-1 block font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-stone">
          Based in
        </span>

        <span className="font-serif text-base text-ink">
          London, UK · Remote
        </span>
      </div>
    </div>
  </div>
</div>
    </>
  );
}
