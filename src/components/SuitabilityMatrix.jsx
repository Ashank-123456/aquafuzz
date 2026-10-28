"use client";

import { GlassWater, Fish, Sprout, Waves, Factory, Check, X, AlertCircle } from "lucide-react";

export default function SuitabilityMatrix({ classification, fwqi, inputs }) {
  const ph = inputs.ph ?? 7.2;
  const turb = inputs.turbidity ?? 2.5;
  const doVal = inputs.do ?? 7.8;
  const tds = inputs.tds ?? 220;

  const categories = [
    {
      id: "potable",
      name: "Drinking & Potable",
      icon: GlassWater,
      allowed: classification.potable,
      minReq: "FWQI ≥ 70, pH 6.5-8.5, Turbidity < 5 NTU",
      statusText: classification.potable
        ? fwqi >= 85
          ? "Safe for direct consumption"
          : "Safe with standard chlorination/filtration"
        : "Unsafe for human drinking without advanced treatment",
      warning: ph < 6.5 || ph > 8.5 ? "pH out of safe range" : turb > 5 ? "Elevated turbidity" : null
    },
    {
      id: "aquatic",
      name: "Aquatic Life & Habitat",
      icon: Fish,
      allowed: classification.aquaticSafe,
      minReq: "DO ≥ 5.0 mg/L, pH 6.5-9.0",
      statusText: classification.aquaticSafe
        ? "Healthy conditions for cold/warm water fish"
        : "Hypoxic / toxic danger to fish and benthic organisms",
      warning: doVal < 5.0 ? `Low DO (${doVal} mg/L) causes asphyxiation` : null
    },
    {
      id: "irrigation",
      name: "Agricultural Irrigation",
      icon: Sprout,
      allowed: classification.irrigationSafe,
      minReq: "TDS < 1000 mg/L, pH 6.0-8.5",
      statusText: classification.irrigationSafe
        ? "Suitable for all food and cash crops"
        : "High salinity/acidity risks soil salinization and plant burn",
      warning: tds > 1000 ? `Excessive TDS (${tds} ppm)` : null
    },
    {
      id: "recreation",
      name: "Primary Contact / Bathing",
      icon: Waves,
      allowed: classification.swimmingSafe,
      minReq: "FWQI ≥ 70, Turbidity < 10 NTU",
      statusText: classification.swimmingSafe
        ? "Safe for swimming and water sports"
        : "Water clarity or microbial hazards restrict bathing",
      warning: turb > 10 ? `Turbidity too high (${turb} NTU)` : null
    },
    {
      id: "industrial",
      name: "Industrial & Cooling",
      icon: Factory,
      allowed: classification.industrialSafe,
      minReq: "TDS < 1500 mg/L, non-corrosive",
      statusText: classification.industrialSafe
        ? "Usable for cooling towers & washing"
        : "Severe scaling or corrosion danger to industrial machinery",
      warning: ph < 5.5 ? "Severe piping corrosion risk" : null
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Water Use Suitability Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluates multi-sector utilization compliance under WHO and CPCB environmental guidelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className={`rounded-xl p-3.5 border transition-all flex flex-col justify-between ${
                cat.allowed
                  ? "bg-slate-900/60 border-emerald-500/30 hover:border-emerald-500/60"
                  : "bg-slate-950/70 border-rose-500/25 opacity-80 hover:opacity-100"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      cat.allowed ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      cat.allowed
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {cat.allowed ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Permitted</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3" />
                        <span>Restricted</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="font-semibold text-xs text-slate-200">
                  {cat.name}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {cat.statusText}
                </p>
              </div>

              {cat.warning && (
                <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span className="truncate">{cat.warning}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
