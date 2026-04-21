'use client';

import React, { useState } from 'react';
import { 
  Ship, 
  AlertTriangle, 
  Clock, 
  Target, 
  ShieldCheck, 
  ClipboardCheck, 
  Loader2, 
  ChevronRight, 
  Activity,
  History,
  Users,
  BarChart3,
  Search
} from 'lucide-react';

export default function CargoDebrief() {
  const [formData, setFormData] = useState({
    description: '',
    timeline: '',
    rootCause: '',
    impact: '',
    teams: ''
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
      INCIDENT DESCRIPTION: ${formData.description}
      TIMELINE OF EVENTS: ${formData.timeline}
      KNOWN ROOT CAUSE: ${formData.rootCause}
      BUSINESS IMPACT: ${formData.impact}
      TEAMS INVOLVED: ${formData.teams}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to analyze incident');
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text: string) => {
    // Basic parser to split the markdown-like response into sections
    const sections = text.split(/\n(?=#{1,3}|[A-Z\s]{5,}:)/g);
    return sections.map((section, idx) => {
      const lines = section.trim().split('\n');
      const title = lines[0].replace(/^[#\s*]+/, '').replace(/:$/, '');
      const content = lines.slice(1).join('\n').trim();
      
      return (
        <div key={idx} className="glass-card p-6 mb-6 group hover:border-teal-500/30 transition-all duration-300">
          <h3 className="text-teal-400 font-tech font-bold text-lg mb-4 flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            {title}
          </h3>
          <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {content}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12">
      <header className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
              <Ship className="w-8 h-8 text-teal-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter neon-teal">CargoDebrief</h1>
          </div>
          <p className="text-slate-400 font-medium">
            After a delay, describe what happened — get a full post-mortem and prevention plan
          </p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2 border-teal-500/20">
            <Activity className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-tech text-teal-400">LOGISTICS PRECISION</span>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2 border-amber-500/20">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-tech text-amber-400">REAL-TIME INTEL</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-8">
        <section>
          <div className="glass-card p-8 sticky top-8">
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-5 h-5 text-teal-400" />
              <h2 className="text-xl font-bold font-tech">INCIDENT INTAKE</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-tech text-slate-400 mb-2 block uppercase tracking-wider">What happened?</label>
                <textarea 
                  required
                  className="glass-input w-full min-h-[100px] resize-none"
                  placeholder="Describe the disruption in detail..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-tech text-slate-400 mb-2 block uppercase tracking-wider flex items-center gap-1">
                    <History className="w-3 h-3" /> Timeline
                  </label>
                  <textarea 
                    className="glass-input w-full min-h-[80px] resize-none text-sm"
                    placeholder="Steps and events..."
                    value={formData.timeline}
                    onChange={e => setFormData({...formData, timeline: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-tech text-slate-400 mb-2 block uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Root Cause
                  </label>
                  <textarea 
                    className="glass-input w-full min-h-[80px] resize-none text-sm"
                    placeholder="If known..."
                    value={formData.rootCause}
                    onChange={e => setFormData({...formData, rootCause: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-tech text-slate-400 mb-2 block uppercase tracking-wider flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" /> Business Impact
                  </label>
                  <input 
                    className="glass-input w-full text-sm"
                    placeholder="Cost, delay time..."
                    value={formData.impact}
                    onChange={e => setFormData({...formData, impact: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-tech text-slate-400 mb-2 block uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3" /> Teams
                  </label>
                  <input 
                    className="glass-input w-full text-sm"
                    placeholder="Operations, Transit..."
                    value={formData.teams}
                    onChange={e => setFormData({...formData, teams: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                suppressHydrationWarning
                className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    ANALYZING DATA...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    GENERATE POST-MORTEM
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        <section className="min-h-[400px]">
          {!result && !loading && !error && (
            <div className="h-full glass-card border-dashed border-white/10 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <ClipboardCheck className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Analysis Pending</h3>
              <p className="text-slate-500 max-w-sm">
                Submit the incident details to receive a forensic post-mortem and prioritized prevention plan.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full glass-card flex flex-col items-center justify-center p-12">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
                <Ship className="w-8 h-8 text-teal-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <h3 className="text-xl font-bold mb-2 neon-teal">Analyzing Network Trajectory</h3>
              <p className="text-slate-400">Gemini is distilling root causes and systemic weaknesses...</p>
            </div>
          )}

          {error && (
            <div className="glass-card p-6 border-red-500/30 bg-red-500/5">
              <div className="flex items-center gap-3 text-red-400 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold">Analysis Failed</h3>
              </div>
              <p className="text-slate-400 text-sm">{error}</p>
              <button 
                onClick={() => setLoading(false)}
                className="mt-4 text-xs font-tech text-teal-400 underline"
              >
                Try again
              </button>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
                  <h2 className="text-xl font-bold font-tech">FINAL REPORT</h2>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="text-xs font-tech text-slate-400 hover:text-teal-400 transition-colors"
                >
                  EXPORT PDF
                </button>
              </div>
              
              {parseResult(result)}
              
              <div className="mt-8 p-6 glass-card bg-amber-500/[0.03] border-amber-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h4 className="font-tech font-bold text-amber-500">EXECUTIVE SUMMARY</h4>
                </div>
                <p className="text-sm text-slate-400 italic">
                  This report was generated using Gemini-2.5-Flash supply chain analytics. 
                  Recommendations are prioritized based on systemic impact and resilience enhancement.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-tech tracking-[0.2em] text-slate-500 uppercase">
        <div>© 2026 CargoDebrief Systems</div>
        <div className="flex gap-6">
          <span>v2.5_FLASH_LOGISTICS</span>
          <span className="text-teal-500/50">SECURE TERMINAL ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}
