'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Users, 
  Eye, 
  Send, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert,
  Info
} from 'lucide-react';

export default function GuestSOS() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  // Form states
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [hazards, setHazards] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const prompt = `
      Emergency Type: ${emergencyType}
      Location: ${location}
      Number of People: ${peopleCount}
      Visible Dangers: ${hazards}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const parseResult = (text: string) => {
    // Basic parsing logic to separate sections based on common Gemini response patterns
    // (1) 5 immediate actions, (2) 3 things NOT to do, (3) closing
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    return (
      <div className="space-y-6">
        <div className="glass-card p-6 border-l-4 border-l-primary">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-primary" />
            Immediate Safety Steps
          </h3>
          <ul className="space-y-3">
            {lines.slice(0, 5).map((line, i) => (
              <li key={i} className="flex gap-3 text-white/90">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                {line.replace(/^\d+\.\s*/, '')}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-pink-500">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <XCircle className="text-pink-500" />
            What NOT To Do
          </h3>
          <ul className="space-y-3">
            {lines.slice(5, 8).map((line, i) => (
              <li key={i} className="flex gap-3 text-white/90">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center text-sm font-bold">
                  ✕
                </span>
                {line.replace(/^[-\d.]+\s*/, '').replace(/^✕\s*/, '')}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6 bg-accent/10 border-accent/20">
          <p className="text-lg italic text-accent-foreground text-center">
            {lines[lines.length - 1]}
          </p>
        </div>
      </div>
    );
  };

  return (
    <main className="relative min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Aurora Background */}
      <div className="aurora-container">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
      </div>

      <div className="w-full max-w-3xl z-10">
        {/* Header */}
        <header className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-block p-2 px-4 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Emergency Support System</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-tight">
            Guest<span className="gradient-text">SOS</span>
          </h1>
          <p className="text-xl text-muted max-w-xl mx-auto leading-relaxed">
            Guest describes emergency — get immediate calm guidance in plain language
          </p>
        </header>

        {/* Main Content */}
        <div className="grid gap-8">
          {/* Input Section */}
          <section className="glass-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted flex items-center gap-2">
                    <AlertTriangle size={16} /> What is the emergency?
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., Small kitchen fire, Medical collapse"
                    className="w-full p-4 glass-input"
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted flex items-center gap-2">
                    <MapPin size={16} /> Your exact location?
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., Room 402, Lobby East"
                    className="w-full p-4 glass-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted flex items-center gap-2">
                    <Users size={16} /> Number of people involved?
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., 2 adults, 1 child"
                    className="w-full p-4 glass-input"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted flex items-center gap-2">
                    <Eye size={16} /> Any immediate dangers visible?
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., Heavy smoke, Loose wires"
                    className="w-full p-4 glass-input"
                    value={hazards}
                    onChange={(e) => setHazards(e.target.value)}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full gradient-border-btn mt-4 group"
              >
                <div className="gradient-border-btn-inner font-bold text-lg py-4">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" /> Analyzing Situation...
                    </>
                  ) : (
                    <>
                      <ShieldAlert size={20} className="group-hover:scale-110 transition-transform" />
                      Get Emergency Instructions
                    </>
                  )}
                </div>
              </button>
            </form>
          </section>

          {/* Error Message */}
          {error && (
            <div className="glass-card p-4 border-red-500/50 bg-red-500/10 flex items-center gap-3 text-red-200">
              <AlertTriangle size={20} />
              <p>{error}</p>
            </div>
          )}

          {/* Results Section */}
          {(loading || result) && (
            <section id="result" className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Info className="text-primary" /> Immediate Action Plan
                </h2>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
              </div>

              {loading ? (
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <Loader2 size={48} className="animate-spin text-primary" />
                    <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
                  </div>
                  <p className="text-xl font-medium text-white/80">Generating safety steps...</p>
                  <p className="text-sm text-muted">Stay calm. Help is being coordinated.</p>
                </div>
              ) : (
                result && parseResult(result)
              )}
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-white/5 text-center">
          <p className="text-sm text-muted">
            GuestSOS &copy; {new Date().getFullYear()} &bull; Professional Crisis Coordination for Hospitality
          </p>
        </footer>
      </div>
    </main>
  );
}
