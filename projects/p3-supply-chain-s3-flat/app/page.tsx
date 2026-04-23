'use client';

import React, { useState } from 'react';
import { 
  PackageSearch, 
  Activity, 
  AlertTriangle, 
  ChevronRight, 
  Network, 
  TrendingDown, 
  Settings2,
  RefreshCcw,
  Zap
} from 'lucide-react';

export default function BottleneckBot() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
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

      if (!response.ok) throw new Error('Analysis failed. Please check your connection.');
      
      const data = await response.json();
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatResult = (text: string) => {
    // Simple parsing logic for the sections defined in system prompt
    const sections = text.split(/(?=Root cause diagnosis|Bottleneck location|Cascade risk|Targeted fix recommendations|3 targeted fix)/i);
    
    return (
      <div className="space-y-6">
        {sections.map((section, idx) => {
          if (!section.trim()) return null;
          
          const isHeader = section.match(/^(Root cause|Bottleneck|Cascade|Targeted fix|3 targeted fix)/i);
          const [title, ...content] = isHeader ? section.split(/:([\s\S]*)/) : ['', section];

          return (
            <div key={idx} className="flat-card">
              {title && (
                <h3 className="label-flat border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
                  <Zap size={18} className="fill-amber-400" />
                  {title.trim()}
                </h3>
              )}
              <div className="text-lg leading-relaxed whitespace-pre-wrap">
                {content.join('').trim()}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main className="min-h-screen">
      {/* Header Section */}
      <header className="flat-header">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-2 flat-border">
                <PackageSearch size={32} className="text-teal-900" />
              </div>
              <span className="status-tag bg-amber-400">System: Operational</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none text-white">
              Bottleneck<span className="text-amber-400">Bot</span>
            </h1>
            <p className="mt-4 text-xl md:text-2xl font-bold text-teal-50 max-w-2xl leading-tight">
              Describe your shipment delay or paste transit logs to pinpoint exact chain failure points.
            </p>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 flat-border border-white/20">
              <span className="block text-xs font-black uppercase text-amber-300">Transit Score</span>
              <span className="text-3xl font-black text-white">92.4%</span>
            </div>
            <div className="bg-white/10 p-4 flat-border border-white/20">
              <span className="block text-xs font-black uppercase text-amber-300">Active Alerts</span>
              <span className="text-3xl font-black text-white">04</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 -mt-10">
        
        {/* Input Column */}
        <section className="lg:col-span-5 space-y-6">
          <div className="flat-card bg-[#FF9F1C] border-none">
            <div className="p-1">
              <h2 className="text-2xl font-black uppercase mb-2 flex items-center gap-2">
                <Activity size={24} />
                Disruption Entry
              </h2>
              <p className="font-bold text-sm mb-4">Include: Last known location, timeline variance, and cargo type.</p>
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. Shipment #9234 delayed at Singapore Port for 48h. Expected departure was Tuesday. No dock space reported..."
                className="flat-input h-64 resize-none focus:outline-none focus:ring-0 focus:border-teal-700"
              />

              <button
                onClick={handleAnalyze}
                disabled={loading || !input.trim()}
                suppressHydrationWarning
                className={`flat-button w-full mt-4 flex items-center justify-center gap-3 text-xl ${loading ? 'loading-flat' : ''}`}
              >
                {loading ? (
                  <>
                    <RefreshCcw size={24} className="animate-spin" />
                    Analyzing Chain...
                  </>
                ) : (
                  <>
                    <Network size={24} />
                    Run Diagnostic
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flat-card hover:bg-teal-50 transition-colors cursor-pointer group">
              <Settings2 size={24} className="mb-2 group-hover:rotate-90 transition-transform" />
              <h4 className="font-black uppercase text-xs">Optimization Presets</h4>
            </div>
            <div className="flat-card hover:bg-teal-50 transition-colors cursor-pointer group">
              <TrendingDown size={24} className="mb-2 group-hover:-translate-y-1 transition-transform" />
              <h4 className="font-black uppercase text-xs">Cost Impact Loss</h4>
            </div>
          </div>
        </section>

        {/* Results Column */}
        <section className="lg:col-span-7">
          {!result && !loading && !error && (
            <div className="flat-card h-full flex flex-col items-center justify-center text-center p-12 border-dashed opacity-60">
              <PackageSearch size={64} className="mb-6" />
              <h2 className="text-3xl font-black uppercase mb-2">No Active Diagnostic</h2>
              <p className="font-bold max-w-sm">
                Enter shipment data to generate a real-time bottleneck analysis and cascade risk assessment.
              </p>
            </div>
          )}

          {loading && (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flat-card animate-pulse">
                  <div className="h-6 w-1/3 bg-gray-200 mb-4 flat-border border-gray-200" />
                  <div className="h-4 w-full bg-gray-100 mb-2" />
                  <div className="h-4 w-5/6 bg-gray-100" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="flat-card bg-red-100 border-red-600">
              <div className="flex items-center gap-3 text-red-600 mb-2">
                <AlertTriangle size={32} />
                <h2 className="text-2xl font-black uppercase">Service Interruption</h2>
              </div>
              <p className="font-bold">{error}</p>
              <button 
                onClick={handleAnalyze}
                className="mt-4 text-xs font-black uppercase underline decoration-2 underline-offset-4"
              >
                Retry Analysis
              </button>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black uppercase flex items-center gap-3">
                  <PackageSearch size={32} className="text-teal-700" />
                  Diagnostic Output
                </h2>
                <button 
                  onClick={() => window.print()}
                  className="status-tag hover:bg-black hover:text-white transition-colors"
                >
                  Export PDF
                </button>
              </div>
              
              {formatResult(result)}
              
              <div className="mt-8 flat-card bg-teal-900 text-white">
                <h3 className="font-black uppercase mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-amber-400" />
                   AI Supply Chain Insight
                </h3>
                <p className="font-bold italic">
                  "This analysis is based on predictive modeling. For physical verification, contact port authorities with reference shipment ID."
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      <footer className="mt-20 border-t-4 border-black p-8 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div className="flex items-center gap-2 font-black uppercase tracking-tighter">
            <div className="bg-black text-white p-1">BB</div>
            BottleneckBot v2.5
          </div>
          <div className="flex gap-8 font-bold text-sm uppercase">
            <a href="#" className="hover:underline underline-offset-4 decoration-2">Protocol</a>
            <a href="#" className="hover:underline underline-offset-4 decoration-2">Ledger</a>
            <a href="#" className="hover:underline underline-offset-4 decoration-2">Network Status</a>
          </div>
          <div className="text-xs font-black text-gray-400">
            © 2026 LOGISTICS OPTIMIZATION GROUP. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </main>
  );
}
