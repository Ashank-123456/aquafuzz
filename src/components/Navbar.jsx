"use client";

import { useState, useEffect } from "react";
import BrandLogo from "./BrandLogo";
import { Sliders, Beaker, GitBranch, Printer, ChevronDown } from "lucide-react";
import { PRESETS } from "@/lib/fuzzyEngine";

export default function Navbar({ onSelectPreset, onOpenReport, currentPresetId }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 40);

      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setHidden(true);
        setPresetDropdownOpen(false);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 no-print ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/15 py-3 shadow-xl shadow-black/40"
          : "bg-transparent py-5 border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#top" className="cursor-pointer group" title="AquaFuzz AI Home">
          <BrandLogo size={38} />
        </a>

        {/* Minimalist Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-300 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800/80">
          <a
            href="#assessment"
            className="px-3 py-1 rounded-full hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer flex items-center gap-1.5"
            title="Assessment Console"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Assessment</span>
          </a>
          <a
            href="#dosing"
            className="px-3 py-1 rounded-full hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer flex items-center gap-1.5"
            title="Field Chemical Dosing"
          >
            <Beaker className="w-3.5 h-3.5 text-emerald-400" />
            <span>Field Dosing</span>
          </a>
          <a
            href="#fuzzy-engine"
            className="px-3 py-1 rounded-full hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer flex items-center gap-1.5"
            title="Fuzzy Logic Curves & Rules"
          >
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            <span>Fuzzy Logic</span>
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Preset Selector */}
          <div className="relative">
            <button
              onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Load standard water samples"
            >
              <span>Presets</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${presetDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {presetDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/25 rounded-2xl shadow-2xl py-2 z-50">
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
                      currentPresetId === p.id ? "text-cyan-300 font-semibold bg-cyan-950/40" : "text-slate-300"
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
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
            title="Generate Official Certificate"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Certificate</span>
          </button>
        </div>
      </div>
    </header>
  );
}
