'use client';

import React, { useState } from 'react';
import { 
  Radar, 
  MapPin, 
  Package, 
  Calendar, 
  Truck, 
  AlertTriangle, 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  ArrowRight,
  Plane,
  Ship,
  TrainFront,
  LocateFixed,
  Info
} from 'lucide-react';

interface DisruptionResult {
  score: number;
  factors: { factor: string; score: number }[];
  categories: { name: string; level: string }[];
  mitigations: string[];
  summary: string;
}

export default function DisruptRadar() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DisruptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const origin = formData.get('origin');
    const destination = formData.get('destination');
    const cargo = formData.get('cargo');
    const date = formData.get('date');
    const mode = formData.get('mode');

    const prompt = `You are a supply chain disruption analyst AI. Analyze this shipment route:
    Origin: ${origin}
    Destination: ${destination}
    Cargo: ${cargo}
    Departure Date: ${date}
    Transport Mode: ${mode}

    Provide: overall disruption risk score (0-100%), top 3 risk factors with individual scores (0-10), 
    risk categories (weather/geopolitical/infrastructure/demand) with levels (Low/Medium/High/Critical), 
    and 2-3 specific mitigation recommendations. Also provide a brief 2-sentence summary.
    
    CRITICAL: Format your response as a valid JSON object only, with this exact structure:
    {
      "score": number,
      "factors": [{"factor": "name", "score": number}],
      "categories": [{"name": "category", "level": "level"}],
      "mitigations": ["string"],
      "summary": "string"
    }`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Clean the response if it includes markdown fences
      const cleanResult = data.result.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanResult);
      setResult(parsed);
    } catch (err) {
      console.error('Failed to analyze:', err);
      setError('Analysis failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-teal-400';
    if (score < 70) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-24 cyber-grid">
      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-teal-500/20 rounded-lg border border-teal-500/30">
              <Radar className="w-8 h-8 text-teal-400 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
              Disrupt<span className="text-teal-400">Radar</span>
            </h1>
          </div>
          <p className="text-zinc-400 max-w-lg font-medium">
            Input your shipment route — get a disruption risk score before it happens
          </p>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-1">System Status</span>
          <div className="flex items-center gap-2 text-teal-400 font-mono text-sm">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            OPERATIONAL [v2.5-FLASH]
          </div>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="bento-grid">
        {/* Main Input Card (2x2) */}
        <div className="bento-card col-span-1 md:col-span-2 row-span-2 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <LocateFixed className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-bold">Route Analytics</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-zinc-500 tracking-wider">Origin</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input required name="origin" placeholder="e.g. Shanghai" className="glass-input pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-zinc-500 tracking-wider">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input required name="destination" placeholder="e.g. Rotterdam" className="glass-input pl-10" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-zinc-500 tracking-wider">Cargo Type</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input required name="cargo" placeholder="e.g. Semi-conductors" className="glass-input pl-10" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-zinc-500 tracking-wider">Departure</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input required name="date" type="date" className="glass-input pl-10 [color-scheme:dark]" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-zinc-500 tracking-wider">Mode</label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <select name="mode" className="glass-input pl-10 appearance-none cursor-pointer">
                    <option value="sea">Ocean Freight</option>
                    <option value="air">Air Cargo</option>
                    <option value="rail">Rail Network</option>
                    <option value="road">Road Freight</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-grow flex items-end pt-4">
              <button 
                type="submit" 
                disabled={loading}
                suppressHydrationWarning
                className="btn-primary w-full flex items-center justify-center gap-2 group"
              >
                {loading ? 'Analyzing Data...' : 'Analyze Risk Profile'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>

        {/* Risk Score Card (1x1) */}
        <div className={`bento-card flex flex-col justify-center items-center text-center ${loading ? 'shimmer' : ''}`}>
          <h3 className="text-xs font-bold text-zinc-500 mb-2">Disruption Risk</h3>
          {result ? (
            <div className={`text-6xl font-bold font-mono tracking-tighter ${getScoreColor(result.score)}`}>
              {result.score}%
            </div>
          ) : (
            <AlertTriangle className="w-12 h-12 text-zinc-800 mb-2" />
          )}
          <span className="text-[10px] text-zinc-500 mt-2 font-mono uppercase tracking-widest">Composite Index</span>
        </div>

        {/* Transport Preview (1x1) */}
        <div className={`bento-card flex flex-col justify-center items-center text-center bento-card-amber ${loading ? 'shimmer' : ''}`}>
          <h3 className="text-xs font-bold text-zinc-500 mb-2">Network Load</h3>
          <div className="flex items-center gap-2 mb-1">
             <BarChart3 className="w-8 h-8 text-amber-500 opacity-50" />
          </div>
          <span className="text-2xl font-bold text-amber-500">OPTIMAL</span>
          <span className="text-[10px] text-zinc-500 mt-2 font-mono uppercase tracking-widest">Global Traffic</span>
        </div>

        {/* Top Risk Factors (2x1) */}
        <div className={`bento-card col-span-1 md:col-span-2 ${loading ? 'shimmer' : ''}`}>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Top Risk Factors</h3>
          </div>
          <div className="space-y-4">
            {result ? (
              result.factors.map((f, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300">{f.factor}</span>
                    <span className="text-teal-400">{(f.score * 10).toFixed(0)}% Impact</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 transition-all duration-1000" 
                      style={{ width: `${f.score * 10}%` }} 
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-700 py-4 italic text-sm">
                Awaiting input data...
              </div>
            )}
          </div>
        </div>

        {/* Categories (1x2) */}
        <div className={`bento-card row-span-2 ${loading ? 'shimmer' : ''}`}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Categories</h3>
          </div>
          <div className="space-y-6">
            {result ? (
              result.categories.map((c, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">{c.name}</span>
                  <span className={`text-lg font-bold ${
                    c.level === 'Critical' ? 'text-rose-500' : 
                    c.level === 'High' ? 'text-rose-300' :
                    c.level === 'Medium' ? 'text-amber-400' : 'text-teal-400'
                  }`}>{c.level}</span>
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map((_, i) => (
                <div key={i} className="h-8 bg-zinc-800/20 rounded animate-pulse" />
              ))
            )}
          </div>
        </div>

        {/* Global Impact (1x1) */}
        <div className="bento-card flex flex-col items-center justify-center text-center border-dashed">
          <Info className="w-5 h-5 text-zinc-500 mb-2" />
          <span className="text-xs text-zinc-400 font-medium">No disruptions recorded in last 24h</span>
        </div>

        {/* Mitigations (2x1) */}
        <div className={`bento-card col-span-1 md:col-span-2 ${loading ? 'shimmer' : ''}`}>
           <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Mitigation Recommendations</h3>
          </div>
          <div className="space-y-3">
            {result ? (
              result.mitigations.map((m, i) => (
                <div key={i} className="flex gap-3 items-start group">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                  <p className="text-sm text-zinc-300 group-hover:text-white transition-colors">{m}</p>
                </div>
              ))
            ) : (
              <div className="text-zinc-700 italic text-sm text-center py-4">
                Execute analysis to generate strategies
              </div>
            )}
          </div>
        </div>

        {/* Summary (Full Width - 4x1 or overflow) */}
        <div className={`bento-card col-span-1 md:col-span-3 ${loading ? 'shimmer' : ''} bg-gradient-to-r from-[#0d0d0d] to-[#141e1d]`}>
          <div className="flex items-center gap-2 mb-2">
            <Radar className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Analyst Brief</h3>
          </div>
          <p className="text-zinc-200 leading-relaxed">
            {result ? result.summary : loading ? 'Synthesizing global logistics telemetry...' : 'Enter target route coordinates to begin real-time predictive analysis across multiple shipping modalities.'}
          </p>
          {error && (
            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded text-rose-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <footer className="mt-12 pt-6 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
        <span>© 2026 DisruptRadar Intelligence Systems</span>
        <span>Secure Terminal // AES-256 Connection Verified</span>
        <span>Data Source: Gemini 2.5-Flash Global Feed</span>
      </footer>
    </main>
  );
}
