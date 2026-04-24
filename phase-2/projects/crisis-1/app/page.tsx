'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send, Loader2, FileText, Activity, MapPin, Users, Info, ShieldAlert } from 'lucide-react';

export default function PanicTranslatePage() {
  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  // Prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  // Render raw markdown-like response with styled boxes
  const renderResult = (text: string) => {
    // A simple parser for the Gemini output to look "brutalist"
    const blocks = text.split('\n\n').filter(Boolean);
    
    return blocks.map((block, i) => {
      // Check if block has bold labels or markdown headers
      const hasHeader = block.match(/^(#|\*|1\.|2\.|3\.|4\.|5\.|6\.|-)\s+/m) || block.includes(':**');
      
      return (
        <div key={i} className="mb-6 brutal-box p-4 bg-[#fffdf5]">
          {block.split('\n').map((line, j) => {
            const isBoldLabel = line.match(/^\*\*(.*?)\*\*(.*)/);
            if (isBoldLabel) {
              return (
                <div key={j} className="mb-2">
                  <span className="font-[900] text-lg uppercase bg-[var(--accent-yellow)] px-2 mr-2 border-[var(--border-thick)] inline-block mb-1">
                    {isBoldLabel[1]}
                  </span>
                  <span className="font-[700] text-lg">{isBoldLabel[2]}</span>
                </div>
              );
            }
            
            const isHeading = line.startsWith('#');
            if (isHeading) {
              return <h3 key={j} className="text-xl font-[900] mb-2 uppercase border-b-[var(--border-thick)] pb-1 inline-block">{line.replace(/#+\s/, '')}</h3>;
            }

            return <p key={j} className="mb-1 text-lg leading-tight font-bold">{line.replace(/\*\*/g, '')}</p>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <header className="mb-12 border-b-[var(--border-thick)] pb-8 relative">
        <div className="absolute top-0 right-0 bg-[var(--accent-red)] w-24 h-24 rounded-full border-[var(--border-thick)] shadow-[var(--shadow-brutal)] flex items-center justify-center -mt-4 -mr-4 animate-pulse hidden md:flex z-10">
          <AlertTriangle size={48} color="white" />
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] uppercase mb-4 tracking-tighter text-[var(--accent-red)]" style={{ textShadow: '4px 4px 0px var(--text-main)' }}>
          PanicTranslate
        </h1>
        <div className="brutal-box inline-block p-3 bg-[var(--accent-yellow)]">
          <h2 className="text-xl md:text-2xl font-[900] uppercase leading-tight">
            Convert a panicked guest message<br/>into a calm structured emergency report
          </h2>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* INPUT SECTION */}
        <section className="flex flex-col gap-6">
          <div className="brutal-box p-6 bg-white relative">
            <div className="absolute -top-4 -left-4 bg-[var(--text-main)] text-white px-4 py-1 font-[900] uppercase tracking-wider text-sm border-[var(--border-thick)] shadow-[4px_4px_0px_#fff]">
              STEP 01
            </div>
            
            <h3 className="text-2xl font-[900] mb-4 uppercase flex items-center gap-2">
              <Activity className="text-[var(--accent-red)]" strokeWidth={3} />
              Raw Panic Input
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="relative">
                <label htmlFor="prompt" className="sr-only">Enter message</label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Oh my god help! Room 402! There's smoke everywhere and my husband can't breathe! Please hurry!"
                  className="brutal-input p-4 min-h-[200px] text-xl font-[700] resize-y"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !prompt.trim()}
                className="brutal-button py-4 px-8 text-2xl w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:box-shadow-[var(--shadow-brutal)]"
              >
                {loading ? (
                  <>
                    <Loader2 size={28} className="animate-spin" strokeWidth={3} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={28} strokeWidth={3} />
                    Extract Facts
                  </>
                )}
              </button>
            </form>
          </div>

          {error && (
            <div className="brutal-box p-4 bg-[var(--accent-red)] text-white flex items-start gap-4">
              <AlertTriangle size={32} strokeWidth={3} className="shrink-0 mt-1" />
              <div>
                <h4 className="font-[900] text-xl mb-1 uppercase">Error Processing</h4>
                <p className="font-[700]">{error}</p>
              </div>
            </div>
          )}
          
          <div className="brutal-box p-4 bg-[var(--accent-yellow)] flex gap-4">
             <Info size={32} strokeWidth={3} className="shrink-0" />
             <p className="font-[700] text-sm uppercase">
               This tool uses AI to parse chaotic inputs. Always verify critical details with the original caller if possible. Do not rely solely on automated extraction for life-safety decisions.
             </p>
          </div>
        </section>

        {/* OUTPUT SECTION */}
        <section className="flex flex-col h-full">
          <div className="brutal-box p-6 bg-white min-h-[500px] relative flex-grow flex flex-col">
            <div className="absolute -top-4 -right-4 bg-[var(--text-main)] text-white px-4 py-1 font-[900] uppercase tracking-wider text-sm border-[var(--border-thick)] shadow-[-4px_4px_0px_#fff]">
              STEP 02
            </div>

            <h3 className="text-2xl font-[900] mb-6 uppercase flex items-center gap-2 border-b-[var(--border-thick)] pb-4">
              <ShieldAlert className="text-[var(--text-main)]" strokeWidth={3} />
              Structured Triage
            </h3>

            <div className="flex-grow">
              {!result && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50 border-4 border-dashed border-[var(--text-main)]">
                  <FileText size={64} strokeWidth={2} className="mb-4" />
                  <p className="text-xl font-[900] uppercase">Waiting for input...</p>
                </div>
              )}

              {loading && (
                <div className="h-full flex flex-col items-center justify-center p-8 gap-6">
                  <div className="w-24 h-24 border-[8px] border-[var(--text-main)] border-t-[var(--accent-red)] rounded-full animate-spin"></div>
                  <p className="text-2xl font-[900] uppercase animate-pulse">Filtering noise...</p>
                </div>
              )}

              {result && !loading && (
                <div className="result-container">
                  {renderResult(result)}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
