'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Send, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze data');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative font-sans text-white pb-20">
      <div className="aurora-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-16 relative z-10">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-10 h-10 text-[var(--teal)]" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Community<span className="gradient-text">Pulse</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto font-light">
            Paste community social media posts — extract hidden needs for NGO action
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-[var(--teal)]" />
                Raw Community Signals
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="posts" className="block text-sm text-[var(--text-secondary)] mb-2">
                    Paste text from Facebook groups, WhatsApp chats, forums, etc.
                  </label>
                  <textarea
                    id="posts"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. 'Several families in the North district haven't had clean water since Tuesday. We are getting worried about the kids...'"
                    className="glass-input w-full h-64 p-4 rounded-lg resize-none text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-full gradient-btn font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Signals...
                    </>
                  ) : (
                    <>
                      <Activity className="w-5 h-5" />
                      Extract Needs
                    </>
                  )}
                </button>
              </form>
            </div>
            
            <div className="glass-card p-5 border border-[var(--card-border)] bg-opacity-30">
               <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-3">How it works</h3>
               <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--teal)] mt-0.5 shrink-0" />
                    <span>Paste unstructured text from any source</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--purple)] mt-0.5 shrink-0" />
                    <span>AI identifies core issues and urgency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--blue)] mt-0.5 shrink-0" />
                    <span>Get actionable interventions for your NGO</span>
                  </li>
               </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-card p-6 min-h-[400px] h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 pb-4 border-b border-[var(--card-border)]">
                <Activity className="w-5 h-5 text-[var(--purple)]" />
                Intelligence Report
              </h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && !result && (
                <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-secondary)] opacity-60">
                  <Activity className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">Awaiting community data...</p>
                  <p className="text-sm mt-2">Submit posts to generate an intelligence report.</p>
                </div>
              )}

              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-[var(--card-border)] rounded-full"></div>
                    <div className="w-20 h-20 border-4 border-[var(--teal)] rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                  </div>
                  <p className="mt-6 text-[var(--teal)] font-medium animate-pulse tracking-widest uppercase text-sm">
                    Processing Signals
                  </p>
                </div>
              )}

              {result && !loading && (
                <div className="flex-1 overflow-auto max-w-none p-2 space-y-4 text-sm leading-relaxed text-gray-300">
                  {result.split('\n').map((line, idx) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={idx} className="text-2xl font-bold mt-6 mb-4 text-[var(--teal)]">{line.replace('# ', '')}</h1>;
                    }
                    if (line.startsWith('## ')) {
                      return <h2 key={idx} className="text-xl font-semibold mt-5 mb-3 text-[var(--blue)] border-b border-gray-700 pb-2">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('### ')) {
                      return <h3 key={idx} className="text-lg font-medium mt-4 mb-2 text-[var(--purple)]">{line.replace('### ', '')}</h3>;
                    }
                    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                      const text = line.trim().substring(2);
                      const parts = text.split(/(\*\*.*?\*\*)/g);
                      return (
                        <li key={idx} className="ml-4 list-disc">
                          {parts.map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
                            }
                            return part;
                          })}
                        </li>
                      );
                    }
                    if (line.trim() === '') {
                      return <br key={idx} />;
                    }
                    
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={idx} className="mb-2">
                        {parts.map((part, i) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
