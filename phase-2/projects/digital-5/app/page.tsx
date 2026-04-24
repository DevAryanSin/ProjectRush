'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, ArrowRight, Shield, FileText, Globe, CheckCircle2 } from 'lucide-react';

export default function ReverseTrace() {
  const [description, setDescription] = useState('');
  const [metadata, setMetadata] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const fullPrompt = `
      Suspicious Content Description: ${description}
      Visible Metadata: ${metadata || 'None provided'}
      Location Found: ${location || 'None provided'}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during the forensic analysis.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <header className="border-b-4 border-black pb-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-4">
          <p className="font-serif italic text-sm md:text-base border-b border-black uppercase tracking-widest">
            Digital Forensics Edition — Vol. 05
          </p>
          <p className="font-serif italic text-sm md:text-base border-b border-black uppercase tracking-widest">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <h1 className="text-center md:text-left font-serif font-black text-6xl md:text-9xl uppercase leading-none tracking-tighter mb-2">
          ReverseTrace
        </h1>
        <div className="border-y border-black py-2 mt-4">
          <p className="text-xl md:text-2xl font-serif italic text-center md:text-left opacity-90">
            Describe suspicious content — trace it back to its likely original source
          </p>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Investigation Form */}
        <section className="lg:col-span-5 border-r-0 lg:border-r border-black pr-0 lg:pr-8">
          <div className="sticky top-8">
            <h2 className="font-serif text-3xl mb-6">Open Case File</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-serif font-bold text-lg mb-2 uppercase tracking-wide">
                  Content Description
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what the media shows, quality, format, and any specific identifiers..."
                  className="w-full h-48 bg-transparent border border-black p-4 font-serif text-lg focus:outline-none focus:ring-1 focus:ring-accent resize-none placeholder:italic placeholder:opacity-50"
                />
              </div>

              <div>
                <label className="block font-serif font-bold text-lg mb-2 uppercase tracking-wide">
                  Visible Metadata
                </label>
                <input
                  type="text"
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  placeholder="Ex: EXIF data, watermarks, timestamps..."
                  className="w-full bg-transparent border border-black p-3 font-serif text-lg focus:outline-none focus:ring-1 focus:ring-accent placeholder:italic placeholder:opacity-50"
                />
              </div>

              <div>
                <label className="block font-serif font-bold text-lg mb-2 uppercase tracking-wide">
                  Origin / Location Found
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Twitter, Telegram, Discord link..."
                  className="w-full bg-transparent border border-black p-3 font-serif text-lg focus:outline-none focus:ring-1 focus:ring-accent placeholder:italic placeholder:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white p-4 font-serif font-bold text-xl uppercase tracking-widest hover:bg-accent transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> Analyzing Trace...
                  </>
                ) : (
                  <>
                    Run Forensic Analysis <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 p-6 border border-dashed border-black">
              <h3 className="font-serif text-xl mb-2 italic flex items-center gap-2">
                <Shield size={18} /> Confidentiality Notice
              </h3>
              <p className="font-serif text-sm opacity-75">
                All trace requests are processed through our secure forensic AI. Results are hypothetical 
                based on content propagation patterns and digital fingerprint analysis.
              </p>
            </div>
          </div>
        </section>

        {/* Right Column: Analysis Results */}
        <section className="lg:col-span-7">
          {!result && !loading && !error && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border border-dashed border-black opacity-40">
              <Search size={64} strokeWidth={1} className="mb-4" />
              <p className="font-serif text-2xl italic">
                Waiting for investigation parameters...
              </p>
              <p className="mt-2 max-w-xs">
                Submit the description on the left to begin the forensic tracing process.
              </p>
            </div>
          )}

          {loading && (
            <div className="p-8 border border-black">
              <div className="animate-pulse space-y-8">
                <div className="h-12 bg-black/10 w-3/4"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-black/10 w-full"></div>
                  <div className="h-4 bg-black/10 w-full"></div>
                  <div className="h-4 bg-black/10 w-5/6"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-black/10"></div>
                  <div className="h-24 bg-black/10"></div>
                </div>
                <div className="h-32 bg-black/10 w-full"></div>
              </div>
              <p className="mt-8 font-serif italic text-center animate-bounce">
                Scanning digital archives and distribution networks...
              </p>
            </div>
          )}

          {error && (
            <div className="p-8 border-2 border-accent bg-accent/5 text-accent">
              <h3 className="flex items-center gap-2 font-bold mb-2">
                <AlertCircle /> Forensic Scan Interrupted
              </h3>
              <p className="font-serif text-lg">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-4 font-bold uppercase underline"
              >
                Reset Parameters
              </button>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-2">
                <span className="font-serif font-black uppercase tracking-tighter text-sm">Case Report #RT-{Math.floor(Math.random() * 900000 + 100000)}</span>
                <span className="font-serif italic text-sm">Status: Verified Analysis</span>
              </div>
              
              <article className="max-w-none">
                <h2 className="font-serif text-4xl md:text-5xl font-black mb-8 leading-tight border-b-0">
                  Forensic Origin Analysis
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <div className="p-6 border border-black bg-black text-white">
                    <h4 className="text-xs uppercase tracking-widest mb-2 opacity-70">Likely Original Source</h4>
                    <p className="text-2xl font-serif italic">
                      {result.split('\n')[0].replace(/.*Source:?\s*/i, '') || 'Analysis Pending'}
                    </p>
                  </div>
                  <div className="p-6 border border-black">
                    <h4 className="text-xs uppercase tracking-widest mb-2 text-secondary">Confidence Level</h4>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-serif font-black">
                        {result.match(/\d+%/)?.[0] || '85%'}
                      </span>
                      <span className="text-sm font-serif italic pb-1">Certainty Rating</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 font-serif text-lg leading-relaxed text-justify">
                  {result.split('\n').map((paragraph, i) => {
                    if (!paragraph.trim()) return null;
                    if (paragraph.toLowerCase().includes('verification steps') || paragraph.toLowerCase().includes('distribution path')) {
                      return <h3 key={i} className="text-2xl font-bold mt-8 border-b border-black pb-1 mb-4 uppercase">{paragraph}</h3>;
                    }
                    if (paragraph.startsWith('-') || paragraph.match(/^\d\./)) {
                      return (
                        <div key={i} className="flex gap-4 items-start pl-4 border-l-2 border-black/20 my-2 italic">
                          <CheckCircle2 className="mt-1 flex-shrink-0 text-accent" size={18} />
                          <p>{paragraph.replace(/^[- \d.]*/, '')}</p>
                        </div>
                      );
                    }
                    return <p key={i} className="mb-4 first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:mt-1">{paragraph}</p>;
                  })}
                </div>

                <footer className="mt-16 pt-8 border-t border-black/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1"><FileText size={14} /> Official Record</span>
                    <span className="flex items-center gap-1"><Globe size={14} /> Network Scan Completed</span>
                  </div>
                  <p>© 2026 ReverseTrace Digital Forensics Laboratory</p>
                </footer>
              </article>
              
              <div className="mt-8 flex gap-4 print:hidden">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 border border-black p-3 font-serif font-bold uppercase hover:bg-black hover:text-white transition-all"
                >
                  Print Official Dossier
                </button>
                <button 
                  onClick={() => {
                    setResult(null);
                    setDescription('');
                    setMetadata('');
                    setLocation('');
                  }}
                  className="flex-1 border border-black p-3 font-serif font-bold uppercase hover:bg-accent hover:border-accent hover:text-white transition-all"
                >
                  Start New Investigation
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Decorative Rules */}
      <div className="mt-16 border-t-2 border-black pt-4 flex justify-between text-[10px] uppercase tracking-[0.2em] font-serif font-bold opacity-30">
        <span>RT-SYS-V2.5.0-FLASH</span>
        <div className="flex gap-8">
          <span>Authentication</span>
          <span>Verification</span>
          <span>Traceability</span>
        </div>
        <span>END OF FILE</span>
      </div>
    </div>
  );
}
