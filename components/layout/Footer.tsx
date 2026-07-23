import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-forest text-taupe py-12 px-6 md:px-12 lg:px-24 border-t border-line-light relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-serif text-lg text-cream">Yameen Munir</div>
        <div className="font-mono text-xs opacity-60">
          © {new Date().getFullYear()} — Designed & Crafted from Scratch
        </div>
      </div>
    </footer>
  );
}
