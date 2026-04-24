'use client';

import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Loader2, ShieldAlert } from 'lucide-react';

export default function Home() {
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze prompt');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-20 selection:bg-[#8A2BE2] selection:text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT COLUMN: Header & Input */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <header className="brutal-container p-6 bg-[#8A2BE2] text-black">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
              Prompt<br />Bias
            </h1>
            <p className="text-lg md:text-xl font-bold border-t-4 border-black pt-4">
              Paste any AI prompt — detect bias baked into the prompt itself.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="brutal-container p-6 bg-white flex flex-col gap-6">
            <div>
              <label htmlFor="promptInput" className="block text-2xl font-black uppercase mb-3 text-black">
                AI Prompt to Audit
              </label>
              <textarea
                id="promptInput"
                className="w-full min-h-[200px] p-4 text-lg font-bold brutal-border resize-y focus:outline-none focus:ring-0 focus:bg-yellow-50 transition-colors"
                placeholder="Enter a prompt here... e.g., 'Write a job description for a nurse...'"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !promptInput.trim()}
              className="w-full bg-[#8A2BE2] text-white py-4 px-6 text-2xl font-black uppercase brutal-border brutal-shadow brutal-shadow-hover flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
            >
              <span>{isLoading ? 'Analyzing...' : 'Audit Prompt'}</span>
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin" strokeWidth={3} />
              ) : (
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
              )}
            </button>
          </form>

          {error && (
            <div className="brutal-container p-4 bg-red-500 text-white flex items-start gap-4">
              <AlertCircle className="w-8 h-8 shrink-0 mt-1" strokeWidth={3} />
              <div>
                <h3 className="text-xl font-black uppercase mb-1">Error</h3>
                <p className="font-bold">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="lg:col-span-7">
          <div className="brutal-container p-6 md:p-8 bg-white min-h-full">
            <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-4 mb-6 flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-[#8A2BE2]" strokeWidth={3} />
              Audit Report
            </h2>

            {!result && !isLoading && (
              <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 border-4 border-dashed border-black">
                <ShieldAlert className="w-20 h-20 mb-4 text-gray-300" strokeWidth={2} />
                <p className="text-3xl font-black text-gray-400 uppercase">Awaiting Input</p>
                <p className="text-xl font-bold text-gray-500 mt-2">Submit a prompt to see the analysis here.</p>
              </div>
            )}

            {isLoading && (
              <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 border-4 border-black bg-yellow-300">
                <Loader2 className="w-20 h-20 mb-6 text-black animate-spin" strokeWidth={3} />
                <p className="text-4xl font-black text-black uppercase animate-pulse">Scanning for Bias...</p>
              </div>
            )}

            {result && !isLoading && (
              <div className="text-lg font-bold text-black flex flex-col gap-4">
                {result.split('\n').map((line, i) => {
                  const trimmedLine = line.trim();
                  if (!trimmedLine) return null;
                  
                  if (trimmedLine.startsWith('## ') || trimmedLine.startsWith('# ')) {
                    return (
                      <h2 key={i} className="text-2xl md:text-3xl font-black uppercase mt-6 mb-2 border-b-4 border-black pb-2 bg-yellow-300 inline-block px-3 py-1 w-max max-w-full break-words">
                        {trimmedLine.replace(/^#+\s/, '')}
                      </h2>
                    );
                  }
                  
                  if (trimmedLine.startsWith('### ')) {
                    return (
                      <h3 key={i} className="text-xl md:text-2xl font-black uppercase mt-4 mb-2 text-[#8A2BE2]">
                        {trimmedLine.replace('### ', '')}
                      </h3>
                    );
                  }

                  if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                    const content = trimmedLine.substring(2);
                    const parts = content.split(/(\*\*.*?\*\*)/g);
                    return (
                      <li key={i} className="ml-6 list-disc mb-2">
                        {parts.map((part, index) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={index} className="text-[#8A2BE2] font-black">{part.slice(2, -2)}</strong>;
                          }
                          return <span key={index}>{part}</span>;
                        })}
                      </li>
                    );
                  }

                  // Handle bold markdown inline roughly for normal paragraphs
                  const parts = trimmedLine.split(/(\*\*.*?\*\*)/g);
                  return (
                    <p key={i} className="mb-2 leading-relaxed">
                      {parts.map((part, index) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={index} className="text-[#8A2BE2] font-black">{part.slice(2, -2)}</strong>;
                        }
                        return <span key={index}>{part}</span>;
                      })}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
