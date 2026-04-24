'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Cpu, Zap, AlertTriangle, ChevronRight, Loader2, DollarSign, Database, Activity } from 'lucide-react';

export default function CostLeakFinder() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      if (!response.ok) throw new Error(data.error || 'Failed to analyze supply chain');

      setResult(data.result);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen p-4 md:p-8 relative">
      <div className="scanlines" />
      
      <div className="max-w-4xl mx-auto relative z-10 crt-flicker">
        {/* Terminal Header */}
        <div className="terminal-window mb-8">
          <div className="terminal-header flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal size={16} />
              <span>COST_LEAK_FINDER_V2.5.0</span>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-600" />
              <div className="w-3 h-3 bg-yellow-600" />
              <div className="w-3 h-3 bg-green-600" />
            </div>
          </div>
          
          <div className="p-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tighter text-white">
              CostLeakFinder
            </h1>
            <p className="text-lg opacity-80 mb-6 text-terminal-green italic">
              "Describe your supply chain — find hidden cost inefficiencies instantly"
            </p>
            
            <div className="terminal-border-dashed p-4 mb-8 bg-black/40">
              <div className="flex items-center gap-3 mb-2">
                <Database size={18} className="text-terminal-cyan" />
                <span className="text-terminal-cyan font-bold uppercase tracking-widest">System Status</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs opacity-70">
                <div className="flex items-center gap-2">
                  <Activity size={14} />
                  <span>CORE_ENGINE: ACTIVE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu size={14} />
                  <span>GEMINI_V2.5_FLASH: READY</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={14} />
                  <span>LATENCY: 42ms</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm uppercase tracking-widest opacity-80">
                  {">"} Input Supply Chain Parameters:
                  <span className="terminal-cursor ml-2" />
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="E.g., 3 stages: Manufacturing in SE Asia, Shipping via Sea, Distribution in EU. 12 vendors total. Current pain point: unpredictable lead times and rising fuel surcharges..."
                  className="w-full h-40 bg-black/50 border border-terminal-green p-4 text-terminal-green font-mono focus:ring-1 focus:ring-terminal-cyan outline-none resize-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="terminal-btn flex items-center gap-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>ANALYZING_COST_STREAMS...</span>
                  </>
                ) : (
                  <>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    <span>[$] EXECUTE_LEAK_ANALYSIS</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        {error && (
          <div className="terminal-window border-red-500 p-4 mb-8 bg-red-950/20 text-red-500">
            <div className="flex items-center gap-2 font-bold mb-2 uppercase">
              <AlertTriangle size={18} />
              <span>FATAL_ERROR</span>
            </div>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div ref={resultRef} className="terminal-window animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="terminal-header flex items-center gap-2">
              <DollarSign size={16} />
              <span>ANALYSIS_REPORT_0X7F4B</span>
            </div>
            <div className="p-6 space-y-8">
              {result.split('\n\n').map((section, idx) => {
                const isHeading = section.match(/^[0-9.]+\s|^\*\*/);
                return (
                  <div key={idx} className={`${isHeading ? 'border-l-2 border-terminal-cyan pl-4' : ''}`}>
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-terminal-green">
                      {section.replace(/\*\*/g, '')}
                    </pre>
                  </div>
                );
              })}
              
              <div className="pt-6 border-t border-terminal-green-dim text-xs opacity-50 italic">
                Report generated by GEMINI-2.5-FLASH // SC-OPTIMIZER-ENGINE
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="fixed bottom-4 left-0 w-full text-center text-[10px] uppercase tracking-[0.3em] opacity-30 pointer-events-none z-0">
        CostLeakFinder // Industrial Logistics Intelligence // (c) 2026
      </footer>
    </main>
  );
}
