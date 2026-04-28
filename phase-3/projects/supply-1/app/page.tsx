"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  MapPin, 
  Truck, 
  Calendar, 
  CloudRain, 
  Wind, 
  AlertTriangle, 
  Clock, 
  ChevronRight,
  Activity,
  Zap,
  Navigation,
  Layers
} from "lucide-react";

interface Threat {
  segment: string;
  threat: string;
  severity: "low" | "medium" | "high";
}

interface AnalysisResult {
  riskScore: number;
  threats: Threat[];
  etaImpact: number;
  mitigations: string[];
}

export default function StormRouteDashboard() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [mode, setMode] = useState("Trucking");
  const [date, setDate] = useState("");
  const [conditions, setConditions] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (result && displayScore < result.riskScore) {
      const timer = setTimeout(() => setDisplayScore(prev => prev + 1), 20);
      return () => clearTimeout(timer);
    }
  }, [result, displayScore]);

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setDisplayScore(0);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination, mode, date, conditions }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Intelligence gathering failed. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* HUD Header */}
      <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-l-4 border-cyan-500 pl-4">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-white glow-cyan uppercase leading-none">
            StormRoute <span className="text-cyan-500/50">MVP</span>
          </h1>
          <p className="mono text-cyan-500 text-sm mt-2 tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 animate-pulse" />
            PREDICTIVE WEATHER RISK ENGINE // V.2.5.0
          </p>
        </div>
        <div className="hidden md:flex flex-col items-end mono text-xs text-slate-500 mt-4 md:mt-0">
          <p>LAT: 40.7128° N // LON: 74.0060° W</p>
          <p>STATUS: OPERATIONAL</p>
          <p>UPTIME: 99.98%</p>
        </div>
      </header>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Control Panel */}
        <section className="lg:col-span-4 space-y-6">
          <div className="industrial-panel p-6">
            <div className="scanline" />
            <h2 className="text-2xl text-cyan-400 mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              MISSION PARAMETERS
            </h2>
            
            <form onSubmit={handleAnalysis} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <label className="mono text-[10px] text-cyan-500/70 block mb-1">ORIGIN POINT</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                    <input 
                      required
                      type="text" 
                      placeholder="e.g., Port of Long Beach" 
                      className="industrial-input"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="mono text-[10px] text-cyan-500/70 block mb-1">DESTINATION TERMINAL</label>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-cyan-500" />
                    <input 
                      required
                      type="text" 
                      placeholder="e.g., Chicago Intermodal" 
                      className="industrial-input"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="mono text-[10px] text-cyan-500/70 block mb-1">TRANSPORT MODE</label>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-cyan-500" />
                      <select 
                        className="industrial-input bg-[#0e1116]"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                      >
                        <option>Trucking</option>
                        <option>Rail</option>
                        <option>Air Freight</option>
                        <option>Maritime</option>
                      </select>
                    </div>
                  </div>
                  <div className="relative">
                    <label className="mono text-[10px] text-cyan-500/70 block mb-1">DEPARTURE DATE</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-500" />
                      <input 
                        required
                        type="date" 
                        className="industrial-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="mono text-[10px] text-cyan-500/70 block mb-1">ENVIRONMENTAL CONDITIONS (OPTIONAL)</label>
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-cyan-500" />
                    <input 
                      type="text" 
                      placeholder="e.g., High winds reported" 
                      className="industrial-input"
                      value={conditions}
                      onChange={(e) => setConditions(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button 
                disabled={loading}
                className="industrial-button w-full flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Zap className="w-5 h-5 animate-spin" />
                    SCANNING FREQUENCIES...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    INITIATE RISK ANALYSIS
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="industrial-panel p-4 opacity-50">
            <h3 className="mono text-xs text-slate-400 mb-2">SYSTEM LOGS</h3>
            <div className="mono text-[10px] text-cyan-900 space-y-1">
              <p>[09:12:44] - SATCOM CONNECTION ESTABLISHED</p>
              <p>[09:12:45] - WEATHER DATA STREAM SYNCED</p>
              <p>[09:12:46] - WAITING FOR MISSION PARAMETERS...</p>
            </div>
          </div>
        </section>

        {/* Right: Risk Visualization */}
        <section className="lg:col-span-8 space-y-8">
          {!result && !loading && (
            <div className="h-full industrial-panel flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
              <div className="radar-sweep" />
              <ShieldAlert className="w-20 h-20 text-cyan-500/20 mb-6" />
              <h2 className="text-3xl text-slate-500 mb-2 uppercase">NO ACTIVE THREATS SCANNED</h2>
              <p className="mono text-slate-600 max-w-md">Input route parameters on the left to begin real-time atmospheric disruption analysis.</p>
            </div>
          )}

          {loading && (
            <div className="h-full industrial-panel flex flex-col items-center justify-center p-12 min-h-[500px]">
              <div className="radar-sweep" />
              <div className="relative">
                <div className="w-48 h-48 border-4 border-cyan-500/20 rounded-full animate-spin border-t-cyan-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="w-12 h-12 text-cyan-500 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl text-cyan-500 mt-8 mono animate-pulse">PROCESSING DATA PACKETS...</h2>
            </div>
          )}

          {result && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Main Risk Score Card */}
              <div className="industrial-panel p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                  <h3 className="mono text-sm text-cyan-500 mb-4 tracking-widest uppercase font-bold underline decoration-2 underline-offset-4">OVERALL DELAY RISK</h3>
                  <div className="flex items-baseline justify-center md:justify-start">
                    <span className={`text-9xl font-black ${result.riskScore > 70 ? 'text-red-500 glow-red animate-flicker' : result.riskScore > 30 ? 'text-amber-500' : 'text-green-500'} transition-all`}>
                      {displayScore}
                    </span>
                    <span className="text-4xl text-slate-500 font-bold ml-2">%</span>
                  </div>
                </div>
                
                <div className="industrial-panel bg-black/40 border-cyan-500/10 p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="w-6 h-6 text-cyan-400" />
                      <span className="mono text-lg text-slate-300">ETA IMPACT</span>
                    </div>
                    <span className="text-3xl font-black text-cyan-400">+{result.etaImpact}h</span>
                  </div>
                  <div className="h-2 bg-slate-800 w-full relative overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 transition-all duration-1000" 
                      style={{ width: `${(result.etaImpact / 24) * 100}%`, maxWidth: '100%' }}
                    />
                  </div>
                  <p className="mono text-[10px] text-slate-500">MAX PREDICTED DELAY CAP: 24.0 HOURS</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Route Segment Threats */}
                <div className="industrial-panel p-6">
                  <h3 className="text-xl text-cyan-400 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    SEGMENT THREATS
                  </h3>
                  <div className="space-y-3">
                    {result.threats.map((t, i) => (
                      <div key={i} className="flex justify-between items-center p-3 border border-cyan-500/10 bg-cyan-500/5">
                        <div>
                          <p className="mono text-xs text-cyan-500 uppercase tracking-tighter">{t.segment}</p>
                          <p className="text-slate-100 font-bold">{t.threat}</p>
                        </div>
                        <span className={`px-2 py-1 mono text-[10px] font-bold uppercase border ${
                          t.severity === 'high' ? 'border-red-500 text-red-500' : 
                          t.severity === 'medium' ? 'border-amber-500 text-amber-500' : 
                          'border-green-500 text-green-500'
                        }`}>
                          {t.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mitigation Actions */}
                <div className="industrial-panel p-6">
                  <h3 className="text-xl text-cyan-400 mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" />
                    MITIGATION STRATEGY
                  </h3>
                  <div className="space-y-4">
                    {result.mitigations.map((m, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-cyan-500/20 text-cyan-500 mono text-xs">
                          0{i + 1}
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed group-hover:text-cyan-300 transition-colors">
                          {m}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Decorative Footer HUD */}
      <footer className="w-full max-w-7xl mt-12 pt-4 border-t border-cyan-500/20 flex justify-between items-center mono text-[10px] text-slate-600">
        <div className="flex gap-4">
          <span className="text-cyan-500/50">SECURE TERMINAL B-4</span>
          <span>//</span>
          <span>AES-256 ENCRYPTED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          SYSTEMS NOMINAL
        </div>
      </footer>
    </main>
  );
}
