"use client";

import { useState } from "react";
import { Compass, GitBranch, BookOpen, HeartPulse, Database } from "lucide-react";
import MembershipVisualizer from "./MembershipVisualizer";
import RuleInspector from "./RuleInspector";
import RealWorldUseCases from "./RealWorldUseCases";
import BatchTelemetryAnalyzer from "./BatchTelemetryAnalyzer";
import TheorySection from "./TheorySection";

/**
 * FuzzyEngineTabs Component
 * 
 * Unifies advanced fuzzy inference visualizations, real-world sector diagnostics,
 * batch telemetry analysis, and theoretical documentation into a clean tabbed console.
 * 
 * @param {Object} props
 * @param {Object} props.inputs - Current sensory values.
 * @param {Object} props.evaluation - Computed Mamdani fuzzy assessment.
 * @param {Object} props.options - T-norm and defuzzification configurations.
 * @param {Function} props.onLoadSample - Callback to load a sample into live sliders.
 */
export default function FuzzyEngineTabs({ inputs, evaluation, options, onLoadSample }) {
  const [activeTab, setActiveTab] = useState("curves");

  const tabs = [
    { id: "curves", label: "Membership Curves", icon: Compass, title: "View interactive fuzzy membership function curves (SVG)" },
    { id: "rules", label: "Rule Base & Centroid", icon: GitBranch, title: "Examine Mamdani active rules and aggregate centroid defuzzification" },
    { id: "sectors", label: "Sector Diagnostics", icon: HeartPulse, title: "Review public health, aquaculture, and crop irrigation hazards" },
    { id: "telemetry", label: "Batch IoT Ingestion", icon: Database, title: "Batch-process CSV sensor logs and verify legal compliance" },
    { id: "theory", label: "Theory & Math", icon: BookOpen, title: "Read Soft Computing Mamdani mathematical formulations" }
  ];

  return (
    <div id="fuzzy-engine" className="space-y-4">
      {/* Tab Switcher Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Advanced Intelligence & Diagnostics
          </h3>
        </div>

        {/* Tab Buttons Bar */}
        <div className="flex items-center p-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.title}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Panels */}
      <div className="transition-all duration-200">
        {activeTab === "curves" && (
          <MembershipVisualizer inputs={inputs} evaluation={evaluation} />
        )}
        {activeTab === "rules" && (
          <RuleInspector evaluation={evaluation} options={options} />
        )}
        {activeTab === "sectors" && (
          <RealWorldUseCases inputs={inputs} />
        )}
        {activeTab === "telemetry" && (
          <BatchTelemetryAnalyzer onLoadSampleToSimulator={onLoadSample} />
        )}
        {activeTab === "theory" && (
          <TheorySection />
        )}
      </div>
    </div>
  );
}
