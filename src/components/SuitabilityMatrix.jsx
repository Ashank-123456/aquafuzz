"use client";

import { GlassWater, Fish, Sprout, Waves, Check, X } from "lucide-react";

export default function SuitabilityMatrix({ classification, fwqi, inputs }) {
  const categories = [
    {
      id: "potable",
      name: "Drinking & Potable",
      icon: GlassWater,
      allowed: classification.potable,
      status: classification.potable
        ? fwqi >= 85 ? "Pristine, directly drinkable" : "Safe with simple filtration"
        : "Unsafe without complete treatment"
    },
    {
      id: "aquatic",
      name: "Aquatic Habitat",
      icon: Fish,
      allowed: classification.aquaticSafe,
      status: classification.aquaticSafe
        ? "Supports healthy freshwater fauna"
        : "Hypoxic / toxic hazard to aquatic life"
    },
    {
      id: "irrigation",
      name: "Crop Irrigation",
      icon: Sprout,
      allowed: classification.irrigationSafe,
      status: classification.irrigationSafe
        ? "Safe for agricultural food crops"
        : "Salinity / acidity risks root damage"
    },
    {
      id: "recreation",
      name: "Bathing & Contact",
      icon: Waves,
      allowed: classification.swimmingSafe,
      status: classification.swimmingSafe
        ? "Safe for swimming and recreation"
        : "Turbidity / coliform risk prevents bathing"
    }
  ];

  return (
    <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-2xl border border-cyan-500/15">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Sector Compliance Matrix
        </h3>
        <span className="text-[10px] font-mono text-slate-500">WHO Standard</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className={`rounded-2xl p-3.5 border transition-all flex flex-col justify-between ${
                cat.allowed
                  ? "bg-slate-900/60 border-emerald-500/25"
                  : "bg-slate-950/60 border-rose-500/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    cat.allowed ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    cat.allowed
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {cat.allowed ? (
                    <>
                      <Check className="w-2.5 h-2.5" />
                      <span>Safe</span>
                    </>
                  ) : (
                    <>
                      <X className="w-2.5 h-2.5" />
                      <span>Unsafe</span>
                    </>
                  )}
                </span>
              </div>

              <div>
                <div className="font-semibold text-xs text-white">
                  {cat.name}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  {cat.status}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
