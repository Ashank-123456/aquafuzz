"use client";

import { Scale, AlertCircle, CheckCircle, ShieldCheck } from "lucide-react";

export default function ComparisonCard({ fwqi, classicalComparison, classification }) {
  const diff = Number((fwqi - classicalComparison.index).toFixed(2));
  const isDivergent = Math.abs(diff) >= 8;

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Soft Computing vs Classical Index Comparison
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Brown et al. Arithmetic Baseline
        </span>
      </div>

      {/* Side-by-side Comparison Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {/* Mamdani Fuzzy System Box */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-cyan-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Mamdani Fuzzy Inference (Soft Computing)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              Non-Linear
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{fwqi}</span>
            <span className="text-xs text-slate-400">/ 100</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded ml-auto"
              style={{
                backgroundColor: `${classification.color}20`,
                color: classification.color
              }}
            >
              Grade {classification.grade}
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Eliminates arbitrary rigid cutoffs. Dynamically prioritizes critical environmental hazards via multi-rule antecedent matching.
          </p>
        </div>

        {/* Classical Weighted Arithmetic Box */}
        <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Classical Arithmetic WQI
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              Linear Weighted
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-300 font-mono">
              {classicalComparison.index}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
            <span className="text-xs font-mono text-slate-400 ml-auto">
              Linear Sum
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Computes Σ(Wi · qi). Prone to &quot;masking&quot; where high values in one parameter mathematically conceal toxic spikes in another.
          </p>
        </div>
      </div>

      {/* Divergence Insight */}
      <div className={`mt-4 p-3.5 rounded-xl border flex items-start gap-3 ${
        isDivergent
          ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
          : "bg-slate-900/60 border-slate-800 text-slate-300"
      }`}>
        <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isDivergent ? "text-amber-400" : "text-cyan-400"}`} />
        <div className="text-xs leading-relaxed">
          <strong>Key Soft Computing Takeaway:</strong> {classicalComparison.critique}
        </div>
      </div>
    </div>
  );
}
