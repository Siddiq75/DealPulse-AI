import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import AccountCard from './components/AccountCard';
import MemoryDashboard from './components/MemoryDashboard';
import PitchGenerator from './components/PitchGenerator';
import BeforeAfterDiff from './components/BeforeAfterDiff';
import FeedbackModal from './components/FeedbackModal';
import DemoWalkthrough from './components/DemoWalkthrough';
import AddCustomerModal from './components/AddCustomerModal';
import { api } from './services/api';
import { Brain, Sparkles, Send, RefreshCw, UserCheck, UserPlus, Zap } from 'lucide-react';

export default function App() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pitch'); // 'pitch' or 'memory'
  
  // Modals & Triggers
  const [isRetainModalOpen, setIsRetainModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isDemoWalkthroughOpen, setIsDemoWalkthroughOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [memoryTrigger, setMemoryTrigger] = useState(0);

  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await api.getAccounts();
      if (Array.isArray(data)) {
        setAccounts(data);
        if (data.length > 0) {
          setSelectedAccount(prev => prev || data[0]);
        }
      } else {
        setAccounts([]);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
      setAccounts([]);
      setApiError('Unable to connect to DealPulse backend API. Please make sure your backend is running or set VITE_API_BASE_URL in Vercel environment variables.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDemo = async () => {
    try {
      await api.resetDemoState();
      await loadAccounts();
      setMemoryTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to reset demo state:', err);
    }
  };

  const accountList = Array.isArray(accounts) ? accounts : [];
  const totalMemories = accountList.reduce((acc, a) => acc + (a?.memory_count || 0), 0);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onStartDemo={() => setIsDemoWalkthroughOpen(true)}
        onResetDemo={handleResetDemo}
        isDemoActive={isDemoWalkthroughOpen}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        
        {apiError && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{apiError}</span>
            </div>
            <button 
              onClick={loadAccounts}
              className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold transition shrink-0"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Global Key Stats Bar */}
        <StatsOverview accounts={accountList} totalMemories={totalMemories} />

        {/* Customer Memory Banks Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-indigo-400 shrink-0" />
              <h2 className="text-xs font-extrabold text-slate-200 uppercase tracking-widest font-sans">
                SELECT CUSTOMER MEMORY BANK
              </h2>
            </div>

            <div className="flex items-center justify-between sm:justify-end space-x-3">
              <span className="text-xs text-slate-400 font-mono hidden md:inline">
                Click a customer or create a brand new user memory bank
              </span>
              <button
                onClick={() => setIsAddCustomerModalOpen(true)}
                className="px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white text-xs font-extrabold transition shadow-lg shadow-indigo-500/20 hover:opacity-95 flex items-center space-x-1.5 shrink-0 border border-indigo-400/30"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add New Customer</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-xs text-slate-400 animate-pulse glass-panel rounded-2xl">
              Querying Hindsight Customer Memory Banks...
            </div>
          ) : accountList.length === 0 ? (
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-dashed border-indigo-500/30 text-center space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <UserPlus className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-slate-200 text-sm sm:text-base">No Predefined Customers</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Create a new customer memory bank freshly! Enter any name and device model to test Groq + Hindsight continuous learning from scratch.
              </p>
              <button
                onClick={() => setIsAddCustomerModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-500/20 hover:opacity-95"
              >
                + Add First Customer Bank
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              {accountList.map((acc) => (
                <AccountCard
                  key={acc.id}
                  account={acc}
                  isSelected={selectedAccount?.id === acc.id}
                  onSelect={(acc) => setSelectedAccount(acc)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Active Customer Workspace & Tabs */}
        {selectedAccount && (
          <div className="space-y-5 pt-2">
            {/* Workspace Header Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2.5 gap-3">
              <div className="flex space-x-3 sm:space-x-6 overflow-x-auto pb-1 scrollbar-none shrink-0">
                <button
                  onClick={() => setActiveTab('pitch')}
                  className={`pb-2.5 text-xs font-extrabold transition-all flex items-center space-x-2 border-b-2 shrink-0 ${
                    activeTab === 'pitch'
                      ? 'border-indigo-500 text-indigo-400 shadow-sm'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>AI Support Response Studio</span>
                </button>

                <button
                  onClick={() => setActiveTab('memory')}
                  className={`pb-2.5 text-xs font-extrabold transition-all flex items-center space-x-2 border-b-2 shrink-0 ${
                    activeTab === 'memory'
                      ? 'border-purple-500 text-purple-400 shadow-sm'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Hindsight Memory Inspector ({selectedAccount.memory_count} nodes)</span>
                </button>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 shadow-inner">
                  Active Bank: <strong className="text-indigo-300 font-bold">{selectedAccount.name}</strong>
                </span>
              </div>
            </div>

            {/* Tab 1: Support Studio */}
            {activeTab === 'pitch' && (
              <PitchGenerator
                account={selectedAccount}
                onCompareClick={() => setIsCompareModalOpen(true)}
              />
            )}

            {/* Tab 2: Hindsight Memory Bank Inspector */}
            {activeTab === 'memory' && (
              <MemoryDashboard
                account={selectedAccount}
                onOpenRetainModal={() => setIsRetainModalOpen(true)}
                memoryTrigger={memoryTrigger}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {isRetainModalOpen && selectedAccount && (
        <FeedbackModal
          account={selectedAccount}
          onClose={() => setIsRetainModalOpen(false)}
          onMemoryRetained={() => {
            setMemoryTrigger(prev => prev + 1);
            loadAccounts();
          }}
        />
      )}

      {isCompareModalOpen && selectedAccount && (
        <BeforeAfterDiff
          account={selectedAccount}
          onClose={() => setIsCompareModalOpen(false)}
        />
      )}

      {isDemoWalkthroughOpen && (
        <DemoWalkthrough
          onClose={() => setIsDemoWalkthroughOpen(false)}
          onComplete={() => {
            loadAccounts();
            setMemoryTrigger(prev => prev + 1);
          }}
        />
      )}

      {isAddCustomerModalOpen && (
        <AddCustomerModal
          onClose={() => setIsAddCustomerModalOpen(false)}
          onCustomerCreated={(newCust) => {
            loadAccounts();
            setSelectedAccount(newCust);
            setMemoryTrigger(prev => prev + 1);
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-6 text-center text-xs text-slate-500 glass-panel mt-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <p className="font-medium">
            DealPulse AI — Built with <strong className="text-indigo-400">Vectorize Hindsight Engine</strong> & <strong className="text-cyan-400">Groq LLM</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}
