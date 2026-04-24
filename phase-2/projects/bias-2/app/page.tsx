'use client';

import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle2, AlertTriangle, Loader2, Sparkles, FileText, Globe } from 'lucide-react';

export default function HiringLens() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to analyze job description');
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text: string) => {
    // Simple parsing logic to divide into sections based on markdown headers or common patterns
    const sections = text.split(/(?=#{1,4}\s|\n\d\.\s|\n\*\*)/g);
    return sections.map((section, idx) => {
      const isHeader = section.trim().startsWith('#') || section.trim().startsWith('**');
      return (
        <div key={idx} className={`mb-6 p-4 rounded-xl ${isHeader ? 'bg-opacity-50 border-l-4 border-blue-400' : ''}`}>
          {section.split('\n').map((line, lIdx) => {
            if (!line.trim()) return null;
            
            // Highlight severity ratings
            const severityMatch = line.match(/(HIGH|MEDIUM|LOW) severity/i);
            const severityColor = severityMatch?.[1].toUpperCase() === 'HIGH' ? 'text-red-500' : 
                                 severityMatch?.[1].toUpperCase() === 'MEDIUM' ? 'text-orange-500' : 'text-green-500';

            return (
              <p key={lIdx} className={`mb-2 leading-relaxed ${severityMatch ? 'font-bold' : ''}`}>
                {severityMatch ? (
                  <span className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${severityColor}`} />
                    <span className={severityColor}>{line}</span>
                  </span>
                ) : line}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16 animate-in fade-in duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 neo-button mb-6">
            <Search className="w-10 h-10 accent-text" />
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">HiringLens</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Paste a job description — find discriminatory language and get a rewrite
          </p>
        </header>

        {/* Input Section */}
        <section className="neo-flat p-8 mb-12 animate-in slide-in-from-bottom-4 duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="jd" className="block text-sm font-semibold mb-3 ml-2 opacity-70">
                Job Description Text
              </label>
              <textarea
                id="jd"
                className="neo-input min-h-[250px] resize-none text-lg"
                placeholder="Paste the job description here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="neo-button px-10 py-4 flex items-center gap-3 text-lg hover:accent-text transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-5 h-5" />
                    Audit Description
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Error State */}
        {error && (
          <div className="neo-flat p-6 border-l-4 border-red-500 mb-12 text-red-600 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold">Analysis Failed</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <section className="neo-flat p-8 animate-in zoom-in-95 duration-500">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-black/5">
              <div className="p-3 neo-button rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold">Audit Results & Rewrites</h2>
            </div>
            
            <div className="space-y-2 whitespace-pre-wrap">
              {parseResult(result)}
            </div>

            <div className="mt-12 flex justify-center">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="neo-button px-6 py-2 text-sm opacity-60 hover:opacity-100"
              >
                Start New Audit
              </button>
            </div>
          </section>
        )}

        {/* Footer Info */}
        {!result && !loading && (
          <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-center">
            <div className="p-6 neo-button rounded-2xl">
              <Globe className="w-6 h-6 mx-auto mb-3 accent-text" />
              <h3 className="font-bold mb-2">Global Standards</h3>
              <p className="text-xs opacity-70">Aligns with EEOC and global fair hiring guidelines.</p>
            </div>
            <div className="p-6 neo-button rounded-2xl">
              <Sparkles className="w-6 h-6 mx-auto mb-3 accent-text" />
              <h3 className="font-bold mb-2">Smart Rewrites</h3>
              <p className="text-xs opacity-70">Automatically generates inclusive alternatives.</p>
            </div>
            <div className="p-6 neo-button rounded-2xl">
              <FileText className="w-6 h-6 mx-auto mb-3 accent-text" />
              <h3 className="font-bold mb-2">Detailed Flags</h3>
              <p className="text-xs opacity-70">Detects subtle bias in gender, age, and ability.</p>
            </div>
          </footer>
        )}
      </div>
    </main>
  );
}
