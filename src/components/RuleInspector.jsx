"use client";

import { useState } from "react";
import { GitBranch, Check, Layers, Search, BarChart3, ChevronRight } from "lucide-react";
import { FUZZY_RULES, OUTPUT_SETS } from "@/lib/fuzzyEngine";

export default function RuleInspector({ evaluation, options }) {
  const { evaluatedRules, fwqi, aggregatedCurve, ruleFiringsByOutput, defuzzMethod } = evaluation;
  const [filterMode, setFilterMode] = useState("active"); // 'active' | 'all'
  const [searchTerm, setSearchTerm] = useState("");

  const displayedRules = evaluatedRules.filter((r) => {
    if (filterMode === "active" && r.firingStrength < 0.005) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.rationale.toLowerCase().includes(q) ||
        r.output.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // SVG Defuzzification Surface geometry
  const svgWidth = 650;
  const svgHeight = 180;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const scaleX = (z) => padding.left + (z / 100) * plotWidth;
  const scaleY = (mu) => padding.top + (1 - mu) * plotHeight;

  // Build aggregated polygon path
  const polyPoints = aggregatedCurve.map((pt) => `${scaleX(pt.z)},${scaleY(pt.mu)}`);
  const aggregatedPathD = `M ${scaleX(0)},${scaleY(0)} L ${polyPoints.join(" L ")} L ${scaleX(100)},${scaleY(0)} Z`;
  const aggregatedStrokeD = `M ${polyPoints.join(" L ")}`;

  const centroidX = scaleX(fwqi);

  return (
    <div id="inference" className="glass-panel rounded-2xl p-5 md:p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Mamdani Rule Base & Defuzzification
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Examine the fuzzy implication step (min/product clipping) and the aggregate defuzzified output surface.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilterMode("active")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                filterMode === "active"
                  ? "bg-sky-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Show only rules with firing strength > 0"
            >
              Active Fired ({evaluation.activeRuleCount})
            </button>
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                filterMode === "all"
                  ? "bg-sky-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Show all 20 rules in the rule base"
            >
              All Rules ({FUZZY_RULES.length})
            </button>
          </div>
        </div>
      </div>

      {/* Defuzzification Surface Visualizer */}
      <div className="mt-5 p-4 bg-slate-950/70 rounded-xl border border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Aggregated Fuzzy Output Surface & Centroid Needle (z*)
            </span>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800/40">
            Defuzz Method: <strong className="uppercase">{defuzzMethod}</strong> (z* = {fwqi})
          </span>
        </div>

        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[500px] select-none"
          >
            <defs>
              <linearGradient id="defuzzGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Y grid */}
            {[0, 0.5, 1.0].map((mu) => (
              <g key={`y-${mu}`}>
                <line
                  x1={padding.left}
                  y1={scaleY(mu)}
                  x2={svgWidth - padding.right}
                  y2={scaleY(mu)}
                  stroke="rgba(51, 65, 85, 0.3)"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={scaleY(mu) + 3}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {mu.toFixed(1)}
                </text>
              </g>
            ))}

            {/* X axis ticks */}
            {[0, 25, 50, 75, 100].map((tick) => (
              <g key={`x-${tick}`}>
                <line
                  x1={scaleX(tick)}
                  y1={svgHeight - padding.bottom}
                  x2={scaleX(tick)}
                  y2={svgHeight - padding.bottom + 5}
                  stroke="#475569"
                />
                <text
                  x={scaleX(tick)}
                  y={svgHeight - padding.bottom + 16}
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {tick}
                </text>
              </g>
            ))}

            {/* Aggregated Fuzzy Region Fill & Stroke */}
            <path d={aggregatedPathD} fill="url(#defuzzGrad)" />
            <path
              d={aggregatedStrokeD}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
            />

            {/* Centroid / Defuzzified Value Line */}
            <line
              x1={centroidX}
              y1={padding.top}
              x2={centroidX}
              y2={svgHeight - padding.bottom}
              stroke="#f59e0b"
              strokeWidth="2.5"
            />
            {/* Centroid Pointer Bubble */}
            <circle
              cx={centroidX}
              cy={padding.top + 6}
              r="4"
              fill="#f59e0b"
              stroke="#0f172a"
              strokeWidth="2"
            />
            <rect
              x={centroidX - 35}
              y={padding.top - 18}
              width="70"
              height="18"
              rx="4"
              fill="#b45309"
              stroke="#f59e0b"
              strokeWidth="1"
            />
            <text
              x={centroidX}
              y={padding.top - 5}
              fill="#ffffff"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor="middle"
            >
              z* = {fwqi}
            </text>
          </svg>
        </div>

        {/* Aggregated Output Strengths per Category */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
          {OUTPUT_SETS.map((out) => {
            const cut = ruleFiringsByOutput[out.id] || 0;
            return (
              <div
                key={out.id}
                className="bg-slate-900/80 px-2 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: out.color }}
                  />
                  <span className="text-slate-300 font-medium truncate">{out.name.split("/")[0]}</span>
                </div>
                <span className="font-mono font-bold text-slate-100">
                  {cut.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules Table Header / Search */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Evaluated Rule Table ({displayedRules.length} matching)
        </span>
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Rule Cards Grid */}
      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
        {displayedRules.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No rules match the current criteria.
          </div>
        ) : (
          displayedRules.map((rule) => {
            const outSet = OUTPUT_SETS.find((s) => s.id === rule.output);
            const isActive = rule.firingStrength > 0.005;

            return (
              <div
                key={rule.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isActive
                    ? "bg-slate-900/70 border-sky-500/30 hover:border-sky-500/60"
                    : "bg-slate-950/40 border-slate-800/60 opacity-60"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      R{rule.id < 10 ? `0${rule.id}` : rule.id}
                    </span>
                    <span className="font-semibold text-xs text-white">
                      {rule.name}
                    </span>
                  </div>

                  {/* Firing Strength Badge */}
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-400">Firing Strength (α):</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        isActive
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {rule.firingStrength.toFixed(3)}
                    </span>
                  </div>
                </div>

                {/* Antecedents -> Consequent */}
                <div className="text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex flex-wrap items-center gap-1.5 font-mono">
                  <span className="text-sky-400 font-bold">IF</span>
                  {Object.entries(rule.conditions).map(([param, set], idx) => {
                    const condDeg = rule.conditionStrengths?.[param]?.degree ?? 0;
                    return (
                      <span key={param} className="flex items-center">
                        <span className="text-slate-400">{param.toUpperCase()}</span>
                        <span className="text-slate-500 mx-0.5">is</span>
                        <span className="text-slate-200 font-semibold">{set}</span>
                        <span className="text-[10px] text-cyan-400 ml-0.5">
                          ({condDeg.toFixed(2)})
                        </span>
                        {idx < Object.keys(rule.conditions).length - 1 && (
                          <span className="text-sky-400 font-bold ml-1.5 mr-0.5">AND</span>
                        )}
                      </span>
                    );
                  })}
                  <span className="text-emerald-400 font-bold ml-1">THEN</span>
                  <span className="text-slate-400">QUALITY</span>
                  <span className="text-slate-500 mx-0.5">is</span>
                  <span
                    className="font-bold px-1.5 py-0.2 rounded"
                    style={{
                      color: outSet?.color || "#ffffff",
                      backgroundColor: `${outSet?.color || "#ffffff"}20`
                    }}
                  >
                    {outSet?.name || rule.output}
                  </span>
                </div>

                {/* Rationale */}
                <p className="text-[11px] text-slate-400 mt-2 italic leading-relaxed">
                  Rationale: {rule.rationale}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
