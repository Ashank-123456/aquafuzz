"use client";

import { useEffect, useState } from "react";
import { Award, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Copy, Check } from "lucide-react";
import confetti from "canvas-confetti";

export default function QualityGauge({ evaluation }) {
  const { fwqi, classification, activeRuleCount, classicalComparison } = evaluation;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti when water achieves Pristine Grade A
    if (fwqi >= 85) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#06b6d4", "#10b981", "#38bdf8"]
        });
      } catch {
        // gracefully ignore if canvas not supported
      }
    }
  }, [classification.grade, fwqi]);

  const handleCopySummary = () => {
    const text = `AquaFuzz AI Water Quality Assessment:
Score: ${fwqi} / 100
Grade: ${classification.grade} (${classification.label})
Status: ${classification.status}
Active Mamdani Rules: ${activeRuleCount}
Classical WQI Baseline: ${classicalComparison.index} / 100`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG Gauge calculations
  // Arc from -210 deg to 30 deg (total 240 deg)
  const radius = 90;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - (fwqi / 100) * arcLength;

  return (
    <div className="glass-panel-glow rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
      {/* Background ambient water glow */}
      <div
        className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: classification.color }}
      />

      {/* Top Bar: Grade & Status */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Fuzzy Inference Output
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
            {activeRuleCount} Rules Fired
          </span>
        </div>

        <button
          onClick={handleCopySummary}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 py-1 px-2 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
          title="Copy assessment summary to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Gauge Visualization Centerpiece */}
      <div className="py-4 flex flex-col items-center justify-center relative">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Arc */}
            <circle
              cx="112"
              cy="112"
              r={radius}
              stroke="rgba(30, 41, 59, 0.7)"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={arcLength}
              strokeDashoffset={0}
              strokeLinecap="round"
              className="transform rotate-[30deg] origin-center"
            />
            {/* Foreground Metric Arc */}
            <circle
              cx="112"
              cy="112"
              r={radius}
              stroke={classification.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transform rotate-[30deg] origin-center transition-all duration-700 ease-out"
              style={{
                filter: `drop-shadow(0 0 10px ${classification.color}80)`
              }}
            />
          </svg>

          {/* Central Score Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full mb-1 border uppercase tracking-wider"
              style={{
                backgroundColor: `${classification.color}15`,
                borderColor: `${classification.color}40`,
                color: classification.color
              }}
            >
              Grade {classification.grade}
            </span>
            <div className="flex items-baseline justify-center">
              <span className="text-5xl font-black text-white tracking-tight font-mono">
                {fwqi}
              </span>
              <span className="text-sm font-semibold text-slate-400 ml-1">/100</span>
            </div>
            <span className="text-xs font-medium text-slate-300 mt-0.5 max-w-[150px] truncate">
              {classification.status}
            </span>
          </div>
        </div>

        {/* Diagnosis Status Banner */}
        <div
          className={`w-full rounded-xl p-3.5 border text-center transition-all mt-1 ${classification.bgColor} ${classification.borderColor}`}
        >
          <div className="flex items-center justify-center gap-1.5 font-bold text-sm tracking-tight" style={{ color: classification.color }}>
            {fwqi >= 70 ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : fwqi >= 50 ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <ShieldAlert className="w-4 h-4" />
            )}
            <span>{classification.label}</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {classification.summary}
          </p>
        </div>
      </div>

      {/* Comparison Preview Strip */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400">Classical Arithmetic WQI:</span>
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-slate-200">
            {classicalComparison.index} / 100
          </span>
          <span
            className={`font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded ${
              Math.abs(fwqi - classicalComparison.index) > 5
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-slate-800 text-slate-400"
            }`}
            title="Difference between Fuzzy Mamdani output and Classical Arithmetic WQI"
          >
            Δ {Number((fwqi - classicalComparison.index).toFixed(1))}
          </span>
        </div>
      </div>
    </div>
  );
}
