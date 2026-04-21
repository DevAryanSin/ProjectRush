'use client';

import React, { useState } from 'react';
import { ArrowRight, Loader2, Info, Scale, ShieldCheck, HelpCircle } from 'lucide-react';

export default function DecisionTrace() {
  const [decision, setDecision] = useState('');
  const [factors, setFactors] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const fullPrompt = `Decision: ${decision}\nFactors: ${factors}\nDomain: ${domain}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.result);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet.');
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text: string) => {
    return text.split('\n').filter(line => line.trim() !== '').map((line, i) => {
      const isHeader = line.match(/^(\d+\.|\*|#)/);
      return (
        <p key={i} className={`${isHeader ? 'font-semibold mt-6 mb-2 text-foreground' : 'text-muted-foreground'} leading-relaxed`}>
          {line.replace(/^(\d+\.|\*|#+)\s*/, '')}
        </p>
      );
    });
  };

  return (
    <main className="min-h-screen bg-white text-foreground px-6 py-20 md:py-32">
      <div className="max-w-[600px] mx-auto stagger-in">
        <header className="mb-20">
          <h1 className="text-6xl md:text-7xl mb-4 text-accent">DecisionTrace</h1>
          <p className="text-xl text-muted-foreground font-light tracking-tight">
            Algorithmic accountability for the automated age.
          </p>
        </header>

        <section className="mb-24">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-1 delay-1">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">The Decision</label>
              <input
                type="text"
                className="minimal-input text-lg"
                placeholder="e.g. Loan Application Denied"
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1 delay-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Context / Factors</label>
              <textarea
                className="minimal-input text-lg min-h-[80px] resize-none"
                placeholder="e.g. Credit score 620, Debt-to-income 45%, Employment 2 years"
                value={factors}
                onChange={(e) => setFactors(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1 delay-3">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Domain</label>
              <select
                className="minimal-input text-lg appearance-none cursor-pointer"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
              >
                <option value="" disabled>Select a domain</option>
                <option value="Financial / Loans">Financial / Loans</option>
                <option value="Employment / Hiring">Employment / Hiring</option>
                <option value="Healthcare / Medical">Healthcare / Medical</option>
                <option value="Education / Admissions">Education / Admissions</option>
                <option value="Legal / Criminal Justice">Legal / Criminal Justice</option>
              </select>
            </div>

            <div className="pt-8 delay-4">
              <button
                type="submit"
                disabled={loading}
                suppressHydrationWarning
                className="group flex items-center gap-4 text-accent font-semibold text-lg hover:gap-6 transition-all duration-300 disabled:opacity-50 disabled:gap-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing Logic...</span>
                  </>
                ) : (
                  <>
                    <span>Trace Decision</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {(result || error || loading) && (
          <section className="pt-20 border-t border-border stagger-in">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-sm text-sm border border-red-100">
                {error}
              </div>
            )}

            {loading && (
              <div className="space-y-8 animate-pulse">
                <div className="h-4 bg-muted w-3/4 rounded-full" />
                <div className="h-4 bg-muted w-full rounded-full" />
                <div className="h-4 bg-muted w-5/6 rounded-full" />
              </div>
            )}

            {result && (
              <div className="delay-1">
                <h2 className="text-4xl mb-8">Trace Analysis</h2>
                <div className="space-y-2">
                  {parseResult(result)}
                </div>
                
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 py-12 border-t border-border">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-accent">
                      <Scale className="w-4 h-4" />
                      <span className="text-xs uppercase font-bold tracking-tighter">Your Rights</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You have the right to request a manual review of automated decisions under most data protection regulations.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-accent">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs uppercase font-bold tracking-tighter">Accountability</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This analysis is powered by DecisionTrace to ensure algorithmic transparency and fairness.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        <footer className="mt-40 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 hover:opacity-100 transition-opacity duration-700">
          <span className="text-xs tracking-widest uppercase">© 2026 DecisionTrace</span>
          <div className="flex gap-8 text-xs tracking-widest uppercase">
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">Ethic Guidelines</a>
            <a href="#" className="hover:text-accent transition-colors">API</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
