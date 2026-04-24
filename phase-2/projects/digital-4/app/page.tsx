'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, AlertTriangle, Search, Cpu, Globe, Lock, ShieldAlert, Zap, Box, User, ChevronRight, Loader2 } from 'lucide-react';

export default function PlatformSpy() {
  const [mounted, setMounted] = useState(false);
  const [platform, setPlatform] = useState('');
  const [contentType, setContentType] = useState('');
  const [reach, setReach] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    addTerminalLine('SYSTEM BOOTING...');
    addTerminalLine('PLATFORMSPY v4.0.1 INITIALIZED');
    addTerminalLine('WAITING FOR INPUT...');
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLines, result, loading]);

  const addTerminalLine = (line: string) => {
    setTerminalLines(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${line}`]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform || !contentType || !reach) return;

    setLoading(true);
    setError(null);
    setResult(null);
    addTerminalLine(`ANALYZING PLATFORM: ${platform.toUpperCase()}...`);
    addTerminalLine(`CONTENT PARAMETER: ${contentType.toUpperCase()}`);
    addTerminalLine(`REACH PARAMETER: ${reach.toUpperCase()}`);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Platform: ${platform}, Content Type: ${contentType}, Account Size/Reach: ${reach}`
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
        addTerminalLine('ANALYSIS COMPLETE. DECRYPTING DATA...');
      } else {
        setError(data.error || 'ANALYSIS FAILED. UNKNOWN ERROR.');
        addTerminalLine('CRITICAL ERROR: DATA RETRIEVAL INTERRUPTED.');
      }
    } catch (err) {
      setError('CONNECTION TIMEOUT. VERIFY NETWORK STATUS.');
      addTerminalLine('CRITICAL ERROR: CONNECTION LOST.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto font-mono text-[#00ff41]">
      {/* Background CRT Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden crt"></div>

      {/* Header */}
      <header className="mb-8 border-b border-[#00ff41] pb-4">
        <div className="flex items-center gap-3">
          <Terminal size={32} className="text-[#39ff14]" />
          <h1 className="text-4xl font-bold tracking-tighter uppercase">PlatformSpy</h1>
        </div>
        <p className="mt-2 text-[#008f11]">
          $ ./analyze --target all-platforms --mode security-audit
        </p>
        <p className="text-xl mt-4 opacity-90">
          Input any platform name — get its content theft risk profile
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Terminal Log */}
        <div className="lg:col-span-5 space-y-8">
          <div className="terminal-window overflow-hidden flex flex-col border border-[#00ff41]">
            <div className="terminal-header bg-[#008f11] text-[#0a0f0a] px-4 py-1 flex justify-between items-center text-xs font-bold">
              <span>SCANNER_INPUT.EXE</span>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-[#0a0f0a]"></div>
                <div className="w-2 h-2 rounded-full bg-[#0a0f0a]"></div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-[#008f11]">Target Platform</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008f11]">$</span>
                    <input 
                      type="text" 
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      placeholder="e.g. TikTok, Twitter, Instagram"
                      className="w-full bg-black/40 border border-[#008f11] focus:border-[#00ff41] p-2 pl-8 outline-none transition-all placeholder:text-[#008f11]/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-[#008f11]">Content Type</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008f11]">$</span>
                    <input 
                      type="text" 
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      placeholder="e.g. Live Stream, Highlight Reels"
                      className="w-full bg-black/40 border border-[#008f11] focus:border-[#00ff41] p-2 pl-8 outline-none transition-all placeholder:text-[#008f11]/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-[#008f11]">Reach / Size</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008f11]">$</span>
                    <input 
                      type="text" 
                      value={reach}
                      onChange={(e) => setReach(e.target.value)}
                      placeholder="e.g. 500k Followers, 10M Views/mo"
                      className="w-full bg-black/40 border border-[#008f11] focus:border-[#00ff41] p-2 pl-8 outline-none transition-all placeholder:text-[#008f11]/50"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#00ff41] text-black font-bold py-3 hover:bg-[#39ff14] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="group-hover:scale-125 transition-transform" />}
                  {loading ? 'EXECUTING ANALYSIS...' : '[ > RUN_SECURITY_AUDIT ]'}
                </button>
              </form>
            </div>
          </div>

          <div className="terminal-window border border-[#008f11] bg-black/60 p-4 h-48 overflow-y-auto text-[10px] leading-tight flex flex-col gap-1" ref={scrollRef}>
            {terminalLines.map((line, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-[#008f11] shrink-0">{line.slice(0, 10)}</span>
                <span className="break-all">{line.slice(11)}</span>
              </div>
            ))}
            {loading && <div className="animate-pulse">_</div>}
          </div>
        </div>

        {/* Right Column: Results Section */}
        <div className="lg:col-span-7">
          <div className="terminal-window border border-[#00ff41] h-full min-h-[500px] flex flex-col">
            <div className="terminal-header bg-[#00ff41] text-[#0a0f0a] px-4 py-2 flex justify-between items-center text-sm font-bold">
              <div className="flex items-center gap-2">
                <Shield size={18} />
                <span>RISK_ASSESSMENT_REPORT.TXT</span>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-[10px] uppercase opacity-70">Security Status: {loading ? 'Scanning' : 'Standby'}</span>
                <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-500 animate-ping' : 'bg-[#00ff41]'}`}></div>
              </div>
            </div>

            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              {!result && !loading && !error && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                  <Cpu size={80} strokeWidth={1} />
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold uppercase tracking-widest">Awaiting Command</h3>
                    <p>SYSTEM IDLE. PLEASE PROVIDE PLATFORM PARAMETERS TO BEGIN TRACE.</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="space-y-6 animate-pulse">
                  <div className="h-8 bg-[#00ff41]/20 w-3/4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-[#00ff41]/10 w-full"></div>
                    <div className="h-4 bg-[#00ff41]/10 w-full"></div>
                    <div className="h-4 bg-[#00ff41]/10 w-2/3"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-8">
                    <div className="h-20 border border-[#00ff41]/30"></div>
                    <div className="h-20 border border-[#00ff41]/30"></div>
                    <div className="h-20 border border-[#00ff41]/30"></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="border border-[#ff3e3e] bg-[#ff3e3e]/10 p-6 flex items-start gap-4 text-[#ff3e3e]">
                  <ShieldAlert size={40} className="shrink-0" />
                  <div>
                    <h3 className="font-bold text-xl uppercase mb-2">Operation Halted</h3>
                    <p>{error}</p>
                    <button 
                      onClick={() => setError(null)}
                      className="mt-4 border border-[#ff3e3e] px-4 py-1 hover:bg-[#ff3e3e] hover:text-black transition-all uppercase text-xs"
                    >
                      Reset Core
                    </button>
                  </div>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="flex items-center gap-4 mb-6 border-b border-[#00ff41]/30 pb-4">
                    <div className="p-3 border border-[#00ff41]">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold uppercase tracking-tighter">{platform}</h2>
                      <p className="text-[#008f11] text-xs uppercase tracking-widest">Audit ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none prose-p:text-[#00ff41] prose-headings:text-[#00ff41] prose-strong:text-[#39ff14]">
                    {result.split('\n').map((line, i) => {
                      if (line.startsWith('###') || line.startsWith('**')) {
                        return <div key={i} className="mt-6 mb-2 text-xl font-bold border-l-4 border-[#00ff41] pl-4">{line.replace(/[#*]/g, '').trim()}</div>;
                      }
                      if (line.trim().match(/^[0-9]\./)) {
                        return <div key={i} className="ml-4 my-2 flex gap-3 text-sm">
                          <span className="text-[#39ff14] shrink-0 font-bold">{line.trim().split('.')[0]}.</span>
                          <span>{line.trim().split('.').slice(1).join('.').trim()}</span>
                        </div>;
                      }
                      if (line.trim().startsWith('-')) {
                        return <div key={i} className="ml-6 my-1 flex gap-3 text-sm opacity-90">
                          <span className="text-[#39ff14] shrink-0">▸</span>
                          <span>{line.trim().substring(1).trim()}</span>
                        </div>;
                      }
                      return line.trim() ? <p key={i} className="my-2 text-sm leading-relaxed">{line}</p> : <br key={i} />;
                    })}
                  </div>

                  <div className="pt-8 border-t border-[#00ff41]/30">
                    <div className="flex justify-between items-center text-[10px] text-[#008f11] uppercase tracking-[0.2em]">
                      <span>Report generated by Gemini 2.5 Flash</span>
                      <span>Checksum: Verified</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="mt-12 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] uppercase tracking-widest text-[#008f11]">
        <div className="border border-[#008f11]/30 p-3 flex items-center gap-3">
          <Shield size={14} />
          <span>IP Protection Active</span>
        </div>
        <div className="border border-[#008f11]/30 p-3 flex items-center gap-3">
          <Box size={14} />
          <span>Distributed Audit Network</span>
        </div>
        <div className="border border-[#008f11]/30 p-3 flex items-center gap-3">
          <Lock size={14} />
          <span>E2E Encryption Enabled</span>
        </div>
      </footer>
    </main>
  );
}
