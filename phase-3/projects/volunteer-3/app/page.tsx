'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Target, 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Loader2,
  ChevronRight,
  ClipboardList,
  Sparkles,
  MapPin,
  Clock,
  Briefcase
} from 'lucide-react';

export default function ActionBridge() {
  const [mode, setMode] = useState<'gaps' | 'plan'>('gaps');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        body: JSON.stringify({ prompt: input, mode }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 font-source-serif">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-16 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-serif-display text-primary mb-4 tracking-tight">
          ActionBridge
        </h1>
        <p className="text-xl md:text-2xl text-accent font-ui font-semibold tracking-wide uppercase">
          Find the gaps. Build the action.
        </p>
        <div className="editorial-hr w-24 mx-auto" />
      </header>

      <main className="max-w-5xl mx-auto">
        {/* Mode Switcher */}
        <div className="flex justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="clay-card p-2 flex gap-2 bg-white/50 backdrop-blur-sm">
            <button
              onClick={() => setMode('gaps')}
              className={`px-8 py-3 rounded-[20px] font-ui font-bold transition-all duration-300 ${
                mode === 'gaps' 
                ? 'clay-button scale-105 z-10' 
                : 'text-charcoal/60 hover:bg-black/5'
              }`}
            >
              Skill Gaps
            </button>
            <button
              onClick={() => setMode('plan')}
              className={`px-8 py-3 rounded-[20px] font-ui font-bold transition-all duration-300 ${
                mode === 'plan' 
                ? 'clay-button scale-105 z-10' 
                : 'text-charcoal/60 hover:bg-black/5'
              }`}
            >
              Event Plan
            </button>
          </div>
        </div>

        {/* Input Form */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSubmit} className="clay-card p-8 md:p-12 mb-16 bg-white">
            <label className="block mb-6">
              <span className="font-serif-display text-2xl text-primary block mb-3">
                {mode === 'gaps' ? 'Describe your current projects & team skills' : 'Outline your community initiative needs'}
              </span>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'gaps' 
                  ? "Example: We have a reforestation project starting next month. Our current team is strong in field work but weak in digital logistics and donor communication..."
                  : "Example: Organizing a local health screening camp for elderly residents in North District. Expected attendance: 100 people. Budget: $2000..."
                }
                className="w-full h-48 p-6 clay-input text-lg font-source-serif resize-none"
                required
              />
            </label>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="clay-button px-10 py-4 flex items-center gap-3 text-xl font-ui font-bold disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Strategy</span>
                    <ArrowRight size={24} />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Error State */}
        {error && (
          <div className="clay-card p-8 bg-red-50 border-red-200 mb-12 animate-fade-in">
            <div className="flex items-center gap-4 text-red-700">
              <AlertCircle size={32} />
              <p className="text-xl font-ui font-bold">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="animate-fade-in space-y-12">
            <div className="editorial-hr" />
            
            {mode === 'gaps' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {result.gaps?.map((gap: any, i: number) => (
                  <div key={i} className="clay-card p-8 bg-white hover:translate-y-[-4px] transition-transform duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div className="bg-teal-50 p-4 rounded-2xl">
                        <Target className="text-primary" size={32} />
                      </div>
                      <span className="font-ui font-black text-accent uppercase tracking-tighter text-sm bg-accent/10 px-3 py-1 rounded-full">
                        Criticality: {gap.criticality}
                      </span>
                    </div>
                    <h3 className="text-3xl font-serif-display text-primary mb-4 leading-tight">
                      {gap.skill}
                    </h3>
                    <p className="text-lg mb-6 leading-relaxed text-charcoal/80 italic">
                      "{gap.impact}"
                    </p>
                    <div className="space-y-6">
                      <div className="bg-orange-50/50 p-6 rounded-2xl border border-accent/10">
                        <h4 className="font-ui font-bold text-accent mb-2 flex items-center gap-2">
                          <Users size={18} /> Recruitment Brief
                        </h4>
                        <p className="text-base font-source-serif leading-relaxed">
                          {gap.brief}
                        </p>
                      </div>
                      <div className="bg-teal-50/30 p-6 rounded-2xl border border-primary/10">
                        <h4 className="font-ui font-bold text-primary mb-2 flex items-center gap-2">
                          <Sparkles size={18} /> Interim Workaround
                        </h4>
                        <p className="text-base font-source-serif leading-relaxed">
                          {gap.workaround}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-12 max-w-4xl mx-auto">
                {/* Event Hero */}
                <div className="clay-card p-12 bg-white text-center">
                  <div className="inline-block bg-accent/10 p-4 rounded-full mb-6">
                    <Calendar className="text-accent" size={48} />
                  </div>
                  <h2 className="text-5xl font-serif-display text-primary mb-4">{result.name}</h2>
                  <p className="text-2xl italic font-source-serif text-charcoal/70 mb-8 max-w-2xl mx-auto">
                    {result.concept}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-editorial-rule pt-8">
                    <div className="text-center">
                      <p className="font-ui font-bold text-accent uppercase text-xs mb-1">Status</p>
                      <p className="font-serif-display text-lg">Execution Ready</p>
                    </div>
                    <div className="text-center">
                      <p className="font-ui font-bold text-accent uppercase text-xs mb-1">Format</p>
                      <p className="font-serif-display text-lg">Structured Plan</p>
                    </div>
                    <div className="text-center">
                      <p className="font-ui font-bold text-accent uppercase text-xs mb-1">Type</p>
                      <p className="font-serif-display text-lg">Community Impact</p>
                    </div>
                    <div className="text-center">
                      <p className="font-ui font-bold text-accent uppercase text-xs mb-1">Priority</p>
                      <p className="font-serif-display text-lg">Strategic</p>
                    </div>
                  </div>
                </div>

                {/* Schedule & Roles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="clay-card p-8 bg-white">
                    <h3 className="text-3xl font-serif-display text-primary mb-6 flex items-center gap-3">
                      <Clock className="text-accent" /> Timeline
                    </h3>
                    <div className="space-y-6">
                      {result.schedule?.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4 relative">
                          {i !== result.schedule.length - 1 && (
                            <div className="absolute left-3 top-8 bottom-[-24px] w-[2px] bg-editorial-rule" />
                          )}
                          <div className="w-6 h-6 rounded-full bg-primary shrink-0 z-10 mt-1 shadow-sm" />
                          <div>
                            <p className="font-ui font-black text-primary text-sm uppercase">{item.time}</p>
                            <p className="text-lg leading-snug">{item.activity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="clay-card p-8 bg-white">
                    <h3 className="text-3xl font-serif-display text-primary mb-6 flex items-center gap-3">
                      <Users className="text-accent" /> Team Roles
                    </h3>
                    <div className="space-y-4">
                      {result.roles?.map((role: any, i: number) => (
                        <div key={i} className="p-4 rounded-2xl bg-teal-50/50 border border-primary/10">
                          <p className="font-ui font-bold text-primary mb-1">{role.role}</p>
                          <p className="text-base text-charcoal/80 leading-relaxed">{role.assignment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Materials & Communication */}
                <div className="clay-card p-10 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <h3 className="text-3xl font-serif-display text-primary mb-6 flex items-center gap-3">
                        <ClipboardList className="text-accent" /> Resource List
                      </h3>
                      <ul className="space-y-3">
                        {result.materials?.map((item: string, i: number) => (
                          <li key={i} className="flex items-center gap-3 text-lg">
                            <CheckCircle2 className="text-primary" size={20} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-3xl font-serif-display text-primary mb-6 flex items-center gap-3">
                        <Target className="text-accent" /> Success Metrics
                      </h3>
                      <ul className="space-y-3">
                        {result.metrics?.map((metric: string, i: number) => (
                          <li key={i} className="flex items-center gap-3 text-lg">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <span>{metric}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8 pt-8 border-t border-editorial-rule">
                        <h4 className="font-ui font-bold text-primary mb-2">Comms Strategy</h4>
                        <p className="text-base leading-relaxed italic text-charcoal/70">
                          {result.communication}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-24 pb-12 text-center">
        <div className="editorial-hr" />
        <p className="font-ui text-charcoal/40 font-bold uppercase tracking-[0.2em] text-sm">
          ActionBridge © 2026 • Strategy Layer • Execution Engine
        </p>
      </footer>
    </div>
  );
}
