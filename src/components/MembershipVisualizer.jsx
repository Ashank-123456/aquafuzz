"use client";

import { useState } from "react";
import { Compass, Info, CheckCircle2 } from "lucide-react";
import { PARAM_DEFINITIONS, OUTPUT_SETS } from "@/lib/fuzzyEngine";

export default function MembershipVisualizer({ inputs, evaluation }) {
  const [selectedParam, setSelectedParam] = useState("ph");

  const isOutput = selectedParam === "output";
  const def = isOutput ? null : PARAM_DEFINITIONS[selectedParam];
  const currentValue = isOutput ? evaluation.fwqi : (inputs[selectedParam] ?? def.default);

  // SVG Canvas dimensions
  const svgWidth = 700;
  const svgHeight = 260;
  const padding = { top: 30, right: 35, bottom: 40, left: 55 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const minX = isOutput ? 0 : def.min;
  const maxX = isOutput ? 100 : def.max;

  const scaleX = (val) => padding.left + ((val - minX) / (maxX - minX)) * plotWidth;
  const scaleY = (mu) => padding.top + (1 - mu) * plotHeight;

  // Generate curve path data
  const sets = isOutput ? OUTPUT_SETS : def.sets;
  const curvePaths = sets.map((set) => {
    const points = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const xVal = minX + (i / steps) * (maxX - minX);
      const mu = set.mf(xVal);
      points.push(`${scaleX(xVal)},${scaleY(mu)}`);
    }

    // Close path along the x-axis for area fill
    const pathD = `M ${scaleX(minX)},${scaleY(0)} L ${points.join(" L ")} L ${scaleX(maxX)},${scaleY(0)} Z`;
    const strokeD = `M ${points.join(" L ")}`;

    const currentMu = set.mf(currentValue);

    return {
      ...set,
      pathD,
      strokeD,
      currentMu: Number(currentMu.toFixed(3)),
      intersectY: scaleY(currentMu)
    };
  });

  const laserX = scaleX(currentValue);

  return (
    <div id="curves" className="glass-panel rounded-2xl p-5 md:p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Fuzzy Membership Function (MF) Curves
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize the continuous fuzzification geometry mapping crisp sensory inputs into linguistic truth degrees [0, 1].
          </p>
        </div>

        {/* Parameter Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {Object.keys(PARAM_DEFINITIONS).map((key) => {
            const p = PARAM_DEFINITIONS[key];
            const isSelected = selectedParam === key;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedParam(key)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title={`View ${p.name} Membership Curves`}
              >
                {p.name.split(" ")[0]}
              </button>
            );
          })}
          <button
            onClick={() => setSelectedParam("output")}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              isOutput
                ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
            title="View Output FWQI Linguistic Variable Curves"
          >
            Output FWQI
          </button>
        </div>
      </div>

      {/* SVG Canvas Plotter */}
      <div className="mt-4 bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[550px] select-none"
        >
          <defs>
            {curvePaths.map((set) => (
              <linearGradient
                key={`grad-${set.id}`}
                id={`grad-${set.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={set.color} stopOpacity="0.28" />
                <stop offset="100%" stopColor={set.color} stopOpacity="0.02" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines and axes */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((mu) => (
            <g key={`grid-y-${mu}`}>
              <line
                x1={padding.left}
                y1={scaleY(mu)}
                x2={svgWidth - padding.right}
                y2={scaleY(mu)}
                stroke="rgba(51, 65, 85, 0.35)"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={scaleY(mu) + 4}
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {mu.toFixed(2)}
              </text>
            </g>
          ))}

          {/* X-axis tick labels */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((ratio) => {
            const val = minX + ratio * (maxX - minX);
            const xPos = scaleX(val);
            return (
              <g key={`grid-x-${ratio}`}>
                <line
                  x1={xPos}
                  y1={svgHeight - padding.bottom}
                  x2={xPos}
                  y2={svgHeight - padding.bottom + 5}
                  stroke="#475569"
                />
                <text
                  x={xPos}
                  y={svgHeight - padding.bottom + 18}
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {val % 1 === 0 ? val : val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={svgWidth / 2}
            y={svgHeight - 6}
            fill="#cbd5e1"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            {isOutput ? "Water Quality Index Score (FWQI: 0 - 100)" : `${def.name} (${def.unit})`}
          </text>
          <text
            x={16}
            y={svgHeight / 2}
            fill="#94a3b8"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
            transform={`rotate(-90, 16, ${svgHeight / 2})`}
          >
            Membership Degree μ(x)
          </text>

          {/* Membership Curves with Fill & Stroke */}
          {curvePaths.map((set) => (
            <g key={set.id}>
              <path d={set.pathD} fill={`url(#grad-${set.id})`} />
              <path
                d={set.strokeD}
                fill="none"
                stroke={set.color}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          ))}

          {/* Vertical Scanline / Laser at Current Value */}
          <line
            x1={laserX}
            y1={padding.top}
            x2={laserX}
            y2={svgHeight - padding.bottom}
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="6 3"
          />

          {/* Intersect Dots with Membership Values */}
          {curvePaths.map((set) => {
            if (set.currentMu < 0.005) return null;
            return (
              <g key={`dot-${set.id}`}>
                <circle
                  cx={laserX}
                  cy={set.intersectY}
                  r="5"
                  fill={set.color}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="animate-pulse"
                />
                <rect
                  x={laserX + 8}
                  y={set.intersectY - 10}
                  width="72"
                  height="18"
                  rx="4"
                  fill="#0f172a"
                  stroke={set.color}
                  strokeWidth="1"
                />
                <text
                  x={laserX + 13}
                  y={set.intersectY + 3}
                  fill={set.color}
                  fontSize="9.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  μ={set.currentMu.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Needle Top Label */}
          <rect
            x={laserX - 35}
            y={8}
            width="70"
            height="18"
            rx="4"
            fill="#0284c7"
            stroke="#38bdf8"
            strokeWidth="1"
          />
          <text
            x={laserX}
            y={21}
            fill="#ffffff"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {currentValue} {isOutput ? "" : def.unit}
          </text>
        </svg>
      </div>

      {/* Curve Legend & Membership Values Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-4">
        {curvePaths.map((set) => {
          const isActive = set.currentMu > 0.01;
          return (
            <div
              key={set.id}
              className={`rounded-xl p-2.5 border transition-all ${
                isActive
                  ? "bg-slate-900 border-cyan-500/40 shadow-sm"
                  : "bg-slate-950/40 border-slate-800/80 opacity-60"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: set.color }}
                />
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {set.name}
                </span>
              </div>
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-[11px] text-slate-400">μ(x) =</span>
                <span
                  className="text-sm font-bold"
                  style={{ color: isActive ? set.color : "#94a3b8" }}
                >
                  {set.currentMu.toFixed(3)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Soft Computing Note */}
      <div className="mt-3.5 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          <strong>Linguistic Fuzzification:</strong> Instead of rigid binary cutoffs (e.g. pH 6.49 = 0 vs 6.50 = 1), Mamdani fuzzy sets overlap continuously, reflecting the inherent ambiguity of natural ecological thresholds.
        </span>
      </div>
    </div>
  );
}
