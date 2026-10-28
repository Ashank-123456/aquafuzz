"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, ShieldAlert, Copy, Check } from "lucide-react";
import confetti from "canvas-confetti";

export default function QualityGauge({ evaluation }) {
  const { fwqi, classification, activeRuleCount } = evaluation;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (fwqi >= 85) {
      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.6 },
          colors: ["#06b6d4", "#10b981", "#38bdf8"]
        });
      } catch {}
    }
  }, [fwqi]);

  const handleCopySummary = () => {
    const text = `AquaFuzz Water Quality: ${fwqi}/100 | Grade ${classification.grade} (${classification.status}) | Active Rules: ${activeRuleCount}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const radius = 86;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - (fwqi / 100) * arcLength;

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between border border-cyan-500/15">
      {/* Background ambient glow */}
      <div
        className="absolute -right-16 -top-16 w-52 h-52 rounded-full blur-3xl opacity-15 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: classification.color }}
      />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Water Quality Index
        </span>
        <button
          onClick={handleCopySummary}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 py-1 px-2.5 rounded-full hover:bg-slate-900 transition-colors cursor-pointer"
          title="Copy results"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Radial Gauge */}
      <div className="py-5 flex flex-col items-center justify-center relative">
        <div className="relative w-52 h-52 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="104"
              cy="104"
              r={radius}
              stroke="rgba(30, 41, 59, 0.6)"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={arcLength}
              strokeDashoffset={0}
              strokeLinecap="round"
              className="transform rotate-[30deg] origin-center"
            />
            {/* Foreground Progress */}
            <circle
              cx="104"
              cy="104"
              r={radius}
              stroke={classification.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transform rotate-[30deg] origin-center transition-all duration-700 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${classification.color}60)`
              }}
            />
          </svg>

          {/* Central Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full mb-1 border uppercase tracking-wider"
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
              <span className="text-sm font-semibold text-slate-500 ml-1">/100</span>
            </div>
            <span className="text-xs font-semibold text-slate-300 mt-1">
              {classification.status}
            </span>
          </div>
        </div>

        {/* Status Callout Banner */}
        <div
          className={`w-full rounded-2xl p-3.5 border text-center transition-all mt-2 ${classification.bgColor} ${classification.borderColor}`}
        >
          <div
            className="flex items-center justify-center gap-1.5 font-bold text-xs"
            style={{ color: classification.color }}
          >
            {fwqi >= 70 ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : fwqi >= 50 ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5" />
            )}
            <span>{classification.label}</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-snug">
            {classification.summary}
          </p>
        </div>
      </div>
    </div>
  );
}
