"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import ParameterControl from "@/components/ParameterControl";
import QualityGauge from "@/components/QualityGauge";
import SuitabilityMatrix from "@/components/SuitabilityMatrix";
import ComparisonCard from "@/components/ComparisonCard";
import RemediationAdvisor from "@/components/RemediationAdvisor";
import TreatmentDosingCalculator from "@/components/TreatmentDosingCalculator";
import RealWorldUseCases from "@/components/RealWorldUseCases";
import BatchTelemetryAnalyzer from "@/components/BatchTelemetryAnalyzer";
import MembershipVisualizer from "@/components/MembershipVisualizer";
import RuleInspector from "@/components/RuleInspector";
import RiverBasinSimulator from "@/components/RiverBasinSimulator";
import TheorySection from "@/components/TheorySection";
import ReportModal from "@/components/ReportModal";
import { evaluateFuzzyWaterQuality, PRESETS } from "@/lib/fuzzyEngine";
import { Droplets, Sparkles, RefreshCw, Beaker, HeartPulse, Database } from "lucide-react";

export default function Home() {
  const [inputs, setInputs] = useState({
    ph: 7.2,
    turbidity: 2.5,
    do: 7.8,
    tds: 220,
    temperature: 22.0
  });

  const [options, setOptions] = useState({
    tNorm: "min",
    defuzzMethod: "centroid"
  });

  const [currentPresetId, setCurrentPresetId] = useState("municipal_tap");
  const [showTemperature, setShowTemperature] = useState(false);
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
    setCurrentPresetId(null); // marked as custom
  };

  const handleSelectPreset = (preset) => {
    setInputs((prev) => ({
      ...prev,
      ...preset.params
    }));
    setCurrentPresetId(preset.id);
  };

  const handleChangeOption = (key, value) => {
    setOptions((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleToggleTemperature = () => {
    setShowTemperature((prev) => !prev);
  };

  const handleLoadStationParams = (stationParams) => {
    setInputs((prev) => ({
      ...prev,
      ...stationParams
    }));
    setCurrentPresetId(null);
    const element = document.getElementById("assessment");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleResetDefaults = () => {
    setInputs({
      ph: 7.2,
      turbidity: 2.5,
      do: 7.8,
      tds: 220,
      temperature: 22.0
    });
    setOptions({
      tNorm: "min",
      defuzzMethod: "centroid"
    });
    setCurrentPresetId("municipal_tap");
    setShowTemperature(false);
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
      <main id="top" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-12">
        {/* Hero Section */}
        <section className="text-center pt-6 pb-2 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Real-World Environmental AI • Soft Computing Laboratory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Fuzzy Water Quality{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
              Assessment System
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed">
            A practical decision-support system that solves real-life water challenges: prevents waterborne disease outbreaks, calculates exact chemical treatment dosages (alum, chlorine, lime), audits municipal sensor telemetry, and protects agricultural crops and aquaculture fisheries.
          </p>

          {/* Quick Real-Life Problem Highlights */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-emerald-500/20 flex items-start gap-2.5">
              <Beaker className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-slate-200 block">Field Chemical Dosing:</strong>
                <span className="text-slate-400 text-[11px]">Exact grams of alum, lime & ml of bleach for any batch volume.</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-rose-500/20 flex items-start gap-2.5">
              <HeartPulse className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-slate-200 block">Public Health & Disease:</strong>
                <span className="text-slate-400 text-[11px]">Flags pathogen shielding & plumbing heavy-metal leaching hazards.</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex items-start gap-2.5">
              <Database className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-slate-200 block">IoT Batch Telemetry:</strong>
                <span className="text-slate-400 text-[11px]">Ingest CSV logs, flag legal EPA/CPCB violations & export audit reports.</span>
              </div>
            </div>
          </div>

          {/* Quick Preset Badges */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1">
              Sample Field Sources:
            </span>
            {PRESETS.map((preset) => {
              const isActive = currentPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 scale-105"
                      : "bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-white"
                  }`}
                  title={preset.description}
                >
                  <Droplets className={`w-3.5 h-3.5 ${isActive ? "text-slate-950" : "text-cyan-400"}`} />
                  <span>{preset.name}</span>
                </button>
              );
            })}
            <button
              onClick={handleResetDefaults}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset parameters to standard values"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </section>

        {/* Core Live Assessment Section */}
        <section id="assessment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Parameter Sliders & Controls (7 cols) */}
            <div className="lg:col-span-7">
              <ParameterControl
                values={inputs}
                onChangeParam={handleChangeParam}
                fuzzified={evaluation.fuzzified}
                options={options}
                onChangeOption={handleChangeOption}
                showTemperature={showTemperature}
                onToggleTemperature={handleToggleTemperature}
              />
            </div>

            {/* Right Column: Live Quality Gauge & Diagnosis (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <QualityGauge evaluation={evaluation} />
              <RemediationAdvisor recommendations={evaluation.recommendations} />
            </div>
          </div>

          {/* Water Suitability Matrix */}
          <SuitabilityMatrix
            classification={evaluation.classification}
            fwqi={evaluation.fwqi}
            inputs={inputs}
          />

          {/* Soft Computing vs Classical Arithmetic Comparison Card */}
          <ComparisonCard
            fwqi={evaluation.fwqi}
            classicalComparison={evaluation.classicalComparison}
            classification={evaluation.classification}
          />
        </section>

        {/* Real-Life Problem Solution 1: Chemical Dosing & Treatment Calculator */}
        <section>
          <TreatmentDosingCalculator inputs={inputs} evaluation={evaluation} />
        </section>

        {/* Real-Life Problem Solution 2: Sector Impact (Public Health, Aquaculture, Farming) */}
        <section>
          <RealWorldUseCases inputs={inputs} />
        </section>

        {/* Real-Life Problem Solution 3: Real-World IoT & CSV Batch Telemetry Ingestion */}
        <section>
          <BatchTelemetryAnalyzer onLoadSampleToSimulator={handleLoadStationParams} />
        </section>

        {/* Visual Membership Curves Section */}
        <section>
          <MembershipVisualizer inputs={inputs} evaluation={evaluation} />
        </section>

        {/* Mamdani Rule Base & Defuzzification Inspector */}
        <section>
          <RuleInspector evaluation={evaluation} options={options} />
        </section>

        {/* Longitudinal River Basin Simulator */}
        <section>
          <RiverBasinSimulator onLoadStationParams={handleLoadStationParams} />
        </section>

        {/* Educational Theory & Mathematical Formulations */}
        <section>
          <TheorySection />
        </section>
      </main>

      {/* Official Laboratory Certificate Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        inputs={inputs}
        evaluation={evaluation}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/70 py-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="font-bold text-slate-200">
                AquaFuzz AI • Soft Computing Laboratory
              </div>
              <div className="text-[11px] text-slate-500">
                Solving Real-World Water Contamination, Treatment Dosing & Regulatory Monitoring
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#assessment" className="hover:text-cyan-300 transition-colors cursor-pointer" title="Jump to assessment simulator">
              Simulator
            </a>
            <a href="#dosing-calculator" className="hover:text-cyan-300 transition-colors cursor-pointer" title="Jump to chemical dosing">
              Dosing Calculator
            </a>
            <a href="#real-world-impact" className="hover:text-cyan-300 transition-colors cursor-pointer" title="Jump to sector impact">
              Sector Impact
            </a>
            <a href="#batch-telemetry" className="hover:text-cyan-300 transition-colors cursor-pointer" title="Jump to batch telemetry">
              Batch IoT
            </a>
            <a href="#curves" className="hover:text-cyan-300 transition-colors cursor-pointer" title="Jump to membership curves">
              Curves
            </a>
            <a href="#theory" className="hover:text-cyan-300 transition-colors cursor-pointer" title="Jump to theory section">
              Theory
            </a>
            <button
              onClick={() => setReportModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
              title="Print official laboratory certificate"
            >
              Export Report
            </button>
          </div>

          <div className="text-center md:text-right font-mono text-[11px]">
            <div>
              Developed by <strong className="text-slate-200">Ashank Gupta</strong>
            </div>
            <div className="text-slate-500">
              Department of Computer Science & Engineering
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
