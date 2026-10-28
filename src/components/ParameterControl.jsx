"use client";

import { Minus, Plus, Settings2, Sliders, Info } from "lucide-react";
import { PARAM_DEFINITIONS } from "@/lib/fuzzyEngine";

export default function ParameterControl({
  values,
  onChangeParam,
  fuzzified,
  options,
  onChangeOption,
  showTemperature,
  onToggleTemperature
}) {
  const paramsToRender = ["ph", "turbidity", "do", "tds"];
  if (showTemperature) {
    paramsToRender.push("temperature");
  }

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Physico-Chemical Sensors
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Adjust water sample parameters to trigger continuous fuzzy membership evaluation.
          </p>
        </div>

        {/* Engine Tuning Options Toggle */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onToggleTemperature}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-all cursor-pointer ${
              showTemperature
                ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            title="Toggle 5th Parameter: Thermal Temperature"
          >
            {showTemperature ? "5-Param Mode (Temp Active)" : "+ Add Temp (°C)"}
          </button>
        </div>
      </div>

      {/* Parameter Sliders Grid */}
      <div className="space-y-6 pt-5">
        {paramsToRender.map((paramKey) => {
          const def = PARAM_DEFINITIONS[paramKey];
          const val = values[paramKey] ?? def.default;
          const memberships = fuzzified?.[paramKey] || {};

          // Calculate percentage for progress fill
          const pct = Math.max(0, Math.min(100, ((val - def.min) / (def.max - def.min)) * 100));

          return (
            <div
              key={def.id}
              className="glass-card rounded-xl p-4 transition-all hover:border-cyan-500/30 group"
            >
              {/* Top Row: Title, Guidance, Value Input */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {def.name}
                    </span>
                    <span className="text-xs font-mono text-cyan-400/90 font-medium bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                      {def.unit}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Info className="w-3 h-3 text-slate-500" />
                    Ideal Standard: <strong className="text-emerald-400/90">{def.standardIdeal}</strong>
                  </span>
                </div>

                {/* Direct Numeric Input with +/- Steppers */}
                <div className="flex items-center gap-1 bg-slate-950/80 rounded-lg p-1 border border-slate-800">
                  <button
                    onClick={() => {
                      const newVal = Math.max(def.min, Number((val - def.step).toFixed(2)));
                      onChangeParam(paramKey, newVal);
                    }}
                    className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
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
                    className="w-16 text-center font-mono text-sm font-bold bg-transparent text-cyan-300 focus:outline-none"
                    title={`Enter direct value for ${def.name}`}
                  />
                  <button
                    onClick={() => {
                      const newVal = Math.min(def.max, Number((val + def.step).toFixed(2)));
                      onChangeParam(paramKey, newVal);
                    }}
                    className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title={`Increase ${def.name}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Slider Input with Custom Track */}
              <div className="relative py-2">
                <input
                  type="range"
                  min={def.min}
                  max={def.max}
                  step={def.step}
                  value={val}
                  onChange={(e) => onChangeParam(paramKey, parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #3b82f6 ${pct}%, #0f172a ${pct}%, #0f172a 100%)`
                  }}
                  title={`Slide to adjust ${def.name} (${val} ${def.unit})`}
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>{def.min}</span>
                  <span>{((def.max + def.min) / 2).toFixed(1)}</span>
                  <span>{def.max}</span>
                </div>
              </div>

              {/* Real-time Fuzzy Linguistic Set Membership Breakdown */}
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                  Fuzzified Sets:
                </span>
                {def.sets.map((set) => {
                  const deg = memberships[set.id] || 0;
                  const isActive = deg > 0.001;
                  return (
                    <div
                      key={set.id}
                      className={`text-[11px] px-2 py-0.5 rounded-md font-mono flex items-center gap-1.5 transition-all ${
                        isActive
                          ? "bg-slate-900 border font-semibold shadow-sm"
                          : "opacity-40 bg-slate-950/40 text-slate-500"
                      }`}
                      style={{
                        borderColor: isActive ? set.color : "transparent",
                        color: isActive ? set.color : undefined
                      }}
                      title={`${set.name} membership degree: ${deg.toFixed(3)}`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: set.color }}
                      />
                      <span>{set.name.split("/")[0]}</span>
                      <span className="text-slate-300 font-bold">
                        μ={deg.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Engine Fine-Tuning Drawer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 bg-slate-950/40 -mx-5 -mb-5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Settings2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase">
            Inference System Configuration
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* T-Norm Operator Selector */}
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <label className="text-[11px] text-slate-400 block mb-1">
              Fuzzy AND Operator (T-Norm)
            </label>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => onChangeOption("tNorm", "min")}
                className={`text-xs py-1 px-2 rounded font-medium transition-all cursor-pointer ${
                  options.tNorm === "min"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
                title="Standard Mamdani Min Intersection: min(μA, μB)"
              >
                Mamdani Min
              </button>
              <button
                onClick={() => onChangeOption("tNorm", "product")}
                className={`text-xs py-1 px-2 rounded font-medium transition-all cursor-pointer ${
                  options.tNorm === "product"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
                title="Algebraic Product Intersection: μA × μB"
              >
                Product (Sum)
              </button>
            </div>
          </div>

          {/* Defuzzification Method Selector */}
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <label className="text-[11px] text-slate-400 block mb-1">
              Defuzzification Algorithm
            </label>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => onChangeOption("defuzzMethod", "centroid")}
                className={`text-xs py-1 px-1.5 rounded font-medium transition-all cursor-pointer ${
                  options.defuzzMethod === "centroid"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
                title="Center of Gravity (Centroid): z* = ∫(z·μ)/∫μ"
              >
                Centroid
              </button>
              <button
                onClick={() => onChangeOption("defuzzMethod", "mom")}
                className={`text-xs py-1 px-1.5 rounded font-medium transition-all cursor-pointer ${
                  options.defuzzMethod === "mom"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
                title="Mean of Maxima (MOM): Average of peak z values"
              >
                MOM
              </button>
              <button
                onClick={() => onChangeOption("defuzzMethod", "bisector")}
                className={`text-xs py-1 px-1.5 rounded font-medium transition-all cursor-pointer ${
                  options.defuzzMethod === "bisector"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
                title="Bisector of Area: Divides aggregated fuzzy region equally"
              >
                Bisector
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
