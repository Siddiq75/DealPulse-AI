import React, { useState, useEffect } from 'react';
import { Brain, Search, PlusCircle, ShieldAlert, CheckCircle2, FileText, Sparkles, Filter, Database, Tag } from 'lucide-react';
import { api } from '../services/api';

export default function MemoryDashboard({ account, onOpenRetainModal, memoryTrigger }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recallResults, setRecallResults] = useState(null);
  const [reflection, setReflection] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (account) {
      loadBankMemories();
    }
  }, [account, memoryTrigger]);

  const loadBankMemories = async () => {
    setLoading(true);
    try {
      const data = await api.getBankMemories(account.id);
      setMemories(data);
      
      // Fetch Hindsight Reflect synthesis
      const reflectData = await api.reflectOnAccount(account.id, 'Summarize customer memory and tried solutions');
      setReflection(reflectData);
    } catch (err) {
      console.error('Failed to fetch bank memories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSemanticRecall = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await api.recallMemories(account.id, searchQuery, 5);
      setRecallResults(res);
    } catch (err) {
      console.error('Recall error:', err);
    }
  };

  const filteredMemories = memories.filter(m => {
    if (activeTab === 'all') return true;
    return m.category === activeTab;
  });

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'attempted_solution':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 uppercase tracking-wide"><CheckCircle2 className="w-3 h-3"/> TRIED STEP</span>;
      case 'observation':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 uppercase tracking-wide"><Tag className="w-3 h-3"/> OBSERVATION</span>;
      case 'preference':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 uppercase tracking-wide"><Sparkles className="w-3 h-3"/> PREFERENCE</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 uppercase tracking-wide"><FileText className="w-3 h-3"/> FACT</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border border-purple-500/20">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 shadow-lg shadow-purple-500/10 shrink-0">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h2 className="font-extrabold text-lg sm:text-xl text-white font-sans flex flex-wrap items-center gap-2">
              <span>Hindsight Memory Inspector</span>
              <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-slate-950 text-purple-300 border border-slate-800 font-mono font-bold">
                Bank: {account.id}
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
              Persistent multi-session vector & graph storage for <strong className="text-slate-200">{account.name}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end md:self-auto">
          <button
            onClick={onOpenRetainModal}
            className="btn-gradient-primary px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-extrabold text-white transition shadow-lg flex items-center space-x-1.5 sm:space-x-2"
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Retain New Memory</span>
          </button>
        </div>
      </div>

      {/* Hindsight Reflect Synthesis Banner */}
      {reflection && (
        <div className="glass-card p-4 sm:p-5 rounded-2xl border-l-4 border-l-purple-500 bg-purple-950/20 space-y-2 shadow-lg">
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-extrabold text-purple-300 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>HINDSIGHT REFLECT SYNTHESIS</span>
          </div>
          <p className="text-xs text-slate-200 font-medium leading-relaxed font-sans">{reflection.synthesis}</p>
        </div>
      )}

      {/* Semantic Recall Test Tool */}
      <form onSubmit={handleSemanticRecall} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Test Hindsight Recall query (e.g. 'What battery steps did Rahul already try?')..."
            className="w-full bg-slate-950/90 border border-slate-800 rounded-xl sm:rounded-2xl pl-10 pr-4 py-2.5 sm:py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition shadow-inner font-sans"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800 transition shrink-0"
        >
          Execute Recall
        </button>
      </form>

      {/* Semantic Recall Results Overlay */}
      {recallResults && (
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/15 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-cyan-300 flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              Recall Query Results for "{recallResults.query}" ({recallResults.total_found} matches)
            </span>
            <button
              onClick={() => setRecallResults(null)}
              className="text-xs text-slate-400 hover:text-white font-semibold"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {recallResults.memories.map((m, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start justify-between text-xs gap-3">
                <div className="flex items-center gap-3">
                  {getCategoryBadge(m.category)}
                  <span className="text-slate-200 font-medium">{m.content}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {(m.relevance_score * 100).toFixed(0)}% Score
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Retained Memory List Filter & Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-3 gap-3">
          <div className="flex flex-wrap gap-2">
            {['all', 'attempted_solution', 'observation', 'preference'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                  activeTab === cat
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800/60'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400 font-mono font-semibold">
            {filteredMemories.length} Retained Memory Nodes
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-slate-400 animate-pulse glass-panel rounded-2xl">
            Querying Hindsight Memory Engine...
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="glass-card p-10 rounded-2xl text-center text-xs text-slate-400 space-y-2">
            <p>No retained memory nodes match this filter yet.</p>
            <p className="text-[11px] text-slate-500">Click "Retain New Memory" to index customer observations!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMemories.map((m) => (
              <div key={m.id} className="glass-card p-4 sm:p-5 rounded-xl flex flex-col justify-between space-y-3 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-200">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    {getCategoryBadge(m.category)}
                    <span className="text-[10px] text-slate-500 font-mono font-medium">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed font-sans">
                    {m.content}
                  </p>
                </div>
                {m.tags && m.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/40">
                    {m.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800/80">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
