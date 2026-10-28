"use client";

import { X, Printer, Droplets, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { PARAM_DEFINITIONS } from "@/lib/fuzzyEngine";

export default function ReportModal({ isOpen, onClose, inputs, evaluation }) {
  if (!isOpen) return null;

  const { fwqi, classification, classicalComparison, recommendations, activeRuleCount, defuzzMethod, tNorm } = evaluation;
  const certId = `FWQA-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden my-8 print:border-none print:shadow-none print:my-0 print:bg-white print:text-black">
        {/* Header Controls (No-print) */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-sm text-white">
              Official Water Quality Assessment Certificate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Print Certificate or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Certificate Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Body */}
        <div className="p-8 space-y-6 print:p-0">
          {/* Top Banner / Watermark Header */}
          <div className="border-b-2 border-cyan-500/30 pb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white print:text-black">
                  AQUA<span className="text-cyan-400 print:text-cyan-700">FUZZ</span> AI
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 print:border-black print:text-black">
                  ISO-14001 / WHO COMPLIANT
                </span>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
                Soft Computing Environmental Assessment Laboratory • Fuzzy Logic Division
              </p>
            </div>

            <div className="text-right text-xs font-mono">
              <div className="text-slate-400 print:text-gray-600">Certificate ID:</div>
              <div className="font-bold text-cyan-400 print:text-black">{certId}</div>
              <div className="text-[11px] text-slate-500 print:text-gray-500 mt-0.5">{dateStr}</div>
            </div>
          </div>

          {/* Primary Assessment Score Box */}
          <div className="rounded-xl p-5 border flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 border-slate-800 print:bg-gray-100 print:border-gray-300">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 print:text-gray-600 tracking-wider">
                Fuzzy Water Quality Index (FWQI)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black font-mono text-white print:text-black">
                  {fwqi}
                </span>
                <span className="text-sm font-semibold text-slate-400 print:text-gray-500">/ 100</span>
                <span
                  className="font-mono text-sm font-bold px-2.5 py-0.5 rounded-full ml-2 border"
                  style={{
                    backgroundColor: `${classification.color}20`,
                    borderColor: `${classification.color}50`,
                    color: classification.color
                  }}
                >
                  Grade {classification.grade}
                </span>
              </div>
              <p className="text-xs text-slate-300 print:text-gray-700 mt-2 max-w-md">
                {classification.summary}
              </p>
            </div>

            <div className="text-right font-mono text-xs space-y-1">
              <div>
                <span className="text-slate-400 print:text-gray-600">Model: </span>
                <strong className="text-slate-200 print:text-black">Mamdani FIS</strong>
              </div>
              <div>
                <span className="text-slate-400 print:text-gray-600">T-Norm: </span>
                <strong className="text-slate-200 print:text-black uppercase">{tNorm}</strong>
              </div>
              <div>
                <span className="text-slate-400 print:text-gray-600">Defuzzification: </span>
                <strong className="text-slate-200 print:text-black uppercase">{defuzzMethod}</strong>
              </div>
              <div>
                <span className="text-slate-400 print:text-gray-600">Active Rules: </span>
                <strong className="text-slate-200 print:text-black">{activeRuleCount} / 20</strong>
              </div>
            </div>
          </div>

          {/* Tested Parameters Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black mb-2">
              Laboratory Sensor Readings
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 print:border-gray-300 bg-slate-950/40 print:bg-gray-100 text-slate-400 print:text-gray-700">
                    <th className="py-2 px-3">Parameter</th>
                    <th className="py-2 px-3">Measured Value</th>
                    <th className="py-2 px-3">WHO Standard</th>
                    <th className="py-2 px-3">Fuzzy Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-gray-200 font-mono">
                  {Object.keys(PARAM_DEFINITIONS).map((key) => {
                    const def = PARAM_DEFINITIONS[key];
                    const val = inputs[key] ?? def.default;
                    return (
                      <tr key={key} className="text-slate-200 print:text-black">
                        <td className="py-2 px-3 font-sans font-medium">{def.name}</td>
                        <td className="py-2 px-3 font-bold text-cyan-400 print:text-black">
                          {val} {def.unit}
                        </td>
                        <td className="py-2 px-3 text-slate-400 print:text-gray-600">{def.standardIdeal}</td>
                        <td className="py-2 px-3 font-sans">
                          {val < def.min * 1.5 || val > def.max * 0.85 ? (
                            <span className="text-amber-400 print:text-amber-700">Borderline / Outlier</span>
                          ) : (
                            <span className="text-emerald-400 print:text-emerald-700">In Standard</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Use Suitability Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black mb-2">
              Authorized Use Classification
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-950/40 border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <span className="text-slate-400 print:text-gray-600 block">Drinking / Potable:</span>
                <strong className={classification.potable ? "text-emerald-400 print:text-black" : "text-rose-400 print:text-black"}>
                  {classification.potable ? "Approved" : "Restricted (Non-potable)"}
                </strong>
              </div>
              <div className="p-2 rounded bg-slate-950/40 border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <span className="text-slate-400 print:text-gray-600 block">Aquatic Ecosystem:</span>
                <strong className={classification.aquaticSafe ? "text-emerald-400 print:text-black" : "text-rose-400 print:text-black"}>
                  {classification.aquaticSafe ? "Supported" : "Hypoxic Threat"}
                </strong>
              </div>
              <div className="p-2 rounded bg-slate-950/40 border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <span className="text-slate-400 print:text-gray-600 block">Agricultural Irrigation:</span>
                <strong className={classification.irrigationSafe ? "text-emerald-400 print:text-black" : "text-rose-400 print:text-black"}>
                  {classification.irrigationSafe ? "Permitted" : "Saline/Acidic Risk"}
                </strong>
              </div>
            </div>
          </div>

          {/* Signatures & Certification Seal */}
          <div className="pt-6 border-t-2 border-slate-800 print:border-gray-300 flex items-end justify-between">
            <div className="text-[11px] text-slate-400 print:text-gray-500 max-w-xs">
              This certificate verifies the non-linear fuzzy modeling of water quality using Mamdani inference. Calculations executed per soft computing principles.
            </div>

            <div className="text-right">
              <div className="font-serif italic text-base text-cyan-300 print:text-black">
                Ashank Gupta
              </div>
              <div className="text-[10px] text-slate-400 print:text-gray-600 font-mono">
                Lead Soft Computing Analyst
              </div>
              <div className="text-[9px] text-slate-500 print:text-gray-400">
                Environmental Intelligence Lab
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
