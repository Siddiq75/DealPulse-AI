import React, { useState } from 'react';
import { X, UserPlus, Laptop, Shield, Mail, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function AddCustomerModal({ onClose, onCustomerCreated }) {
  const [name, setName] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState('Standard Support');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a customer name.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const newCustomer = await api.createAccount({
        name: name.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        industry: deviceModel.trim() || 'ZenBook Ultra 15 Pro',
        tier: tier,
        stage: 'Active Support',
        contact_name: name.trim(),
        deal_size: '$0'
      });
      
      onCustomerCreated(newCustomer);
      onClose();
    } catch (err) {
      console.error('Failed to create customer:', err);
      setError('Failed to create new customer bank. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-indigo-500/35 shadow-2xl p-6 sm:p-7 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3.5 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2 font-sans">
              Create Customer Memory Bank
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Starts fresh with 0 initial memories — Hindsight auto-learns!
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
              Customer / User Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Karthik Raja or Sarah Connor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-sans shadow-inner"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-cyan-400" />
              <span>Device / System Model</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Asus ROG Strix G16, MacBook Pro M3, Surface Pro"
              value={deviceModel}
              onChange={(e) => setDeviceModel(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-sans shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-sans shadow-inner"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Support Tier</span>
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 transition font-sans shadow-inner"
              >
                <option value="Standard Support">Standard Support</option>
                <option value="Premium Support">Premium Support</option>
                <option value="Enterprise Support">Enterprise Support</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient-primary px-5 py-2.5 rounded-xl text-white text-xs font-extrabold transition shadow-lg shadow-indigo-500/30 flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Memory Bank...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Create Bank</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

