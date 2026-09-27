import React, { useState } from 'react';
import { Brain, Sparkles, Tag, CheckCircle2, ShieldAlert, Cpu, Network, Zap, Eye } from 'lucide-react';

export default function MemoryGraphView({ account, memories }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Group memories into categories
  const categories = {
    attempted_solution: memories.filter(m => m.category === 'attempted_solution'),
    observation: memories.filter(m => m.category === 'observation'),
    preference: memories.filter(m => m.category === 'preference'),
    fact: memories.filter(m => !['attempted_solution', 'observation', 'preference'].includes(m.category))
  };

  const nodeColor = (cat) => {
    switch (cat) {
      case 'attempted_solution': return 'from-amber-500 to-orange-500 border-amber-400 text-amber-300';
      case 'observation': return 'from-purple-500 to-indigo-500 border-purple-400 text-purple-300';
      case 'preference': return 'from-cyan-500 to-blue-500 border-cyan-400 text-cyan-300';
      default: return 'from-emerald-500 to-teal-500 border-emerald-400 text-emerald-300';
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 space-y-5 shadow-2xl relative overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-purple-600/10 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-white font-sans flex items-center gap-2">
              Hindsight Memory Graph Network
              <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Live Interactive Map
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-session memory topology for <strong className="text-indigo-300">{account.name}</strong> ({memories.length} indexed nodes)
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold">
          <div className="flex items-center space-x-1.5 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Tried Steps</span>
          </div>
          <div className="flex items-center space-x-1.5 text-purple-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <span>Observations</span>
          </div>
          <div className="flex items-center space-x-1.5 text-cyan-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Preferences</span>
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Facts</span>
          </div>
        </div>
      </div>

      {/* Interactive Visual Graph Canvas */}
      <div className="relative bg-slate-950/90 rounded-2xl p-6 min-h-[340px] border border-slate-800/90 flex items-center justify-center overflow-hidden shadow-inner">
        {/* Central Hindsight Memory Hub */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-glow"></div>
            <div className="relative w-20 h-20 rounded-full bg-slate-950 border-2 border-indigo-400/80 flex flex-col items-center justify-center shadow-2xl">
              <Brain className="w-8 h-8 text-indigo-400 animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-indigo-300 mt-1">
                {account.name.split(' ')[0]}
              </span>
            </div>
          </div>
          <span className="mt-2 text-xs font-extrabold text-slate-200 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 font-mono shadow">
            Hindsight Memory Bank #{account.id}
          </span>
        </div>

        {/* Orbiting Category Clusters */}
        <div className="absolute inset-0 p-4 flex items-center justify-between pointer-events-none">
          {/* Top Left: Tried Steps */}
          <div className="absolute top-6 left-6 pointer-events-auto space-y-2">
            <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider block bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
              Tried Steps ({categories.attempted_solution.length})
            </span>
            {categories.attempted_solution.slice(0, 3).map((m, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedNode(m)}
                className="glass-card px-3 py-2 rounded-xl border border-amber-500/30 text-xs text-amber-200 cursor-pointer hover:scale-105 transition shadow-lg max-w-[220px] truncate flex items-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{m.content}</span>
              </div>
            ))}
          </div>

          {/* Top Right: Observations */}
          <div className="absolute top-6 right-6 pointer-events-auto space-y-2 text-right">
            <span className="text-[10px] font-extrabold text-purple-300 uppercase tracking-wider block bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-500/30 ml-auto w-fit">
              Observations ({categories.observation.length})
            </span>
            {categories.observation.slice(0, 3).map((m, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedNode(m)}
                className="glass-card px-3 py-2 rounded-xl border border-purple-500/30 text-xs text-purple-200 cursor-pointer hover:scale-105 transition shadow-lg max-w-[220px] truncate flex items-center gap-2 ml-auto"
              >
                <Tag className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{m.content}</span>
              </div>
            ))}
          </div>

          {/* Bottom Left: Preferences */}
          <div className="absolute bottom-6 left-6 pointer-events-auto space-y-2">
            <span className="text-[10px] font-extrabold text-cyan-300 uppercase tracking-wider block bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              Preferences ({categories.preference.length})
            </span>
            {categories.preference.slice(0, 3).map((m, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedNode(m)}
                className="glass-card px-3 py-2 rounded-xl border border-cyan-500/30 text-xs text-cyan-200 cursor-pointer hover:scale-105 transition shadow-lg max-w-[220px] truncate flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{m.content}</span>
              </div>
            ))}
          </div>

          {/* Bottom Right: Facts */}
          <div className="absolute bottom-6 right-6 pointer-events-auto space-y-2 text-right">
            <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider block bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30 ml-auto w-fit">
              Facts ({categories.fact.length})
            </span>
            {categories.fact.slice(0, 3).map((m, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedNode(m)}
                className="glass-card px-3 py-2 rounded-xl border border-emerald-500/30 text-xs text-emerald-200 cursor-pointer hover:scale-105 transition shadow-lg max-w-[220px] truncate flex items-center gap-2 ml-auto"
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{m.content}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/40 space-y-2 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-indigo-300 flex items-center gap-2 uppercase tracking-wide">
              <Eye className="w-4 h-4 text-cyan-400" />
              Node Inspector Details
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-[11px] text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <p className="text-xs text-slate-100 font-medium leading-relaxed font-sans">
            "{selectedNode.content}"
          </p>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
            <span>Category: <strong className="text-slate-200">{selectedNode.category}</strong></span>
            <span>•</span>
            <span>Tags: {selectedNode.tags?.join(', ') || 'general'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
