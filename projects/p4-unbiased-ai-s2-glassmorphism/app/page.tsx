'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  BrainCircuit, 
  ScanSearch, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Loader2,
  Sparkles,
  Info
} from 'lucide-react';

export default function FairnessAuditPage() {
  const [formData, setFormData] = useState({
    modelPurpose: '',
    dataSources: '',
    inputFeatures: '',
    decisionType: '',
    context: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const fullPrompt = `
      Model Purpose: ${formData.modelPurpose}
      Training Data Sources: ${formData.dataSources}
      Input Features: ${formData.inputFeatures}
      Decision Type: ${formData.decisionType}
      Deployment Context: ${formData.context}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate audit');
    } finally {
      setLoading(false);
    }
  };

  const formatResult = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('#') || line.startsWith('**') || line.match(/^[0-9]\./)) {
        return <p key={i} className="font-semibold text-white mt-4 mb-2">{line.replace(/[#*]/g, '')}</p>;
      }
      if (line.trim().startsWith('-')) {
        return (
          <div key={i} className="flex items-start gap-2 mb-1 pl-2">
            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
            <p className="text-gray-300">{line.substring(1).trim()}</p>
          </div>
        );
      }
      return line.trim() ? <p key={i} className="text-gray-400 mb-2 leading-relaxed">{line}</p> : null;
    });
  };

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 flex flex-col items-center">
      {/* Visual Background Orbs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-12 fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2.5 glass-panel bg-white/10">
            <ShieldAlert className="w-8 h-8 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              FairnessAudit
            </h1>
            <p className="text-xs md:text-sm text-gray-400 uppercase tracking-widest font-semibold">
              Algorithmic Accountability Engine
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <span className="hover:text-white transition-colors cursor-pointer">Standards</span>
          <span className="hover:text-white transition-colors cursor-pointer">Metrics</span>
          <span className="hover:text-white transition-colors cursor-pointer">Compliance</span>
        </div>
      </header>

      <div className="w-full max-w-2xl grid gap-8">
        {/* Input Form Section */}
        <section className="glass-panel p-6 md:p-10 fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-8 text-violet-300">
            <BrainCircuit className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Model Specifications</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">Model Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Credit Scoring for personal loans"
                  required
                  className="w-full glass-input p-4 rounded-xl text-white"
                  value={formData.modelPurpose}
                  onChange={e => setFormData({ ...formData, modelPurpose: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">Training Data Sources</label>
                <input
                  type="text"
                  placeholder="e.g. Historical bank transaction data 2018-2023"
                  required
                  className="w-full glass-input p-4 rounded-xl text-white"
                  value={formData.dataSources}
                  onChange={e => setFormData({ ...formData, dataSources: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">Major Input Features</label>
                <textarea
                  placeholder="e.g. Age, Postal Code, Employment Duration, Education level..."
                  required
                  className="w-full glass-input p-4 rounded-xl text-white h-24 resize-none"
                  value={formData.inputFeatures}
                  onChange={e => setFormData({ ...formData, inputFeatures: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">Decision Output</label>
                  <input
                    type="text"
                    placeholder="e.g. Binary Approval/Rejection"
                    required
                    className="w-full glass-input p-4 rounded-xl text-white"
                    value={formData.decisionType}
                    onChange={e => setFormData({ ...formData, decisionType: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">Deployment Context</label>
                  <input
                    type="text"
                    placeholder="e.g. Real-time web application"
                    required
                    className="w-full glass-input p-4 rounded-xl text-white"
                    value={formData.context}
                    onChange={e => setFormData({ ...formData, context: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-900/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Audit Report...
                </>
              ) : (
                <>
                  <ScanSearch className="w-5 h-5" />
                  Run Fairness Audit
                </>
              )}
            </button>
          </form>
        </section>

        {/* Error Handling */}
        {error && (
          <div className="glass-panel p-6 border-red-500/30 bg-red-500/5 fade-in">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <section className="glass-panel p-8 md:p-10 fade-in border-violet-500/30">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Audit Report</h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-violet-400/10 border border-violet-400/20 rounded-full text-[10px] uppercase font-bold text-violet-300">
                <Sparkles className="w-3 h-3" />
                Gemini AI Verified
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              {formatResult(result)}
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
              <Info className="w-6 h-6 text-violet-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Standard Reference</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  This audit references NIST AI RMF, EU AI Act risk profiles, and ISO/IEC 24027:2021 standards 
                  for bias in AI systems. Continue to monitor these metrics throughout production lifecycle.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      <footer className="mt-20 text-gray-500 text-xs text-center fade-in" style={{ animationDelay: '0.4s' }}>
        <p>© 2026 FairnessAudit Systems. Built with Ethic-First Intelligence.</p>
        <p className="mt-2">Next.js 16 • Gemini 2.5 Flash • Lucide UI</p>
      </footer>
    </main>
  );
}
