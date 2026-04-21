'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Package, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight,
  RefreshCcw,
  Activity
} from 'lucide-react';

export default function ETAShield() {
  const [formData, setFormData] = useState({
    originalETA: '',
    disruptionType: '',
    severity: '3',
    location: '',
    cargo: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const prompt = `
      Original ETA: ${formData.originalETA}
      Disruption: ${formData.disruptionType}
      Severity (1-5): ${formData.severity}
      Current Location: ${formData.location}
      Cargo Criticality: ${formData.cargo}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.result);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen selection:bg-teal-100 selection:text-teal-900 pb-24">
      {/* Navigation / Header */}
      <nav className="fixed top-0 left-0 w-full px-8 py-6 flex justify-between items-center z-50 mix-blend-difference invert pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-foreground" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Resilient Logistics</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest font-bold">2024 System</div>
      </nav>

      <div className="max-w-[560px] mx-auto px-6 pt-32 lg:pt-40">
        {/* Hero Section */}
        <header className="mb-20">
          <div className="flex items-center gap-3 mb-4 text-accent">
            <Activity size={18} strokeWidth={2.5} />
            <span className="text-[11px] uppercase tracking-[0.3em] font-bold">Real-time Intelligence</span>
          </div>
          <h1 className="text-7xl md:text-8xl mb-6">ETA Shield.</h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed max-w-[480px]">
            Input shipment variables and disruption events to calculate resilient delivery windows and downstream impacts.
          </p>
        </header>

        {/* Input Form */}
        <section className="mb-24">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-8">
              <div className="group">
                <label className="minimal-label">Current Position</label>
                <div className="relative">
                  <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-accent" size={16} />
                  <input
                    type="text"
                    name="location"
                    required
                    placeholder="Terminal 4, Port of Singapore"
                    className="minimal-input pl-8"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="group">
                  <label className="minimal-label">Original ETA</label>
                  <div className="relative">
                    <Clock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-accent" size={16} />
                    <input
                      type="text"
                      name="originalETA"
                      required
                      placeholder="YYYY-MM-DD HH:MM"
                      className="minimal-input pl-8 text-sm"
                      value={formData.originalETA}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="minimal-label">Disruption Scope</label>
                  <div className="relative">
                    <AlertTriangle className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-amber-500" size={16} />
                    <input
                      type="text"
                      name="disruptionType"
                      required
                      placeholder="Vessel Delay / Storm"
                      className="minimal-input pl-8 text-sm"
                      value={formData.disruptionType}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="minimal-label">Cargo Criticality & Type</label>
                <div className="relative">
                  <Package className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-accent" size={16} />
                  <input
                    type="text"
                    name="cargo"
                    required
                    placeholder="Semiconductors - High Priority"
                    className="minimal-input pl-8"
                    value={formData.cargo}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="group">
                <label className="minimal-label">Severity Index: {formData.severity}</label>
                <input
                  type="range"
                  name="severity"
                  min="1"
                  max="5"
                  className="w-full h-[1px] bg-gray-200 appearance-none cursor-pointer accent-accent mt-6"
                  value={formData.severity}
                  onChange={handleInputChange}
                />
                <div className="flex justify-between text-[8px] uppercase tracking-tighter text-gray-400 mt-2 font-bold">
                  <span>Minor</span>
                  <span>Catastrophic</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                suppressHydrationWarning
                className="minimal-button group w-full flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <RefreshCcw className="animate-spin" size={18} />
                    <span className="uppercase tracking-widest text-[11px] font-bold">Recalculating Logic...</span>
                  </>
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-[11px] font-bold">Analyze Impact</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Loading Indicator */}
        {loading && (
          <div className="mb-20">
            <div className="loader-line" />
            <p className="text-[10px] uppercase text-gray-400 mt-4 tracking-widest text-center animate-pulse">Running Monte Carlo Simulations</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-20 p-6 border-l-2 border-red-500 bg-red-50 text-red-900 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className={`result-card visible mb-24`}>
            <div className="flex items-center gap-2 mb-10 text-accent">
              <ShieldCheck size={20} />
              <span className="text-[11px] uppercase tracking-[0.3em] font-bold">Generation Complete</span>
            </div>

            <div className="prose prose-sm max-w-none prose-h3:text-accent prose-h3:uppercase prose-h3:text-[11px] prose-h3:tracking-widest prose-h3:font-bold prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600">
              {result.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <br key={i} />;
                
                if (trimmed.startsWith('#') || trimmed.includes(':') && trimmed.length < 40) {
                  return (
                    <h3 key={i} className="mt-10 first:mt-0 mb-4 border-b border-gray-100 pb-2">
                      {trimmed.replace(/[#*:]/g, '')}
                    </h3>
                  );
                }
                
                if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                  return (
                    <div key={i} className="flex gap-3 mb-2 items-start">
                      <ChevronRight size={14} className="mt-1 text-accent flex-shrink-0" />
                      <span>{trimmed.substring(1).trim()}</span>
                    </div>
                  );
                }

                return <p key={i} className="mb-4">{trimmed}</p>;
              })}
            </div>

            <div className="mt-12 pt-12 border-t border-gray-100 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-full text-amber-600">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Communication Draft</p>
                  <p className="text-xs text-gray-500">Ready for stakeholder distribution</p>
                </div>
              </div>
              <button 
                onClick={() => window.print()}
                className="text-[10px] uppercase tracking-widest font-bold text-foreground hover:text-accent transition-colors border-b border-foreground hover:border-accent pb-1"
              >
                Export PDF
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="pt-12 border-t border-gray-100 flex justify-between items-center opacity-40">
          <p className="text-[8px] uppercase tracking-widest font-bold">Ref: P3-S4-MIN</p>
          <div className="flex gap-6">
            <span className="text-[8px] uppercase tracking-widest font-bold">Privacy</span>
            <span className="text-[8px] uppercase tracking-widest font-bold">Logistics Cloud</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
