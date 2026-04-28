"use client";

import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, Fingerprint, FileText, ArrowRight, Loader2, Sparkles, History, Globe, Scale } from 'lucide-react';

export default function OriginLock() {
  const [mode, setMode] = useState<'trace' | 'license'>('trace');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, mode }),
      });
      const data = await response.json();
      if (data.text) {
        setOutput(data.text);
      } else {
        setOutput('Error: Unable to process request.');
      }
    } catch (err) {
      setOutput('Error: Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center mb-12 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-3 clay-button bg-accent-blue/10">
            <ShieldCheck className="w-8 h-8 text-accent-blue" />
          </div>
          <h1 className="text-5xl md:text-6xl tracking-tight text-accent-blue">OriginLock</h1>
        </div>
        <p className="ui-text text-lg text-accent-blue/60 font-semibold tracking-widest uppercase">
          Forensic Content Trace & Legal Licensing
        </p>
        <div className="mt-6 separator max-w-xs mx-auto opacity-30" />
      </header>

      {/* Mode Switcher */}
      <div className="flex p-2 clay-card mb-8 w-full max-w-md animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <button
          onClick={() => setMode('trace')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] transition-all ui-text font-bold ${
            mode === 'trace' 
            ? 'bg-accent-blue text-white shadow-lg' 
            : 'text-accent-blue/60 hover:bg-black/5'
          }`}
        >
          <Fingerprint className="w-5 h-5" />
          Trace Origin
        </button>
        <button
          onClick={() => setMode('license')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] transition-all ui-text font-bold ${
            mode === 'license' 
            ? 'bg-accent-blue text-white shadow-lg' 
            : 'text-accent-blue/60 hover:bg-black/5'
          }`}
        >
          <Scale className="w-5 h-5" />
          Generate License
        </button>
      </div>

      {/* Input Section */}
      <div className="w-full clay-card p-6 md:p-8 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="mb-4">
          <label className="ui-text font-bold text-accent-blue mb-2 block uppercase text-sm tracking-tighter">
            {mode === 'trace' ? 'Analysis Subject' : 'Asset Description'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'trace' 
              ? "Paste content snippet, URL, or metadata for forensic analysis..." 
              : "Describe the digital asset (image, code, text) to generate terms for..."}
            className="w-full h-32 clay-input p-4 text-lg resize-none placeholder:text-accent-blue/30"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || !input}
          className="w-full clay-button py-4 bg-accent-blue text-white flex items-center justify-center gap-3 ui-text font-bold text-lg disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              {mode === 'trace' ? <Search className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
              {mode === 'trace' ? 'Initialize Forensic Trace' : 'Draft Legal License'}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Output Section */}
      {output && (
        <div className="w-full clay-card p-8 md:p-12 animate-fade-in border-t-4 border-accent-blue">
          <div className="flex items-center gap-4 mb-8">
            <div className={`p-3 rounded-full ${mode === 'trace' ? 'bg-blue-100' : 'bg-red-100'}`}>
              {mode === 'trace' ? <History className="w-6 h-6 text-blue-800" /> : <ShieldCheck className="w-6 h-6 text-red-800" />}
            </div>
            <div>
              <h2 className="text-3xl text-accent-blue">
                {mode === 'trace' ? 'Forensic Analysis Report' : 'Formal Licensing Document'}
              </h2>
              <p className="ui-text text-sm text-accent-blue/50 italic">
                Generated via Gemini 2.5-Flash Origin Protocol
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <div className="text-xl leading-relaxed whitespace-pre-wrap font-serif text-accent-blue/90 first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-accent-blue">
              {output}
            </div>
          </div>

          <div className="mt-12 pt-8 separator opacity-30" />
          <div className="mt-4 flex justify-between items-center ui-text text-[10px] text-accent-blue/40 uppercase tracking-[0.2em]">
            <span>© 2024 OriginLock Protocol</span>
            <span>Secured By Digital Evidence Chain</span>
          </div>
        </div>
      )}

      {/* Footer Decoration */}
      <footer className="mt-auto py-12 opacity-20 flex gap-8">
        <Globe className="w-8 h-8" />
        <Fingerprint className="w-8 h-8" />
        <Sparkles className="w-8 h-8" />
      </footer>
    </div>
  );
}
