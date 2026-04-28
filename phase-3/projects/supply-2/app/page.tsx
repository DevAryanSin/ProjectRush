"use client";

import { useState, useEffect } from "react";
import { 
  Box, 
  Search, 
  TrendingDown, 
  FileText, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  Terminal,
  ChevronRight,
  Activity,
  Layers
} from "lucide-react";

type Mode = "story" | "cost";

interface NarrativeEvent {
  title: string;
  time: string;
  content: string;
  type: "status" | "delay" | "next";
}

interface CostLeak {
  issue: string;
  cost: string;
  priority: string;
  fix: string;
}

export default function ChainSight() {
  const [mode, setMode] = useState<Mode>("story");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to the intelligence core.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen relative p-4 md:p-8 lg:p-12 max-w-7xl mx-auto overflow-hidden">
      {/* Background elements moved to layout but decorative ones here */}
      <div className="aurora-bg" />
      <div className="aurora-layer" />

      {/* Header */}
      <header className="mb-12 fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-cyan-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            <Activity className="text-navy-950 w-6 h-6" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white">
            ChainSight<span className="text-cyan-400">.</span>
          </h1>
        </div>
        <p className="text-slate-400 text-lg max-w-2xl font-light">
          See what happened. <span className="text-cyan-300/80">Find what it cost you.</span>
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6 fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="glass glass-cyan p-6 rounded-lg space-y-6">
            {/* Mode Switcher */}
            <div className="flex bg-slate-950/50 p-1 rounded border border-white/5">
              <button 
                onClick={() => { setMode("story"); setResults(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-medium transition-all ${
                  mode === "story" ? "bg-cyan-500 text-slate-950 shadow-lg" : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText size={16} />
                Shipment Story
              </button>
              <button 
                onClick={() => { setMode("cost"); setResults(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-medium transition-all ${
                  mode === "cost" ? "bg-violet-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                }`}
              >
                <TrendingDown size={16} />
                Cost Analysis
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-bold block">
                {mode === "story" ? "Raw Tracking Logs / Updates" : "Supply Chain Structure / Pain Points"}
              </label>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "story" ? "Paste tracking data here..." : "Describe your vendors, transport routes, and current issues..."}
                className="input-field rounded h-64 resize-none font-mono text-sm leading-relaxed"
              />
              <button 
                onClick={handleAnalyze}
                disabled={loading || !input.trim()}
                className="btn-analyze w-full disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Analyze Intelligence
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Utility Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 rounded-lg">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Clock size={14} />
                <span className="text-[10px] uppercase tracking-wider font-bold">Real-time</span>
              </div>
              <p className="text-xs text-slate-500">Live data ingestion and narrative generation.</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <div className="flex items-center gap-2 text-violet-400 mb-2">
                <Layers size={14} />
                <span className="text-[10px] uppercase tracking-wider font-bold">Multi-layer</span>
              </div>
              <p className="text-xs text-slate-500">Structural cost analysis across all stages.</p>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 space-y-6 fade-in" style={{ animationDelay: '0.2s' }}>
          {!results && !loading && !error && (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Terminal className="text-slate-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-400 mb-2">Intelligence Core Idle</h3>
              <p className="text-slate-600 max-w-sm">
                Enter your data to begin the narrative translation or cost optimization analysis.
              </p>
            </div>
          )}

          {loading && (
            <div className="space-y-6">
              {mode === "story" ? (
                <div className="space-y-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="narrative-block animate-pulse">
                      <div className="h-4 bg-slate-800 rounded w-1/4 mb-4" />
                      <div className="h-6 bg-slate-800 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-slate-800 rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="terminal-block border-slate-800 animate-pulse">
                      <div className="h-3 bg-slate-800 rounded w-24 mb-4" />
                      <div className="h-5 bg-slate-800 rounded w-1/2 mb-2" />
                      <div className="h-4 bg-slate-800 rounded w-full opacity-50" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-lg flex items-start gap-4">
              <AlertCircle className="text-red-500 shrink-0" />
              <div>
                <h4 className="font-bold text-red-500 mb-1">System Error</h4>
                <p className="text-sm text-red-400/80">{error}</p>
              </div>
            </div>
          )}

          {results && mode === "story" && (
            <div className="space-y-8 py-4">
              {(results as NarrativeEvent[]).map((event, idx) => (
                <div key={idx} className="narrative-block fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-cyan-400/70 font-mono tracking-tighter uppercase">
                      {event.time}
                    </span>
                    <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-widest ${
                      event.type === 'delay' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                      event.type === 'next' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                      'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-lg">{event.content}</p>
                </div>
              ))}
            </div>
          )}

          {results && mode === "cost" && (
            <div className="space-y-4">
              {(results as CostLeak[]).map((leak, idx) => (
                <div key={idx} className="terminal-block fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="terminal-header">INCIDENT_DATA_RECORD_{idx + 1}</div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-slate-500 font-mono block mb-1">ISSUE:</span>
                      <div className="text-white font-bold text-lg">{leak.issue}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-slate-500 font-mono block mb-1">WASTE_MAGNITUDE:</span>
                        <div className={`font-mono font-bold ${
                          leak.cost === 'High' ? 'text-red-500' : 
                          leak.cost === 'Medium' ? 'text-amber-500' : 'text-cyan-400'
                        }`}>
                          {leak.cost.toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 font-mono block mb-1">PRIORITY_RANK:</span>
                        <div className="text-white font-mono">{leak.priority}</div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-xs text-cyan-400/70 font-mono block mb-1 flex items-center gap-2">
                        <ArrowRight size={12} /> RECOMMENDED_FIX:
                      </span>
                      <div className="text-slate-300 italic">{leak.fix}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="mt-20 pt-8 border-t border-white/5 text-slate-600 text-sm flex flex-col md:flex-row justify-between items-center gap-4 fade-in">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs">STATUS: CORE_OPERATIONAL</span>
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
        </div>
        <p>© 2026 ChainSight Terminal Intelligence Systems. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Security</a>
        </div>
      </footer>
    </main>
  );
}
