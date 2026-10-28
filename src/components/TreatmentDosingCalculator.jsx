"use client";

import { useState } from "react";
import { Wrench, Beaker, Clock, DollarSign, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { calculateChemicalDosing } from "@/lib/realWorldEngine";

export default function TreatmentDosingCalculator({ inputs, evaluation }) {
  const [volume, setVolume] = useState(1000); // 1000 Liters default

  const dosing = calculateChemicalDosing(inputs, volume);
  const { fwqi, classification } = evaluation;

  const volumePresets = [
    { label: "20 L (Jerrycan / Bucket)", value: 20 },
    { label: "200 L (Standard Drum)", value: 200 },
    { label: "1,000 L (Community Tank)", value: 1000 },
    { label: "10,000 L (Disaster Relief Bladder)", value: 10000 }
  ];

  return (
    <div id="dosing-calculator" className="glass-panel rounded-2xl p-5 md:p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Beaker className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              In-Field Remediation & Chemical Dosing Calculator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Solves real-world emergency water treatment: computes exact chemical weights, disinfection volume, and settling times for any batch size.
          </p>
        </div>

        {/* Volume Selector Presets */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {volumePresets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setVolume(preset.value)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                volume === preset.value
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
              title={`Calculate chemicals for ${preset.label}`}
            >
              {preset.label.split("(")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Target Volume Custom Input Bar */}
      <div className="mt-4 p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Target Water Batch:</span>
          <span className="font-mono text-cyan-400 font-bold text-sm">
            {volume.toLocaleString()} Liters
          </span>
          <span className="text-slate-500">
            ({(volume * 0.264172).toFixed(0)} US Gallons)
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="custom-volume-input" className="text-slate-400">Custom Liters:</label>
          <input
            id="custom-volume-input"
            type="number"
            min="1"
            max="100000"
            value={volume}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val > 0) setVolume(val);
            }}
            className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Chemical Dosages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Card 1: Coagulation (Alum) */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                1. Coagulation & Silt Removal
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Alum Al2(SO4)3
              </span>
            </div>

            <div className="flex items-baseline gap-1 my-2">
              <span className="text-3xl font-black font-mono text-white">
                {dosing.alum.totalGrams}
              </span>
              <span className="text-xs font-semibold text-slate-400">grams needed</span>
            </div>
            <div className="text-[11px] text-cyan-400/90 font-mono">
              Concentration: {dosing.alum.concentrationMgL} mg/L
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {dosing.alum.procedure}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Settling time:
            </span>
            <strong className="text-slate-200 font-mono">{dosing.timings.settlingMinutes} mins</strong>
          </div>
        </div>

        {/* Card 2: Disinfection (Chlorine / Bleach) */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                2. Pathogen Disinfection
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                5% NaOCl Bleach
              </span>
            </div>

            <div className="flex items-baseline gap-1 my-2">
              <span className="text-3xl font-black font-mono text-white">
                {dosing.disinfection.bleachMl}
              </span>
              <span className="text-xs font-semibold text-slate-400">ml bleach</span>
            </div>
            <div className="text-[11px] text-emerald-400/90 font-mono">
              Or ~{dosing.disinfection.tablets} Chlorine Tablets (33mg)
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {dosing.disinfection.procedure}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Contact time:
            </span>
            <strong className="text-slate-200 font-mono">30 mins contact</strong>
          </div>
        </div>

        {/* Card 3: pH Neutralizer (Lime) */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-amber-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                3. pH Buffering
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                Ca(OH)2 Lime
              </span>
            </div>

            <div className="flex items-baseline gap-1 my-2">
              <span className="text-3xl font-black font-mono text-white">
                {dosing.neutralization.limeGrams > 0 ? dosing.neutralization.limeGrams : "0"}
              </span>
              <span className="text-xs font-semibold text-slate-400">grams lime</span>
            </div>
            <div className="text-[11px] text-amber-400/90 font-mono">
              Status: {dosing.neutralization.action}
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {dosing.neutralization.procedure}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              Est. Batch Chemical Cost:
            </span>
            <strong className="text-emerald-400 font-mono font-bold">${dosing.costUSD} USD</strong>
          </div>
        </div>
      </div>

      {/* Emergency Field Action Checklist */}
      <div className="mt-4 p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs">
        <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Step-by-Step Field Operator Execution Order:</span>
        </h4>
        <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed font-sans pl-1">
          <li><strong>Step 1 (Pre-Filtration):</strong> Pour raw water through clean folded cotton cloth to remove coarse leaves and grit.</li>
          <li><strong>Step 2 (Rapid Coagulation):</strong> Add {dosing.alum.totalGrams}g alum powder; stir rapidly for 1–2 minutes, then stir very gently for 5 minutes to form visible floc clusters.</li>
          <li><strong>Step 3 (Settling):</strong> Let water rest undisturbed for {dosing.timings.settlingMinutes} minutes until silt deposits at the bottom. Decant clear supernatant into clean container.</li>
          <li><strong>Step 4 (Disinfection):</strong> Add {dosing.disinfection.bleachMl}ml bleach ({dosing.disinfection.tablets} tablets); wait 30 minutes. If boiling, maintain rolling boil for {dosing.timings.boilMinutes} minutes.</li>
        </ol>
      </div>
    </div>
  );
}
