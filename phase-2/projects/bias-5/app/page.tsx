'use client';

import React, { useState, useEffect } from 'react';
import { Search, Info, AlertTriangle, BookOpen, Newspaper, ArrowRight, Loader2, Feather } from 'lucide-react';

export default function BiasTranslator() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while translating.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse the AI response into structured sections
  const renderParsedResult = (text: string) => {
    // Basic parsing based on common AI list formats (1., 2., etc. or headers)
    const sections = text.split(/(?=\d\.\s|\n\d\.\s|(?:\*\*|\n\*\*))/g).filter(s => s.trim());
    
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="rule-double mb-6"></div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs uppercase tracking-widest font-bold text-paper-ink-soft">Special Report</span>
          <span className="text-xs uppercase tracking-widest font-bold text-paper-ink-soft">Ethics Edition</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight italic">
          Understanding {query}: A Plain Language Analysis
        </h2>

        <div className="newspaper-cols space-y-6">
          {sections.map((section, idx) => {
            const cleanSection = section.replace(/^\d\.\s|\*\*/g, '').trim();
            const firstWord = cleanSection.split(' ')[0];
            const restOfContent = cleanSection.slice(firstWord.length);

            if (idx === 0) {
              return (
                <div key={idx} className="mb-6">
                  <p className="text-xl leading-relaxed first-letter:text-7xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.8] first-letter:text-paper-accent">
                    {cleanSection}
                  </p>
                </div>
              );
            }

            if (idx === 1) {
              return (
                <div key={idx} className="pull-quote my-8">
                  "{cleanSection}"
                </div>
              );
            }

            return (
              <div key={idx} className="mb-6 break-inside-avoid">
                <p className="leading-relaxed text-paper-ink-soft text-lg">
                  {cleanSection}
                </p>
              </div>
            );
          })}
        </div>
        
        <div className="rule-thin mt-12 pt-4 flex justify-between text-[10px] uppercase tracking-tighter text-paper-ink-soft">
          <span>&copy; BiasTranslator Editorial Board</span>
          <span>Verified for Non-Technical Stakeholders</span>
        </div>
      </div>
    );
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen paper-texture p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-8">
        
        {/* MASTHEAD */}
        <header className="text-center border-b-[6px] border-paper-ink pb-6 pt-10">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase mb-2">
            BiasTranslator
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-center px-2 py-1 border-t border-paper-ink text-sm font-bold uppercase tracking-widest">
            <div className="flex gap-4">
              <span>Vol. MMXXIV &bull; No. 5</span>
              <span className="hidden md:inline">Truth in Algorithms</span>
            </div>
            <div className="my-2 md:my-0">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div>
              <span className="text-paper-accent">Price: One Clear Thought</span>
            </div>
          </div>
          <p className="mt-6 text-xl md:text-2xl italic font-serif text-paper-ink-soft max-w-2xl mx-auto leading-relaxed">
            "Explain any AI bias concept in plain language for non-technical stakeholders."
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Input & Tools */}
          <div className="lg:col-span-4 space-y-8 lg:border-r lg:border-paper-border lg:pr-8">
            <section className="bg-white/50 p-6 border border-paper-border">
              <h3 className="text-xs uppercase tracking-widest font-black mb-4 flex items-center gap-2">
                <Search size={14} /> Submit Inquiry
              </h3>
              <form onSubmit={handleTranslate} className="space-y-6">
                <div>
                  <label htmlFor="concept" className="block text-sm font-bold uppercase mb-2">Bias Concept to Translate</label>
                  <input
                    id="concept"
                    type="text"
                    placeholder="e.g. Proxy Discrimination..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    required
                    className="placeholder:italic placeholder:text-paper-border"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="editorial-btn w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Printing...
                    </>
                  ) : (
                    <>
                      <Feather size={18} />
                      Publish Explanation
                    </>
                  )}
                </button>
              </form>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-black border-b border-paper-ink pb-1 flex items-center gap-2">
                <BookOpen size={14} /> Glossary Terms
              </h3>
              <div className="space-y-3">
                {['Demographic Parity', 'Disparate Impact', 'Historical Bias', 'Selection Bias'].map((term) => (
                  <button 
                    key={term}
                    onClick={() => setQuery(term)}
                    className="block w-full text-left text-sm hover:text-paper-accent transition-colors border-b border-paper-border border-dotted pb-1 group"
                  >
                    <span className="flex justify-between items-center">
                      {term} <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-paper-accent/5 p-4 border-l-4 border-paper-accent italic text-sm leading-relaxed">
              <strong>Editor's Note:</strong> Algorithmic accountability is no longer optional. These translations are designed to bridge the gap between technical teams and executive oversight.
            </section>
          </div>

          {/* RIGHT COLUMN: Results / Content */}
          <div className="lg:col-span-8">
            {loading && !result && (
              <div className="h-64 flex flex-col items-center justify-center text-paper-ink-soft space-y-4">
                <Loader2 className="animate-spin" size={48} />
                <p className="font-serif italic text-lg">Setting type and preparing the plates...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 p-6 border border-red-200 text-red-800 space-y-2">
                <h4 className="font-bold flex items-center gap-2">
                  <AlertTriangle size={18} /> Error in Dispatch
                </h4>
                <p>{error}</p>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="space-y-8">
                <div className="text-center py-20 border-2 border-dashed border-paper-border">
                  <Newspaper size={64} className="mx-auto mb-4 opacity-20" />
                  <p className="font-serif text-2xl italic text-paper-ink-soft">
                    Select a concept to reveal the explanation.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                  <div>
                    <h4 className="font-black uppercase mb-2 border-b border-paper-ink">Why Clarity Matters</h4>
                    <p className="leading-relaxed">Technical jargon often hides systemic risks. By translating these concepts into human terms, we empower leaders to make ethical decisions without needing a degree in data science.</p>
                  </div>
                  <div>
                    <h4 className="font-black uppercase mb-2 border-b border-paper-ink">Our Methodology</h4>
                    <p className="leading-relaxed">We utilize advanced linguistic models to deconstruct complex AI fairness metrics into relatable analogies and business-relevant impacts.</p>
                  </div>
                </div>
              </div>
            )}

            {result && renderParsedResult(result)}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="mt-20 pt-10 border-t-2 border-paper-ink text-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] mb-8">
            <span className="hover:text-paper-accent cursor-pointer">Classifieds</span>
            <span className="hover:text-paper-accent cursor-pointer">Archive</span>
            <span className="hover:text-paper-accent cursor-pointer">Legal Notice</span>
            <span className="hover:text-paper-accent cursor-pointer">Accessibility</span>
            <span className="hover:text-paper-accent cursor-pointer">Contact Ethics Board</span>
          </div>
          <p className="text-xs italic text-paper-ink-soft mb-10">
            Published daily in the interest of a fairer digital future. All algorithms are subject to scrutiny.
          </p>
        </footer>
      </div>
    </div>
  );
}
