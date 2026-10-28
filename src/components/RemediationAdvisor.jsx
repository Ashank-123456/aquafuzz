"use client";

import { Wrench, ShieldCheck, AlertTriangle, ArrowRight } from "lucide-react";

export default function RemediationAdvisor({ recommendations }) {
  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Remediation & Water Treatment Advisory
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Targeted Protocol
        </span>
      </div>

      <div className="space-y-3 pt-4">
        {recommendations.map((rec, index) => {
          const isHigh = rec.priority === "high";
          const isMedium = rec.priority === "medium";

          return (
            <div
              key={index}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                isHigh
                  ? "bg-rose-950/20 border-rose-500/30 text-rose-200"
                  : isMedium
                  ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                  : "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isHigh
                    ? "bg-rose-500/20 text-rose-400"
                    : isMedium
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {isHigh ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs text-white">
                    {rec.title}
                  </h4>
                  <span
                    className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                      isHigh
                        ? "bg-rose-500/20 text-rose-300"
                        : isMedium
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    Priority: {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {rec.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
