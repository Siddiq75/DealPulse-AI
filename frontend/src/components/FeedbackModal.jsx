import React, { useState } from 'react';
import { X, Brain, PlusCircle, Sparkles, Tag, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function FeedbackModal({ account, onClose, onMemoryRetained }) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('attempted_solution');
  const [tagsInput, setTagsInput] = useState('battery, chrome, brightness');
  const [loading, setLoading] = useState(false);
  const [retainedMessage, setRetainedMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setRetainedMessage(null);
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const res = await api.retainMemory(account.id, content, category, tags);
      setRetainedMessage(res.message);
      onMemoryRetained();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to retain memory:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-purple-500/35 shadow-2xl p-6 sm:p-7 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white font-sans">
                Hindsight RETAIN — Log Observation
              </h3>
              <p className="text-xs text-slate-400">
                Retaining persistent memory for <strong className="text-purple-300 font-bold">{account.name}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {retainedMessage ? (
          <div className="bg-emerald-950/40 p-5 rounded-2xl border border-emerald-500/40 text-center space-y-2 shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-base text-emerald-300 font-sans">Retained into Hindsight Bank!</h4>
            <p className="text-xs text-slate-300 font-medium">{retainedMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Memory Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'attempted_solution', label: 'Tried Step', icon: CheckCircle2 },
                  { id: 'observation', label: 'Observation', icon: Tag },
                  { id: 'preference', label: 'Preference', icon: Sparkles },
                  { id: 'objection', label: 'Constraint', icon: ShieldAlert }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition ${
                      category === item.id
                        ? 'bg-purple-600/30 text-purple-300 border-purple-500 shadow-md ring-1 ring-purple-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Memory Content / Customer Observation
              </label>
              <textarea
                rows={3}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="e.g., 'Customer Rahul already reduced screen brightness, updated drivers, and noted drain happens with Chrome tabs...'"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans leading-relaxed shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="battery, chrome, brightness"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 shadow-inner"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 text-xs font-bold hover:text-white border border-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 disabled:opacity-50"
              >
                {loading ? 'Retaining...' : 'Hindsight RETAIN'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

