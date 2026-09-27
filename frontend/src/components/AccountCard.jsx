import React from 'react';
import { User, Laptop, ShieldCheck, Brain, ChevronRight, ChevronDown } from 'lucide-react';

export default function AccountCard({ account, isSelected, onSelect }) {
  const device = account.device_model || account.industry || 'Macbook';
  const tier = 'Enterprise Support';
  const initial = account.name ? account.name[0].toLowerCase() : 'u';
  
  return (
    <div
      onClick={() => onSelect(account)}
      className={`glass-card p-4 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
        isSelected
          ? 'border-2 border-indigo-500 bg-indigo-950/20 shadow-xl shadow-indigo-500/15 ring-1 ring-indigo-500/30'
          : 'border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/40'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300 shrink-0 ${
            isSelected 
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
              : 'bg-slate-900/90 border border-slate-800 text-indigo-300'
          }`}>
            {initial}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-100 text-xs sm:text-sm tracking-tight flex items-center gap-1.5 font-sans">
              {account.name}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <Laptop className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="truncate">{device}</span>
            </p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-slate-900 text-slate-300 border border-slate-800 shrink-0">
          {tier}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 mb-3 bg-slate-950/60 p-2 rounded-lg border border-slate-800/70">
        <div className="flex items-center space-x-1 text-slate-400 truncate">
          <User className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{account.email || 'support@example.com'}</span>
        </div>
        <div className="flex items-center space-x-1 text-emerald-400 justify-end">
          <ShieldCheck className="w-3 h-3 shrink-0" />
          <span className="font-bold text-[10px]">Active History</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/50">
        <div className="flex items-center space-x-1.5">
          <Brain className="w-3 h-3 text-purple-400 shrink-0" />
          <span className="font-semibold text-slate-300 text-[10px]">Hindsight Bank:</span>
          <span className="font-extrabold bg-purple-950/60 px-2 py-0.5 rounded-full text-purple-300 text-[10px] border border-purple-500/30">
            {account.memory_count || 0} nodes
          </span>
        </div>
        {isSelected ? (
          <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        )}
      </div>
    </div>
  );
}
