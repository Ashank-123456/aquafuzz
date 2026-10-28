"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import BrandLogo from "@/components/BrandLogo";
import ParameterControl from "@/components/ParameterControl";
import QualityGauge from "@/components/QualityGauge";
import SuitabilityMatrix from "@/components/SuitabilityMatrix";
import TreatmentDosingCalculator from "@/components/TreatmentDosingCalculator";
import FuzzyEngineTabs from "@/components/FuzzyEngineTabs";
import ReportModal from "@/components/ReportModal";
import { evaluateFuzzyWaterQuality, PRESETS } from "@/lib/fuzzyEngine";
import { Droplets, Sparkles, RefreshCw } from "lucide-react";

export default function Home() {
  const [inputs, setInputs] = useState({
    ph: 7.2,
    turbidity: 2.5,
    do: 7.8,
    tds: 220
  });

  const [options] = useState({
    tNorm: "min",
    defuzzMethod: "centroid"
  });

  const [currentPresetId, setCurrentPresetId] = useState("municipal_tap");
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Compute live Mamdani Fuzzy Inference result
  const evaluation = useMemo(() => {
    return evaluateFuzzyWaterQuality(inputs, options);
  }, [inputs, options]);

  const handleChangeParam = (paramKey, value) => {
    setInputs((prev) => ({
      ...prev,
      [paramKey]: value
    }));
    setCurrentPresetId(null);
  };

  const handleSelectPreset = (preset) => {
    setInputs((prev) => ({
      ...prev,
      ...preset.params
    }));
    setCurrentPresetId(preset.id);
  };

  const handleResetDefaults = () => {
    setInputs({
      ph: 7.2,
      turbidity: 2.5,
      do: 7.8,
      tds: 220
    });
    setCurrentPresetId("municipal_tap");
  };

  return (
    <div className="min-h-screen water-gradient-bg text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      {/* Floating Navbar */}
      <Navbar
        onSelectPreset={handleSelectPreset}
        onOpenReport={() => setReportModalOpen(true)}
        currentPresetId={currentPresetId}
      />

      {/* Main Content */}
      <main id="top" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-24 pb-16 space-y-10">
        {/* Minimalist Hero Section */}
        <section className="text-center pt-4 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Soft Computing • Mamdani Fuzzy Inference</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Intelligent Water Quality{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              Assessment System
            </span>
          </h1>

          <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Eliminating rigid thresholds through fuzzy logic modeling, automated sector compliance, and emergency chemical dosing.
          </p>

          {/* Minimalist Preset Selector Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium mr-1 hidden sm:inline">
              Sample Source:
            </span>
            {PRESETS.map((preset) => {
              const isActive = currentPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20 scale-105"
                      : "bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-cyan-500/30 hover:text-white"
                  }`}
                  title={preset.description}
                >
                  <Droplets className={`w-3 h-3 ${isActive ? "text-slate-950" : "text-cyan-400"}`} />
                  <span>{preset.name}</span>
                </button>
              );
            })}
            <button
              onClick={handleResetDefaults}
              className="text-xs px-2.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset parameters"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </section>

        {/* Core Assessment Console */}
        <section id="assessment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Parameter Sliders (7 cols) */}
            <div className="lg:col-span-7">
              <ParameterControl
                values={inputs}
                onChangeParam={handleChangeParam}
                fuzzified={evaluation.fuzzified}
              />
            </div>

            {/* Right: Quality Gauge (5 cols) */}
            <div className="lg:col-span-5">
              <QualityGauge evaluation={evaluation} />
            </div>
          </div>

          {/* Sector Compliance Matrix */}
          <SuitabilityMatrix
            classification={evaluation.classification}
            fwqi={evaluation.fwqi}
            inputs={inputs}
          />
        </section>

        {/* Real-World Field Action: Chemical Dosing */}
        <section id="dosing">
          <TreatmentDosingCalculator inputs={inputs} evaluation={evaluation} />
        </section>

        {/* Technical Fuzzy Logic Console (Tabbed) */}
        <section>
          <FuzzyEngineTabs
            inputs={inputs}
            evaluation={evaluation}
            options={options}
          />
        </section>
      </main>

      {/* Official Laboratory Certificate Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        inputs={inputs}
        evaluation={evaluation}
      />

      {/* Minimalist Branded Footer with Copyright Line */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <BrandLogo size={28} />
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Soft Computing Laboratory
            </span>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center gap-5 text-[11px] font-medium">
            <a href="#assessment" className="hover:text-cyan-300 transition-colors cursor-pointer">
              Assessment
            </a>
            <a href="#dosing" className="hover:text-cyan-300 transition-colors cursor-pointer">
              Field Dosing
            </a>
            <a href="#fuzzy-engine" className="hover:text-cyan-300 transition-colors cursor-pointer">
              Fuzzy Engine
            </a>
            <button
              onClick={() => setReportModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-semibold"
            >
              Certificate
            </button>
          </div>

          {/* Explicit Copyright Line */}
          <div className="text-center md:text-right font-mono text-[11px] text-slate-500">
            © 2026 AquaFuzz AI • Developed by <strong className="text-slate-300 font-semibold">Ashank Gupta</strong>. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
