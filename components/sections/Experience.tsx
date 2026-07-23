"use client";

import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsapPlugins } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FreelanceProject {
  name: string;
  desc: string;
}

interface CareerItem {
  year: string;
  company: string;
  role: string;
  dates: string;
  org: string;
  description: string;
  tech: string[];
}

export default function Experience() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CareerItem | null>(null);
  const reducedMotion = useReducedMotion();

  // Structured experience data
  const featuredExperience = {
    dates: "DEC 2025 — PRESENT",
    role: "Freelance Web Developer",
    org: "Freelance · London, UK · Remote",
    summary:
      "Delivering end-to-end websites and digital systems for local businesses.",
  };

  const featuredProjects: FreelanceProject[] = [
    { name: "MKP London", desc: "AI systems · Pricing automation · SEO" },
    {
      name: "Infinitum Education",
      desc: "WordPress · Higher education · Content",
    },
    {
      name: "Gup Shup Chit Chat Chai",
      desc: "React · Node.js · Toast ecosystem",
    },
  ];

  const leftIndex: CareerItem[] = [
    {
      year: "2025",
      company: "Host Family Stay",
      role: "Full-Stack Software Engineer",
      dates: "Oct 2025 – Dec 2025",
      org: "Host Family Stay · Part-time",
      description:
        "Built responsive, accessible interfaces in React and Tailwind, cutting page load times by ~20%. Integrated a Supabase / PostgreSQL backend, optimised queries and implemented secure authentication. Translated stakeholder requirements into delivered features following clean, modular code and Git workflows.",
      tech: [
        "React",
        "Tailwind CSS",
        "Supabase",
        "PostgreSQL",
        "REST APIs",
        "WCAG",
        "Git",
      ],
    },
    {
      year: "2025",
      company: "Mako Trading",
      role: "Insight Day Participant",
      dates: "Sep 2025",
      org: "Mako Trading — Aleto Foundation Partnership",
      description:
        "Immersive insight day at MAKO Trading’s London office exploring the intersection of finance and technology — trading simulations, career sessions and networking, with insight into fintech software development and graduate pathways.",
      tech: [
        "Financial Technology",
        "Trading Systems",
        "Data-Driven Solutions",
        "Networking",
      ],
    },
    {
      year: "2025",
      company: "London South Bank University",
      role: "Student Researcher",
      dates: "Jul 2025 – Sep 2025",
      org: "London South Bank University",
      description:
        "Analysed the LRS2 (Lip Reading Sentences 2) dataset, focusing on multimodal speech/visual alignment. Evaluated dataset structure, metadata and annotation formats for reproducible ML workflows, and designed an Entity-Relationship Diagram modelling audio, video and transcript entities.",
      tech: ["Python", "Data Science", "Statistical Analysis", "Research"],
    },
    {
      year: "Jul 2025",
      company: "IEUK — Bright Network",
      role: "Technology & Engineering Virtual Intern",
      dates: "Jul 2025",
      org: "IEUK — Bright Network",
      description:
        "Structured virtual internship developing technical and employability skills. Workshops led by Google, Cisco, JLR and Lloyds on AI applications, project management and problem-solving; completed a sector skills project simulating real industry challenges and presented solutions for feedback.",
      tech: [
        "Problem Solving",
        "AI Literacy",
        "Project Management",
        "Technical Communication",
      ],
    },
  ];

  const rightIndex: CareerItem[] = [
    {
      year: "2024–2026",
      company: "London SouthHack",
      role: "Welfare Committee",
      dates: "Nov 2024 – Jun 2026",
      org: "London SouthHack",
      description:
        "Managed SouthHack’s official Discord server and community guidelines, coordinated pre-event planning and logistics, and provided on-the-ground support during hackathons and tech meetups to ensure successful delivery.",
      tech: [
        "Event Coordination",
        "Community Management",
        "Team Collaboration",
      ],
    },
    {
      year: "2024",
      company: "Microsoft Embrace Program",
      role: "Mentee",
      dates: "Oct 2024 – Dec 2024",
      org: "Microsoft",
      description:
        "Workshops led by Microsoft professionals on AI, machine learning and cybersecurity; mentorship on personal development and career navigation; explored responsible-AI practices through case studies and group discussion.",
      tech: [
        "Career Development",
        "Ethical AI",
        "Networking",
        "Industry Awareness",
      ],
    },
    {
      year: "2024–2026",
      company: "London South Bank University",
      role: "CSI Ambassador",
      dates: "Jul 2024 – May 2026",
      org: "London South Bank University",
      description:
        "Developed coding workshops and led career fairs to foster computer-science interest among students, reaching 100+ participants.",
      tech: [
        "Workshop Development",
        "Public Speaking",
        "Mentoring",
        "Community Outreach",
      ],
    },
    {
      year: "2020–Present",
      company: "Youshiko LTD",
      role: "Customer Service Specialist",
      dates: "Jan 2020 – Present",
      org: "Youshiko LTD",
      description:
        "Resolve 200+ monthly inquiries and improved retention ~15% through data-informed service. Clean and manage daily customer datasets across Amazon, eBay and Shopify with Python and Excel, build predictive models with Pandas and scikit-learn, and present Power BI dashboards to guide strategy.",
      tech: [
        "Data Analysis",
        "Customer Service",
        "Power BI",
        "Python",
        "Statistics",
      ],
    },
  ];

  useEffect(() => {
    setMounted(true);
    registerGsapPlugins();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useLayoutEffect(() => {
    if (!mounted || reducedMotion) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // Mobile: a simplified pinned document sequence that keeps the
      // layered-paper character without forcing the desktop 3D geometry
      // into a narrow viewport.
      mm.add("(max-width: 767px)", () => {
        // Mobile still uses the same three real DOM documents, but now
        // each one begins at a different depth and physical angle. This is
        // the important part that makes the sequence feel spatial rather
        // than like flat cards sliding vertically.
        gsap.set(".mobile-plane-01", {
          yPercent: -1,
          rotateX: 7,
          rotateY: -2.6,
          rotateZ: -1.35,
          z: 0,
          scale: 0.975,
          transformPerspective: 950,
          transformOrigin: "50% 18%",
          transformStyle: "preserve-3d",
          force3D: true,
        });

        gsap.set(".mobile-plane-02", {
          yPercent: 116,
          rotateX: 27,
          rotateY: 6,
          rotateZ: 1.8,
          z: -260,
          scale: 0.91,
          transformPerspective: 950,
          transformOrigin: "50% 0%",
          transformStyle: "preserve-3d",
          force3D: true,
        });

        gsap.set(".mobile-plane-03", {
          yPercent: 150,
          rotateX: 31,
          rotateY: -6,
          rotateZ: -1.5,
          z: -420,
          scale: 0.88,
          transformPerspective: 950,
          transformOrigin: "50% 0%",
          transformStyle: "preserve-3d",
          force3D: true,
        });

        gsap.set(".mobile-reveal-01", { y: 22, opacity: 0 });
        gsap.set(".mobile-reveal-02", { y: 20, opacity: 0 });
        gsap.set(".mobile-reveal-03", { y: 18, opacity: 0 });

        const mobileTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.05,
            invalidateOnRefresh: true,
            onToggle: (self) => {
              const planes = document.querySelectorAll(
                ".mobile-plane-01, .mobile-plane-02, .mobile-plane-03",
              );

              planes.forEach((plane) => {
                plane.classList.toggle("will-change-transform", self.isActive);
              });
            },
          },
        });

        mobileTimeline.set(
          wrapperRef.current,
          { attr: { "data-nav-theme": "dark" } },
          0,
        );

        // MOBILE TIMING MAP
        // The earlier sequence started moving the sage sheet away while its
        // staggered content was still revealing, and the final index began
        // panning before all rows had entered. This longer rhythm gives each
        // document a proper reveal, readable hold and then a separate exit.

        mobileTimeline.to(
          ".mobile-plane-01",
          {
            yPercent: -2.5,
            rotateX: 4.5,
            rotateY: -1.1,
            rotateZ: -0.65,
            z: 38,
            scale: 0.995,
            duration: 0.18,
            ease: "sine.out",
          },
          0,
        );

        mobileTimeline.to(
          ".mobile-reveal-01",
          {
            y: 0,
            opacity: 1,
            stagger: 0.04,
            duration: 0.12,
            ease: "power2.out",
          },
          0.04,
        );

        // Quiet cover hold before the next document enters.
        mobileTimeline.to(
          ".mobile-plane-01",
          {
            yPercent: -3,
            rotateX: 4.2,
            rotateY: -0.9,
            rotateZ: -0.55,
            duration: 0.14,
            ease: "none",
          },
          0.28,
        );

        // Sage client-work document rises only after the cover is fully read.
        mobileTimeline.to(
          ".mobile-plane-01",
          {
            yPercent: -98,
            rotateX: -8,
            rotateY: 2.6,
            rotateZ: 0.8,
            z: -220,
            scale: 0.9,
            opacity: 0.72,
            duration: 0.28,
            ease: "sine.inOut",
          },
          0.42,
        );

        mobileTimeline.to(
          ".mobile-plane-02",
          {
            yPercent: 1,
            rotateX: 5.8,
            rotateY: 0.9,
            rotateZ: -0.4,
            z: 30,
            scale: 0.995,
            duration: 0.28,
            ease: "sine.inOut",
          },
          0.41,
        );

        mobileTimeline.set(
          wrapperRef.current,
          { attr: { "data-nav-theme": "light" } },
          0.54,
        );

        mobileTimeline.to(
          ".mobile-reveal-02",
          {
            y: 0,
            opacity: 1,
            stagger: 0.025,
            duration: 0.1,
            ease: "power2.out",
          },
          0.57,
        );

        // Deliberate reading hold for the freelance role and all three projects.
        mobileTimeline.to(
          ".mobile-plane-02",
          {
            yPercent: 0,
            rotateX: 4.8,
            rotateY: 0.5,
            rotateZ: -0.2,
            z: 38,
            duration: 0.24,
            ease: "none",
          },
          0.82,
        );

        // Cream career index takes over after the sage copy has fully settled.
        mobileTimeline.to(
          ".mobile-plane-02",
          {
            yPercent: -74,
            rotateX: -7,
            rotateY: -2,
            rotateZ: -0.75,
            z: -240,
            scale: 0.89,
            opacity: 0.58,
            duration: 0.28,
            ease: "sine.inOut",
          },
          1.08,
        );

        mobileTimeline.to(
          ".mobile-plane-03",
          {
            yPercent: 1,
            rotateX: 5.5,
            rotateY: -0.6,
            rotateZ: 0.2,
            z: 34,
            scale: 0.995,
            duration: 0.28,
            ease: "sine.inOut",
          },
          1.07,
        );

        // The shorter stagger guarantees that every index row is visible
        // before the controlled upward pan begins.
        mobileTimeline.to(
          ".mobile-reveal-03",
          {
            y: 0,
            opacity: 1,
            stagger: 0.014,
            duration: 0.08,
            ease: "power2.out",
          },
          1.18,
        );

        // Final-sheet reading hold.
        mobileTimeline.to(
          ".mobile-plane-03",
          {
            yPercent: 0,
            rotateX: 4.4,
            rotateY: 0,
            rotateZ: 0,
            z: 40,
            duration: 0.2,
            ease: "none",
          },
          1.42,
        );

        // Controlled pan reveals the lower entries without edge distortion.
        mobileTimeline.to(
          ".mobile-plane-03",
          {
            y: "-32svh",
            rotateX: 3.4,
            rotateY: 0,
            rotateZ: 0,
            z: 42,
            duration: 0.3,
            ease: "none",
          },
          1.66,
        );
      });

      // Desktop & Tablet (min-width: 768px)
      mm.add("(min-width: 768px)", () => {
        // Initial setup for the 3D planes
        gsap.set(".plane-01", {
          yPercent: 0,
          rotateX: 14,
          rotateY: 8,
          rotateZ: -8,
          transformPerspective: 1800,
        });

        gsap.set(".plane-02", {
          yPercent: 115,
          rotateX: 22,
          rotateY: 10,
          rotateZ: -8,
          transformPerspective: 1800,
        });

        gsap.set(".plane-03", {
          yPercent: 155,
          rotateX: 28,
          rotateY: -8,
          rotateZ: -8,
          transformPerspective: 1800,
        });

        // Setup hidden reveal elements
        gsap.set(".reveal-item-01", { y: 24, opacity: 0 });
        gsap.set(".reveal-item-02", { y: 20, opacity: 0 });
        gsap.set(".reveal-item-03", { y: 20, opacity: 0 });

        // Master Timeline with ScrollTrigger scrub over ~360vh scroll height
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            invalidateOnRefresh: true,
            onToggle: (self) => {
              const planes = document.querySelectorAll(
                ".plane-01, .plane-02, .plane-03",
              );
              planes.forEach((p) => {
                if (self.isActive) {
                  p.classList.add("will-change-transform");
                } else {
                  p.classList.remove("will-change-transform");
                }
              });
            },
          },
        });

        // Labels
        tl.add("intro", 0);
        tl.add("darkHold", 0.15);
        tl.add("sageEnter", 0.3);
        tl.add("sageHold", 0.5);
        tl.add("creamEnter", 0.66);
        tl.add("creamHold", 0.86);

        // 0.00–0.30: Dark plane enters/settles and holds
        tl.set(wrapperRef.current, { attr: { "data-nav-theme": "dark" } }, 0);
        tl.to(
          ".plane-01",
          {
            yPercent: -3,
            rotateX: 13,
            rotateY: 7.5,
            duration: 0.15,
            ease: "sine.out",
          },
          0,
        );

        tl.to(
          ".reveal-item-01",
          { y: 0, opacity: 1, duration: 0.12, ease: "power2.out" },
          0.08,
        );

        // Dark Hold
        tl.to(
          ".plane-01",
          {
            yPercent: -4,
            rotateX: 12.8,
            rotateY: 7.4,
            duration: 0.15,
            ease: "none",
          },
          0.15,
        );

        // 0.30–0.50: Sage plane enters, Forest plane translates up
        tl.to(
          ".plane-01",
          {
            yPercent: -80,
            rotateX: 6,
            rotateY: 4,
            ease: "sine.inOut",
            duration: 0.2,
          },
          0.3,
        );

        tl.to(
          ".plane-01-heading-wrap",
          {
            y: 60,
            ease: "none",
            duration: 0.2,
          },
          0.3,
        );

        tl.fromTo(
          ".plane-02",
          { yPercent: 115, rotateX: 22, rotateY: 10, rotateZ: -8 },
          {
            yPercent: 0,
            rotateX: 8,
            rotateY: 4,
            rotateZ: -8,
            ease: "sine.inOut",
            duration: 0.2,
          },
          0.3,
        );

        // Toggle navbar theme
        tl.set(
          wrapperRef.current,
          { attr: { "data-nav-theme": "light" } },
          0.38,
        );

        // Stagger reveal Sage text inside sageEnter
        tl.to(
          ".reveal-item-02",
          {
            y: 0,
            opacity: 1,
            stagger: 0.04,
            ease: "power2.out",
            duration: 0.1,
          },
          0.36,
        );

        // 0.50–0.66: Sage readable hold (stationary to allow reading)
        tl.to(
          ".plane-02",
          {
            yPercent: -1,
            rotateX: 7.8,
            rotateY: 3.9,
            duration: 0.16,
            ease: "none",
          },
          0.5,
        );

        // 0.66–0.86: Cream plane enters and unfolds
        tl.to(
          ".plane-02",
          {
            yPercent: -18,
            scale: 0.985,
            opacity: 0.85,
            ease: "sine.inOut",
            duration: 0.2,
          },
          0.66,
        );

        tl.fromTo(
          ".plane-03",
          { yPercent: 155, rotateX: 28, rotateY: -8, rotateZ: -8 },
          {
            yPercent: -18,
            rotateX: 12,
            rotateY: -2,
            rotateZ: -8,
            ease: "sine.inOut",
            duration: 0.2,
          },
          0.66,
        );

        // Stagger reveal Cream text
        tl.to(
          ".reveal-item-03",
          {
            y: 0,
            opacity: 1,
            stagger: 0.03,
            ease: "power2.out",
            duration: 0.12,
          },
          0.72,
        );

        // 0.86–1.00: Cream readable hold (slow pan from yPercent -18 to -28 to reveal lower rows)
        tl.to(
          ".plane-03",
          {
            yPercent: -28,
            rotateX: 10,
            rotateY: -1.5,
            duration: 0.14,
            ease: "none",
          },
          0.86,
        );
      });
    }, wrapperRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [mounted, reducedMotion]);

  return (
    <section
      id="experience"
      ref={wrapperRef}
      className={`relative w-full ${reducedMotion ? "h-auto py-16 bg-[#F5F1E8]" : "h-[420svh] md:h-[360vh] bg-transparent"}`}
      data-nav-theme="dark"
      style={
        reducedMotion
          ? {
              background:
                "radial-gradient(circle at 50% 50%, #FAF6EE 0%, #F4F0E6 70%, #E8E2D5 100%)",
            }
          : undefined
      }
    >
      {/* MOBILE INTERACTIVE DOCUMENT STAGE */}
      {!reducedMotion && mounted && (
        <div
          className="md:hidden sticky top-0 h-[100svh] w-full overflow-hidden select-none"
          style={{
            background:
              "radial-gradient(circle at 50% 38%, #FBF8F1 0%, #F4F0E6 58%, #DDD6C9 100%)",
            perspective: "950px",
            perspectiveOrigin: "50% 40%",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Subtle mobile cyclorama: a light pool and receding floor give
              the document edges something spatial to sit against. */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute left-1/2 top-[12%] h-[58%] w-[118%] -translate-x-1/2 rounded-[50%] bg-white/45 blur-3xl" />
            <div
              className="absolute inset-x-[-22%] bottom-[-31%] h-[58%] opacity-45"
              style={{
                transform: "perspective(720px) rotateX(67deg)",
                transformOrigin: "50% 0%",
                background:
                  "linear-gradient(to bottom, rgba(196,124,90,0.08), rgba(28,40,34,0.12) 68%, rgba(28,40,34,0.2))",
              }}
            />
            <div className="absolute inset-x-[8%] top-[49%] h-px bg-ink/8" />
          </div>

          {/* Mobile cover */}
          <article
            className="mobile-plane-01 absolute inset-[12px] z-10 overflow-hidden bg-[#1C2822] text-[#F5F1E8] shadow-[0_24px_70px_rgba(16,24,19,0.28)]"
            style={{
              clipPath:
                "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              willChange: "transform, opacity",
            }}
          >
            <div className="pointer-events-none absolute inset-y-3 right-0 w-[5px] bg-gradient-to-l from-black/25 to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute bottom-0 left-4 right-2 h-[7px] bg-gradient-to-t from-black/25 to-transparent" aria-hidden="true" />

            <div className="flex h-full flex-col justify-center px-7 pb-10 pt-[calc(var(--nav-height)+var(--nav-offset)+38px)]">
              <span className="mobile-reveal-01 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#C47C5A]">
                03 — EXPERIENCE
              </span>

              <h2 className="mobile-reveal-01 mt-3 max-w-[300px] font-sans text-[clamp(2.65rem,12.5vw,4.2rem)] font-black uppercase leading-[0.88] tracking-[-0.06em] text-cream">
                A working <span className="text-[#C47C5A]">track record</span>
              </h2>

              <div className="mobile-reveal-01 mt-5 flex items-center gap-2 font-mono text-[10px] font-bold text-[#C47C5A]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C47C5A]" />
                2020 — PRESENT
              </div>

              <p className="mobile-reveal-01 mt-auto max-w-[260px] font-sans text-[12px] leading-[1.55] text-cream/72">
                Freelance builds, research, technical roles and community work —
                arranged as one continuous record.
              </p>
            </div>
          </article>

          {/* Mobile featured freelance sheet */}
          <article
            className="mobile-plane-02 absolute left-3 right-3 top-[calc(var(--nav-height)+var(--nav-offset)+18px)] z-20 min-h-[calc(100svh-var(--nav-height)-var(--nav-offset)-32px)] overflow-hidden bg-[#C8CEC3] text-[#1B1B18] shadow-[0_24px_65px_rgba(28,40,34,0.24)]"
            style={{
              clipPath: "polygon(24px 0, 100% 0, 100% 100%, 0 100%, 0 24px)",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              willChange: "transform, opacity",
            }}
          >
            <div
              className="absolute left-0 top-0 h-6 w-6 bg-[#C47C5A]"
              style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-y-3 right-0 w-[5px] bg-gradient-to-l from-ink/20 to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute bottom-0 left-4 right-2 h-[7px] bg-gradient-to-t from-ink/20 to-transparent" aria-hidden="true" />

            <div className="flex min-h-[inherit] flex-col px-6 pb-7 pt-10">
              <div className="mobile-reveal-02 border-b border-ink/10 pb-4">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.09em] text-ink/68">
                  CLIENT WORK
                </span>
                <span className="mt-2 block font-mono text-[10.5px] font-semibold text-ink/72">
                  {featuredExperience.dates}
                </span>

                <h3 className="mt-2 font-sans text-[clamp(2rem,9vw,3rem)] font-black uppercase leading-[0.9] tracking-[-0.055em] text-ink">
                  Freelance{" "}
                  <span className="relative inline-block">
                    Web Developer
                    <span className="absolute bottom-[-3px] left-0 h-[2px] w-[58%] bg-[#C47C5A]" />
                  </span>
                </h3>

                <span className="mt-3 block font-sans text-[12px] font-semibold text-ink/74">
                  {featuredExperience.org}
                </span>
              </div>

              <p className="mobile-reveal-02 mt-5 max-w-[300px] font-sans text-[13px] leading-[1.5] text-ink/75">
                {featuredExperience.summary}
              </p>

              <div className="mt-auto border-t border-ink/12 pt-4">
                {featuredProjects.map((project, index) => (
                  <div
                    key={project.name}
                    className="mobile-reveal-02 grid grid-cols-[24px_1fr] gap-3 border-b border-ink/10 py-3 last:border-b-0"
                  >
                    <span className="font-mono text-[9px] font-bold text-[#C47C5A]">
                      0{index + 1}
                    </span>
                    <div>
                      <h4 className="font-sans text-[13px] font-black uppercase tracking-[-0.025em] text-ink">
                        {project.name}
                      </h4>
                      <p className="mt-0.5 font-sans text-[11px] leading-relaxed text-ink/68">
                        {project.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Mobile career index sheet */}
          <article
            className="mobile-plane-03 absolute left-[14px] right-[14px] top-[calc(var(--nav-height)+var(--nav-offset)+10px)] z-30 min-h-[118svh] bg-[#F5F1E8] px-6 pb-8 pt-9 text-[#1B1B18] shadow-[0_26px_75px_rgba(27,27,24,0.2)]"
            style={{
              clipPath:
                "polygon(24px 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%, 0 24px)",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              willChange: "transform, opacity",
            }}
          >
            <div
              className="absolute left-0 top-0 h-6 w-6 bg-[#C47C5A]"
              style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
              aria-hidden="true"
            />
            <div
              className="absolute right-0 top-0 h-6 w-6 bg-[#C47C5A]"
              style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-y-4 right-0 w-[5px] bg-gradient-to-l from-ink/15 to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute bottom-0 left-4 right-2 h-[7px] bg-gradient-to-t from-ink/15 to-transparent" aria-hidden="true" />

            <div className="mobile-reveal-03 flex items-end justify-between border-b border-ink/10 pb-3">
              <div>
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-ink/65">
                  CAREER STAGE INDEX
                </span>
                <h3 className="mt-2 font-sans text-[1.5rem] font-black uppercase leading-[0.95] tracking-[-0.04em] text-ink">
                  Roles & research
                </h3>
              </div>
              <span className="shrink-0 pl-3 font-sans text-[9.5px] font-bold text-[#C47C5A]">
                08 RECORDS
              </span>
            </div>

            <div className="mt-2">
              {[...leftIndex, ...rightIndex].map((item, index) => (
                <button
                  type="button"
                  key={`${item.company}-${item.role}`}
                  onClick={() => setSelectedItem(item)}
                  className="mobile-reveal-03 group grid w-full grid-cols-[64px_minmax(0,1fr)_16px] items-center gap-2.5 border-b border-ink/10 py-3.5 text-left last:border-b-0"
                >
                <span className="min-w-0 font-sans text-[9px] min-[390px]:text-[9.5px] font-bold leading-[1.15] tracking-[0.01em] text-[#C47C5A] [overflow-wrap:anywhere]">
               {item.year}
               </span>

                  <span className="min-w-0">
                    <span className="block min-w-0 break-words font-sans text-[12px] min-[390px]:text-[12.5px] font-black uppercase leading-[1.08] tracking-[-0.02em] text-ink transition-colors group-hover:text-[#C47C5A] [overflow-wrap:anywhere]">
                      {item.company}
                    </span>
                    <span className="mt-1 block break-words pr-0.5 font-sans text-[10.5px] leading-[1.25] text-[#77776F] [overflow-wrap:anywhere]">
                      {item.role}
                    </span>
                  </span>

                  <span className="justify-self-end font-sans text-[12px] text-ink/35 transition-transform group-hover:translate-x-0.5 group-hover:text-[#C47C5A]">
                    →
                  </span>
                </button>
              ))}
            </div>
          </article>
        </div>
      )}

      {/* DESKTOP/TABLET INTERACTIVE 3D PERSPECTIVE STAGE */}
      {!reducedMotion && (
        <div
          ref={stageRef}
          className="hidden md:flex sticky top-0 w-full h-[100svh] overflow-hidden flex-col justify-start items-center z-10 select-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #FAF6EE 0%, #F4F0E6 70%, #E8E2D5 100%)",
            perspective: "1800px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* PLANE 01: DARK INTRODUCTION PLANE */}
          <article
            className="plane-01 absolute bg-[#1C2822] text-[#F5F1E8] transform-gpu z-10 flex flex-col justify-start shadow-lg"
            style={{
              width: "122vw",
              height: "clamp(48vh, 54vh, 58vh)",
              top: "-6vh",
              left: "-11vw",
              transformOrigin: "top center",
              boxSizing: "border-box",
              paddingTop: "calc(var(--nav-safe-top) + 2vh)",
              paddingLeft: "11vw",
              paddingRight: "11vw",
            }}
          >
            {/* Display Typography Content Wrapper */}
         <div
  className="
    plane-01-heading-wrap
    relative select-text
    md:pt-[clamp(30px,4.2svh,58px)]
    xl:pt-0
  "
  style={{
    width:
      "min(1180px, calc(100vw - 2 * var(--experience-inline-padding)))",
    margin: "0 auto",
  }}
>
              <div className="reveal-item-01">
                <h2
                  className="font-sans font-black text-cream uppercase"
                  style={{
                    fontSize: "clamp(5.5rem, 10vw, 11rem)",
                    lineHeight: "0.82",
                    letterSpacing: "-0.065em",
                  }}
                >
                  EXPERIENCE
                </h2>
              </div>
              <div className="reveal-item-01 mt-3">
                <h3
                  className="font-sans font-black text-cream tracking-tight uppercase"
                  style={{
                    fontSize: "clamp(2.3rem, 4.4vw, 5rem)",
                    lineHeight: "0.92",
                  }}
                >
                  A WORKING <span className="text-[#C47C5A]">TRACK RECORD</span>
                </h3>
              </div>
            </div>
          </article>

          {/* PLANE 02: SAGE FEATURED ROLE PLANE */}
          <article
            className="plane-02 absolute bg-[#C8CEC3] text-[#1B1B18] transform-gpu z-20 flex flex-col justify-start"
            style={{
              width: "104vw",
              height: "clamp(50vh, 58vh, 64vh)",
              top: "24vh",
              left: "-2vw",
              transformOrigin: "top center",
              clipPath: "polygon(32px 0, 100% 0, 100% 100%, 0 100%, 0 32px)",
              boxSizing: "border-box",
              paddingTop: "calc(var(--nav-safe-top) + 1vh)",
              paddingLeft: "5vw",
              paddingRight: "5vw",
              boxShadow:
                "0 15px 35px rgba(28, 40, 34, 0.22), 0 5px 15px rgba(28, 40, 34, 0.14)",
            }}
          >
            {/* Top-left Clay Fold Corner */}
            <div
              className="absolute top-0 left-0 w-8 h-8 bg-[#C47C5A] z-30 pointer-events-none"
              style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
              aria-hidden="true"
            />

            {/* Content Wrapper */}
            <div className="relative w-full flex flex-col justify-start select-text">
              {/* Sage featured role details */}
              <div className="flex flex-col gap-1">
                <span className="reveal-item-02 font-mono text-[9px] text-[#1B1B18]/70 tracking-widest uppercase">
                  CLIENT WORK
                </span>
                <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-6 mt-1">
                  <div>
                    <span className="reveal-item-02 font-mono text-[10px] md:text-xs text-[#1B1B18]/70 block font-semibold">
                      {featuredExperience.dates}
                    </span>
                    <h3
                      className="reveal-item-02 font-sans font-black text-[#1B1B18] uppercase tracking-tight mt-1"
                      style={{
                        fontSize: "clamp(3rem, 5.5vw, 6.3rem)",
                        lineHeight: "0.9",
                      }}
                    >
                      Freelance{" "}
                      <span className="relative inline-block">
                        Web Developer
                        <span className="absolute bottom-[-1px] left-0 w-[55%] h-[2.5px] bg-[#C47C5A]" />
                      </span>
                    </h3>
                    <span className="reveal-item-02 font-sans text-xs font-semibold text-[#1B1B18]/80 block mt-1.5">
                      {featuredExperience.org}
                    </span>
                  </div>
                  <p className="reveal-item-02 font-sans text-xs md:text-sm text-[#1B1B18]/85 leading-relaxed max-w-md">
                    {featuredExperience.summary}
                  </p>
                </div>
              </div>

              {/* 3 Projects horizontal row summaries */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 border-t border-ink/15 pt-4"
                style={{
                  marginTop: "clamp(28px, 4vh, 54px)",
                  paddingBottom: "clamp(48px, 6vh, 82px)",
                }}
              >
                {featuredProjects.map((project, i) => (
                  <div
                    key={i}
                    className="reveal-item-02 flex flex-col justify-between border-l border-ink/15 pl-6 first:border-l-0 first:pl-0"
                    style={{ opacity: 0.9 }}
                  >
                    <div className="flex flex-col gap-1">
                      <span
                        className="font-sans font-black text-ink uppercase tracking-tight"
                        style={{ fontSize: "clamp(1.15rem, 1.5vw, 1.8rem)" }}
                      >
                        {project.name}
                      </span>
                      <p className="font-sans text-[11px] md:text-[12px] text-[#1B1B18]/78 leading-relaxed">
                        {project.desc}
                      </p>
                      <hr className="border-t border-ink/10 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* PLANE 03: CREAM CAREER INDEX PLANE */}
          <article
            className="plane-03 absolute bg-[#F5F1E8] text-[#1B1B18] transform-gpu z-30 flex flex-col justify-start"
            style={{
              width: "104vw",
              height: "clamp(58vh, 66vh, 72vh)",
              top: "48vh",
              left: "-2vw",
              transformOrigin: "top center",
              clipPath:
                "polygon(32px 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 0 100%, 0 32px)",
              boxSizing: "border-box",
              paddingTop: "clamp(32px, 4.5vh, 56px)",
              paddingLeft: "5vw",
              paddingRight: "5vw",
              boxShadow:
                "0 -10px 30px rgba(0, 0, 0, 0.05), 0 25px 50px rgba(0, 0, 0, 0.16)",
            }}
          >
            {/* Left Fold Corner */}
            <div
              className="absolute top-0 left-0 w-8 h-8 bg-[#C47C5A] z-20 pointer-events-none"
              style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
              aria-hidden="true"
            />
            {/* Right Fold Corner */}
            <div
              className="absolute top-0 right-0 w-8 h-8 bg-[#C47C5A] z-20 pointer-events-none"
              style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
              aria-hidden="true"
            />

            {/* Content Wrapper */}
            <div className="relative w-full flex flex-col select-text">
              {/* Distributed Monospaced labels */}
              <div className="reveal-item-03 grid grid-cols-4 gap-4 border-b border-ink/10 pb-2 font-mono text-[10px] text-[#1B1B18]/78 uppercase tracking-widest relative">
                <span>CLIENT WORK</span>
                <span className="text-right pr-6">RESEARCH</span>
                <span className="pl-6">COMMUNITY</span>
                <span className="text-right">DATA</span>

                {/* Visual Indicator "2" */}
                <span className="absolute right-0 top-[-16px] font-mono text-[9px] text-[#1B1B18]/40 select-none">
                  2
                </span>
              </div>

              {/* Career index column grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  columnGap: "clamp(70px, 8vw, 150px)",
                  marginTop: "clamp(12px, 2vh, 24px)",
                  paddingBottom: "35px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: "repeat(4, minmax(0, 1fr))",
                    rowGap: "clamp(8px, 1.2vh, 16px)",
                  }}
                >
                  {leftIndex.map((item, i) => (
                    <div
                      key={i}
                      className="reveal-item-03 flex items-start gap-4 border-b border-ink/10 pb-1.5 last:border-0 cursor-pointer group hover:bg-ink/5 px-2 py-1 rounded-[2px] transition-all duration-300"
                      style={{
                        minHeight: "clamp(68px, 8.5vh, 96px)",
                      }}
                      onClick={() => setSelectedItem(item)}
                    >
                      <span className="w-16 shrink-0 font-mono text-[10px] text-[#C47C5A] font-semibold">
                        {item.year}
                      </span>
                      <div className="flex-1 flex justify-between items-center pr-2">
                        <div>
                          <h4
                            className="font-sans font-bold text-[#1B1B18] uppercase tracking-tight group-hover:text-[#C47C5A] transition-colors duration-300"
                            style={{
                              fontSize: "clamp(0.95rem, 1.25vw, 1.45rem)",
                            }}
                          >
                            {item.company}
                          </h4>
                          <p
                            className="font-sans text-stone mt-0.5"
                            style={{
                              fontSize: "clamp(0.9rem, 1.1vw, 1.22rem)",
                            }}
                          >
                            {item.role}
                          </p>
                        </div>
                        <span className="opacity-40 group-hover:opacity-100 group-hover:text-[#C47C5A] group-hover:translate-x-1 transition-all duration-300 font-mono text-xs text-[#1B1B18] ml-2 select-none">
                          →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: "repeat(4, minmax(0, 1fr))",
                    rowGap: "clamp(8px, 1.2vh, 16px)",
                  }}
                >
                  {rightIndex.map((item, i) => (
                    <div
                      key={i}
                      className="reveal-item-03 flex items-start gap-4 border-b border-ink/10 pb-1.5 last:border-0 cursor-pointer group hover:bg-ink/5 px-2 py-1 rounded-[2px] transition-all duration-300"
                      style={{
                        minHeight: "clamp(68px, 8.5vh, 96px)",
                      }}
                      onClick={() => setSelectedItem(item)}
                    >
                      <span className="w-20 shrink-0 font-mono text-[10px] text-[#C47C5A] font-semibold">
                        {item.year}
                      </span>
                      <div className="flex-1 flex justify-between items-center pr-2">
                        <div>
                          <h4
                            className="font-sans font-bold text-[#1B1B18] uppercase tracking-tight group-hover:text-[#C47C5A] transition-colors duration-300"
                            style={{
                              fontSize: "clamp(0.95rem, 1.25vw, 1.45rem)",
                            }}
                          >
                            {item.company}
                          </h4>
                          <p
                            className="font-sans text-stone mt-0.5"
                            style={{
                              fontSize: "clamp(0.9rem, 1.1vw, 1.22rem)",
                            }}
                          >
                            {item.role}
                          </p>
                        </div>
                        <span className="opacity-40 group-hover:opacity-100 group-hover:text-[#C47C5A] group-hover:translate-x-1 transition-all duration-300 font-mono text-xs text-[#1B1B18] ml-2 select-none">
                          →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      )}

      {/* STATIC MOBILE FALLBACK FOR REDUCED MOTION */}
      {reducedMotion && mounted && (
        <div className="md:hidden block w-full px-6 py-12 select-text bg-[#F5F1E8]">
          {/* Mobile Header Surface */}
          <article className="w-full bg-[#1C2822] text-[#F5F1E8] p-6 rounded-[2px] shadow-md border border-ink/20 transform-gpu rotate-[-1deg] mb-8 min-h-[90svh] flex flex-col justify-center">
            <span className="font-mono text-xs text-[#C47C5A] font-bold">
              EXPERIENCE
            </span>
            <h2
              className="font-sans font-black text-cream tracking-tighter uppercase mt-2 block"
              style={{
                fontSize: "clamp(2.2rem, 8vw, 3.5rem)",
                lineHeight: "0.85",
              }}
            >
              A WORKING <span className="text-[#C47C5A]">TRACK RECORD</span>
            </h2>
            <div className="font-mono text-[10px] text-[#C47C5A] mt-4 flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-clay shrink-0" />
              <span>2020 — PRESENT</span>
            </div>
          </article>

          {/* Mobile Sage Featured Role Surface */}
          <article className="w-full bg-[#C8CEC3] text-[#1B1B18] p-6 rounded-[2px] shadow-lg border-t border-ink/10 transform-gpu rotate-[1deg] mb-8 relative">
            <div
              className="absolute top-0 left-0 w-6 h-6 bg-[#C47C5A] z-20 pointer-events-none"
              style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
              aria-hidden="true"
            />
            <div className="border-t border-ink/10 pt-4 mt-2">
              <span className="font-mono text-[9px] text-[#1B1B18]/70 tracking-widest uppercase">
                CLIENT WORK
              </span>
              <span className="font-mono text-[10px] text-[#1B1B18]/70 block mt-2">
                {featuredExperience.dates}
              </span>
              <h3 className="font-sans font-black text-lg md:text-xl text-[#1B1B18] uppercase tracking-tight mt-1">
                Freelance{" "}
                <span className="relative inline-block">
                  Web Developer
                  <span className="absolute bottom-[-1px] left-0 w-[55%] h-[2px] bg-[#C47C5A]" />
                </span>
              </h3>
              <p className="font-sans text-xs text-[#1B1B18]/80 leading-relaxed mt-2">
                {featuredExperience.summary}
              </p>
            </div>

            {/* Mobile Project summaries list */}
            <div className="space-y-4 border-t border-ink/15 pt-4 mt-6">
              {featuredProjects.map((project, i) => (
                <div
                  key={i}
                  className="border-l border-[#C47C5A] pl-3 py-0.5 flex flex-col gap-1"
                >
                  <h4 className="font-sans font-black text-xs text-[#1B1B18] uppercase tracking-tight">
                    {project.name}
                  </h4>
                  <p className="font-sans text-[10px] text-[#1B1B18]/70">
                    {project.desc}
                  </p>
                </div>
              ))}
            </div>
          </article>

          {/* Mobile Cream Experience Index */}
          <article className="w-full bg-[#F5F1E8] text-[#1B1B18] p-6 rounded-[2px] shadow-lg border-t border-ink/10 transform-gpu rotate-[-1deg] relative">
            {/* Left Fold Corner */}
            <div
              className="absolute top-0 left-0 w-6 h-6 bg-[#C47C5A] z-20 pointer-events-none"
              style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
              aria-hidden="true"
            />
            {/* Right Fold Corner */}
            <div
              className="absolute top-0 right-0 w-6 h-6 bg-[#C47C5A] z-20 pointer-events-none"
              style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
              aria-hidden="true"
            />

            <div className="font-mono text-[9px] text-[#1B1B18]/70 uppercase tracking-widest border-b border-ink/10 pb-2 mb-4">
              CAREER STAGE INDEX
            </div>

            {/* Reusable Index list stacked in 1 column */}
            <div className="space-y-4">
              {[...leftIndex, ...rightIndex].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 border-b border-ink/10 pb-3 last:border-0 last:pb-0 cursor-pointer group rounded-[2px] hover:bg-ink/5 p-1 transition-all"
                  onClick={() => setSelectedItem(item)}
                >
                  <span className="w-20 shrink-0 font-mono text-[10px] text-[#C47C5A] font-semibold">
                    {item.year}
                  </span>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <h4 className="font-sans font-bold text-xs text-[#1B1B18] uppercase tracking-tight group-hover:text-[#C47C5A] transition-colors">
                        {item.company}
                      </h4>
                      <p className="font-sans text-[10px] text-stone mt-0.5">
                        {item.role}
                      </p>
                    </div>
                    <span className="opacity-40 group-hover:opacity-100 group-hover:text-[#C47C5A] group-hover:translate-x-1 transition-all duration-300 font-mono text-xs text-[#1B1B18] ml-2 select-none">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      )}

      {/* STATIC FINAL DESKTOP COMPOSITION FOR REDUCED MOTION */}
      {reducedMotion && mounted && (
        <div
          className="hidden md:flex w-full min-h-[100svh] overflow-hidden flex-col justify-start items-center relative py-20 px-8 select-text"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #FAF6EE 0%, #F4F0E6 70%, #E8E2D5 100%)",
            perspective: "1800px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* STATIC PLANE 01 */}
          <article
            className="plane-01 relative bg-[#1C2822] text-[#F5F1E8] p-10 md:p-14 overflow-hidden border-t border-b border-ink/20 transform-gpu z-10 flex flex-col justify-end shadow-lg"
            style={{
              width: "104vw",
              height: "40vh",
              transform: "rotateX(6deg) rotateY(4deg) rotateZ(-8deg)",
              transformOrigin: "top center",
            }}
          >
            <div
              className="flex flex-col justify-end pb-4 select-text"
              style={{
                width: "min(1180px, calc(100vw - 48px))",
                margin: "0 auto",
              }}
            >
              <h2
                className="font-sans font-black text-cream uppercase"
                style={{
                  fontSize: "clamp(3rem, 6vw, 7rem)",
                  lineHeight: "0.82",
                  letterSpacing: "-0.065em",
                }}
              >
                EXPERIENCE
              </h2>
              <h3
                className="font-sans font-black text-cream tracking-tight mt-2 leading-[0.9]"
                style={{ fontSize: "clamp(1.2rem, 2vw, 2.5rem)" }}
              >
                A WORKING <span className="text-[#C47C5A]">TRACK RECORD</span>
              </h3>
            </div>
          </article>

          {/* STATIC PLANE 02 */}
          <article
            className="plane-02 relative bg-[#C8CEC3] text-[#1B1B18] p-10 md:p-12 overflow-hidden plane-shadow-sage border-t border-ink/10 transform-gpu z-20 flex flex-col justify-between mt-[-10vh]"
            style={{
              width: "104vw",
              minHeight: "43vh",
              transform: "rotateX(8deg) rotateY(4deg) rotateZ(-8deg)",
              transformOrigin: "top center",
              clipPath: "polygon(32px 0, 100% 0, 100% 100%, 0 100%, 0 32px)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-8 h-8 bg-[#C47C5A] z-30 pointer-events-none"
              style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-2 border-t border-ink/10 pt-4 mt-2 px-[5vw]">
              <span className="font-mono text-[9px] text-[#1B1B18]/70 tracking-widest uppercase">
                CLIENT WORK
              </span>
              <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-6 mt-2">
                <div>
                  <span className="font-mono text-xs text-[#1B1B18]/70 block">
                    {featuredExperience.dates}
                  </span>
                  <h3
                    className="font-sans font-black text-[#1B1B18] uppercase tracking-tight leading-none mt-1"
                    style={{ fontSize: "clamp(1.5rem, 2.5vw, 3rem)" }}
                  >
                    Freelance{" "}
                    <span className="relative inline-block">
                      Web Developer
                      <span className="absolute bottom-[-2px] left-0 w-[55%] h-[2.5px] bg-[#C47C5A]" />
                    </span>
                  </h3>
                  <span className="font-sans text-xs font-semibold text-[#1B1B18]/80 block mt-2">
                    {featuredExperience.org}
                  </span>
                </div>
                <p className="font-sans text-xs md:text-sm text-[#1B1B18]/85 leading-relaxed max-w-md">
                  {featuredExperience.summary}
                </p>
              </div>
            </div>
            <div className="plane-02-projects grid grid-cols-3 gap-6 border-t border-ink/15 pt-5 mt-6 px-[5vw]">
              {featuredProjects.map((project, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between border-l border-ink/15 pl-6 first:border-l-0 first:pl-0"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] text-[#1B1B18]/70 block font-bold">
                      {project.name}
                    </span>
                    <p className="font-sans text-[10px] md:text-[11px] text-[#1B1B18]/70 leading-relaxed">
                      {project.desc}
                    </p>
                    <hr className="border-t border-ink/10 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* STATIC PLANE 03 */}
          <article
            className="plane-03 relative bg-[#F5F1E8] text-[#1B1B18] p-10 md:p-12 overflow-hidden plane-shadow-cream border-t border-ink/10 transform-gpu z-30 flex flex-col justify-start mt-[-10vh]"
            style={{
              width: "104vw",
              minHeight: "50vh",
              transform: "rotateX(12deg) rotateY(-2deg) rotateZ(-8deg)",
              transformOrigin: "top center",
              clipPath:
                "polygon(32px 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 0 100%, 0 32px)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-8 h-8 bg-[#C47C5A] z-20 pointer-events-none"
              style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
              aria-hidden="true"
            />
            <div
              className="absolute top-0 right-0 w-8 h-8 bg-[#C47C5A] z-20 pointer-events-none"
              style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
              aria-hidden="true"
            />
            <div className="plane-03-header-labels grid grid-cols-4 gap-4 border-b border-ink/10 pb-2 mb-6 font-mono text-[9px] text-[#1B1B18]/70 uppercase tracking-widest relative px-[5vw]">
              <span>CLIENT WORK</span>
              <span className="text-right pr-6">RESEARCH</span>
              <span className="pl-6">COMMUNITY</span>
              <span className="text-right">DATA</span>

              <span className="absolute right-[5vw] top-[-16px] font-mono text-[9px] text-[#1B1B18]/40 select-none">
                2
              </span>
            </div>
            <div className="grid grid-cols-2 gap-8 md:gap-12 px-[5vw]">
              <div className="space-y-4">
                {leftIndex.map((item, i) => (
                  <div
                    key={i}
                    className="career-index-row flex items-start gap-6 border-b border-ink/10 pb-3 last:border-0 last:pb-0 cursor-pointer group p-1 transition-all"
                    onClick={() => setSelectedItem(item)}
                  >
                    <span className="w-24 shrink-0 font-mono text-[10px] md:text-xs text-[#C47C5A] font-semibold">
                      {item.year}
                    </span>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <h4 className="font-sans font-bold text-xs md:text-sm text-[#1B1B18] uppercase tracking-tight group-hover:text-[#C47C5A] transition-colors">
                          {item.company}
                        </h4>
                        <p className="font-sans text-[11px] text-stone mt-0.5">
                          {item.role}
                        </p>
                      </div>
                      <span className="opacity-40 group-hover:opacity-100 group-hover:text-[#C47C5A] group-hover:translate-x-1 transition-all duration-300 font-mono text-xs text-[#1B1B18] ml-2 select-none">
                        →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {rightIndex.map((item, i) => (
                  <div
                    key={i}
                    className="career-index-row flex items-start gap-6 border-b border-ink/10 pb-3 last:border-0 last:pb-0 cursor-pointer group p-1 transition-all"
                    onClick={() => setSelectedItem(item)}
                  >
                    <span className="w-24 shrink-0 font-mono text-[10px] md:text-xs text-[#C47C5A] font-semibold">
                      {item.year}
                    </span>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <h4 className="font-sans font-bold text-xs md:text-sm text-[#1B1B18] uppercase tracking-tight group-hover:text-[#C47C5A] transition-colors">
                          {item.company}
                        </h4>
                        <p className="font-sans text-[11px] text-stone mt-0.5">
                          {item.role}
                        </p>
                      </div>
                      <span className="opacity-40 group-hover:opacity-100 group-hover:text-[#C47C5A] group-hover:translate-x-1 transition-all duration-300 font-mono text-xs text-[#1B1B18] ml-2 select-none">
                        →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      )}

      {/* DETAILED EXPERIENCE SIDE DRAWER */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-[#1B1B18]/30 backdrop-blur-[2px] z-[998] transition-opacity duration-300"
          onClick={() => setSelectedItem(null)}
        />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[480px] bg-[#F5F1E8] z-[999] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
          selectedItem ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          boxShadow:
            "-10px 0 30px rgba(0, 0, 0, 0.05), -20px 0 50px rgba(0, 0, 0, 0.12)",
        }}
      >
        {/* Sliced Top-Right Corner */}
        <div
          className="absolute top-0 right-0 w-8 h-8 bg-[#C47C5A] z-20 pointer-events-none"
          style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
          aria-hidden="true"
        />

        {/* Content Container */}
        {selectedItem && (
          <div
            className="w-full h-full flex flex-col justify-between p-8 sm:p-10 relative overflow-y-auto"
            style={{ paddingTop: "calc(var(--nav-safe-top) + 16px)" }}
          >
            {/* Header: Dates & Close */}
            <div className="flex justify-between items-center border-b border-ink/10 pb-4">
              <span className="font-mono text-[10px] text-[#C47C5A] uppercase tracking-widest font-semibold">
                {selectedItem.dates}
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="font-mono text-[10px] uppercase tracking-widest text-[#1B1B18]/60 hover:text-[#C47C5A] transition-colors cursor-pointer"
              >
                [ CLOSE ]
              </button>
            </div>

            {/* Main Content Body */}
            <div className="flex-1 flex flex-col justify-start py-8 gap-6">
              <div>
                <span className="font-mono text-[9px] text-[#1B1B18]/50 uppercase tracking-widest block mb-2 font-bold">
                  {selectedItem.org}
                </span>
                <h3
                  className="font-sans font-black text-[#1B1B18] uppercase tracking-tight leading-none"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}
                >
                  {selectedItem.role}
                </h3>
                <h4 className="font-serif italic text-lg text-[#C47C5A] mt-2 font-normal">
                  {selectedItem.company}
                </h4>
              </div>

              <div className="border-t border-b border-ink/5 py-6">
                <p className="font-sans text-xs md:text-sm text-[#1B1B18]/85 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              {/* Technologies / Skills list */}
              <div>
                <span className="font-mono text-[9px] text-[#1B1B18]/50 uppercase tracking-widest block mb-3 font-semibold">
                  COMPETENCIES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.tech.map((skill, index) => (
                    <span
                      key={index}
                      className="font-mono text-[9px] border border-ink/10 bg-ink/5 text-[#1B1B18]/85 rounded-[2px] px-2 py-0.5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}