'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Layers, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Database, 
  UserCheck, 
  Workflow,
  ChevronRight,
  Loader2,
  RefreshCcw,
  Zap
} from 'lucide-react';

type Mode = 'DOCUMENTATION' | 'TESTING';

export default function FairScope() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>('DOCUMENTATION');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states for Documentation
  const [docInputs, setDocInputs] = useState({
    purpose: '',
    trainingData: '',
    users: '',
    limitations: '',
    context: ''
  });

  // Form states for Testing
  const [testInputs, setTestInputs] = useState({
    decision: '',
    variables: '',
    demographics: '',
    domain: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDocChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setDocInputs({ ...docInputs, [e.target.name]: e.target.value });
  };

  const handleTestChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setTestInputs({ ...testInputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const prompt = mode === 'DOCUMENTATION' 
      ? `Model Purpose: ${docInputs.purpose}\nTraining Data: ${docInputs.trainingData}\nIntended Users: ${docInputs.users}\nLimitations: ${docInputs.limitations}\nDeployment Context: ${docInputs.context}`
      : `Decision Made: ${testInputs.decision}\nInput Variables: ${testInputs.variables}\nDemographic Context: ${testInputs.demographics}\nDecision Domain: ${testInputs.domain}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate');
      setResult(data.text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen relative p-4 md:p-8">
      {/* Aurora Orbs */}
      <div className="aurora-container">
        <div className="aurora-orb orb-1" />
        <div className="aurora-orb orb-2" />
        <div className="aurora-orb orb-3" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-12 text-center fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4">
            <ShieldCheck size={16} />
            <span className="text-xs font-bold tracking-widest uppercase">FairScope AI Governance</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
            FairScope
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto terminal-font">
            [ <span className="text-cyan-400">STATUS:</span> OPERATIONAL ] Document AI systems and stress-test them for fairness before deployment.
          </p>
        </header>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex p-1 bg-black/40 border border-white/10 rounded-xl backdrop-blur-xl">
            <button
              onClick={() => setMode('DOCUMENTATION')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                mode === 'DOCUMENTATION' 
                ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]' 
                : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileText size={18} />
              <span className="font-semibold uppercase tracking-wider text-sm">Model Card</span>
            </button>
            <button
              onClick={() => setMode('TESTING')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                mode === 'TESTING' 
                ? 'bg-cyan-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.4)]' 
                : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Terminal size={18} />
              <span className="font-semibold uppercase tracking-wider text-sm">Testing</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Input Section */}
          <section className="glass-card rounded-2xl p-6 md:p-8 fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              {mode === 'DOCUMENTATION' ? <Layers className="text-violet-400" /> : <Zap className="text-cyan-400" />}
              {mode === 'DOCUMENTATION' ? 'SYSTEM SPECIFICATIONS' : 'STRESS TEST PARAMETERS'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'DOCUMENTATION' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                      <Cpu size={14} /> Model Purpose
                    </label>
                    <textarea
                      name="purpose"
                      value={docInputs.purpose}
                      onChange={handleDocChange}
                      placeholder="What is this model designed to do?"
                      className="w-full h-24 glass-input rounded-xl resize-none terminal-font text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                      <Database size={14} /> Training Data Description
                    </label>
                    <textarea
                      name="trainingData"
                      value={docInputs.trainingData}
                      onChange={handleDocChange}
                      placeholder="What datasets were used? Any sensitive attributes included?"
                      className="w-full h-24 glass-input rounded-xl resize-none terminal-font text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                        <UserCheck size={14} /> Intended Users
                      </label>
                      <input
                        name="users"
                        value={docInputs.users}
                        onChange={handleDocChange}
                        placeholder="e.g. Data Scientists"
                        className="w-full glass-input rounded-xl terminal-font text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                        <Workflow size={14} /> Deployment Context
                      </label>
                      <input
                        name="context"
                        value={docInputs.context}
                        onChange={handleDocChange}
                        placeholder="e.g. Cloud API"
                        className="w-full glass-input rounded-xl terminal-font text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                      <AlertTriangle size={14} /> Known Limitations
                    </label>
                    <textarea
                      name="limitations"
                      value={docInputs.limitations}
                      onChange={handleDocChange}
                      placeholder="Are there known edge cases or failure modes?"
                      className="w-full h-20 glass-input rounded-xl resize-none terminal-font text-sm"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                      <ShieldCheck size={14} /> Decision Made
                    </label>
                    <textarea
                      name="decision"
                      value={testInputs.decision}
                      onChange={handleTestChange}
                      placeholder="e.g. Loan approved for $50k"
                      className="w-full h-24 glass-input rounded-xl resize-none terminal-font text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                      <Database size={14} /> Input Variables
                    </label>
                    <textarea
                      name="variables"
                      value={testInputs.variables}
                      onChange={handleTestChange}
                      placeholder="e.g. Credit score, income, employment history"
                      className="w-full h-24 glass-input rounded-xl resize-none terminal-font text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                      <UserCheck size={14} /> Demographic Context
                    </label>
                    <input
                      name="demographics"
                      value={testInputs.demographics}
                      onChange={handleTestChange}
                      placeholder="e.g. 35yo Male, minority background"
                      className="w-full glass-input rounded-xl terminal-font text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                      <Workflow size={14} /> Decision Domain
                    </label>
                    <input
                      name="domain"
                      value={testInputs.domain}
                      onChange={handleTestChange}
                      placeholder="e.g. Fintech / Credit Lending"
                      className="w-full glass-input rounded-xl terminal-font text-sm"
                      required
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-hybrid rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    RUNNING ANALYSIS...
                  </>
                ) : (
                  <>
                    <ChevronRight size={20} />
                    [ RUN ANALYSIS ]
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Output Section */}
          <section className="glass-card rounded-2xl overflow-hidden min-h-[600px] flex flex-col fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <span className="text-xs font-mono text-zinc-500 ml-4">TERMINAL_OUTPUT.log</span>
              </div>
              {result && (
                <button 
                  onClick={() => setResult(null)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <RefreshCcw size={14} />
                </button>
              )}
            </div>

            <div className="flex-1 p-6 terminal-font relative overflow-auto">
              <div className="scanline" />
              
              {!loading && !result && !error && (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-center space-y-4">
                  <Terminal size={48} className="opacity-20" />
                  <p className="text-sm">SYSTEM IDLE. AWAITING INPUT PARAMETERS...</p>
                  <p className="text-[10px] tracking-widest opacity-50">INITIALIZE ANALYSIS TO GENERATE FAIRNESS REPORT</p>
                </div>
              )}

              {loading && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-xs uppercase tracking-widest font-bold">Initializing Auditor...</span>
                  </div>
                  <div className="space-y-2 opacity-50 text-[10px] uppercase">
                    <p>{'>'} Loading ethical frameworks...</p>
                    <p>{'>'} Accessing bias detection modules...</p>
                    <p>{'>'} Performing counterfactual permutation...</p>
                    <p>{'>'} Scanning model architecture for drift...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="terminal-panel border-red-500/50 bg-red-500/5">
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <AlertTriangle size={16} />
                    <span className="text-sm font-bold uppercase tracking-wider">System Error</span>
                  </div>
                  <p className="text-xs text-red-300/80">{error}</p>
                </div>
              )}

              {result && (
                <div className="space-y-6 fade-in">
                  <div className="flex items-center gap-2 text-green-400 mb-4">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-bold uppercase tracking-wider">Analysis Complete</span>
                  </div>
                  
                  <div className="terminal-text text-sm leading-relaxed whitespace-pre-wrap">
                    {result}
                  </div>

                  <div className="pt-8 border-t border-white/5">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] text-center">
                      *** END OF REPORT — GENERATED BY FAIRSCOPE v1.0.0 ***
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer info */}
        <footer className="mt-12 text-center text-zinc-500 text-[10px] uppercase tracking-[0.3em] fade-in" style={{ animationDelay: '0.4s' }}>
          AI GOVERNANCE | ETHICAL AUDITING | COUNTERFACTUAL TESTING
        </footer>
      </div>
    </main>
  );
}
