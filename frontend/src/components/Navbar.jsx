import React from 'react';
import { Cpu, Database, Play, RefreshCw, Zap, Sparkles, ShieldCheck } from 'lucide-react';

export default function Navbar({ onStartDemo, onResetDemo, isDemoActive }) {
  return (
    <header className="glass-panel border-b border-slate-800/80 sticky top-0 z-50 px-3.5 sm:px-8 py-2.5 sm:py-3.5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
          <div className="relative group flex items-center justify-center shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-xl sm:rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-glow"></div>
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-700/80 flex items-center justify-center shadow-2xl">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 group-hover:scale-110 transition duration-300" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
              </span>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-white font-sans truncate">
                DealPulse <span className="gradient-text">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 shrink-0">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Hindsight SDK 1.0
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-400 font-medium tracking-wide">
              Autonomous Account Intelligence powered by <span className="text-cyan-400 font-semibold">Vectorize Hindsight</span>
            </p>
          </div>
        </div>

        {/* Status Pill & Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Hindsight Live Radar Pill */}
          <div className="hidden lg:flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
            <div className="flex items-center space-x-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400 text-[11px] font-medium">Memory:</span>
              <span className="text-emerald-400 text-xs font-mono font-bold tracking-wider">ACTIVE</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center space-x-1.5 text-[11px]">
              <span className="text-slate-400">Loop:</span>
              <span className="text-indigo-300 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Remember → Recall → Learn
              </span>
            </div>
          </div>

          {/* Reset State Button */}
          <button
            onClick={onResetDemo}
            title="Reset Hindsight Memory State"
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition shadow-md group shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-180 transition duration-500 text-slate-400 group-hover:text-indigo-400" />
          </button>
        </div>

      </div>
    </header>
  );
}
