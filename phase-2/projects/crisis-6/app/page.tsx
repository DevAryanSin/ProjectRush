'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Layers, 
  Users, 
  AlertTriangle, 
  Loader2, 
  ChevronRight,
  PlusCircle,
  Building2,
  Navigation
} from 'lucide-react';

export default function HazardMap() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    venueType: '',
    floors: '',
    keyAreas: '',
    occupancy: '',
    knownHazards: ''
  });

  useEffect(() => {
    setMounted(true);
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

    const prompt = `
      Venue Type: ${formData.venueType}
      Number of Floors: ${formData.floors}
      Key Areas: ${formData.keyAreas}
      Occupancy: ${formData.occupancy}
      Known Hazards: ${formData.knownHazards}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
        <div className="inline-flex items-center justify-center p-4 mb-4 clay-card bg-white/90">
          <ShieldAlert className="w-12 h-12 text-[#38bdf8] mr-3" />
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[#1e293b]">
            HazardMap
          </h1>
        </div>
        <p className="text-lg md:text-xl text-slate-600 font-medium">
          Describe your venue layout — identify hidden hazard zones automatically
        </p>
      </header>

      <div className="w-full max-w-4xl grid grid-cols-1 gap-8">
        {/* Form Section */}
        <section className="clay-card p-6 md:p-10 bg-white/90">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-bold text-slate-700 ml-2">
                  <Building2 className="w-4 h-4 mr-2 text-[#38bdf8]" />
                  Venue Type
                </label>
                <input
                  required
                  name="venueType"
                  value={formData.venueType}
                  onChange={handleInputChange}
                  placeholder="e.g. Luxury Resort, Urban Hotel"
                  className="w-full clay-input"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-bold text-slate-700 ml-2">
                  <Layers className="w-4 h-4 mr-2 text-[#38bdf8]" />
                  Number of Floors
                </label>
                <input
                  required
                  type="number"
                  name="floors"
                  value={formData.floors}
                  onChange={handleInputChange}
                  placeholder="e.g. 12"
                  className="w-full clay-input"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-bold text-slate-700 ml-2">
                  <Users className="w-4 h-4 mr-2 text-[#38bdf8]" />
                  Max Occupancy
                </label>
                <input
                  required
                  type="number"
                  name="occupancy"
                  value={formData.occupancy}
                  onChange={handleInputChange}
                  placeholder="e.g. 500"
                  className="w-full clay-input"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-bold text-slate-700 ml-2">
                  <MapPin className="w-4 h-4 mr-2 text-[#38bdf8]" />
                  Key Areas
                </label>
                <input
                  required
                  name="keyAreas"
                  value={formData.keyAreas}
                  onChange={handleInputChange}
                  placeholder="Lobby, Kitchen, Pool, etc."
                  className="w-full clay-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-bold text-slate-700 ml-2">
                <AlertTriangle className="w-4 h-4 mr-2 text-[#fca5a5]" />
                Any Known Hazards or Specific Concerns
              </label>
              <textarea
                name="knownHazards"
                value={formData.knownHazards}
                onChange={handleInputChange}
                placeholder="e.g. Aging electrical in wing B, slippery deck near pool"
                rows={3}
                className="w-full clay-input resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full clay-button py-4 text-xl font-display font-bold flex items-center justify-center disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Analyzing Layout...
                </>
              ) : (
                <>
                  Generate Hazard Analysis
                  <ChevronRight className="w-6 h-6 ml-2" />
                </>
              )}
            </button>
          </form>
        </section>

        {/* Results Section */}
        {(result || error) && (
          <section className="clay-card p-6 md:p-10 bg-white/95 animate-in fade-in zoom-in duration-500">
            {error ? (
              <div className="flex items-center p-6 bg-red-50 text-red-700 rounded-3xl border-2 border-red-100">
                <AlertTriangle className="w-8 h-8 mr-4 shrink-0" />
                <p className="font-bold">{error}</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b-4 border-slate-100 pb-6">
                  <h2 className="text-3xl font-display font-bold text-[#1e293b] flex items-center">
                    <Navigation className="w-8 h-8 mr-3 text-[#38bdf8]" />
                    Hazard Zone Analysis
                  </h2>
                </div>

                <div className="prose prose-slate max-w-none">
                  {result?.split('\n').map((line, i) => {
                    if (line.includes('HIGH') || line.includes('HIGH RISK')) {
                      return (
                        <div key={i} className="my-4 p-4 clay-pill clay-badge-high inline-block mr-2">
                          {line}
                        </div>
                      );
                    }
                    if (line.includes('MEDIUM')) {
                      return (
                        <div key={i} className="my-4 p-4 clay-pill clay-badge-medium inline-block mr-2">
                          {line}
                        </div>
                      );
                    }
                    if (line.includes('LOW')) {
                      return (
                        <div key={i} className="my-4 p-4 clay-pill clay-badge-low inline-block mr-2">
                          {line}
                        </div>
                      );
                    }
                    if (line.startsWith('###') || line.startsWith('**')) {
                      return <h3 key={i} className="text-xl font-display font-bold text-[#1e293b] mt-6 mb-3">{line.replace(/[#*]/g, '')}</h3>;
                    }
                    return line.trim() ? <p key={i} className="text-slate-600 leading-relaxed mb-2 font-medium">{line}</p> : <br key={i} />;
                  })}
                </div>

                <div className="mt-8 p-6 clay-card bg-sky-50/50 border-[#38bdf8]/20">
                  <div className="flex items-center mb-4">
                    <PlusCircle className="w-6 h-6 text-[#38bdf8] mr-2" />
                    <h4 className="font-display font-bold text-lg text-slate-800">Safety Tip</h4>
                  </div>
                  <p className="text-slate-600 text-sm italic">
                    This analysis is AI-generated based on provided layouts. Always conduct manual site inspections to verify safety compliance.
                  </p>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <footer className="mt-12 text-slate-400 text-sm font-medium">
        &copy; {new Date().getFullYear()} HazardMap Hospitality Systems. All Rights Reserved.
      </footer>
    </main>
  );
}
