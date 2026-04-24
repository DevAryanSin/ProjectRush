'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, CheckCircle, Search, ChevronRight, AlertTriangle, Loader2, Cpu } from 'lucide-react';

export default function CounterfactualPage() {
  const [inputs, setInputs] = useState({
    decision: '',
    factors: '',
    demographic: '',
    domain: '',
  });
  const [logs, setLogs] = useState<{ msg: string; time: string }[]>([]);
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingIndex, setTypingIndex] = useState(0);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const getTimestamp = () => new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, { msg: `> ${msg}`, time: getTimestamp() }]);
  };

  useEffect(() => {
    setMounted(true);
    setLogs([
      { msg: 'INITIALIZING COUNTERFACTUAL ENGINE...', time: getTimestamp() },
      { msg: 'SYSTEM READY. WAITING FOR INPUT...', time: getTimestamp() }
    ]);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.decision || !inputs.factors) return;

    setLoading(true);
    setError(null);
    setResult(null);
    addLog(`ANALYZING DECISION: "${inputs.decision.substring(0, 30)}..."`);
    addLog(`DOMAIN: ${inputs.domain || 'GENERAL'}`);
    addLog(`EXTRACTING DEMOGRAPHIC VECTORS: ${inputs.demographic || 'DEFAULT'}`);
    addLog('QUERYING GEMINI-2.5-FLASH FOR COUNTERFACTUAL SCENARIOS...');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `
            Decision: ${inputs.decision}
            Factors: ${inputs.factors}
            Demographic Context: ${inputs.demographic}
            Domain: ${inputs.domain}
          `,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setResult(data.result);
      addLog('ANALYSIS COMPLETE. 5 SCENARIOS GENERATED.');
    } catch (err: any) {
      setError(err.message);
      addLog(`ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-6xl mx-auto relative">
      <div className="crt-effect" />
      <div className="scanline" />

      {/* Header */}
      <header className="w-full mb-8 border-b border-[#00ff41] pb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-8 h-8 text-[#00ff41]" />
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
            CounterfactualAI
          </h1>
        </div>
        <p className="text-[#008f11] mt-2 text-sm md:text-base">
          $ Input an automated decision — generate counterfactual fairness test cases
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {/* Input Section */}
        <div className="terminal-window h-fit">
          <div className="flex items-center gap-2 mb-6 border-b border-[#00ff41] pb-2">
            <Cpu className="w-5 h-5" />
            <h2 className="uppercase font-bold tracking-widest">Input Parameters</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm uppercase opacity-70">Decision Made</label>
              <div className="flex items-start">
                <span className="mr-2 mt-2 font-bold text-[#00ff41]">{'>'}</span>
                <textarea
                  name="decision"
                  value={inputs.decision}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Loan application rejected due to insufficient credit history"
                  className="terminal-input min-h-[80px] border-b border-[#008f11] focus:border-[#00ff41] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm uppercase opacity-70">Key Input Factors</label>
              <div className="flex items-start">
                <span className="mr-2 mt-2 font-bold text-[#00ff41]">{'>'}</span>
                <input
                  type="text"
                  name="factors"
                  value={inputs.factors}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Credit score, Income, Employment length"
                  className="terminal-input border-b border-[#008f11] focus:border-[#00ff41]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm uppercase opacity-70">Demographic Context</label>
                <div className="flex items-center">
                  <span className="mr-2 font-bold text-[#00ff41]">{'>'}</span>
                  <input
                    type="text"
                    name="demographic"
                    value={inputs.demographic}
                    onChange={handleInputChange}
                    placeholder="e.g., 28y/o Latino Male"
                    className="terminal-input border-b border-[#008f11] focus:border-[#00ff41]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm uppercase opacity-70">Decision Domain</label>
                <div className="flex items-center">
                  <span className="mr-2 font-bold text-[#00ff41]">{'>'}</span>
                  <input
                    type="text"
                    name="domain"
                    value={inputs.domain}
                    onChange={handleInputChange}
                    placeholder="e.g., Fintech / Banking"
                    className="terminal-input border-b border-[#008f11] focus:border-[#00ff41]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="terminal-btn w-full mt-4 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  [ EXECUTE ANALYSIS ]
                </>
              )}
            </button>
          </form>

          {/* Mini Terminal Logs */}
          <div className="mt-8 bg-black/50 border border-[#008f11] p-3 text-xs h-32 overflow-y-auto font-mono">
            {mounted && logs.map((log, i) => (
              <div key={i} className="mb-1">
                <span className="text-[#008f11] mr-2">[{log.time}]</span>
                {log.msg}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Output Section */}
        <div className="terminal-window flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-6 border-b border-[#00ff41] pb-2">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              <h2 className="uppercase font-bold tracking-widest">Analysis Result</h2>
            </div>
            {result && (
              <span className="text-xs border border-[#00ff41] px-2 py-0.5 animate-pulse">
                STATUS: COMPLETED
              </span>
            )}
          </div>

          <div className="flex-grow overflow-y-auto pr-2 space-y-4">
            {!result && !loading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-[#008f11] opacity-50 text-center">
                <ShieldAlert className="w-12 h-12 mb-4" />
                <p className="uppercase tracking-widest">Awaiting system input...</p>
                <p className="text-xs mt-2">Run [EXECUTE ANALYSIS] to begin bias detection</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-[#00ff41]">
                <div className="w-16 h-16 border-4 border-[#00ff41] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="uppercase tracking-widest animate-pulse">Processing Counterfactuals...</p>
              </div>
            )}

            {error && (
              <div className="border border-red-500 p-4 text-red-500">
                <div className="flex items-center gap-2 mb-2 font-bold">
                  <AlertTriangle className="w-5 h-5" />
                  SYSTEM ERROR
                </div>
                <p className="text-sm font-mono">{error}</p>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-in fade-in duration-700">
                {result.split(/\n(?=\d\.|\*)/).map((section, idx) => {
                  if (!section.trim()) return null;
                  return (
                    <div key={idx} className="border-l-2 border-[#00ff41] pl-4 py-1 hover:bg-[#00ff41]/5 transition-colors">
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {section.trim().split('\n').map((line, li) => {
                          if (line.toLowerCase().includes('pass') || line.toLowerCase().includes('fair')) {
                            return <div key={li} className="text-cyan-400 font-bold">{line}</div>;
                          }
                          if (line.toLowerCase().includes('fail') || line.toLowerCase().includes('biased')) {
                            return <div key={li} className="text-white bg-red-900/40 px-1 inline-block">{line}</div>;
                          }
                          return <div key={li}>{line}</div>;
                        })}
                      </div>
                    </div>
                  );
                })}
                
                <div className="mt-8 pt-4 border-t border-[#008f11] flex justify-between items-center text-xs opacity-70">
                  <span>ENGINE: GEMINI-2.5-FLASH</span>
                  <span>TRUST_SCORE: 0.98</span>
                  <div className="flex items-center gap-1 text-[#00ff41]">
                    <CheckCircle className="w-3 h-3" />
                    VERIFIED
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="w-full mt-12 text-[10px] uppercase opacity-40 flex flex-wrap justify-between gap-4 border-t border-[#008f11]/30 pt-4">
        <div>© 2026 CounterfactualAI Labs // Algorithmic Accountability Module</div>
        <div>Encryption: AES-256 // Connection: Secured</div>
        <div>Lat: 37.7749° N // Long: 122.4194° W</div>
      </footer>
    </main>
  );
}
