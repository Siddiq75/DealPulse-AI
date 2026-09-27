import React from 'react';
import { Activity, Brain, CheckCircle2, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function LiveMemoryTicker() {
  const events = [
    { type: 'RETAIN', title: 'Rahul Verma', text: 'Indexed tried step: screen brightness & driver updates already completed', time: 'Just now' },
    { type: 'RECALL', title: 'Siddiq', text: 'Hybrid RRF BM25 + Vector Graph matched 6 memory nodes (18ms latency)', time: '2m ago' },
    { type: 'REFLECT', title: 'Yashwanth', text: 'Synthesized persistent account objections & hybrid cloud deployment preference', time: '5m ago' },
    { type: 'LEARN', title: 'Srikar', text: 'AI Agent adapted strategy: Avoided repeating annual seat pricing objections', time: '8m ago' }
  ];

  return (
    <div className="glass-panel py-2.5 px-4 rounded-2xl border border-indigo-500/25 flex items-center space-x-3 overflow-hidden shadow-lg">
      <div className="flex items-center space-x-2 shrink-0 pr-3 border-r border-slate-800">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
        </span>
        <span className="text-[11px] font-extrabold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          Live Stream:
        </span>
      </div>

      <div className="flex items-center space-x-6 overflow-x-auto whitespace-nowrap text-xs no-scrollbar py-0.5">
        {events.map((ev, idx) => (
          <div key={idx} className="flex items-center space-x-2 shrink-0">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
              ev.type === 'RETAIN' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
              ev.type === 'RECALL' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
              ev.type === 'REFLECT' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
              'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}>
              [{ev.type}]
            </span>
            <span className="font-bold text-slate-200">{ev.title}:</span>
            <span className="text-slate-400 font-medium">{ev.text}</span>
            <span className="text-[10px] text-slate-600 font-mono">({ev.time})</span>
            {idx < events.length - 1 && <span className="text-slate-700 ml-3">•</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
