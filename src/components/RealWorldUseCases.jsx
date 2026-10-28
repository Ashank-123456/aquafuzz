"use client";

import { useState } from "react";
import { Fish, Sprout, HeartPulse, AlertTriangle, CheckCircle, ShieldAlert, Info } from "lucide-react";
import { evaluateAquacultureSuitability, evaluateAgriculturalSuitability, evaluateHealthAndPathogenRisk } from "@/lib/realWorldEngine";

export default function RealWorldUseCases({ inputs }) {
  const [activeTab, setActiveTab] = useState("health"); // 'health' | 'aquaculture' | 'agriculture'

  const healthData = evaluateHealthAndPathogenRisk(inputs);
  const aquaData = evaluateAquacultureSuitability(inputs);
  const agriData = evaluateAgriculturalSuitability(inputs);

  return (
    <div id="real-world-impact" className="glass-panel rounded-2xl p-5 md:p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Real-World Sector Impact & Threat Diagnostics
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Practical application to food security, public health disease prevention, and commercial aquaculture.
          </p>
        </div>

        {/* Sector Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("health")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "health"
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                : "text-slate-400 hover:text-white"
            }`}
            title="Public Health & Waterborne Pathogen Risk"
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Public Health</span>
          </button>
          <button
            onClick={() => setActiveTab("aquaculture")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "aquaculture"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
            title="Aquaculture & Commercial Fisheries"
          >
            <Fish className="w-3.5 h-3.5" />
            <span>Aquaculture</span>
          </button>
          <button
            onClick={() => setActiveTab("agriculture")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "agriculture"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
            title="Agriculture & Crop Irrigation Hazards"
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Agriculture</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Public Health & Epidemiological Disease Risk */}
      {activeTab === "health" && (
        <div className="mt-5 space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Risk Gauge */}
            <div className="bg-slate-900/80 rounded-xl p-4 border border-rose-500/30 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">
                  Waterborne Illness Vulnerability
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-black font-mono text-white">
                    {healthData.illnessRiskPercent}%
                  </span>
                  <span className="text-xs text-slate-400">estimated attack rate</span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Calculated based on turbidity pathogen shielding, potential coliform encapsulation, and disinfection resistance.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                Primary threats: Cryptosporidium, E. Coli, Rotavirus.
              </div>
            </div>

            {/* Pathogen Shielding */}
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                  Pathogen Shielding by Turbidity
                </span>
                <div className="text-xs font-semibold text-slate-200 mt-2">
                  {healthData.pathogenShielding}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Real-world fact: Suspended silt and organic particles absorb and scatter UV rays and deplete chlorine demand, shielding trapped pathogens from disinfectant contact.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-cyan-400">
                WHO Requirement: Turbidity &lt; 1.0 NTU for effective disinfection.
              </div>
            </div>

            {/* Heavy Metal Leaching */}
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-sky-400 tracking-wider">
                  Corrosive Plumbing Metal Leaching
                </span>
                <div className="text-xs font-semibold text-slate-200 mt-2">
                  {healthData.leadCopperLeachingHazard}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Water with acidic pH dissolves protective calcium carbonate passivating layers on lead and copper pipes, releasing neurotoxic heavy metals directly into tap water.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                Safe buffering range: pH 7.2 to 8.2 with orthophosphates.
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong>Public Health Directive:</strong> {healthData.recommendation}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Aquaculture & Fisheries Safety */}
      {activeTab === "aquaculture" && (
        <div className="mt-5 space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Hypoxia Asphyxiation Stress:</div>
                <div className="font-bold text-sm text-cyan-300 mt-0.5">{aquaData.hypoxiaSeverity}</div>
              </div>
              <Fish className="w-8 h-8 text-cyan-400/40" />
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Unionized Ammonia (NH3) Toxicity Risk:</div>
                <div className="font-bold text-sm text-amber-300 mt-0.5">{aquaData.ammoniaRiskLevel}</div>
              </div>
              <ShieldAlert className="w-8 h-8 text-amber-400/40" />
            </div>
          </div>

          {/* Species Suitability Table */}
          <div className="bg-slate-950/70 rounded-xl border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Fish / Crustacean Species</th>
                  <th className="py-2.5 px-3">Min. DO Required</th>
                  <th className="py-2.5 px-3">Optimal pH</th>
                  <th className="py-2.5 px-3">Survival Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {aquaData.species.map((sp, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="py-2 px-3 font-semibold text-slate-200">{sp.name}</td>
                    <td className="py-2 px-3 font-mono text-slate-300">{sp.minDO}</td>
                    <td className="py-2 px-3 font-mono text-slate-300">{sp.optimalPH}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                          sp.suitable
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {sp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2 p-2 bg-slate-900/60 rounded-lg border border-slate-800">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span><strong>Aquaculture Recommendation:</strong> {aquaData.keyIntervention}</span>
          </div>
        </div>
      )}

      {/* Tab 3: Agriculture & Crop Irrigation */}
      {activeTab === "agriculture" && (
        <div className="mt-5 space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] uppercase font-bold text-slate-400">Salinity Hazard (USSL)</span>
              <div className="text-sm font-bold text-emerald-400 mt-1">{agriData.salinityClass}</div>
              <p className="text-[11px] text-slate-400 mt-1">{agriData.salinityDescription}</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] uppercase font-bold text-slate-400">Drip Emitter Clogging</span>
              <div className="text-sm font-bold text-amber-400 mt-1">{agriData.dripCloggingRisk}</div>
              <p className="text-[11px] text-slate-400 mt-1">Suspended clay and silt choke micro-irrigation nozzles.</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] uppercase font-bold text-slate-400">Soil Infiltration Hazard</span>
              <div className="text-sm font-bold text-sky-400 mt-1">{agriData.soilHazard}</div>
              <p className="text-[11px] text-slate-400 mt-1">Extreme pH impairs micronutrient uptake.</p>
            </div>
          </div>

          {/* Crop Tolerance Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {agriData.crops.map((crop, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border ${
                  crop.suitable
                    ? "bg-slate-900/60 border-emerald-500/30 text-emerald-200"
                    : "bg-slate-950/70 border-rose-500/30 text-rose-300"
                }`}
              >
                <div className="font-semibold text-xs text-white">{crop.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Threshold: Max {crop.maxTDS}</div>
                <div className="mt-2 font-mono text-[11px] font-bold">
                  {crop.suitable ? "✅ Safe for Irrigation" : "❌ Osmotic Stunting Risk"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
