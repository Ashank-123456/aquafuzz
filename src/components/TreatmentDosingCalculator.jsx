"use client";

import { useState } from "react";
import { Beaker, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import { calculateChemicalDosing } from "@/lib/realWorldEngine";

export default function TreatmentDosingCalculator({ inputs, evaluation }) {
  const [volume, setVolume] = useState(1000);

  const dosing = calculateChemicalDosing(inputs, volume);

  const volumePresets = [
    { label: "20 L (Jerrycan)", value: 20 },
    { label: "200 L (Drum)", value: 200 },
    { label: "1,000 L (Tank)", value: 1000 },
    { label: "10,000 L (Reservoir)", value: 10000 }
  ];

  return (
    <div id="dosing" className="glass-panel rounded-3xl p-6 shadow-2xl border border-emerald-500/15">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Beaker className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Field Chemical Dosing Calculator
            </h3>
            <p className="text-[11px] text-slate-400">
              Exact emergency treatment recipes for any water volume
            </p>
          </div>
        </div>

        {/* Volume Presets */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-full border border-slate-800 text-xs">
          {volumePresets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setVolume(preset.value)}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                volume === preset.value
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {preset.label.split("(")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Target Volume Subheader */}
      <div className="flex items-center justify-between py-3 text-xs">
        <div className="text-slate-400">
          Selected Batch: <strong className="text-emerald-400 font-mono text-sm">{volume.toLocaleString()} Liters</strong>
        </div>
        <div className="flex items-center gap-1.5">
          <label htmlFor="custom-vol" className="text-slate-500 text-[11px]">Custom (L):</label>
          <input
            id="custom-vol"
            type="number"
            min="1"
            max="100000"
            value={volume}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val > 0) setVolume(val);
            }}
            className="w-20 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded-lg text-emerald-300 font-mono text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* 3 Chemical Dosage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-1">
        {/* Alum */}
        <div className="bg-slate-900/60 rounded-2xl p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold mb-1">
            <span>Alum Coagulant</span>
            <span className="font-mono text-[10px] text-slate-500">Al2(SO4)3</span>
          </div>
          <div className="text-3xl font-black font-mono text-white my-1">
            {dosing.alum.totalGrams} <span className="text-xs text-slate-400 font-sans font-normal">grams</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            {dosing.alum.concentrationMgL > 0 
              ? `Dissolve powder in cup; stir into tank to clump suspended silt.`
              : `Turbidity is safe. No chemical coagulant needed.`}
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>Settling time:</span>
            <strong className="text-slate-300 font-mono">{dosing.timings.settlingMinutes} mins</strong>
          </div>
        </div>

        {/* Bleach / Chlorine */}
        <div className="bg-slate-900/60 rounded-2xl p-4 border border-emerald-500/20">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-1">
            <span>5% Chlorine Bleach</span>
            <span className="font-mono text-[10px] text-slate-500">NaOCl</span>
          </div>
          <div className="text-3xl font-black font-mono text-white my-1">
            {dosing.disinfection.bleachMl} <span className="text-xs text-slate-400 font-sans font-normal">ml</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Or ~{dosing.disinfection.tablets} chlorine tablets (33mg). Wait 30 mins contact before drinking.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>Contact time:</span>
            <strong className="text-slate-300 font-mono">30 mins</strong>
          </div>
        </div>

        {/* Lime Neutralizer */}
        <div className="bg-slate-900/60 rounded-2xl p-4 border border-amber-500/20">
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-1">
            <span>Lime Buffer</span>
            <span className="font-mono text-[10px] text-slate-500">Ca(OH)2</span>
          </div>
          <div className="text-3xl font-black font-mono text-white my-1">
            {dosing.neutralization.limeGrams} <span className="text-xs text-slate-400 font-sans font-normal">grams</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            {dosing.neutralization.limeGrams > 0 
              ? `Adds basic buffer to stop pipe corrosion and metal leaching.`
              : `pH is balanced in safe neutral zone (6.5–8.5).`}
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>Est. Chemical Cost:</span>
            <strong className="text-emerald-400 font-mono">${dosing.costUSD}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
