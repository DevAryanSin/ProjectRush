'use client';

import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Loader2, ShieldAlert } from 'lucide-react';

export default function FirstContact() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate');
      
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-24 pb-32 px-6">
      {/* Header Section */}
      <div className="w-full max-w-xl animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <ShieldAlert className="w-5 h-5 text-[var(--accent)]" />
          <span className="text-xs tracking-[0.3em] uppercase font-semibold">FirstContact</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-normal leading-[0.9] mb-6 lowercase italic">
          Help is <br /> on the way.
        </h1>
        
        <p className="text-[var(--muted)] text-lg font-light leading-relaxed mb-16 max-w-sm">
          Describe your emergency. Get immediate calm guidance while we alert the response team.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="group">
            <textarea
              className="minimal-input h-32 resize-none"
              placeholder="What is happening? (Type, location, number of people, dangers)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              suppressHydrationWarning
            />
          </div>

          <button
            type="submit"
            className="minimal-button group flex items-center justify-between"
            disabled={loading || !prompt.trim()}
            suppressHydrationWarning
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing request...
              </span>
            ) : (
              <>
                Initiate Protocol
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="mt-12 p-6 border border-red-100 bg-red-50/30 flex items-start gap-4 text-red-600 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="mt-24 pt-24 border-t border-[var(--border)] animate-fade-in">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="text-xs tracking-widest uppercase font-bold">Active Guidance</span>
            </div>
            
            <div className="prose prose-neutral max-w-none">
              <div className="whitespace-pre-wrap text-xl md:text-2xl font-light leading-relaxed text-[var(--foreground)]">
                {result.split('\n').map((line, i) => {
                  if (line.match(/^\d\./)) {
                    return (
                      <div key={i} className="mb-6 pl-8 relative">
                        <span className="absolute left-0 text-[var(--accent)] italic font-serif">
                          {line.split('.')[0]}.
                        </span>
                        {line.split('.').slice(1).join('.').trim()}
                      </div>
                    );
                  }
                  if (line.match(/^-/)) {
                    return <div key={i} className="mb-4 pl-8 border-l border-[var(--border)] italic text-lg text-[var(--muted)]">{line}</div>;
                  }
                  return <p key={i} className={line.trim() ? "mb-8" : "mb-4"}>{line}</p>;
                })}
              </div>
            </div>

            <div className="mt-20 flex justify-center">
              <button 
                onClick={() => { setResult(null); setPrompt(''); }}
                className="text-[var(--muted)] hover:text-[var(--foreground)] text-xs tracking-widest uppercase transition-colors"
                suppressHydrationWarning
              >
                Clear and Reset System
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Background Ornament - Subtle and Minimalist */}
      <div className="fixed bottom-12 right-12 opacity-[0.03] select-none pointer-events-none">
        <h2 className="text-[20vw] font-bold leading-none tracking-tighter">SAFETY</h2>
      </div>
    </main>
  );
}
