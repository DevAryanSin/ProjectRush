'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Zap, 
  AlertTriangle, 
  Target, 
  Eye, 
  ChevronRight, 
  Loader2,
  RefreshCw,
  Cpu
} from 'lucide-react';

export default function RedTeamPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    purpose: '',
    inputTypes: '',
    decisions: '',
    population: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const fullPrompt = `
      AI System Purpose: ${formData.purpose}
      Input Types: ${formData.inputTypes}
      Decisions it makes: ${formData.decisions}
      User Population: ${formData.population}
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
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseScenarios = (text: string) => {
    // Basic parser for scenario blocks
    const scenarios = text.split(/Scenario \d+:|### Scenario \d+:|\d+\.\s+\*\*Attack Name/gi).filter(s => s.trim().length > 20);
    return scenarios.map((s, i) => {
      const lines = s.split('\n').filter(l => l.trim() !== '');
      return {
        id: i,
        content: s.trim()
      };
    });
  };

  if (!mounted) return null;

  return (
    <div className="clay-container min-h-screen">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[30px] shadow-lg mb-6 clay-inner-shadow">
          <ShieldAlert size={40} className="text-[#ff6b6b]" />
        </div>
        <h1 className="text-5xl md:text-6xl mb-4 tracking-tight">RedTeamAI</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto font-semibold">
          Describe your AI system — generate adversarial bias attack scenarios
        </p>
      </header>

      {/* Main Content */}
      <main className="space-y-12">
        {/* Form Card */}
        <section className="clay-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block px-4 font-bold text-gray-700 flex items-center gap-2">
                  <Cpu size={18} className="text-[#ff6b6b]" /> System Purpose
                </label>
                <input
                  required
                  className="clay-input"
                  placeholder="e.g. Loan Approval Assistant"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block px-4 font-bold text-gray-700 flex items-center gap-2">
                  <Search size={18} className="text-[#ff6b6b]" /> Input Types
                </label>
                <input
                  required
                  className="clay-input"
                  placeholder="e.g. Credit score, Zip code, Income"
                  value={formData.inputTypes}
                  onChange={(e) => setFormData({ ...formData, inputTypes: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block px-4 font-bold text-gray-700 flex items-center gap-2">
                  <Zap size={18} className="text-[#ff6b6b]" /> Decisions Made
                </label>
                <input
                  required
                  className="clay-input"
                  placeholder="e.g. Interest rate, Approval status"
                  value={formData.decisions}
                  onChange={(e) => setFormData({ ...formData, decisions: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block px-4 font-bold text-gray-700 flex items-center gap-2">
                  <Target size={18} className="text-[#ff6b6b]" /> User Population
                </label>
                <input
                  required
                  className="clay-input"
                  placeholder="e.g. Small business owners in US"
                  value={formData.population}
                  onChange={(e) => setFormData({ ...formData, population: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="clay-button w-full md:w-auto mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Simulating Attacks...
                  </>
                ) : (
                  <>
                    <ShieldAlert />
                    Generate Attack Scenarios
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Error State */}
        {error && (
          <div className="clay-card border-red-200 bg-red-50 text-red-600 flex items-center gap-3">
            <AlertTriangle />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="clay-card h-40 animate-pulse bg-gray-100/50" />
            ))}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-3xl">Adversarial Scenarios</h2>
              <button 
                onClick={() => setResult(null)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <RefreshCw size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              {result.split('\n\n').filter(p => p.trim()).map((paragraph, idx) => (
                <div key={idx} className="clay-result-item group">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#ff6b6b] text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-md flex-shrink-0 group-hover:rotate-12 transition-transform">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="prose prose-slate max-w-none">
                        {paragraph.split('\n').map((line, lIdx) => {
                          if (line.includes('**')) {
                            const [label, ...rest] = line.split(':');
                            return (
                              <p key={lIdx} className="mb-2">
                                <span className="text-[#ff6b6b] font-black uppercase text-xs tracking-wider block mb-1">
                                  {label.replace(/\*/g, '')}
                                </span>
                                <span className="text-gray-700 font-semibold leading-relaxed">
                                  {rest.join(':').trim()}
                                </span>
                              </p>
                            );
                          }
                          return <p key={lIdx} className="text-gray-600 mb-2">{line}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center pb-12">
              <div className="inline-flex items-center gap-2 clay-badge">
                <Eye size={14} /> Red-Team Assessment Complete
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-12 text-gray-400 font-bold text-sm">
        <p>© 2026 RedTeamAI • Fairness via Adversarial Testing</p>
      </footer>
    </div>
  );
}
