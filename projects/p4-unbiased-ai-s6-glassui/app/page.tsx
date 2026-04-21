'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ChevronRight, 
  Loader2, 
  Cpu, 
  Database, 
  Users, 
  Globe, 
  Gavel
} from 'lucide-react';

export default function EthicsCheckPage() {
  const [formData, setFormData] = useState({
    purpose: '',
    data: '',
    decisions: '',
    populations: '',
    scale: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const fullPrompt = `
      AI System Purpose: ${formData.purpose}
      Data Used: ${formData.data}
      Decisions it makes: ${formData.decisions}
      Affected Populations: ${formData.populations}
      Deployment Scale: ${formData.scale}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to analyze');
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedResult = (text: string) => {
    const sections = text.split('\n\n');
    return sections.map((section, idx) => {
      if (section.toUpperCase().includes('TOP 3 RISK GAPS')) {
        return (
          <div key={idx} className="mt-8 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 glass-panel">
            <h3 className="text-xl font-bold text-red-400 flex items-center mb-4 font-syne">
              <AlertTriangle className="mr-2 h-6 w-6" />
              Critical Compliance Risks
            </h3>
            <div className="space-y-3 opacity-90">
              {section.split('\n').filter(line => line.trim().startsWith('-') || line.trim().match(/^\d\./)).map((item, i) => (
                <div key={i} className="flex items-start text-red-100">
                  <div className="h-2 w-2 rounded-full bg-red-400 mt-2 mr-3 shrink-0" />
                  <p>{item.replace(/^[- \d\.]*/, '')}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (section.includes('STATUS:')) {
        const lines = section.split('\n');
        const headerLine = lines.find(l => l.startsWith('-'));
        const statusLine = lines.find(l => l.includes('STATUS:'));
        const reasoningLine = lines.find(l => l.includes('REASONING:'));

        const status = statusLine?.split(':')[1]?.trim() || '';
        const isPass = status === 'LIKELY COMPLIANT';
        const isFail = status === 'LIKELY NON-COMPLIANT';
        
        return (
          <div key={idx} className="mb-4 glass-card border-l-4 overflow-hidden" 
            style={{ borderLeftColor: isPass ? '#10b981' : isFail ? '#ef4444' : '#f59e0b' }}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-lg text-white/90">
                {headerLine?.replace(/^[- ]*/, '') || 'Requirement'}
              </h4>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isPass ? 'bg-emerald-500/20 text-emerald-400' : 
                isFail ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {status}
              </span>
            </div>
            {reasoningLine && (
              <p className="text-sm text-white/60 italic mt-2 leading-relaxed">
                {reasoningLine.replace('REASONING:', '').trim()}
              </p>
            )}
          </div>
        );
      }

      return <p key={idx} className="mb-4 text-white/80 leading-relaxed">{section}</p>;
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-outfit selection:bg-accent-primary/30">
      {/* Header Nav */}
      <nav className="h-20 border-b border-white/10 backdrop-blur-xl bg-black/40 flex items-center px-8 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-glow">
            <ShieldCheck className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight font-syne bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            EthicsCheck
          </span>
        </div>
        <div className="ml-auto hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <a href="#" className="hover:text-accent-primary transition-colors">Documentation</a>
          <a href="#" className="hover:text-accent-primary transition-colors">Standards</a>
          <a href="#" className="hover:text-accent-primary transition-colors">Case Studies</a>
          <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all">
            Login
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold font-syne leading-tight">
                Audit your AI <br/>
                <span className="text-accent-primary">with Precision.</span>
              </h1>
              <p className="text-white/50 text-lg">
                Map your system against EU AI Act, NIST, and IEEE ethics frameworks in seconds.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-white/70 flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-accent-primary" />
                    System Purpose
                  </label>
                  <input
                    required
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    placeholder="e.g. Automated loan approval engine"
                    className="glass-input"
                    suppressHydrationWarning
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-white/70 flex items-center gap-2">
                    <Database className="h-4 w-4 text-accent-primary" />
                    Data Sources
                  </label>
                  <textarea
                    required
                    name="data"
                    value={formData.data}
                    onChange={handleInputChange}
                    placeholder="e.g. Historical credit scores, zip codes, employment history"
                    className="glass-input min-h-[80px]"
                    suppressHydrationWarning
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-white/70 flex items-center gap-2">
                      <Scale className="h-4 w-4 text-accent-primary" />
                      Key Decisions
                    </label>
                    <input
                      required
                      name="decisions"
                      value={formData.decisions}
                      onChange={handleInputChange}
                      placeholder="e.g. Interest rates"
                      className="glass-input"
                      suppressHydrationWarning
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-white/70 flex items-center gap-2">
                      <Users className="h-4 w-4 text-accent-primary" />
                      Impacted Groups
                    </label>
                    <input
                      required
                      name="populations"
                      value={formData.populations}
                      onChange={handleInputChange}
                      placeholder="e.g. Young applicants"
                      className="glass-input"
                      suppressHydrationWarning
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-white/70 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-accent-primary" />
                    Deployment Scale
                  </label>
                  <input
                    required
                    name="scale"
                    value={formData.scale}
                    onChange={handleInputChange}
                    placeholder="e.g. Nationwide deployment, 100k users/day"
                    className="glass-input"
                    suppressHydrationWarning
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="glass-button w-full flex items-center justify-center gap-2 group"
                suppressHydrationWarning
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing Compliance Architecture...
                  </>
                ) : (
                  <>
                    Generate Compliance Audit
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex gap-4">
              <Info className="h-6 w-6 text-cyan-400 shrink-0" />
              <p className="text-xs text-white/40 leading-relaxed">
                EthicsCheck uses Gemini 2.5 Flash for high-speed ethical reasoning. Results are suggestive and should be reviewed by legal professionals.
              </p>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            {!result && !isLoading && !error && (
              <div className="h-full min-h-[400px] glass-card flex flex-col items-center justify-center text-center p-12 border-dashed border-2">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Gavel className="h-8 w-8 text-white/20" />
                </div>
                <h3 className="text-xl font-bold font-syne mb-2 text-white/60">Ready for Audit</h3>
                <p className="text-white/40 max-w-sm">
                  Fill in your AI system details to generate a comprehensive compliance checklist mapped to international standards.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="h-full min-h-[400px] glass-card flex flex-col items-center justify-center text-center p-12 border-accent-primary/20">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full border-2 border-accent-primary/20 border-t-accent-primary animate-spin" />
                  <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-accent-primary animate-pulse" />
                </div>
                <h3 className="mt-8 text-xl font-bold font-syne animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
                  Auditing Ethics...
                </h3>
                <p className="mt-4 text-white/40 max-w-sm">
                  Our auditor is cross-referencing your system against NIST AI RMF, EU AI Act, and IEEE 7010.
                </p>
              </div>
            )}

            {error && (
              <div className="glass-card border-red-500/30 p-8 flex gap-4 items-start">
                <AlertTriangle className="h-6 w-6 text-red-400" />
                <div>
                  <h3 className="text-lg font-bold text-red-400 mb-1">Analysis Interrupted</h3>
                  <p className="text-red-200/60 text-sm">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="glass-panel rounded-2xl p-8 border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                  <div>
                    <h2 className="text-2xl font-bold font-syne">Compliance Audit Report</h2>
                    <p className="text-sm text-white/40 mt-1">Generated for: {formData.purpose}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <Globe className="h-4 w-4 text-white/60" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors font-bold text-[10px] uppercase text-white/60">
                      PDF
                    </button>
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  {renderFormattedResult(result)}
                </div>

                <div className="mt-12 flex items-center justify-center p-6 border-t border-white/5">
                  <button 
                    onClick={() => {setResult(null); setFormData({purpose:'', data:'', decisions:'', populations:'', scale:''})}}
                    className="text-white/40 hover:text-white/80 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    Start New Audit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-white/5 text-center">
        <p className="text-white/20 text-xs">
          &copy; 2026 EthicsCheck AI Compliance. All rights reserved. Built with Gemini 2.5 Flash.
        </p>
      </footer>
    </div>
  );
}
