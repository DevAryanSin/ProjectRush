'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Users, 
  Activity, 
  Send, 
  ShieldAlert, 
  ClipboardCheck, 
  ChevronRight,
  Loader2,
  PhoneCall,
  Radio
} from 'lucide-react';

export default function CrisisSync() {
  const [mode, setMode] = useState<'incident' | 'team'>('incident');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: input, 
          mode: mode === 'incident' ? 'Incident Translation' : 'Team Status Synthesis' 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to process signal');
      
      setOutput(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-8 page-transition">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 brutal-card bg-red-600 text-white">
              <ShieldAlert size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
              CrisisSync
            </h1>
          </div>
          <p className="text-lg font-medium text-charcoal opacity-80 pl-1">
            Signal → Situation → Response System
          </p>
        </div>
        
        {/* Mode Switcher */}
        <div className="neo-inset p-1.5 rounded-xl flex gap-1 w-full md:w-auto">
          <button
            onClick={() => { setMode('incident'); setOutput(null); }}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-bold uppercase text-sm flex items-center justify-center gap-2 transition-all ${
              mode === 'incident' ? 'mode-switch-active text-red-600' : 'text-charcoal opacity-60 hover:opacity-100'
            }`}
          >
            <PhoneCall size={18} />
            Incident Input
          </button>
          <button
            onClick={() => { setMode('team'); setOutput(null); }}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-bold uppercase text-sm flex items-center justify-center gap-2 transition-all ${
              mode === 'team' ? 'mode-switch-active text-amber-600' : 'text-charcoal opacity-60 hover:opacity-100'
            }`}
          >
            <Radio size={18} />
            Team Status
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Panel */}
        <section className="lg:col-span-2 space-y-6">
          <div className="neo-flat p-6 rounded-2xl border-t-4 border-black/5">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold uppercase tracking-tight">
                {mode === 'incident' ? 'Input: Distressed Signal' : 'Input: Staff Updates'}
              </h2>
            </div>
            
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'incident' 
                    ? "Paste transcript or message here... (e.g. 'HELP! There's a fire in the kitchen, smoke is everywhere, 2 people trapped!')" 
                    : "Paste multiple staff updates... (e.g. 'John: Lobby, Green. All clear. Mary: Level 2, Red. Dense smoke observed.')"
                }
                className="w-full h-64 p-4 neo-inset rounded-xl border-none focus:ring-2 focus:ring-red-500 outline-none resize-none font-medium placeholder:opacity-40"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className={`w-full mt-6 py-4 flex items-center justify-center gap-3 font-bold text-lg uppercase brutal-btn ${
                mode === 'incident' ? 'brutal-btn-red' : 'brutal-btn-amber'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Execute Analysis
                </>
              )}
            </button>
          </div>

          {/* Quick Samples */}
          <div className="p-4 rounded-xl border-2 border-dashed border-charcoal/20">
            <h3 className="text-sm font-bold uppercase opacity-60 mb-3 text-charcoal">Operational Samples</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setInput(mode === 'incident' ? "Fire in the ballroom, guests are running, someone fell near the east exit. Smoke is getting thick." : "Unit 1: North Gate, Clear. Unit 2: Ballroom, High Activity. Unit 3: Parking, No issues.")}
                className="px-3 py-1.5 bg-white border border-black text-xs font-bold hover:bg-black hover:text-white transition-colors"
              >
                Sample 1
              </button>
              <button 
                onClick={() => setInput(mode === 'incident' ? "Medical emergency! Person collapsed in the gym, looks like a heart attack. No pulse, need AED now!" : "Alpha: Roof, 100% coverage. Bravo: Kitchen, 20%. Charlie: Main Entrance, 0%. Need support at Entrance.")}
                className="px-3 py-1.5 bg-white border border-black text-xs font-bold hover:bg-black hover:text-white transition-colors"
              >
                Sample 2
              </button>
            </div>
          </div>
        </section>

        {/* Output Panel */}
        <section className="lg:col-span-3">
          {!output && !loading && !error && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 neo-inset rounded-2xl opacity-40">
              <Activity size={64} className="mb-4" />
              <p className="text-xl font-bold uppercase">Awaiting Signal Input</p>
              <p className="text-sm">Structured intelligence will appear here after execution</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 neo-inset rounded-2xl">
              <div className="relative">
                <Loader2 size={64} className="animate-spin text-red-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity size={24} className="animate-pulse" />
                </div>
              </div>
              <p className="mt-6 text-xl font-bold uppercase animate-pulse">Analyzing Pattern...</p>
              <p className="text-sm">Synthesizing operational intelligence</p>
            </div>
          )}

          {error && (
            <div className="p-6 brutal-card bg-red-100 border-red-600">
              <div className="flex items-center gap-3 text-red-600 mb-2">
                <AlertTriangle />
                <h2 className="font-bold uppercase text-lg">System Failure</h2>
              </div>
              <p className="font-medium text-charcoal">{error}</p>
              <button 
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-red-600 text-white font-bold uppercase text-sm"
              >
                Retry Command
              </button>
            </div>
          )}

          {output && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="neo-flat p-8 rounded-2xl brutal-card bg-white">
                <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
                  <h2 className="text-2xl font-bold uppercase flex items-center gap-3 text-black">
                    {mode === 'incident' ? <AlertTriangle className="text-red-600" /> : <Users className="text-amber-600" />}
                    {mode === 'incident' ? 'Intelligence Report' : 'Operational Picture'}
                  </h2>
                  <div className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest">
                    Live Data
                  </div>
                </div>

                <div className="max-w-none space-y-4">
                  <div className="whitespace-pre-wrap font-medium text-lg leading-relaxed text-charcoal">
                    {output.split('\n').map((line, i) => {
                      if (line.startsWith('#') || line.toUpperCase().includes('INCIDENT TYPE') || line.toUpperCase().includes('TEAM STATUS')) {
                        return <div key={i} className="text-2xl font-bold uppercase text-black mt-6 mb-2 border-l-8 border-black pl-3">{line.replace(/^#+\s/, '')}</div>;
                      }
                      if (line.includes(':')) {
                        const [label, ...rest] = line.split(':');
                        return (
                          <div key={i} className="mb-2 flex flex-col md:flex-row md:items-start gap-1 md:gap-4 border-b border-black/5 pb-2">
                            <span className="text-xs font-black uppercase opacity-60 min-w-[140px] pt-1">{label}</span>
                            <span className="font-bold text-black">{rest.join(':')}</span>
                          </div>
                        );
                      }
                      return line.trim() === '' ? <div key={i} className="h-4" /> : <p key={i} className="mb-2">{line}</p>;
                    })}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t-2 border-black/10 flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={() => {
                      const text = `CRISIS REPORT: ${output}`;
                      navigator.clipboard.writeText(text);
                    }}
                    className="flex-1 py-3 neo-button rounded-xl font-bold uppercase text-sm flex items-center justify-center gap-2 text-charcoal"
                  >
                    <ClipboardCheck size={18} />
                    Copy Briefing
                  </button>
                  <button 
                    onClick={() => setOutput(null)}
                    className="flex-1 py-3 neo-button rounded-xl font-bold uppercase text-sm flex items-center justify-center gap-2 text-charcoal"
                  >
                    Clear Display
                  </button>
                </div>
              </div>

              {/* Action Recommendation */}
              <div className="brutal-card bg-black text-white p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-red-500">System Recommendation</h3>
                  <p className="text-lg font-bold">Initiate Response Protocol Alpha-7</p>
                </div>
                <ChevronRight size={32} className="text-red-500" />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Footer / Status Bar */}
      <footer className="pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase opacity-50">
        <div className="flex items-center gap-4 text-charcoal">
          <span>Status: Operational</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="ml-4">Nodes Active: 14</span>
        </div>
        <div className="flex items-center gap-4 text-charcoal">
          <span>Security Level: Tier 1</span>
          <span>© 2026 CrisisSync Terminal</span>
        </div>
      </footer>
    </main>
  );
}
