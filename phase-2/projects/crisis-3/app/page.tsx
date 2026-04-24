'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, MapPin, Users, AlertTriangle, Send, Loader2, Info } from 'lucide-react';

export default function GuestSOSPage() {
  const [mounted, setMounted] = useState(false);
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [dangers, setDangers] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    if (!emergencyType || !location) {
      setError('Emergency type and location are required fields.');
      setLoading(false);
      return;
    }

    const prompt = `Emergency Type: ${emergencyType}\nLocation: ${location}\nNumber of People: ${peopleCount || 'Not specified'}\nImmediate Dangers Visible: ${dangers || 'None reported'}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text: string) => {
    const blocks = text.split('\n\n').filter((b) => b.trim());
    return (
      <div className="space-y-6 text-gray-200 leading-relaxed text-lg">
        {blocks.map((block, idx) => {
          if (block.match(/^\d+\./) || block.match(/^\*/)) {
            const items = block.split('\n').map(i => i.trim()).filter(Boolean);
            return (
              <ul key={idx} className="space-y-3">
                {items.map((item, i) => {
                  const isNegative = item.match(/don't/i) || item.match(/do not/i) || item.match(/avoid/i) || item.match(/not/i);
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-2">
                        {isNegative ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
                        )}
                      </span>
                      <span>{item.replace(/^\d+\.\s*/, '').replace(/^\*\s*/, '')}</span>
                    </li>
                  );
                })}
              </ul>
            );
          }
          
          if (block.includes('NOT') || block.toLowerCase().includes("don't") || block.toLowerCase().includes("avoid")) {
            return <div key={idx} className="p-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 shadow-inner">{block}</div>;
          }
          
          if (idx === blocks.length - 1) {
            return <div key={idx} className="p-5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-100 font-medium italic shadow-[0_0_20px_rgba(45,212,191,0.05)] text-center text-xl">{block}</div>;
          }

          return <p key={idx} className="text-gray-100 font-medium">{block}</p>;
        })}
      </div>
    );
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen relative flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-teal-500/30">
      <div className="aurora-container">
        <div className="aurora-orb aurora-orb-1"></div>
        <div className="aurora-orb aurora-orb-2"></div>
        <div className="aurora-orb aurora-orb-3"></div>
        <div className="aurora-orb aurora-orb-4"></div>
      </div>

      <div className="w-full max-w-3xl space-y-8 z-10 relative">
        <header className="text-center space-y-4 pt-8 pb-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-4 shadow-[0_0_30px_rgba(0,212,170,0.3)] relative group">
            <div className="absolute inset-0 rounded-full bg-teal-400/20 animate-ping opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <ShieldAlert className="w-10 h-10 text-teal-400 relative z-10" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl">
            Guest<span className="text-gradient">SOS</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto">
            Guest describes emergency &mdash; get immediate calm guidance in plain language
          </p>
        </header>

        <div className="glass-card p-6 md:p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-150 duration-700"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-200 gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Emergency Type *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fire, Medical, Intruder"
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  className="glass-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-200 gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  Your Location in Venue *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lobby, Room 402, Pool"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="glass-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-200 gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Number of People
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                  className="glass-input"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-200 gap-2">
                  <Info className="w-4 h-4 text-amber-400" />
                  Immediate Dangers Visible
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smoke blocking hallway"
                  value={dangers}
                  onChange={(e) => setDangers(e.target.value)}
                  className="glass-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-8 text-lg py-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Safety Instructions...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Get Immediate Instructions
                </>
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 flex items-start gap-3 shadow-lg shadow-red-500/5">
            <AlertTriangle className="w-6 h-6 shrink-0 text-red-400" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {result && (
          <div className="glass-card p-6 md:p-10 animate-in zoom-in-95 fade-in duration-500 relative overflow-hidden shadow-[0_0_40px_rgba(0,212,170,0.15)] border-t border-t-teal-500/30 mt-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500"></div>
            <h2 className="text-3xl font-extrabold text-white mb-8 flex items-center gap-3 tracking-tight">
              <ShieldAlert className="w-8 h-8 text-teal-400" />
              Immediate Safety Instructions
            </h2>
            {parseResult(result)}
          </div>
        )}
      </div>
    </main>
  );
}
