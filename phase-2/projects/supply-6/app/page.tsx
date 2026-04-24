'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  AlertTriangle, 
  Search, 
  Activity, 
  Layers, 
  ArrowRight,
  Loader2,
  Box,
  Zap,
  Info
} from 'lucide-react';

export default function DemandSignal() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    industry: '',
    signals: '',
    inventory: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const fullPrompt = `Industry/Product: ${formData.industry}\nRecent Market Signals: ${formData.signals}\nCurrent Inventory Level: ${formData.inventory}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate prediction');
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen py-12 px-4 md:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center mb-12 animate-float">
        <div className="inline-flex items-center justify-center p-4 glass-pill mb-4">
          <Zap className="text-orange-500 w-8 h-8 fill-current" />
        </div>
        <h1 className="text-5xl md:text-6xl text-slate-800 mb-4 tracking-tight">
          Demand<span className="text-orange-500">Signal</span>
        </h1>
        <p className="text-lg text-slate-600 font-medium max-w-lg mx-auto">
          Input market signals — get a near-term demand shift prediction
        </p>
      </header>

      {/* Main Form Card */}
      <section className="clay-card p-8 md:p-10 mb-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700 font-bold ml-2">
                <Layers size={18} className="text-blue-500" />
                Industry / Product
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Consumer Electronics"
                className="w-full clay-input"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700 font-bold ml-2">
                <Box size={18} className="text-orange-500" />
                Inventory Level
              </label>
              <input
                required
                type="text"
                placeholder="e.g. 5000 units (Low)"
                className="w-full clay-input"
                value={formData.inventory}
                onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-700 font-bold ml-2">
              <Activity size={18} className="text-green-500" />
              Market Signals
            </label>
            <textarea
              required
              rows={4}
              placeholder="News, trends, competitor moves, seasonal factors..."
              className="w-full clay-input resize-none"
              value={formData.signals}
              onChange={(e) => setFormData({ ...formData, signals: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full clay-button flex items-center justify-center gap-3 text-lg py-4 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Analyzing Signals...
              </>
            ) : (
              <>
                Generate Prediction
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </section>

      {/* Error State */}
      {error && (
        <div className="clay-card bg-red-50 border-red-100 p-6 mb-10 flex items-start gap-4">
          <AlertTriangle className="text-red-500 shrink-0 mt-1" />
          <div>
            <h3 className="text-red-800 font-bold mb-1">Analysis Interrupted</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 ml-2">
            <BarChart3 className="text-blue-500" />
            <h2 className="text-2xl text-slate-800">Forecast Intelligence</h2>
          </div>

          <div className="clay-card p-8 md:p-10">
            <div className="prose prose-slate max-w-none">
              {result.split('\n').map((line, i) => {
                const isHeading = line.startsWith('**') || line.includes(':');
                const cleanLine = line.replace(/\*\*/g, '');
                
                if (line.trim() === '') return <div key={i} className="h-4" />;
                
                return (
                  <p key={i} className={`${isHeading ? 'font-bold text-slate-800 mt-4 text-lg' : 'text-slate-600'} leading-relaxed`}>
                    {cleanLine}
                  </p>
                );
              })}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-orange-50">
                <TrendingUp className="text-orange-500" />
                <div>
                  <div className="text-xs font-bold text-orange-400 uppercase tracking-wider">Strategy</div>
                  <div className="text-sm font-bold text-orange-800">Actionable Insight</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50">
                <Info className="text-blue-500" />
                <div>
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Confidence</div>
                  <div className="text-sm font-bold text-blue-800">Verified by Gemini</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center mt-16 pb-12">
        <p className="text-slate-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} DemandSignal Logistics. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
