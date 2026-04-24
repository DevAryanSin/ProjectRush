'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Database, 
  Globe, 
  Lock, 
  DollarSign, 
  Loader2, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export default function AssetVault() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    assetTypes: '',
    platforms: '',
    accessLevels: '',
    commercialValue: ''
  });
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);

    const assembledPrompt = `
      Asset Types: ${formData.assetTypes}
      Platforms: ${formData.platforms}
      Access Levels: ${formData.accessLevels}
      Commercial Value: ${formData.commercialValue}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: assembledPrompt }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data.result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen text-white p-6 md:p-12 lg:p-24 overflow-hidden">
      {/* Aurora Background */}
      <div className="bg-aurora">
        <div className="orb orb-teal" />
        <div className="orb orb-purple" />
        <div className="orb orb-blue" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-12 space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-500/20 border border-teal-500/30 rounded-2xl">
              <ShieldAlert className="w-8 h-8 text-teal-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Asset<span className="text-gradient-teal">Vault</span>
            </h1>
          </div>
          <p className="text-xl text-slate-400 font-medium max-w-2xl">
            Describe your media library — get a theft vulnerability ranking
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
          {/* Input Form */}
          <section className="glass rounded-3xl p-8 space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Database className="w-4 h-4 text-teal-400" /> Asset Types
                  </label>
                  <input
                    required
                    className="w-full glass-input rounded-xl px-4 py-3 text-white placeholder:text-slate-500"
                    placeholder="e.g. 4K match highlights, Player interviews"
                    value={formData.assetTypes}
                    onChange={(e) => setFormData({...formData, assetTypes: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-400" /> Platforms
                  </label>
                  <input
                    required
                    className="w-full glass-input rounded-xl px-4 py-3 text-white placeholder:text-slate-500"
                    placeholder="e.g. YouTube, Instagram, Internal Server"
                    value={formData.platforms}
                    onChange={(e) => setFormData({...formData, platforms: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-400" /> Access Levels
                  </label>
                  <input
                    required
                    className="w-full glass-input rounded-xl px-4 py-3 text-white placeholder:text-slate-500"
                    placeholder="e.g. Public, Partner-only, Private"
                    value={formData.accessLevels}
                    onChange={(e) => setFormData({...formData, accessLevels: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-pink-400" /> Commercial Value
                  </label>
                  <input
                    required
                    className="w-full glass-input rounded-xl px-4 py-3 text-white placeholder:text-slate-500"
                    placeholder="e.g. High ($1M+ revenue potential)"
                    value={formData.commercialValue}
                    onChange={(e) => setFormData({...formData, commercialValue: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:hover:bg-teal-500 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-teal-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Vulnerabilities...
                  </>
                ) : (
                  <>
                    Calculate Security Score
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Results Section */}
          {(analysis || error) && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="glass rounded-3xl p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-teal-400" />
                    Risk Analysis Report
                  </h2>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                {analysis && (
                  <div className="prose prose-invert max-w-none prose-headings:text-teal-400 prose-strong:text-white prose-p:text-slate-300">
                    {analysis.split('\n').map((line, i) => {
                      if (line.startsWith('#') || line.includes(':')) {
                        return <div key={i} className="mb-4">{line}</div>;
                      }
                      return <p key={i} className="mb-2">{line}</p>;
                    })}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Decorative Orbs Overlay */}
      <div className="fixed top-0 right-0 p-8 pointer-events-none opacity-20">
        <ShieldCheck className="w-64 h-64 text-teal-500 blur-3xl" />
      </div>
    </main>
  );
}
