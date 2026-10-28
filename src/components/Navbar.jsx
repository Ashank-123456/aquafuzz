"use client";

import { useState, useEffect, useRef } from "react";
import BrandLogo from "./BrandLogo";
import { Sliders, Beaker, GitBranch, Printer, ChevronDown } from "lucide-react";
import { PRESETS } from "@/lib/fuzzyEngine";

export default function Navbar({ onSelectPreset, onOpenReport, currentPresetId }) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const threshold = 8; // Scroll buffer to avoid jitter on trackpads

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // When near the top of page, always show navbar
      if (currentScrollY <= 40) {
        setHidden(false);
        setScrolled(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      setScrolled(true);

      const delta = currentScrollY - lastScrollY.current;

      // Scrolling DOWN past threshold -> smoothly hide navbar (slides up)
      if (delta > threshold) {
        setHidden(true);
        setPresetDropdownOpen(false);
        lastScrollY.current = currentScrollY;
      }
      // Scrolling UP past threshold -> smoothly reveal navbar (slides down)
      else if (delta < -threshold) {
        setHidden(false);
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-5xl transition-all duration-300 ease-out no-print ${
        hidden
          ? "-translate-y-24 opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
      }`}
    >
      <header
        className={`w-full rounded-full transition-all duration-300 px-3.5 sm:px-5 py-2.5 flex items-center justify-between ${
          scrolled
            ? "bg-slate-950/85 backdrop-blur-2xl border border-cyan-500/25 shadow-2xl shadow-cyan-950/30"
            : "bg-slate-950/70 backdrop-blur-xl border border-slate-800/80 shadow-xl shadow-black/40"
        }`}
      >
        {/* Brand Logo */}
        <a href="#top" className="cursor-pointer group shrink-0" title="AquaFuzz AI Home">
          <BrandLogo size={34} />
        </a>

        {/* Minimalist Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-300">
          <a
            href="#assessment"
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-slate-800/70 transition-all cursor-pointer flex items-center gap-1.5"
            title="Assessment Sliders & Score"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Assessment</span>
          </a>
          <a
            href="#dosing"
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-slate-800/70 transition-all cursor-pointer flex items-center gap-1.5"
            title="Field Chemical Dosing"
          >
            <Beaker className="w-3.5 h-3.5 text-emerald-400" />
            <span>Field Dosing</span>
          </a>
          <a
            href="#fuzzy-engine"
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-slate-800/70 transition-all cursor-pointer flex items-center gap-1.5"
            title="Fuzzy Curves & Mamdani Rules"
          >
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            <span>Fuzzy Logic</span>
          </a>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Preset Sample Selector */}
          <div className="relative">
            <button
              onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Load standard water samples"
            >
              <span>Presets</span>
              <ChevronDown
                className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                  presetDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {presetDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-800/80">
                  Select Water Sample
                </div>
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPreset(p);
                      setPresetDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-cyan-500/10 transition-colors cursor-pointer ${
                      currentPresetId === p.id
                        ? "text-cyan-300 font-semibold bg-cyan-950/40"
                        : "text-slate-300"
                    }`}
                  >
                    <span>{p.name}</span>
                    {currentPresetId === p.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Certificate Button */}
          <button
            onClick={onOpenReport}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95"
            title="Generate Official Certificate"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Certificate</span>
          </button>
        </div>
      </header>
    </div>
  );
}
