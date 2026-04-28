'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  UserSearch, 
  Zap, 
  RefreshCcw, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface Finding {
  phrase: string;
  type: string;
  groups: string[];
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
}

interface AnalysisResult {
  findings: Finding[];
  rewritten: string;
}

export default function FairPrompt() {
  const [mode, setMode] = useState<'prompt' | 'hiring'>('prompt');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, mode }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-500 text-white';
      case 'MEDIUM': return 'bg-orange-500 text-white';
      case 'LOW': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#e8ecf1]" />;

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl text-center mb-12 animate-fade-in">
        <div className="inline-block neo-out brutal-border px-6 py-2 mb-6 rounded-full bg-white">
          <span className="font-heading font-bold text-sm tracking-widest text-purple-600 uppercase">
            AI Ethics & Equality
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-4 tracking-tight">
          Fair<span className="text-purple-600">Prompt</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
          Audit prompts and job descriptions for bias — fix them before they cause harm.
        </p>
      </header>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <section className="flex flex-col gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="fusion-card bg-white">
            <div className="flex gap-2 mb-6 p-1 neo-in rounded-xl brutal-border">
              <button 
                onClick={() => setMode('prompt')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-heading font-bold transition-all ${
                  mode === 'prompt' ? 'bg-purple-600 text-white brutal-shadow-sm' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Zap size={18} />
                PROMPT AUDIT
              </button>
              <button 
                onClick={() => setMode('hiring')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-heading font-bold transition-all ${
                  mode === 'hiring' ? 'bg-purple-600 text-white brutal-shadow-sm' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <UserSearch size={18} />
                HIRING AUDIT
              </button>
            </div>

            <div className="space-y-4">
              <label className="block font-heading font-bold text-sm text-gray-700 uppercase tracking-wider">
                {mode === 'prompt' ? 'Paste AI Prompt' : 'Paste Job Description'}
              </label>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'prompt' ? 'Enter a system prompt or instruction...' : 'Enter the full text of a job posting...'}
                className="w-full h-64 fusion-input resize-none font-medium leading-relaxed"
              />
              
              <button 
                onClick={handleAnalyze}
                disabled={loading || !input.trim()}
                className={`w-full fusion-button-primary flex items-center justify-center gap-3 py-4 text-lg ${
                  loading || !input.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCcw className="animate-spin" />
                    ANALYZING BIAS...
                  </>
                ) : (
                  <>
                    <ShieldAlert size={24} />
                    START AUDIT
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="neo-out border-3 border-red-500 bg-red-50 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
              <AlertTriangle className="text-red-500 shrink-0" />
              <p className="text-red-700 font-bold">{error}</p>
            </div>
          )}
        </section>

        {/* Results Section */}
        <section className="flex flex-col gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {result ? (
            <>
              {/* Findings */}
              <div className="fusion-card bg-white">
                <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                  <div className="p-2 neo-out rounded-lg bg-red-100 brutal-border border-red-500">
                    <ShieldAlert className="text-red-600" size={20} />
                  </div>
                  BIAS FINDINGS
                </h3>
                
                {result.findings && result.findings.length > 0 ? (
                  <div className="space-y-6">
                    {result.findings.map((finding, index) => (
                      <div key={index} className="neo-in p-4 rounded-xl brutal-border relative overflow-hidden">
                        <div className={`absolute top-0 right-0 px-3 py-1 font-bold text-[10px] tracking-tighter ${getSeverityColor(finding.severity)}`}>
                          {finding.severity} RISK
                        </div>
                        <div className="mb-3">
                          <span className="bias-tag mb-2 inline-block">FLAGGED PHRASE</span>
                          <p className="text-lg font-bold italic leading-tight mt-1">"{finding.phrase}"</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Bias Type</span>
                            <p className="text-sm font-bold text-purple-700">{finding.type}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Impact</span>
                            <p className="text-sm font-bold text-gray-700">{finding.groups.join(', ')}</p>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            <span className="font-bold text-black mr-2">WHY:</span> {finding.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 neo-in rounded-xl">
                    <CheckCircle2 className="mx-auto mb-4 text-green-500" size={48} />
                    <p className="font-heading font-bold text-xl">NO BIAS DETECTED</p>
                    <p className="text-gray-500">The analyzed text appears inclusive and balanced.</p>
                  </div>
                )}
              </div>

              {/* Rewritten Version */}
              <div className="fusion-card bg-black text-white brutal-shadow-primary">
                <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                  <div className="p-2 neo-out rounded-lg bg-purple-600 brutal-border border-white">
                    <CheckCircle2 className="text-white" size={20} />
                  </div>
                  REWRITTEN VERSION
                </h3>
                <div className="bg-white/10 p-6 rounded-xl border border-white/20 font-medium leading-relaxed text-purple-50 italic">
                  {result.rewritten}
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(result.rewritten);
                    // Add some feedback logic here if wanted
                  }}
                  className="mt-6 flex items-center gap-2 text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ArrowRight size={16} /> COPY REWRITTEN VERSION
                </button>
              </div>
            </>
          ) : (
            <div className="fusion-card h-full flex flex-col items-center justify-center text-center py-20 bg-white/50 border-dashed opacity-70">
              <div className="w-20 h-20 neo-out rounded-full brutal-border flex items-center justify-center mb-6 bg-white">
                <Info size={40} className="text-gray-300" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-gray-400">WAITING FOR INPUT</h3>
              <p className="text-gray-400 max-w-xs mt-2 font-medium">
                Results will appear here after you start the audit analysis.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Footer Decoration */}
      <footer className="mt-20 mb-8 flex items-center gap-4 text-gray-400 font-bold text-xs tracking-[0.2em] uppercase">
        <div className="h-[1px] w-12 bg-gray-300" />
        FairPrompt MVP 2026
        <div className="h-[1px] w-12 bg-gray-300" />
      </footer>

      <style jsx global>{`
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
