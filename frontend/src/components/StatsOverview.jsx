import React from 'react';
import { Database, Brain, Zap, TrendingUp } from 'lucide-react';

export default function StatsOverview({ accounts, totalMemories }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
      {/* Active Customer Memory Banks */}
      <div className="glass-card p-3.5 sm:p-4 rounded-xl relative overflow-hidden group border-t-2 border-t-indigo-500/60">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition duration-500 pointer-events-none">
          <Database className="w-14 h-14 text-indigo-400" />
        </div>
        <div className="flex items-center space-x-2.5 mb-1.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Database className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">ACTIVE MEMORY BANKS</span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-white font-sans tracking-tight leading-none my-1">{accounts.length}</div>
        <p className="text-[10px] text-slate-400 font-medium leading-tight mt-1">Isolated per customer</p>
      </div>

      {/* Retained Memories */}
      <div className="glass-card p-3.5 sm:p-4 rounded-xl relative overflow-hidden group border-t-2 border-t-purple-500/60">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition duration-500 pointer-events-none">
          <Brain className="w-14 h-14 text-purple-400" />
        </div>
        <div className="flex items-center space-x-2.5 mb-1.5">
          <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/30 shrink-0">
            <Brain className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">RETAINED MEMORIES</span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-purple-300 font-sans tracking-tight leading-none my-1">{totalMemories}</div>
        <p className="text-[10px] text-purple-300/80 font-medium leading-tight mt-1">Tried Steps & Observations</p>
      </div>

      {/* Hindsight Recall Speed */}
      <div className="glass-card p-3.5 sm:p-4 rounded-xl relative overflow-hidden group border-t-2 border-t-cyan-500/60">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition duration-500 pointer-events-none">
          <Zap className="w-14 h-14 text-cyan-400" />
        </div>
        <div className="flex items-center space-x-2.5 mb-1.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shrink-0">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">HINDSIGHT RECALL LATENCY</span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-cyan-300 font-sans tracking-tight leading-none my-1">18 ms</div>
        <p className="text-[10px] text-cyan-300/80 font-medium leading-tight mt-1">RRF Hybrid BM25 + Semantic Search</p>
      </div>

      {/* Support Learning Rate */}
      <div className="glass-card p-3.5 sm:p-4 rounded-xl relative overflow-hidden group border-t-2 border-t-emerald-500/60">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition duration-500 pointer-events-none">
          <TrendingUp className="w-14 h-14 text-emerald-400" />
        </div>
        <div className="flex items-center space-x-2.5 mb-1.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">SUPPORT LEARNING RATE</span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-emerald-300 font-sans tracking-tight leading-none my-1">100%</div>
        <p className="text-[10px] text-emerald-300/80 font-medium leading-tight mt-1">Zero repeated basic steps</p>
      </div>
    </div>
  );
}
