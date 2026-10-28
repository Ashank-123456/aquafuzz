"use client";

import { Minus, Plus, Sliders } from "lucide-react";
import { PARAM_DEFINITIONS } from "@/lib/fuzzyEngine";

export default function ParameterControl({ values, onChangeParam, fuzzified }) {
  const coreParams = ["ph", "turbidity", "do", "tds"];

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-cyan-500/15">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Sensor Parameters
            </h2>
            <p className="text-[11px] text-slate-400">
              Adjust water sample indicators in real time
            </p>
          </div>
        </div>
      </div>

      {/* Parameter Sliders */}
      <div className="space-y-5 pt-5">
        {coreParams.map((paramKey) => {
          const def = PARAM_DEFINITIONS[paramKey];
          const val = values[paramKey] ?? def.default;
          const memberships = fuzzified?.[paramKey] || {};
          const pct = Math.max(0, Math.min(100, ((val - def.min) / (def.max - def.min)) * 100));

          return (
            <div
              key={def.id}
              className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/80 hover:border-cyan-500/30 transition-all"
            >
              {/* Parameter Info & Stepper */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">
                      {def.name}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 font-medium px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/30">
                      {def.unit}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    WHO Standard: {def.standardIdeal}
                  </span>
                </div>

                {/* Direct Numeric Input with +/- Steppers */}
                <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
                  <button
                    onClick={() => {
                      const newVal = Math.max(def.min, Number((val - def.step).toFixed(2)));
                      onChangeParam(paramKey, newVal);
                    }}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title={`Decrease ${def.name}`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <input
                    type="number"
                    step={def.step}
                    min={def.min}
                    max={def.max}
                    value={val}
                    onChange={(e) => {
                      const parsed = parseFloat(e.target.value);
                      if (!isNaN(parsed)) {
                        onChangeParam(paramKey, Math.max(def.min, Math.min(def.max, parsed)));
                      }
                    }}
                    className="w-14 text-center font-mono text-xs font-bold bg-transparent text-cyan-300 focus:outline-none"
                    title={`Enter direct value for ${def.name}`}
                  />
                  <button
                    onClick={() => {
                      const newVal = Math.min(def.max, Number((val + def.step).toFixed(2)));
                      onChangeParam(paramKey, newVal);
                    }}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title={`Increase ${def.name}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Slider Track */}
              <div className="py-1.5">
                <input
                  type="range"
                  min={def.min}
                  max={def.max}
                  step={def.step}
                  value={val}
                  onChange={(e) => onChangeParam(paramKey, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #3b82f6 ${pct}%, #0f172a ${pct}%, #0f172a 100%)`
                  }}
                  title={`Slide to adjust ${def.name}`}
                />
              </div>

              {/* Minimal Active Fuzzy Linguistic Badges */}
              <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-800/40">
                {def.sets.map((set) => {
                  const deg = memberships[set.id] || 0;
                  const isActive = deg > 0.01;
                  return (
                    <span
                      key={set.id}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1 transition-all ${
                        isActive
                          ? "bg-slate-950 border font-bold"
                          : "opacity-30 bg-transparent text-slate-600"
                      }`}
                      style={{
                        borderColor: isActive ? set.color : "transparent",
                        color: isActive ? set.color : undefined
                      }}
                    >
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: set.color }} />
                      <span>{set.name.split("/")[0]}</span>
                      {isActive && <span>(μ={deg.toFixed(2)})</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
