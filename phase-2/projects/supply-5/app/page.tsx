'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ShieldAlert, 
  Gavel, 
  Globe, 
  AlertTriangle, 
  Send, 
  Loader2, 
  BookOpen,
  ArrowRight,
  Quote
} from 'lucide-react';

export default function ContractClausePage() {
  const [formData, setFormData] = useState({
    contractType: '',
    scenario: '',
    role: '',
    jurisdiction: '',
    riskTolerance: 'Balanced'
  });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    setFormattedDate(new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const assembledPrompt = `
      Contract Type: ${formData.contractType}
      Disruption Scenario: ${formData.scenario}
      User Role: ${formData.role}
      Jurisdiction: ${formData.jurisdiction}
      Risk Tolerance: ${formData.riskTolerance}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: assembledPrompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate clauses');
      
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    // Simple parser to separate clauses by numbered headings or common markers
    const sections = result.split(/\d\.\s|\(\d\)\s|\n\n(?=[A-Z])/).filter(s => s.trim().length > 0);

    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        <div className="rule-line-double"></div>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-4xl font-serif-display italic">Legislative Drafts</h2>
          <span className="text-sm uppercase tracking-widest text-muted border-b border-border pb-1">Internal Reference: CC-2024-X</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {sections.map((section, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-6 top-0 text-3xl font-serif-display text-accent opacity-20 group-hover:opacity-100 transition-opacity">
                {idx + 1}
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-wrap first-letter:text-4xl first-letter:font-serif-display first-letter:mr-2 first-letter:float-left">
                  {section.trim()}
                </p>
              </div>
              <div className="rule-line-thin mt-6"></div>
            </div>
          ))}
        </div>

        <div className="pull-quote">
          "The strength of a supply chain is not in its capacity to resist change, but in its contractual agility to absorb it."
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      {/* Newspaper Header */}
      <header className="mb-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rule-line-thin"></div>
          <div className="flex justify-between w-full text-xs uppercase tracking-[0.2em] text-muted font-medium">
            <span>Special Edition</span>
            <span>{formattedDate || 'Special Edition'}</span>
            <span>Price: Pro Bono</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif-display font-black tracking-tight text-foreground mt-4 mb-2">
            ContractClause
          </h1>
          <p className="text-xl md:text-2xl font-serif italic text-muted max-w-2xl">
            Generate protective contract clauses for supply chain disruption scenarios
          </p>
          <div className="rule-line-double"></div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-8">
          <section className="paper-card p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-accent/5 rounded-full">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-serif-display font-bold">Clause Specification</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm uppercase tracking-wider font-bold text-muted mb-2">Contract Type</label>
                <input
                  type="text"
                  name="contractType"
                  required
                  placeholder="e.g., Master Services Agreement, Logistics Contract"
                  className="w-full bg-transparent border-b-2 border-border focus:border-accent outline-none py-2 font-serif text-lg transition-colors"
                  value={formData.contractType}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider font-bold text-muted mb-2">Disruption Scenario</label>
                <textarea
                  name="scenario"
                  required
                  rows={3}
                  placeholder="e.g., Port congestion in SE Asia, unexpected fuel price spike..."
                  className="w-full bg-transparent border-b-2 border-border focus:border-accent outline-none py-2 font-serif text-lg transition-colors resize-none"
                  value={formData.scenario}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm uppercase tracking-wider font-bold text-muted mb-2">Your Role</label>
                  <select
                    name="role"
                    className="w-full bg-transparent border-b-2 border-border focus:border-accent outline-none py-2 font-serif text-lg transition-colors appearance-none"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Role</option>
                    <option value="Buyer / Consignee">Buyer</option>
                    <option value="Seller / Shipper">Seller</option>
                    <option value="Logistics Provider">Provider</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-wider font-bold text-muted mb-2">Jurisdiction</label>
                  <input
                    type="text"
                    name="jurisdiction"
                    placeholder="e.g., New York, UK, International"
                    className="w-full bg-transparent border-b-2 border-border focus:border-accent outline-none py-2 font-serif text-lg transition-colors"
                    value={formData.jurisdiction}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider font-bold text-muted mb-2">Risk Tolerance</label>
                <div className="flex justify-between items-center bg-accent/5 p-4 rounded border border-accent/10">
                  {['Conservative', 'Balanced', 'Aggressive'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, riskTolerance: level }))}
                      className={`px-4 py-2 text-sm font-bold uppercase tracking-widest transition-all ${
                        formData.riskTolerance === level 
                        ? 'bg-accent text-white scale-105' 
                        : 'text-muted hover:text-accent'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-foreground text-background py-4 flex items-center justify-center space-x-3 hover:bg-accent transition-colors disabled:opacity-50 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-bold uppercase tracking-widest">Drafting Clauses...</span>
                  </>
                ) : (
                  <>
                    <span className="font-bold uppercase tracking-widest">Generate Protective Clauses</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </section>

          <div className="prose prose-slate italic text-muted text-sm leading-relaxed p-4 border-l-2 border-border">
            Note: ContractClause provides AI-generated suggestions for informational purposes. These do not constitute legal advice. Always consult with qualified legal counsel before incorporating these into binding agreements.
          </div>
        </div>

        {/* Right Column: Info/Results */}
        <div className="lg:col-span-7 newspaper-column">
          {!result && !loading && !error && (
            <div className="space-y-10 py-4">
              <div className="mb-12">
                <h3 className="text-3xl font-serif-display mb-4">The Volatility of Global Logistics</h3>
                <p className="text-xl leading-relaxed text-muted font-serif">
                  In an era of unprecedented supply chain complexity, the legal framework governing transit has become the ultimate safeguard. ContractClause analyzes current risk vectors and generates precise language to mitigate operational exposure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <ShieldAlert className="w-8 h-8 text-accent" />
                  <h4 className="text-xl font-bold font-serif-display">Force Majeure 2.0</h4>
                  <p className="text-muted leading-relaxed">
                    Moving beyond standard "Acts of God" to address modern disruption: cyber-attacks, port strikes, and algorithmic failures.
                  </p>
                </div>
                <div className="space-y-4">
                  <Gavel className="w-8 h-8 text-accent" />
                  <h4 className="text-xl font-bold font-serif-display">SLA Flexibility</h4>
                  <p className="text-muted leading-relaxed">
                    Dynamic service level adjustments that allow for operational pivoting without triggering immediate penalty clauses.
                  </p>
                </div>
              </div>

              <div className="rule-line-thin"></div>

              <div className="bg-foreground text-background p-8 relative overflow-hidden">
                <Quote className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
                <h3 className="text-2xl font-serif-display italic mb-4 text-white/90">Featured Insight</h3>
                <p className="text-lg leading-relaxed font-serif text-white/80 relative z-10">
                  "Most contracts fail not because they lack detail, but because they lack context for the specific volatility of the routes they govern."
                </p>
                <p className="mt-4 text-sm font-bold uppercase tracking-widest text-accent">Editorial — Q2 2024</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-8 loading-ink">
              <div className="relative">
                <BookOpen className="w-20 h-20 text-accent" />
                <div className="absolute inset-0 border-4 border-accent/20 rounded-full animate-ping"></div>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-serif-display italic mb-2">Analyzing Jurisprudence</h3>
                <p className="text-muted uppercase tracking-widest text-xs font-bold">Scanning Global Supply Chain Standards</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-8 border-2 border-red-200 bg-red-50 text-red-900 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-xl font-bold">Drafting Error</h3>
              </div>
              <p className="font-serif italic text-lg">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-6 text-sm font-bold uppercase tracking-widest underline decoration-red-900/30 underline-offset-4"
              >
                Reset Legal Engine
              </button>
            </div>
          )}

          {renderResult()}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-[0.3em] text-muted font-bold space-y-4 md:space-y-0">
          <div>&copy; 2024 ContractClause Editorial Group</div>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-accent transition-colors">Archive</a>
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
          </div>
          <div>Published in Virtual Space</div>
        </div>
      </footer>

      <style jsx global>{`
        ::selection {
          background: rgba(45, 74, 62, 0.2);
          color: inherit;
        }
      `}</style>
    </div>
  );
}
