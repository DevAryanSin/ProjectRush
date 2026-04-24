'use client';

import React, { useState, useEffect } from 'react';
import { Package, Send, Loader2, History, AlertCircle, CheckCircle2, ChevronRight, Truck, Clock } from 'lucide-react';

export default function ShipmentNarrator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze shipment data');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative z-10 min-h-screen p-6 md:p-12 lg:p-24 flex flex-col items-center">
      {/* Aurora Background */}
      <div className="aurora-container">
        <div className="aurora-orb orb-1"></div>
        <div className="aurora-orb orb-2"></div>
        <div className="aurora-orb orb-3"></div>
        <div className="aurora-orb orb-4"></div>
      </div>

      {/* Header */}
      <header className="z-10 text-center mb-16 animate-in fade-in slide-in-from-top duration-1000">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 glass-card rounded-2xl">
            <Package className="w-8 h-8 text-[#00d4aa]" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Shipment<span className="gradient-text">Narrator</span>
          </h1>
        </div>
        <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
          Paste raw tracking data — get a plain-language shipment story
        </p>
      </header>

      {/* Main Action Area */}
      <div className="z-10 w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="glass-card p-8 md:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                <History className="w-4 h-4" />
                Raw Tracking Log
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your carrier updates, status logs, or raw tracking JSON here..."
                className="w-full h-48 glass-input p-6 text-lg resize-none placeholder:text-slate-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#00d4aa] to-[#2563eb] hover:from-[#00f2c3] hover:to-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-teal-500/20 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Narrating shipment story...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Generate Story
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results / Error Display */}
        {error && (
          <div className="glass-card p-6 border-red-500/30 bg-red-500/5 flex items-start gap-4 text-red-200 animate-in zoom-in duration-300">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="font-bold mb-1">Analysis Error</h3>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="glass-card p-8 md:p-12 space-y-8 animate-in zoom-in duration-500 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Truck className="w-32 h-32" />
            </div>
            
            <div className="flex items-center gap-3 pb-6 border-b border-white/10">
              <CheckCircle2 className="w-6 h-6 text-[#00d4aa]" />
              <h2 className="text-2xl font-bold">Shipment Narrative</h2>
            </div>

            <div className="prose prose-invert max-w-none">
              {result.split('\n\n').map((paragraph, idx) => (
                <div key={idx} className="mb-6 last:mb-0 group">
                  {paragraph.includes(':') ? (
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/3 font-bold text-[#00d4aa] text-lg">
                        {paragraph.split(':')[0]}
                      </div>
                      <div className="md:w-2/3 text-slate-300 leading-relaxed">
                        {paragraph.split(':').slice(1).join(':').trim()}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-300 leading-relaxed text-lg">
                      {paragraph}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-400">
                <Clock className="w-3 h-3" />
                Analyzed by Gemini 2.5-flash
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-medium text-[#00d4aa]">
                <Truck className="w-3 h-3" />
                Logistics Logic Active
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="z-10 mt-auto pt-16 pb-8 text-slate-500 text-sm font-medium">
        <p>&copy; {new Date().getFullYear()} ShipmentNarrator • Premium Supply Chain Intelligence</p>
      </footer>
    </main>
  );
}
