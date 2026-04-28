'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  FileText, 
  Zap, 
  MapPin, 
  Activity, 
  ChevronRight, 
  Loader2, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

type Mode = 'hazard' | 'post-mortem';

export default function RiskLens() {
  const [mode, setMode] = useState<Mode>('hazard');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Form states for Hazard Mode
  const [venueType, setVenueType] = useState('');
  const [floors, setFloors] = useState('');
  const [areas, setAreas] = useState('');
  const [occupancy, setOccupancy] = useState('');
  const [knownHazards, setKnownHazards] = useState('');

  // Form states for Post-Mortem Mode
  const [incident, setIncident] = useState('');
  const [timeline, setTimeline] = useState('');
  const [whatWorked, setWhatWorked] = useState('');
  const [whatFailed, setWhatFailed] = useState('');
  const [teams, setTeams] = useState('');
  const [outcome, setOutcome] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    let prompt = '';
    if (mode === 'hazard') {
      prompt = `Venue Type: ${venueType}, Floors: ${floors}, Areas: ${areas}, Occupancy: ${occupancy}, Known Hazards: ${knownHazards}`;
    } else {
      prompt = `Incident: ${incident}, Timeline: ${timeline}, What Worked: ${whatWorked}, What Failed: ${whatFailed}, Teams Involved: ${teams}, Outcome: ${outcome}`;
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#f5f0e8]" />;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
        <div className="inline-flex items-center justify-center p-3 mb-4 clay-card bg-white">
          <ShieldAlert className="w-8 h-8 text-[#8b0000]" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-2 tracking-tight">RiskLens</h1>
        <p className="text-lg md:text-xl text-gray-600 font-ui italic">
          Map risks before. Learn from failures after.
        </p>
      </header>

      {/* Mode Switcher */}
      <div className="flex justify-center mb-12">
        <div className="clay-card p-1 flex space-x-1 bg-white/50">
          <button
            onClick={() => { setMode('hazard'); setResult(null); }}
            className={`px-6 py-2 rounded-full font-ui transition-all ${
              mode === 'hazard' 
                ? 'bg-[#8b0000] text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Hazard Analysis
          </button>
          <button
            onClick={() => { setMode('post-mortem'); setResult(null); }}
            className={`px-6 py-2 rounded-full font-ui transition-all ${
              mode === 'post-mortem' 
                ? 'bg-[#002366] text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Post-Mortem
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8">
        {/* Form Section */}
        {!result && (
          <section className="clay-card p-8 bg-white/80 backdrop-blur-sm animate-in fade-in slide-in-from-bottom duration-500">
            <h2 className="text-3xl mb-6 flex items-center gap-2">
              {mode === 'hazard' ? <MapPin className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
              {mode === 'hazard' ? 'Environmental Survey' : 'Incident Log'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'hazard' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-ui font-bold mb-2 text-gray-700">Venue Type</label>
                      <input 
                        className="w-full clay-input" 
                        placeholder="e.g. Luxury Hotel, Nightclub, Warehouse"
                        value={venueType}
                        onChange={(e) => setVenueType(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-ui font-bold mb-2 text-gray-700">Occupancy</label>
                      <input 
                        className="w-full clay-input" 
                        placeholder="e.g. 500 pax"
                        value={occupancy}
                        onChange={(e) => setOccupancy(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-ui font-bold mb-2 text-gray-700">Key Areas & Floor Count</label>
                    <textarea 
                      className="w-full clay-input min-h-[100px]" 
                      placeholder="e.g. 3 floors, Kitchen (L1), Pool (Roof), Ballroom (L2)"
                      value={areas}
                      onChange={(e) => setAreas(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-ui font-bold mb-2 text-gray-700">Known Hazards (Optional)</label>
                    <input 
                      className="w-full clay-input" 
                      placeholder="e.g. Aged electrical system, Slippery floor near pool"
                      value={knownHazards}
                      onChange={(e) => setKnownHazards(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-ui font-bold mb-2 text-gray-700">Incident Description</label>
                      <input 
                        className="w-full clay-input" 
                        placeholder="e.g. Kitchen fire due to grease trap"
                        value={incident}
                        onChange={(e) => setIncident(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-ui font-bold mb-2 text-gray-700">Teams Involved</label>
                      <input 
                        className="w-full clay-input" 
                        placeholder="e.g. Security, Maintenance, Local Fire Dept"
                        value={teams}
                        onChange={(e) => setTeams(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-ui font-bold mb-2 text-gray-700">Timeline of Events</label>
                    <textarea 
                      className="w-full clay-input min-h-[100px]" 
                      placeholder="18:30 Smoke detected. 18:35 Evacuation started. 18:45 Fire suppressed."
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-ui font-bold mb-2 text-gray-700">What Worked?</label>
                      <textarea 
                        className="w-full clay-input" 
                        placeholder="e.g. Sprinkler system, Staff training"
                        value={whatWorked}
                        onChange={(e) => setWhatWorked(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-ui font-bold mb-2 text-gray-700">What Failed?</label>
                      <textarea 
                        className="w-full clay-input" 
                        placeholder="e.g. PA system was quiet, Exit B blocked"
                        value={whatFailed}
                        onChange={(e) => setWhatFailed(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 text-xl flex items-center justify-center gap-3 clay-button text-white ${
                  mode === 'hazard' ? 'bg-[#8b0000]' : 'bg-[#002366]'
                } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Generate {mode === 'hazard' ? 'Risk Map' : 'Analysis Report'}
                    <Zap className="w-5 h-5 fill-current" />
                  </>
                )}
              </button>
            </form>
          </section>
        )}

        {/* Error State */}
        {error && (
          <div className="clay-card p-6 bg-red-50 border-red-200 text-red-800 flex items-center gap-4">
            <XCircle className="w-8 h-8 flex-shrink-0" />
            <div>
              <p className="font-bold">System Error</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-sm underline font-ui">Dismiss</button>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="flex justify-between items-end">
              <h2 className="text-4xl">Analysis Results</h2>
              <button 
                onClick={() => setResult(null)} 
                className="text-[#8b0000] font-ui font-bold hover:underline flex items-center gap-1"
              >
                New Analysis <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {result.type === 'hazard' ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {result.zones?.map((zone: any, i: number) => (
                    <div key={i} className="clay-card p-6 bg-white relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-2 h-full ${
                        zone.riskLevel === 'HIGH' ? 'bg-red-400' : 
                        zone.riskLevel === 'MEDIUM' ? 'bg-amber-400' : 'bg-green-400'
                      }`} />
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold">{zone.name}</h3>
                        <span className={`risk-tag ${
                          zone.riskLevel === 'HIGH' ? 'risk-high' : 
                          zone.riskLevel === 'MEDIUM' ? 'risk-medium' : 'risk-low'
                        }`}>
                          {zone.riskLevel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4 font-ui uppercase font-black tracking-widest">{zone.hazards}</p>
                      <p className="text-sm mb-6 leading-relaxed text-gray-700">{zone.explanation}</p>
                      <div className="editorial-rule" />
                      <div className="space-y-2">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Mitigations</p>
                        {zone.mitigations?.map((m: string, j: number) => (
                          <div key={j} className="flex items-start gap-2 text-sm italic">
                            <ChevronRight className="w-4 h-4 text-[#8b0000] flex-shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="clay-card p-8 bg-[#fdfaf5] border border-[#e5dfd3]">
                  <h3 className="text-2xl mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-[#8b0000]" />
                    Emergency Access Recommendations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {result.recommendations?.map((rec: string, i: number) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 font-bold shadow-sm border">
                          {i + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed italic">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="clay-card p-10 bg-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#002366]" />
                
                {/* Executive Summary */}
                <div className="mb-12">
                  <span className="text-xs font-black text-[#002366] uppercase tracking-[0.2em] mb-4 block">Executive Summary</span>
                  <p className="text-3xl md:text-4xl font-editorial italic leading-tight text-gray-800">
                    "{result.summary}"
                  </p>
                </div>

                <div className="editorial-rule" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                  {/* Timeline */}
                  <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-gray-500">
                      <Clock className="w-5 h-5" /> Timeline
                    </h3>
                    <div className="space-y-4">
                      {result.timeline?.map((item: string, i: number) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#002366] mt-2 flex-shrink-0" />
                          <p className="text-gray-700 italic">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Root Cause */}
                  <div className="bg-[#f8f9fb] p-6 rounded-2xl border border-blue-50">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-gray-500">
                      <Activity className="w-5 h-5" /> Root Cause (5-Why)
                    </h3>
                    <div className="space-y-4">
                      {result.rootCause?.map((item: string, i: number) => (
                        <div key={i} className="flex gap-4 items-start">
                          <span className="font-editorial text-blue-300 font-black text-2xl leading-none">Q.</span>
                          <p className="text-gray-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="editorial-rule" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* What Worked/Failed */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-5 h-5" /> Operational Successes
                      </h3>
                      <ul className="space-y-2">
                        {result.whatWorked?.map((item: string, i: number) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-500">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-700">
                        <AlertTriangle className="w-5 h-5" /> System Failures
                      </h3>
                      <ul className="space-y-2">
                        {result.whatFailed?.map((item: string, i: number) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-red-500">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Prevention Plan */}
                  <div className="clay-card p-6 bg-[#002366] text-white">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-300" /> Prevention Plan
                    </h3>
                    <div className="space-y-4">
                      {result.preventionPlan?.map((item: string, i: number) => (
                        <div key={i} className="flex gap-4 items-start border-b border-white/10 pb-3 last:border-0">
                          <span className="font-bold opacity-50">{i + 1}</span>
                          <p className="text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-400 font-ui text-xs uppercase tracking-widest pb-12">
        © 2026 RiskLens Intelligence Systems • Editorial Clay Fusion Protocol
      </footer>
    </main>
  );
}
