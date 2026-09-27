import React, { useState } from 'react';
import { X, Sparkles, AlertTriangle, CheckCircle2, ArrowRight, Brain, Zap } from 'lucide-react';
import { api } from '../services/api';

export default function BeforeAfterDiff({ account, onClose }) {
  const [prompt, setPrompt] = useState('My battery is still draining. What should I do next?');
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState(null);

  const handleRunComparison = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const data = await api.comparePitches(account.id, prompt);
      setComparison(data);
    } catch (err) {
      console.error('Failed comparison:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-6xl rounded-3xl border border-purple-500/35 shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10">
              <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h2 className="font-extrabold text-2xl text-white font-sans flex items-center gap-2 tracking-tight">
                Hindsight Memory BEFORE vs AFTER Matrix
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Visualizing behavioral adaptation for customer <strong className="text-purple-300 font-bold">{account.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleRunComparison} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 shadow-inner font-sans"
            placeholder="Enter customer support prompt to test BEFORE vs AFTER behavioral change..."
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
          >
            {loading ? <Brain className="w-4 h-4 animate-spin text-cyan-300"/> : <Zap className="w-4 h-4 text-cyan-300"/>}
            <span>{loading ? 'Comparing...' : 'Run Side-by-Side Test'}</span>
          </button>
        </form>

        {/* Comparison Matrix Output */}
        {comparison && (
          <div className="space-y-6">
            {/* Key Behavioral Improvements Bar */}
            <div className="bg-slate-950 p-4.5 rounded-2xl border border-indigo-500/30 space-y-2.5 shadow-inner">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-indigo-300 tracking-wider uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>HINDSIGHT LEARNED BEHAVIOR ADAPTATIONS</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {comparison.key_improvements.map((imp, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-2.5 rounded-xl text-[11px] text-slate-200 border border-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                    <span className="font-medium">{imp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Side-by-Side Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1: WITHOUT MEMORY */}
              <div className="glass-card p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10 space-y-3.5">
                <div className="flex items-center justify-between border-b border-rose-900/50 pb-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
                    <span className="font-extrabold text-sm text-rose-200 font-sans">
                      WITHOUT MEMORY (Standard AI) ❌
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Stateless
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 italic">
                  * Has zero historical memory. Repeats basic brightness and driver advice from scratch.
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap border border-slate-900 max-h-[380px] overflow-y-auto shadow-inner">
                  {comparison.without_memory_pitch || comparison.without_memory_response}
                </div>
              </div>

              {/* Column 2: WITH HINDSIGHT MEMORY */}
              <div className="glass-card p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/10 space-y-3.5">
                <div className="flex items-center justify-between border-b border-emerald-900/50 pb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    <span className="font-extrabold text-sm text-emerald-200 font-sans">
                      WITH HINDSIGHT MEMORY ✅
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Stateful Memory
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400/90 font-medium">
                  * Recalled {comparison.recalled_memories.length} past observation nodes from Hindsight memory bank.
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap border border-slate-900 max-h-[380px] overflow-y-auto shadow-inner">
                  {comparison.with_memory_pitch || comparison.with_memory_response}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
