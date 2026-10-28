"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Download, RefreshCw, MapPin } from "lucide-react";
import { evaluateFuzzyWaterQuality } from "@/lib/fuzzyEngine";

const INITIAL_STATIONS = [
  {
    id: 1,
    name: "Glacier Ridge Headwaters",
    elevation: "2,450 m",
    distance: "0 km",
    environment: "Alpine Glacial Melting Zone",
    params: { ph: 7.3, turbidity: 0.6, do: 10.4, tds: 95 }
  },
  {
    id: 2,
    name: "Pine Valley Tributary",
    elevation: "1,520 m",
    distance: "35 km",
    environment: "Montane Forest Runoff",
    params: { ph: 7.4, turbidity: 2.2, do: 8.4, tds: 180 }
  },
  {
    id: 3,
    name: "Clover Creek Agricultural Inflow",
    elevation: "780 m",
    distance: "85 km",
    environment: "Intensive Farmland & Fertilizer Runoff",
    params: { ph: 6.6, turbidity: 14.5, do: 5.6, tds: 490 }
  },
  {
    id: 4,
    name: "Metro-City Municipal Confluence",
    elevation: "240 m",
    distance: "140 km",
    environment: "Urban Stormwater & Treated Wastewater",
    params: { ph: 7.8, turbidity: 22.0, do: 4.2, tds: 640 }
  },
  {
    id: 5,
    name: "Harbor Delta Industrial Estuary",
    elevation: "15 m",
    distance: "210 km",
    environment: "Industrial Heavy Outfall & Saline Mixing",
    params: { ph: 5.8, turbidity: 45.0, do: 2.5, tds: 1150 }
  }
];

export default function RiverBasinSimulator({ onLoadStationParams }) {
  const [stations, setStations] = useState(INITIAL_STATIONS);

  // Evaluate all stations with fuzzy engine
  const evaluatedStations = stations.map((st) => {
    const result = evaluateFuzzyWaterQuality(st.params);
    return {
      ...st,
      result
    };
  });

  const handleExportCSV = () => {
    const headers = "Station ID,Name,Distance (km),Elevation,pH,Turbidity (NTU),DO (mg/L),TDS (ppm),Fuzzy WQI,Grade,Status\n";
    const rows = evaluatedStations.map((st) => {
      const r = st.result;
      return `${st.id},"${st.name}",${st.distance},"${st.elevation}",${st.params.ph},${st.params.turbidity},${st.params.do},${st.params.tds},${r.fwqi},${r.classification.grade},"${r.classification.status}"`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `aquafuzz_river_basin_survey_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="river-route" className="glass-panel rounded-2xl p-5 md:p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              River Basin Continuum: Multi-Station Longitudinal Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate pollutant accumulation, biochemical degradation, and self-purification dynamics across an entire watershed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Download survey readings as CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* River Elevation & Quality Progression Diagram */}
      <div className="mt-5 p-4 bg-slate-950/80 rounded-xl border border-slate-800/80">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Downstream Water Quality Trajectory (Headwaters → Estuary)
        </div>

        {/* Stations Line */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {evaluatedStations.map((st, index) => {
            const { fwqi, classification } = st.result;
            return (
              <div
                key={st.id}
                className="bg-slate-900/70 rounded-xl p-3.5 border transition-all hover:scale-[1.02] flex flex-col justify-between group"
                style={{ borderColor: `${classification.color}35` }}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-cyan-400 font-bold">
                      Station #{st.id}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {st.distance}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                    {st.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{st.elevation}</span>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-1 italic line-clamp-2">
                    {st.environment}
                  </p>
                </div>

                {/* Score & Status */}
                <div className="mt-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">Fuzzy WQI</div>
                      <div
                        className="font-mono font-black text-xl"
                        style={{ color: classification.color }}
                      >
                        {fwqi}
                      </div>
                    </div>
                    <span
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: `${classification.color}15`,
                        borderColor: `${classification.color}40`,
                        color: classification.color
                      }}
                    >
                      Grade {classification.grade}
                    </span>
                  </div>

                  {/* Parameter chips */}
                  <div className="grid grid-cols-2 gap-1 text-[9.5px] font-mono text-slate-400 mt-2 bg-slate-950/70 p-1.5 rounded">
                    <span>pH: <strong className="text-slate-200">{st.params.ph}</strong></span>
                    <span>Turb: <strong className="text-slate-200">{st.params.turbidity}</strong></span>
                    <span>DO: <strong className="text-slate-200">{st.params.do}</strong></span>
                    <span>TDS: <strong className="text-slate-200">{st.params.tds}</strong></span>
                  </div>

                  {/* Load to Simulator button */}
                  <button
                    onClick={() => onLoadStationParams(st.params)}
                    className="w-full mt-2.5 py-1 text-[11px] font-semibold text-cyan-400 hover:text-white bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-800/40 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                    title="Load these sensor readings into the live simulator above"
                  >
                    <span>Load in Simulator</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
