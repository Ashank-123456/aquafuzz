"use client";

export default function BrandLogo({ size = 36, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Custom Vector Brand Mark */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-500 p-[1.5px] shadow-lg shadow-cyan-500/20"
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full bg-[#070d1e] rounded-[10px] flex items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5"
          >
            <defs>
              <linearGradient id="dropGrad" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="nodeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {/* Stylized Geometric Water Droplet Silhouette */}
            <path
              d="M16 4C16 4 7 14.5 7 20C7 24.9706 11.0294 28 16 28C20.9706 28 25 24.9706 25 20C25 14.5 16 4 16 4Z"
              stroke="url(#dropGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Inner Fuzzy Logic Interconnected Nodes */}
            <line x1="12" y1="21" x2="16" y2="15" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1.5" />
            <line x1="20" y1="21" x2="16" y2="15" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1.5" />
            <line x1="12" y1="21" x2="20" y2="21" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1.5" />

            <circle cx="16" cy="15" r="2" fill="url(#nodeGrad)" />
            <circle cx="12" cy="21" r="1.8" fill="#38bdf8" />
            <circle cx="20" cy="21" r="1.8" fill="#10b981" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="leading-tight">
        <span className="font-extrabold tracking-tight text-white text-base sm:text-lg flex items-center">
          Aqua<span className="text-cyan-400">Fuzz</span>
          <span className="ml-1.5 text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            AI
          </span>
        </span>
      </div>
    </div>
  );
}
