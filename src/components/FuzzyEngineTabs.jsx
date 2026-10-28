"use client";

import { useState } from "react";
import { Compass, GitBranch, BookOpen } from "lucide-react";
import MembershipVisualizer from "./MembershipVisualizer";
import RuleInspector from "./RuleInspector";
import TheorySection from "./TheorySection";

export default function FuzzyEngineTabs({ inputs, evaluation, options }) {
  const [activeTab, setActiveTab] = useState("curves"); // 'curves' | 'rules' | 'theory'

  return (
    <div id="fuzzy-engine" className="space-y-4">
      {/* Sleek Segmented Tab Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Fuzzy Inference Engine
          </h3>
        </div>

        <div className="flex items-center p-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("curves")}
            className={`px-3.5 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "curves"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Membership Curves</span>
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`px-3.5 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "rules"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Rule Matrix & Centroid</span>
          </button>
          <button
            onClick={() => setActiveTab("theory")}
            className={`px-3.5 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "theory"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Theory & Math</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === "curves" && (
        <MembershipVisualizer inputs={inputs} evaluation={evaluation} />
      )}
      {activeTab === "rules" && (
        <RuleInspector evaluation={evaluation} options={options} />
      )}
      {activeTab === "theory" && (
        <TheorySection />
      )}
    </div>
  );
}
