"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  BookOpen, 
  Zap, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Quote,
  Target,
  Terminal,
  Activity
} from 'lucide-react';

// Type definitions
interface ExplainerResult {
  title: string;
  summary: string;
  analogy: string;
  example: string;
  impact: string;
  action: string;
}

interface RedTeamScenario {
  attack: string;
  input: string;
  failure: string;
  detection: string;
}

type Mode = 'explainer' | 'redteam';

export default function BiasLab() {
  const [mode, setMode] = useState<Mode>('explainer');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

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
        body: JSON.stringify({ prompt: input, mode }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-4 md:p-12 max-w-5xl mx-auto">
      {/* Header */}
      <header className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter">
          BiasLab
        </h1>
        <p className="text-xl md:text-2xl font-editorial italic opacity-80">
          Understand bias. Then break your system to find it.
        </p>
      </header>

      {/* Mode Switcher */}
      <div className="flex justify-center mb-12">
        <div className="clay-card p-1 flex gap-2 pastel-lavender">
          <button 
            onClick={() => { setMode('explainer'); setResult(null); }}
            className={`clay-button flex items-center gap-2 ${mode === 'explainer' ? 'bg-white' : 'bg-transparent shadow-none'}`}
          >
            <BookOpen size={18} />
            <span>Explain Bias</span>
          </button>
          <button 
            onClick={() => { setMode('redteam'); setResult(null); }}
            className={`clay-button flex items-center gap-2 ${mode === 'redteam' ? 'bg-white' : 'bg-transparent shadow-none'}`}
          >
            <ShieldAlert size={18} />
            <span>Red Team System</span>
          </button>
        </div>
      </div>

      {/* Input Section */}
      <section className="mb-16">
        <form onSubmit={handleSubmit} className="clay-card p-8 md:p-12 pastel-peach">
          <div className="flex flex-col gap-6">
            <label className="font-editorial text-2xl font-bold">
              {mode === 'explainer' 
                ? "Which bias concept should we break down?" 
                : "Tell us about the AI system you want to test."}
            </label>
            
            {mode === 'explainer' ? (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., Proxy Bias, Feedback Loops, Disparate Impact..."
                className="clay-input text-xl"
                disabled={loading}
              />
            ) : (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe: AI purpose, input types, decisions it makes, target users..."
                className="clay-input text-lg min-h-[150px] resize-none"
                disabled={loading}
              />
            )}

            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="clay-button bg-[#1a1a1a] text-white flex items-center justify-center gap-3 hover:bg-black w-fit mx-auto md:mx-0"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Zap size={20} fill="currentColor" />
                  <span>{mode === 'explainer' ? 'Explain Concept' : 'Generate Scenarios'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Error State */}
      {error && (
        <div className="clay-card p-6 pastel-lavender border-2 border-red-200 mb-12 flex items-center gap-4 text-red-700">
          <AlertCircle />
          <p className="font-ui font-bold">{error}</p>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="editorial-rule"></div>
          
          {mode === 'explainer' ? (
            <ExplainerDisplay data={result as ExplainerResult} />
          ) : (
            <RedTeamDisplay scenarios={result as RedTeamScenario[]} />
          )}
        </div>
      )}

      <footer className="mt-24 text-center pb-12 opacity-40 font-ui text-sm">
        &copy; {new Date().getFullYear()} BiasLab — AI Safety & Fairness Research Tool
      </footer>
    </div>
  );
}

function ExplainerDisplay({ data }: { data: ExplainerResult }) {
  return (
    <article className="max-w-3xl mx-auto font-editorial">
      <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">{data.title}</h2>
      <p className="text-2xl md:text-3xl leading-relaxed mb-12 text-black/80 font-medium">
        {data.summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div className="clay-card p-8 pastel-mint relative">
          <Quote className="absolute -top-4 -left-4 opacity-20" size={48} />
          <h3 className="font-ui uppercase tracking-widest text-sm font-black mb-4 opacity-60">The Analogy</h3>
          <p className="text-xl italic leading-relaxed">"{data.analogy}"</p>
        </div>

        <div className="clay-card p-8 bg-white">
          <h3 className="font-ui uppercase tracking-widest text-sm font-black mb-4 opacity-60">Actionable Step</h3>
          <p className="text-xl font-bold mb-4">{data.action}</p>
          <div className="w-12 h-1 bg-[#1a1a1a]"></div>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <h4 className="text-sm font-black font-ui uppercase tracking-[0.2em] mb-4 opacity-50">Business Example</h4>
          <p className="text-xl leading-relaxed text-black/90">{data.example}</p>
        </section>

        <section className="clay-card p-8 bg-red-50/50 border border-red-100">
          <h4 className="text-sm font-black font-ui uppercase tracking-[0.2em] mb-4 text-red-600">Why it matters</h4>
          <p className="text-xl leading-relaxed text-red-900">{data.impact}</p>
        </section>
      </div>
    </article>
  );
}

function RedTeamDisplay({ scenarios }: { scenarios: RedTeamScenario[] }) {
  return (
    <div className="space-y-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-black mb-2">Adversarial Scenarios</h2>
        <p className="font-editorial italic text-xl opacity-60">10 executable tests to expose latent vulnerabilities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {scenarios.map((s, i) => (
          <div key={i} className="clay-card p-8 flex flex-col group hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-ui font-black">
                {i + 1}
              </div>
              <h3 className="font-editorial text-2xl font-bold leading-tight">{s.attack}</h3>
            </div>

            <div className="space-y-6 flex-grow">
              <div>
                <div className="flex items-center gap-2 mb-1 opacity-50">
                  <Terminal size={14} />
                  <span className="text-xs font-black font-ui uppercase tracking-widest">Input to test</span>
                </div>
                <div className="bg-black/5 p-3 rounded-lg font-mono text-sm border border-black/5 italic">
                  {s.input}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 opacity-50">
                  <Target size={14} />
                  <span className="text-xs font-black font-ui uppercase tracking-widest">Expected Failure</span>
                </div>
                <p className="font-editorial text-lg leading-snug">{s.failure}</p>
              </div>

              <div className="mt-auto pt-6 border-t border-black/5">
                <div className="flex items-center gap-2 mb-1 opacity-50">
                  <Activity size={14} />
                  <span className="text-xs font-black font-ui uppercase tracking-widest text-blue-600">Detection Strategy</span>
                </div>
                <p className="font-ui text-sm font-bold">{s.detection}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
