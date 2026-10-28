"use client";

import { useState } from "react";
import { Database, Upload, Download, AlertTriangle, CheckCircle, RefreshCw, Eye, FileText } from "lucide-react";
import { REAL_WORLD_DATASETS } from "@/lib/realWorldEngine";
import { evaluateFuzzyWaterQuality } from "@/lib/fuzzyEngine";

export default function BatchTelemetryAnalyzer({ onLoadSampleToSimulator }) {
  const [selectedDatasetId, setSelectedDatasetId] = useState("post_flood_disaster");
  const [customRecords, setCustomRecords] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const activeDataset = customRecords
    ? {
        name: "Custom Uploaded Telemetry Batch",
        location: "Uploaded File",
        description: "User-imported CSV sensor batch dataset.",
        records: customRecords
      }
    : REAL_WORLD_DATASETS.find((d) => d.id === selectedDatasetId) || REAL_WORLD_DATASETS[0];

  // Batch process all records through the Mamdani Fuzzy Engine
  const processedRecords = activeDataset.records.map((rec) => {
    const result = evaluateFuzzyWaterQuality({
      ph: rec.ph,
      turbidity: rec.turbidity,
      do: rec.do,
      tds: rec.tds
    });

    const violations = [];
    if (rec.ph < 6.5) violations.push(`Acidic pH (${rec.ph})`);
    if (rec.ph > 8.5) violations.push(`Alkaline pH (${rec.ph})`);
    if (rec.turbidity > 5.0) violations.push(`High Turbidity (${rec.turbidity} NTU)`);
    if (rec.do < 4.0) violations.push(`Hypoxia DO (${rec.do} mg/L)`);
    if (rec.tds > 1000) violations.push(`Excessive TDS (${rec.tds} ppm)`);

    return {
      ...rec,
      fwqi: result.fwqi,
      grade: result.classification.grade,
      status: result.classification.status,
      color: result.classification.color,
      isCompliant: violations.length === 0,
      violations
    };
  });

  // Calculate summary metrics
  const total = processedRecords.length;
  const compliantCount = processedRecords.filter((r) => r.isCompliant).length;
  const compliantPercent = total > 0 ? Math.round((compliantCount / total) * 100) : 0;
  const criticalCount = processedRecords.filter((r) => r.fwqi < 30).length;

  // Handle CSV file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const lines = text.split("\n").filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          setUploadError("CSV must contain a header and at least one data row.");
          return;
        }

        const headers = lines[0].toLowerCase().split(",").map((h) => h.trim().replace(/"/g, ""));
        const phIdx = headers.findIndex((h) => h.includes("ph"));
        const turbIdx = headers.findIndex((h) => h.includes("turb"));
        const doIdx = headers.findIndex((h) => h.includes("do") || h.includes("oxygen"));
        const tdsIdx = headers.findIndex((h) => h.includes("tds") || h.includes("solid"));

        if (phIdx === -1 || turbIdx === -1 || doIdx === -1 || tdsIdx === -1) {
          setUploadError("CSV must have columns for pH, Turbidity, DO, and TDS.");
          return;
        }

        const parsed = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map((c) => c.trim().replace(/"/g, ""));
          const ph = parseFloat(cols[phIdx]);
          const turbidity = parseFloat(cols[turbIdx]);
          const doVal = parseFloat(cols[doIdx]);
          const tds = parseFloat(cols[tdsIdx]);

          if (!isNaN(ph) && !isNaN(turbidity) && !isNaN(doVal) && !isNaN(tds)) {
            parsed.push({
              id: cols[0] || `S-${i}`,
              timestamp: cols[1] || `Sample ${i}`,
              location: cols[2] || "Imported Node",
              ph,
              turbidity,
              do: doVal,
              tds
            });
          }
        }

        if (parsed.length === 0) {
          setUploadError("No valid rows could be parsed.");
          return;
        }

        setCustomRecords(parsed);
      } catch (err) {
        setUploadError("Failed to parse CSV file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleExportAuditReport = () => {
    const headers = "Sample ID,Timestamp,Location,pH,Turbidity (NTU),DO (mg/L),TDS (ppm),Fuzzy WQI,Grade,Status,Compliance,Violations\n";
    const rows = processedRecords
      .map(
        (r) =>
          `"${r.id}","${r.timestamp}","${r.location}",${r.ph},${r.turbidity},${r.do},${r.tds},${r.fwqi},"${r.grade}","${r.status}","${
            r.isCompliant ? "COMPLIANT" : "VIOLATION"
          }","${r.violations.join("; ")}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `aquafuzz_audit_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="batch-telemetry" className="glass-panel rounded-2xl p-5 md:p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Real-World IoT & CSV Batch Telemetry Ingestion
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Solves municipal regulatory compliance: batch-processes multi-node sensor logs, flags legal standard violations, and exports audit logs.
          </p>
        </div>

        {/* Actions: CSV Upload & Download Report */}
        <div className="flex items-center gap-2">
          <label className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={handleExportAuditReport}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Download analyzed audit report with legal pass/fail tags"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Audit Report</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="mt-3 p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
          {uploadError}
        </div>
      )}

      {/* Dataset Selection Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium mr-1">
            Real Crisis Datasets:
          </span>
          {REAL_WORLD_DATASETS.map((ds) => (
            <button
              key={ds.id}
              onClick={() => {
                setSelectedDatasetId(ds.id);
                setCustomRecords(null);
              }}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                selectedDatasetId === ds.id && !customRecords
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              }`}
              title={ds.description}
            >
              {ds.name.split(" ")[0]} ({ds.records.length} nodes)
            </button>
          ))}
          {customRecords && (
            <span className="text-xs px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
              Active: Custom Uploaded ({customRecords.length} rows)
            </span>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Samples</div>
          <div className="text-2xl font-black font-mono text-white mt-0.5">{total}</div>
        </div>
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Compliance Rate</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">{compliantPercent}%</div>
        </div>
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Critical Hazards</div>
          <div className="text-2xl font-black font-mono text-rose-400 mt-0.5">{criticalCount}</div>
        </div>
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Environment</div>
          <div className="text-xs font-semibold text-cyan-300 mt-1 truncate">{activeDataset.location}</div>
        </div>
      </div>

      {/* Processed Batch Records Table */}
      <div className="mt-4 bg-slate-950/80 rounded-xl border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold">
              <th className="py-2.5 px-3">Node / ID</th>
              <th className="py-2.5 px-3">Location / Time</th>
              <th className="py-2.5 px-3">pH</th>
              <th className="py-2.5 px-3">Turbidity</th>
              <th className="py-2.5 px-3">DO</th>
              <th className="py-2.5 px-3">TDS</th>
              <th className="py-2.5 px-3">Fuzzy Score</th>
              <th className="py-2.5 px-3">Compliance</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {processedRecords.map((r, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-2.5 px-3 font-bold text-cyan-400">{r.id}</td>
                <td className="py-2.5 px-3 font-sans text-slate-300">
                  <div className="font-medium text-xs">{r.location}</div>
                  <div className="text-[10px] text-slate-500">{r.timestamp}</div>
                </td>
                <td className="py-2.5 px-3 text-slate-200">{r.ph}</td>
                <td className="py-2.5 px-3 text-slate-200">{r.turbidity} NTU</td>
                <td className="py-2.5 px-3 text-slate-200">{r.do} mg/L</td>
                <td className="py-2.5 px-3 text-slate-200">{r.tds} ppm</td>
                <td className="py-2.5 px-3">
                  <span
                    className="font-black px-2 py-0.5 rounded border text-[11px]"
                    style={{
                      backgroundColor: `${r.color}15`,
                      borderColor: `${r.color}40`,
                      color: r.color
                    }}
                  >
                    {r.fwqi} ({r.grade})
                  </span>
                </td>
                <td className="py-2.5 px-3 font-sans">
                  {r.isCompliant ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Compliant</span>
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400"
                      title={r.violations.join(", ")}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{r.violations[0]}</span>
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => onLoadSampleToSimulator(r)}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-semibold border border-cyan-500/30 transition-all cursor-pointer"
                    title="Load these sensor readings into the live simulator above"
                  >
                    Simulate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
