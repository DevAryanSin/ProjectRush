"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Globe, 
  Database, 
  Search, 
  Terminal as TerminalIcon, 
  Activity, 
  AlertTriangle, 
  CheckCircle2,
  Lock,
  Layers,
  Zap,
  BarChart3
} from "lucide-react";

type Mode = "asset" | "platform";

export default function ThreatScope() {
  const [mode, setMode] = useState<Mode>("asset");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Form states
  const [assetInputs, setAssetInputs] = useState({
    types: "",
    platforms: "",
    access: "",
    value: ""
  });

  const [platformInputs, setPlatformInputs] = useState({
    name: "",
    contentType: "",
    reach: ""
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    const prompt = mode === "asset" 
      ? `ASSET VULNERABILITY ANALYSIS:
         Asset Types: ${assetInputs.types}
         Distribution Platforms: ${assetInputs.platforms}
         Access Levels: ${assetInputs.access}
         Commercial Value: ${assetInputs.value}`
      : `PLATFORM INTELLIGENCE AUDIT:
         Platform Name: ${platformInputs.name}
         Content Type: ${platformInputs.contentType}
         Account Size/Reach: ${platformInputs.reach}`;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setResult(data.text);
    } catch (error) {
      console.error("Analysis failed:", error);
      setResult("ERROR: SYSTEM_FAILURE. Connection to risk intelligence node lost.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Aurora Background */}
      <div className="aurora-bg">
        <div className="aurora-orb orb-1"></div>
        <div className="aurora-orb orb-2"></div>
        <div className="aurora-orb orb-3"></div>
        <div className="scanline"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10 max-w-5xl">
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-terminal/10 border border-terminal/30 mb-4">
            <TerminalIcon className="w-4 h-4 text-terminal" />
            <span className="font-mono text-xs text-terminal tracking-[0.2em] uppercase">System Live: v3.0.4</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-terminal/80 to-white/50">
            ThreatScope
          </h1>
          <p className="text-lg md:text-xl text-white/60 font-mono">
            Analyze your assets. Audit your platforms. Understand your exposure.
          </p>
        </header>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md">
            <button
              onClick={() => { setMode("asset"); setResult(null); }}
              className={`px-8 py-3 rounded-lg font-mono text-sm uppercase tracking-widest transition-all ${
                mode === "asset" 
                  ? "bg-terminal text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]" 
                  : "text-white/40 hover:text-white"
              }`}
            >
              [ ASSET RISK ]
            </button>
            <button
              onClick={() => { setMode("platform"); setResult(null); }}
              className={`px-8 py-3 rounded-lg font-mono text-sm uppercase tracking-widest transition-all ${
                mode === "platform" 
                  ? "bg-terminal text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]" 
                  : "text-white/40 hover:text-white"
              }`}
            >
              [ PLATFORM RISK ]
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <section className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                {mode === "asset" ? <Database className="w-16 h-16" /> : <Globe className="w-16 h-16" />}
              </div>
              
              <div className="terminal-header">
                {mode === "asset" ? "Asset Vulnerability Input" : "Platform Intelligence Input"}
              </div>

              <div className="space-y-6">
                {mode === "asset" ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-white/40 uppercase ml-1">Asset Types</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Master recordings, Unreleased footage"
                        className="input-glass"
                        value={assetInputs.types}
                        onChange={(e) => setAssetInputs({...assetInputs, types: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-white/40 uppercase ml-1">Distribution Platforms</label>
                      <input 
                        type="text" 
                        placeholder="e.g. YouTube, Spotify, TikTok"
                        className="input-glass"
                        value={assetInputs.platforms}
                        onChange={(e) => setAssetInputs({...assetInputs, platforms: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-white/40 uppercase ml-1">Access Levels</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Internal only"
                          className="input-glass"
                          value={assetInputs.access}
                          onChange={(e) => setAssetInputs({...assetInputs, access: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-white/40 uppercase ml-1">Comm. Value</label>
                        <input 
                          type="text" 
                          placeholder="e.g. High ($1M+)"
                          className="input-glass"
                          value={assetInputs.value}
                          onChange={(e) => setAssetInputs({...assetInputs, value: e.target.value})}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-white/40 uppercase ml-1">Platform Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Instagram, Telegram"
                        className="input-glass"
                        value={platformInputs.name}
                        onChange={(e) => setPlatformInputs({...platformInputs, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-white/40 uppercase ml-1">Content Type</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Short-form video, Art"
                        className="input-glass"
                        value={platformInputs.contentType}
                        onChange={(e) => setPlatformInputs({...platformInputs, contentType: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-white/40 uppercase ml-1">Account Reach</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 500k Followers"
                        className="input-glass"
                        value={platformInputs.reach}
                        onChange={(e) => setPlatformInputs({...platformInputs, reach: e.target.value})}
                      />
                    </div>
                  </>
                )}

                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="btn-terminal w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Activity className="w-4 h-4 animate-spin" />
                      SYSTEM_ANALYZING...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 group-hover:fill-current" />
                      [ RUN ANALYSIS ]
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-4 flex flex-col items-center justify-center text-center space-y-1">
                <BarChart3 className="w-5 h-5 text-terminal/60" />
                <span className="text-[10px] uppercase font-mono text-white/40">Active Nodes</span>
                <span className="font-mono text-xl text-terminal">12,842</span>
              </div>
              <div className="glass-panel p-4 flex flex-col items-center justify-center text-center space-y-1">
                <Lock className="w-5 h-5 text-terminal/60" />
                <span className="text-[10px] uppercase font-mono text-white/40">Encryption</span>
                <span className="font-mono text-xl text-terminal">AES-512</span>
              </div>
            </div>
          </section>

          {/* Output Panel */}
          <section className="lg:col-span-7">
            <div className="glass-panel min-h-[500px] flex flex-col relative overflow-hidden bg-black/60 border-terminal/20">
              <div className="p-8 flex-1">
                <div className="terminal-header flex justify-between items-center w-full">
                  <span>Intelligence Output</span>
                  {result && <span className="text-[10px] bg-terminal/20 px-2 py-0.5 rounded text-terminal border border-terminal/40">RESULT_READY</span>}
                </div>

                {!result && !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                    <div className="p-6 rounded-full bg-white/5 border border-white/10 animate-pulse">
                      <Search className="w-12 h-12 text-white/20" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-white/40 font-mono uppercase tracking-widest text-sm">System Idle</p>
                      <p className="text-white/20 text-xs font-mono italic max-w-xs">
                        Awaiting input parameters for risk assessment and platform intelligence gathering.
                      </p>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="h-full flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="w-24 h-24 border-2 border-terminal/20 rounded-full"></div>
                      <div className="w-24 h-24 border-t-2 border-terminal rounded-full absolute top-0 left-0 animate-spin"></div>
                      <Activity className="w-8 h-8 text-terminal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <p className="mt-8 font-mono text-terminal animate-pulse">PROCESSING_THREAT_VECTORS...</p>
                    <div className="mt-4 w-48 bg-white/5 h-1 rounded-full overflow-hidden">
                      <div className="bg-terminal h-full w-1/3 animate-[loading_2s_infinite_ease-in-out]"></div>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="terminal-text whitespace-pre-wrap animate-in fade-in duration-700">
                    {/* Render logic to make it look like a terminal */}
                    {result.split('\n').map((line, i) => {
                      if (line.includes('SCORE:')) {
                        const score = parseInt(line.match(/SCORE: (\d+)/)?.[1] || "0");
                        const scoreClass = score > 7 ? "risk-high" : score > 4 ? "risk-medium" : "risk-low";
                        return (
                          <div key={i} className="flex items-center gap-4 my-4 p-4 rounded bg-white/5 border border-white/10">
                            <div className={`risk-score ${scoreClass}`}>{score}</div>
                            <div className="flex-1">{line.replace(/SCORE: \d+/, '').replace(/^[-*]\s+/, '')}</div>
                          </div>
                        );
                      }
                      if (line.match(/^[A-Z\s]+:$/) || line.match(/^#{1,3}\s/)) {
                        return <h3 key={i} className="text-white font-bold mt-8 mb-2 border-b border-white/10 pb-1">{line.replace(/^#+\s/, '')}</h3>;
                      }
                      return <p key={i} className="mb-2 opacity-90">{line}</p>;
                    })}
                  </div>
                )}
              </div>

              {/* Decorative Terminal Footer */}
              <div className="p-4 bg-terminal/5 border-t border-terminal/10 flex items-center justify-between font-mono text-[10px] text-white/30">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-terminal" /> AUTH_STATUS: OK</span>
                  <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-terminal" /> BUFFER_HEALTH: 100%</span>
                </div>
                <div className="flex gap-4">
                  <span>LATENCY: 42ms</span>
                  <span className="text-terminal">SYS_STABLE</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Floating Background Text */}
        <div className="fixed bottom-10 left-10 opacity-5 pointer-events-none select-none hidden xl:block">
          <p className="font-mono text-9xl font-black">THREAT</p>
          <p className="font-mono text-9xl font-black -mt-10">SCOPE</p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </main>
  );
}
