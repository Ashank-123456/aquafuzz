"use client";

import { BookOpen, BrainCircuit, Sigma, CheckCircle, Award } from "lucide-react";

export default function TheorySection() {
  return (
    <div id="theory" className="glass-panel rounded-2xl p-6 md:p-8 shadow-2xl">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Soft Computing Theory: Fuzzy Water Quality Modeling
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mathematical formulation, linguistic variable mapping, and Mamdani approximate reasoning architecture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30">
            Soft Computing Lab • Ashank Gupta
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* Pillar 1: Hard vs Soft Computing */}
        <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center mb-3">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white mb-2">
              1. The Soft Computing Paradigm
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlike conventional <em>Hard Computing</em> that demands exact binary true/false classifications and rigid mathematical models, <strong>Soft Computing</strong> embraces:
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 mt-3">
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>Tolerance for Imprecision:</strong> Environmental sensors inherently possess measurement noise.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>Approximate Reasoning:</strong> Human experts classify water quality in linguistic gradations (e.g. &quot;slightly murky&quot;), not binary cliffs.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>Tractability & Robustness:</strong> Resilient against sensor outliers.</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-purple-300 italic">
            &quot;In soft computing, truth is a matter of degree.&quot; — Lotfi Zadeh (1973)
          </div>
        </div>

        {/* Pillar 2: Mamdani Fuzzy System Math */}
        <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-3">
              <Sigma className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white mb-2">
              2. Mamdani Mathematical Formalism
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-mono">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-cyan-400 font-bold mb-0.5">Triangular MF:</div>
                <div className="text-[11px] text-slate-300">
                  μ(x; a, b, c) = max(min((x-a)/(b-a), (c-x)/(c-b)), 0)
                </div>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-cyan-400 font-bold mb-0.5">T-Norm (Antecedent Min):</div>
                <div className="text-[11px] text-slate-300">
                  α_k = min(μ_pH, μ_Turb, μ_DO, μ_TDS)
                </div>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-cyan-400 font-bold mb-0.5">Centroid Defuzzification (COG):</div>
                <div className="text-[11px] text-slate-300">
                  z* = [ ∫ z · μ_agg(z) dz ] / [ ∫ μ_agg(z) dz ]
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Centroid integrates the geometric center of gravity across all clipped consequents.
          </div>
        </div>

        {/* Pillar 3: Overcoming Crisp Failure Modes */}
        <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white mb-2">
              3. Elimination of Boolean &quot;Cliff Effects&quot;
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard regulatory guidelines specify rigid thresholds (e.g., pH 6.5 to 8.5). In classical crisp logic:
            </p>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono my-2.5 space-y-1">
              <div className="text-rose-400">pH 6.49 ➔ Fails compliance (0%)</div>
              <div className="text-emerald-400">pH 6.50 ➔ 100% Acceptable (Safe)</div>
              <div className="text-[10px] text-slate-500 mt-1 font-sans">
                A 0.01 delta completely inverts the safety verdict!
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fuzzy Logic eliminates this cliff by allowing continuous partial membership across the transitional zone, mirroring actual biological toxicology.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Robust • Explainable • ISO/WHO Aligned</span>
          </div>
        </div>
      </div>
    </div>
  );
}
