import React, { useState } from 'react';
import { X, Play, CheckCircle2, ArrowRight, Brain, Sparkles, AlertTriangle, Zap, User, Laptop } from 'lucide-react';
import { api } from '../services/api';

export default function DemoWalkthrough({ onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scenarioData, setScenarioData] = useState({
    withoutMemoryResponse: '',
    retainedMemory: '',
    withMemoryResponse: '',
    recalledCount: 0
  });

  // Step 1: Run Without Memory Response
  const runStep1WithoutMemory = async () => {
    setLoading(true);
    try {
      const res = await api.generatePitch('customer-rahul', 'My battery is still draining. What should I do next?', false);
      const text = res.pitch_text || res.response_text;
      setScenarioData(prev => ({ ...prev, withoutMemoryResponse: text }));
      setStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Retain Rahul's feedback into Hindsight Memory
  const runStep2Retain = async () => {
    setLoading(true);
    try {
      const note = "Customer Rahul already reduced screen brightness, updated drivers, and noted drain happens with Chrome tabs. Requested: 'Don't give me basic troubleshooting steps!'";
      await api.retainMemory('customer-rahul', note, 'attempted_solution', ['battery', 'chrome', 'brightness']);
      setScenarioData(prev => ({ ...prev, retainedMemory: note }));
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Run With Hindsight Memory
  const runStep3WithMemory = async () => {
    setLoading(true);
    try {
      const res = await api.generatePitch('customer-rahul', 'My battery is still draining. What should I do next?', true);
      const text = res.pitch_text || res.response_text;
      setScenarioData(prev => ({
        ...prev,
        withMemoryResponse: text,
        recalledCount: res.recalled_memories?.length || 0
      }));
      setStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-4xl rounded-3xl border border-indigo-500/40 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-white font-sans flex items-center gap-2">
                60-Second Hackathon Demo — Rahul's Support Story
              </h2>
              <p className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Customer: <strong className="text-indigo-300 font-bold">Rahul Verma (ZenBook Ultra 15 Pro)</strong></span>
                <span className="text-slate-700">|</span>
                <span className="text-cyan-300 font-semibold">REMEMBER → RECALL → LEARN → IMPROVE</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Stepper Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { num: 1, title: "1. Day 1 (No Memory)" },
            { num: 2, title: "2. Hindsight RETAIN" },
            { num: 3, title: "3. Day 2 RECALL" },
            { num: 4, title: "4. Before vs After" }
          ].map(s => (
            <div
              key={s.num}
              className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center gap-2 ${
                step === s.num
                  ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                  : step > s.num
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-950/80 text-slate-500 border-slate-800'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0"/> : <span className="w-4 h-4 rounded-full bg-slate-900 text-[10px] flex items-center justify-center shrink-0 border border-slate-800">{s.num}</span>}
              <span className="truncate">{s.title}</span>
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 shadow-inner">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2 font-sans">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                Step 1: Rahul asks "My battery is still draining. What should I do next?" WITHOUT Memory ❌
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Without long-term memory, the AI starts from scratch and gives generic basic suggestions (reduce screen brightness, update drivers), frustrating Rahul because he already tried them.
              </p>
            </div>
            <button
              onClick={runStep1WithoutMemory}
              disabled={loading}
              className="btn-gradient-primary w-full py-3.5 rounded-2xl text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? <Brain className="w-4 h-4 animate-spin text-cyan-300"/> : <ArrowRight className="w-4 h-4"/>}
              <span>Run Step 1: Query Standard AI Agent</span>
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <span className="text-[11px] font-extrabold text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/30 uppercase tracking-wide">
                Standard AI Output (Repeated Basic Advice ❌)
              </span>
              <div className="bg-slate-950 p-4 rounded-xl text-xs text-slate-300 max-h-36 overflow-y-auto font-sans leading-relaxed border border-slate-900 shadow-inner">
                {scenarioData.withoutMemoryResponse}
              </div>
            </div>

            <div className="bg-purple-950/30 p-5 rounded-2xl border border-purple-500/40 space-y-2 shadow-inner">
              <h3 className="font-extrabold text-sm text-purple-300 flex items-center gap-2 font-sans">
                <Brain className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                Step 2: Hindsight RETAIN — Index Rahul's Feedback & Chrome Observation ✅
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Rahul explains: <em>"I already reduced screen brightness and updated drivers. The battery drain mainly happens when Google Chrome has many tabs open. Don't give me basic steps!"</em>
              </p>
            </div>

            <button
              onClick={runStep2Retain}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? <Brain className="w-4 h-4 animate-spin text-cyan-300"/> : <Sparkles className="w-4 h-4 text-cyan-300"/>}
              <span>Execute Hindsight RETAIN (Index Memory Nodes)</span>
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-emerald-950/30 p-5 rounded-2xl border border-emerald-500/40 space-y-2 shadow-inner">
              <h3 className="font-extrabold text-sm text-emerald-300 flex items-center gap-2 font-sans">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                Memory Successfully Retained into Hindsight Bank!
              </h3>
              <p className="text-xs text-slate-300 font-sans bg-slate-950 p-3 rounded-xl border border-slate-900 leading-relaxed">
                "{scenarioData.retainedMemory}"
              </p>
            </div>

            <div className="bg-indigo-950/30 p-5 rounded-2xl border border-indigo-500/40 space-y-2 shadow-inner">
              <h3 className="font-extrabold text-sm text-indigo-300 flex items-center gap-2 font-sans">
                <Zap className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                Step 3: Day 2 Return Interaction WITH Hindsight RECALL ✅
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Rahul returns: <em>"My battery is still draining. What should I do next?"</em><br/>
                The AI executes <code>recall()</code>, recognizes Rahul's past attempts, skips basic advice, and provides tailored diagnostics for Chrome background tabs!
              </p>
            </div>

            <button
              onClick={runStep3WithMemory}
              disabled={loading}
              className="btn-gradient-primary w-full py-3.5 rounded-2xl text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? <Brain className="w-4 h-4 animate-spin text-cyan-300"/> : <Zap className="w-4 h-4 text-cyan-300"/>}
              <span>Execute Hindsight RECALL & Generate Adapted Support Response</span>
            </button>
          </div>
        )}

        {/* STEP 4: BEFORE VS AFTER FINAL RESULT */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="bg-gradient-to-r from-emerald-950/50 via-indigo-950/50 to-purple-950/50 p-5 rounded-2xl border border-emerald-500/40 text-center space-y-1 shadow-xl">
              <Sparkles className="w-7 h-7 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="font-extrabold text-lg text-white font-sans">Demonstration Complete!</h3>
              <p className="text-xs text-emerald-300 font-medium">
                Vectorize Hindsight transformed generic repeat advice into an intelligent, personalized customer experience!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-rose-950/20 p-4 rounded-2xl border border-rose-500/30 space-y-2.5">
                <span className="font-extrabold text-rose-300 block font-sans">WITHOUT MEMORY ❌ ("I don't know what happened before")</span>
                <div className="bg-slate-950 p-3.5 rounded-xl font-sans text-slate-300 text-[11px] max-h-52 overflow-y-auto leading-relaxed border border-slate-900 shadow-inner">
                  {scenarioData.withoutMemoryResponse}
                </div>
              </div>

              <div className="bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/30 space-y-2.5">
                <span className="font-extrabold text-emerald-300 block font-sans">WITH HINDSIGHT MEMORY ✅ ("I remember & learned from it")</span>
                <div className="bg-slate-950 p-3.5 rounded-xl font-sans text-slate-200 text-[11px] max-h-52 overflow-y-auto leading-relaxed border border-slate-900 shadow-inner">
                  {scenarioData.withMemoryResponse}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (onComplete) onComplete();
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs border border-slate-800 shadow-lg"
            >
              Close Walkthrough & Explore Live Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

