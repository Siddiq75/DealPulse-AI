import React, { useState } from 'react';
import { Send, Brain, Sparkles, CheckCircle2, ShieldCheck, Copy, ArrowRight, Layers } from 'lucide-react';
import { api } from '../services/api';

export default function PitchGenerator({ account, onCompareClick }) {
  const [prompt, setPrompt] = useState('My battery is still draining. What should I do next?');
  const [useHindsight, setUseHindsight] = useState(true);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const data = await api.generatePitch(account.id, prompt, useHindsight);
      setResponse(data);
    } catch (err) {
      console.error('Failed to generate support response:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    const text = response.pitch_text || response.response_text;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="glass-panel p-4 sm:p-6 rounded-2xl space-y-4 sm:space-y-5 border border-indigo-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="font-extrabold text-lg sm:text-xl text-white font-sans flex items-center gap-2 tracking-tight">
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
              AI Response Studio
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Generating contextual solution for <strong className="text-slate-200">{account.name}</strong> ({account.device_model || 'ZenBook Ultra 15 Pro'})
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            {/* Toggle Hindsight Memory */}
            <label className="flex items-center space-x-2 cursor-pointer bg-slate-950 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-800 shadow-inner hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={useHindsight}
                onChange={(e) => setUseHindsight(e.target.checked)}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
              />
              <span className={`text-[11px] sm:text-xs font-bold transition ${useHindsight ? 'text-indigo-300' : 'text-slate-500'}`}>
                {useHindsight ? 'Hindsight Memory: ACTIVE ✅' : 'Hindsight Memory: OFF ❌'}
              </span>
            </label>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Customer Query / Follow-up Message
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'My battery is still draining. What should I do next?'..."
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition font-sans leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={onCompareClick}
              className="text-[11px] sm:text-xs font-bold text-purple-300 hover:text-purple-200 bg-purple-500/10 px-3 py-2 rounded-xl border border-purple-500/30 flex items-center justify-center space-x-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Compare BEFORE vs AFTER Memory Matrix</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient-primary flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Brain className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>Recalling Hindsight Memory...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Generate Response with Hindsight</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Response Output */}
      {response && (
        <div className="glass-panel p-4 sm:p-6 rounded-2xl space-y-4 sm:space-y-5 border border-indigo-500/30 shadow-2xl animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-3 sm:pb-4 gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
              <span className="font-extrabold text-sm sm:text-base text-white font-sans">
                Generated Support Solution
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                response.use_hindsight ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}>
                {response.use_hindsight ? 'Powered by Hindsight Memory' : 'Default Generic LLM (No Memory)'}
              </span>
            </div>
            
            <button
              onClick={handleCopy}
              className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition self-start sm:self-auto"
            >
              <Copy className="w-3.5 h-3.5 text-indigo-400" />
              <span>{copied ? 'Copied!' : 'Copy Response'}</span>
            </button>
          </div>

          {/* Recalled Memory Highlights */}
          {response.recalled_memories && response.recalled_memories.length > 0 && (
            <div className="bg-slate-950 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-500/30 space-y-2.5">
              <span className="text-[10px] sm:text-[11px] font-extrabold text-purple-300 flex items-center gap-2 tracking-wide uppercase">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                Hindsight Recalled Nodes ({response.recalled_memories.length} facts injected into context):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {response.recalled_memories.map((m, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-2 sm:p-2.5 rounded-xl text-[11px] text-slate-200 flex items-center gap-2 border border-slate-800 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate font-medium">{m.content}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Response Text Output */}
          <div className="bg-slate-950/90 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap shadow-inner overflow-x-auto">
            {response.pitch_text || response.response_text}
          </div>
        </div>
      )}
    </div>
  );
}
