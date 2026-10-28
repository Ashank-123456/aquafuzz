"use client";

import { useState, useEffect } from "react";
import { Droplets, Activity, GitBranch, Compass, BookOpen, Printer, Sparkles, ChevronDown } from "lucide-react";
import { PRESETS } from "@/lib/fuzzyEngine";

export default function Navbar({ onSelectPreset, onOpenReport, currentPresetId }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
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
          ? "bg-slate-950/85 backdrop-blur-md border-b border-cyan-500/20 py-2.5 shadow-xl shadow-cyan-950/20"
          : "bg-transparent py-4 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand & Logo */}
        <a
          href="#top"
          className="flex items-center gap-3 group cursor-pointer"
          title="AquaFuzz AI - Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 p-[1.5px] shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-400/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Droplets className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">
                Aqua<span className="text-cyan-400">Fuzz</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                MAMDANI v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Soft Computing Water Quality Assessment
            </p>
          </div>
        </a>

        {/* Section Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-300">
          <a
            href="#assessment"
            className="px-3 py-1.5 rounded-lg hover:text-cyan-300 hover:bg-slate-900/60 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Go to Live Assessment Simulator"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Assessment</span>
          </a>
          <a
            href="#curves"
            className="px-3 py-1.5 rounded-lg hover:text-cyan-300 hover:bg-slate-900/60 transition-all flex items-center gap-1.5 cursor-pointer"
            title="View Fuzzy Membership Curves"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Membership Curves</span>
          </a>
          <a
            href="#inference"
            className="px-3 py-1.5 rounded-lg hover:text-cyan-300 hover:bg-slate-900/60 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Examine Mamdani Rule Base and Defuzzification"
          >
            <GitBranch className="w-4 h-4 text-sky-400" />
            <span>Rule Matrix</span>
          </a>
          <a
            href="#river-route"
            className="px-3 py-1.5 rounded-lg hover:text-cyan-300 hover:bg-slate-900/60 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Simulate River Basin Degradation Route"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>River Route</span>
          </a>
          <a
            href="#theory"
            className="px-3 py-1.5 rounded-lg hover:text-cyan-300 hover:bg-slate-900/60 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Soft Computing Mathematical Foundations"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Theory</span>
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Preset Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Load standard water source presets"
            >
              <span className="hidden sm:inline">Presets</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${presetDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {presetDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Select Water Source
                </div>
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPreset(p);
                      setPresetDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-cyan-500/15 transition-colors cursor-pointer ${
                      currentPresetId === p.id ? "text-cyan-300 font-semibold bg-cyan-950/40" : "text-slate-200"
                    }`}
                    title={p.description}
                  >
                    <span>{p.name}</span>
                    {currentPresetId === p.id && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export / Print Certificate */}
          <button
            onClick={onOpenReport}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all cursor-pointer"
            title="Generate & Print Official Water Quality Laboratory Certificate"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Certificate</span>
          </button>
        </div>
      </div>
    </header>
  );
}
