'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Zap, 
  Database, 
  ChevronRight, 
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function DataMirrorPage() {
  const [columns, setColumns] = useState('');
  const [sampleValues, setSampleValues] = useState('');
  const [useCase, setUseCase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const fullInput = `
      Columns: ${columns}
      Sample Values: ${sampleValues}
      Intended Use Case: ${useCase}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze data');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    // Simple parsing logic: split by double newlines or lines starting with "Feature:"
    const sections = result.split(/\n(?=(?:Feature|Risk|Mitigation|Attribute):?)/gi);

    return (
      <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="title-lg text-primary mb-8 border-b-8 border-accent pb-4">Detection Results</h2>
        <div className="grid gap-6">
          {sections.map((section, idx) => {
            if (section.trim().length < 5) return null;
            
            const isHighRisk = section.toLowerCase().includes('high');
            const isMedRisk = section.toLowerCase().includes('medium');
            
            let colorClass = 'border-primary';
            let bgClass = 'bg-white';
            let icon = <Info className="w-6 h-6" />;

            if (isHighRisk) {
              colorClass = 'border-accent';
              bgClass = 'bg-accent/5';
              icon = <AlertTriangle className="w-6 h-6 text-accent" />;
            } else if (isMedRisk) {
              colorClass = 'border-primary';
              bgClass = 'bg-primary/5';
              icon = <AlertCircle className="w-6 h-6 text-primary" />;
            }

            return (
              <div 
                key={idx} 
                className={`flat-card border-l-[16px] ${colorClass} ${bgClass} transition-transform hover:-translate-y-1`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2 border-4 border-primary bg-white">
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap text-lg leading-relaxed font-semibold text-primary">
                      {section.trim()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* HEADER SECTION */}
      <header className="section-purple py-12 px-6 border-b-[12px] border-accent">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-accent p-4 border-4 border-white">
              <ShieldCheck className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="title-xl text-white">DataMirror</h1>
              <p className="text-xl font-bold bg-white text-primary px-3 py-1 inline-block mt-2">
                Unbiased AI Decision Tool
              </p>
            </div>
          </div>
          <div className="text-right max-w-md hidden md:block">
            <p className="text-lg font-bold uppercase tracking-widest text-accent">
              Core Mission: FAIRNESS
            </p>
            <p className="text-sm font-medium opacity-80 mt-1">
              Detecting discriminatory proxies hiding in your data before they become biased algorithms.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* INPUT FORM SECTION */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-primary text-white p-8 mb-8 border-4 border-primary">
            <h2 className="text-4xl font-black mb-4">Analyze Dataset</h2>
            <p className="text-lg opacity-90 font-medium">
              Input your dataset structure to find hidden correlations with protected attributes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                <Database className="w-5 h-5 text-accent" />
                Column Names
              </label>
              <textarea
                value={columns}
                onChange={(e) => setColumns(e.target.value)}
                placeholder="e.g. user_id, zip_code, credit_score, gender, last_purchase_date..."
                className="flat-input h-32 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Sample Values
              </label>
              <textarea
                value={sampleValues}
                onChange={(e) => setSampleValues(e.target.value)}
                placeholder="e.g. 10231, '10001', 720, 'male', '2023-10-01'..."
                className="flat-input h-32 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Intended Use Case
              </label>
              <input
                type="text"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder="e.g. Credit score estimation for loan approval"
                className="flat-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              suppressHydrationWarning
              className="flat-button w-full group"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  ANALYZING DATA...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Search className="w-6 h-6" />
                  DETECT DISCRIMINATORY PROXIES
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {error && (
            <div className="flat-card border-accent bg-accent/10 border-l-[12px] p-6 flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-accent flex-shrink-0" />
              <div>
                <p className="font-black text-accent uppercase">Detection Error</p>
                <p className="font-bold text-primary">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* RESULTS SECTION */}
        <div className="lg:col-span-7 bg-off overflow-hidden relative">
          <div className="p-12 min-h-[600px] border-4 border-primary h-full">
            {!result && !isLoading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="bg-primary/10 p-12 border-8 border-primary border-dashed">
                  <Search className="w-24 h-24 text-primary opacity-30" />
                </div>
                <div>
                  <h3 className="title-lg text-primary opacity-40">Waiting for Input</h3>
                  <p className="text-xl font-bold text-primary/40 mt-2">
                    Results will be displayed here after analysis.
                  </p>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="border-8 border-accent p-8 animate-pulse">
                  <Loader2 className="w-24 h-24 text-accent animate-spin" />
                </div>
                <h3 className="title-lg text-accent">Mirroring Data...</h3>
                <p className="text-xl font-bold text-primary italic">
                  Scanning for discriminatory proxy patterns across 20+ protected classes.
                </p>
              </div>
            )}

            {renderResult()}

            {result && (
              <div className="mt-12 flex justify-between items-center border-t-4 border-primary pt-8">
                <div className="flex gap-4">
                  <div className="bg-accent px-4 py-2 text-white font-black text-sm uppercase">Protected Attributes Scanned</div>
                  <div className="bg-primary px-4 py-2 text-white font-black text-sm uppercase">Statistical Parity Check: ON</div>
                </div>
                <button 
                  onClick={() => window.print()} 
                  className="bg-white border-4 border-primary px-6 py-2 font-black hover:bg-primary hover:text-white transition-colors"
                >
                  EXPORT REPORT
                </button>
              </div>
            )}
          </div>
          
          {/* Decorative Flat Elements */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent opacity-10 -mr-12 -mt-12 rotate-45" />
          <div className="absolute bottom-0 left-0 w-48 h-12 bg-primary opacity-5 -ml-12 mb-24 -rotate-12" />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-primary py-8 border-t-[12px] border-accent mt-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-accent w-8 h-8" />
            <span className="text-white font-black text-2xl tracking-tighter">DATAMIRROR</span>
          </div>
          <p className="text-white font-bold opacity-60 text-sm">
            © 2026 DATAMIRROR | BUILT FOR ALGORITHMIC ACCOUNTABILITY
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-white font-black text-xs uppercase hover:text-accent transition-colors">Safety Standard</a>
            <a href="#" className="text-white font-black text-xs uppercase hover:text-accent transition-colors">Legal Context</a>
            <a href="#" className="text-white font-black text-xs uppercase hover:text-accent transition-colors">Documentation</a>
          </div>
        </div>
      </footer>

      {/* Font loading styles */}
      <style jsx global>{`
        .bg-off { background-color: var(--bg-off); }
      `}</style>
    </div>
  );
}
