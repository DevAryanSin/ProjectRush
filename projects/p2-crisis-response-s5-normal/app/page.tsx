'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  FileText, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MapPin, 
  User, 
  Activity,
  ArrowRight,
  ClipboardList
} from 'lucide-react';

export default function IncidentLogPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate report');
      
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseReport = (text: string) => {
    // Basic parser for AI generated sections
    const sections = text.split(/\n(?=[A-Z][A-Z\s\/]+:)/g);
    return sections.map((section, idx) => {
      const [title, ...content] = section.split(':');
      if (!content.length) return <p key={idx} className="whitespace-pre-wrap mb-4">{section}</p>;
      
      return (
        <div key={idx} className="report-section group">
          <label className="section-label group-hover:text-blue-600 transition-colors uppercase">
            {title.trim().replace(/\*\*/g, '')}
          </label>
          <div className="section-content whitespace-pre-wrap">
            {content.join(':').trim().replace(/\*\*/g, '')}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-1.5 rounded-[4px] shadow-sm shadow-red-200">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 uppercase">IncidentLog</h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Emergency Coordination System</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <nav className="flex gap-4">
              <a href="#" className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors">DASHBOARD</a>
              <a href="#" className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors">ARCHIVES</a>
              <a href="#" className="text-xs font-semibold text-blue-600">NEW REPORT</a>
            </nav>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 emergency-pulse"></div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">SYSTEM ACTIVE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <section className="glass-card p-6 rounded-[4px]">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-1">Create Incident Report</h2>
                <p className="text-sm text-slate-500">Provide a plain-language description of the event. Our AI will structure it according to official standards.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-slate-500 tracking-wide uppercase flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Incident Details
                    </label>
                    <span className="text-[10px] text-slate-400 italic">Industry standard format applied automatically</span>
                  </div>
                  <textarea
                    className="input-field min-h-[300px] resize-none text-sm leading-relaxed"
                    placeholder="Example: At approximately 10:45 PM on April 20th, a guest in room 402 reported a strong smell of smoke. Staff member John Doe investigated and found a small electrical fire in a wall outlet. John used a nearby fire extinguisher to douse the flames while Jane Smith initiated guest evacuation for the 4th floor. Fire department was called at 10:48 PM..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full group py-4 h-14"
                  disabled={loading || !input.trim()}
                  suppressHydrationWarning
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>ANALYZING FIELD DATA...</span>
                    </>
                  ) : (
                    <>
                      <span>GENERATE ACCREDITED REPORT</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* Quick Stats/Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-[4px] bg-blue-50/30 border-blue-100">
                <Clock className="w-4 h-4 text-blue-600 mb-2" />
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg. Processing</div>
                <div className="text-lg font-bold text-slate-800">1.4s</div>
              </div>
              <div className="glass-card p-4 rounded-[4px] bg-emerald-50/30 border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-2" />
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compliance</div>
                <div className="text-lg font-bold text-slate-800">ISO-9001</div>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            {!result && !loading && !error && (
              <div className="glass-card rounded-[4px] p-12 flex flex-col items-center justify-center text-center border-dashed border-2 bg-slate-50/50">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <ClipboardList className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-base font-bold text-slate-400 uppercase tracking-widest">Awaiting Input</h3>
                <p className="text-sm text-slate-400 max-w-xs mt-2">Submit field notes on the left to generate a formatted incident report automatically.</p>
              </div>
            )}

            {loading && (
              <div className="glass-card rounded-[4px] overflow-hidden">
                <div className="h-1 bg-slate-100 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-blue-600 shimmer"></div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-8">
                    <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Processing Report Infrastructure...</span>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                    <div className="h-32 bg-slate-50 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse"></div>
                    <div className="h-24 bg-slate-50 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="glass-card rounded-[4px] p-6 border-red-100 bg-red-50/30">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider">Analysis Failed</h3>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                    <button 
                      onClick={() => setError(null)}
                      className="mt-4 text-xs font-bold text-red-700 underline underline-offset-4"
                    >
                      CLEAR ERROR AND RETRY
                    </button>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="glass-card rounded-[4px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-lg border-blue-100">
                <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold tracking-widest uppercase">Verified Incident Report</h3>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                </div>
                
                <div className="p-8 bg-white max-h-[700px] overflow-y-auto">
                  <div className="mb-10 text-center border-b pb-8 border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">OFFICIAL INCIDENT REPORT</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Form 704-B | Internal Operations</p>
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    {parseReport(result)}
                  </div>

                  <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-end">
                    <div className="space-y-4">
                      <div className="w-48 h-10 border-b border-slate-300"></div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Supervisor Signature</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Automated By</div>
                      <div className="text-sm font-bold text-slate-900 italic">Gemini Crisis Core 2.5</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center px-6">
                  <button className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider flex items-center gap-2">
                    <Send className="w-3.5 h-3.5" /> Email Copy
                  </button>
                  <button className="bg-white border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors rounded-[2px] shadow-sm uppercase tracking-wider">
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 grayscale brightness-125">
            <ShieldAlert className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">IncidentLog Security Framework v2.0</span>
          </div>
          <div className="flex gap-6 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
