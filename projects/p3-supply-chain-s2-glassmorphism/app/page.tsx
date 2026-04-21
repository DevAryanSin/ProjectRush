'use client';

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  AlertTriangle, 
  Zap, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  MapPin, 
  RotateCcw,
  Loader2,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Activity
} from 'lucide-react';

interface RouteOption {
  rank: string;
  description: string;
  timeEstimate: string;
  costDelta: string;
  riskRating: number;
  tradeOffs: string;
  bestFor: string;
  justification: string;
}

export default function RouteRethink() {
  const [formData, setFormData] = useState({
    routeDetails: '',
    cargoSpecs: '',
    urgency: 'medium',
    budget: 'medium'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<RouteOption[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResults(null);
    setError(null);

    const prompt = `
      Shipment Disruption Details:
      - Blocked/Original Route: ${formData.routeDetails}
      - Cargo Specifications: ${formData.cargoSpecs}
      - Urgency Level: ${formData.urgency}
      - Budget Flexibility: ${formData.budget}

      Please provide 3 alternative routing options as per the system instructions.
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to analyze routes');
      
      const data = await response.json();
      parseResults(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const parseResults = (text: string) => {
    const options: RouteOption[] = [];
    const sections = text.split(/(?=1st|2nd|3rd|Option 1|Option 2|Option 3|Choice 1|Choice 2|Choice 3)/i);
    
    const filteredSections = sections.filter(s => s.trim().length > 50).slice(0, 3);

    filteredSections.forEach((section, index) => {
      const option: RouteOption = {
        rank: index === 0 ? "1st Choice" : index === 1 ? "2nd Choice" : "3rd Choice",
        description: extractField(section, /route description|description|route:? /i),
        timeEstimate: extractField(section, /time vs original|estimated time:? /i),
        costDelta: extractField(section, /cost delta|estimated cost:? /i),
        riskRating: parseInt(extractField(section, /risk rating:? /i).match(/\d/)?.[0] || '3'),
        tradeOffs: extractField(section, /key trade-offs|trade-offs:? /i),
        bestFor: extractField(section, /best-for scenario|best for:? /i),
        justification: extractField(section, /justification:? /i)
      };
      options.push(option);
    });

    if (options.length > 0) {
      setResults(options);
    } else {
      setResults([{
        rank: "Analysis Complete",
        description: text.substring(0, 500) + "...",
        timeEstimate: "See details",
        costDelta: "See details",
        riskRating: 3,
        tradeOffs: "Parsed content limited",
        bestFor: "Manual review recommended",
        justification: "Response format varied from expected structure."
      }]);
    }
  };

  const extractField = (text: string, regex: RegExp): string => {
    const lines = text.split('\n');
    for (const line of lines) {
      if (regex.test(line)) {
        return line.replace(regex, '').replace(/^[:\s-]+/, '').trim();
      }
    }
    const match = text.match(new RegExp(`${regex.source}(.*?)(?=\\n\\w|$)`, 'is'));
    return match ? match[1].trim() : 'Not specified';
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center py-12 px-6 lg:py-20">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="w-full max-w-[680px] z-10 animate-fade-in">
        <header className="mb-10 flex items-center space-x-3">
          <div className="bg-teal-500/20 p-3 rounded-2xl border border-teal-500/30 backdrop-blur-md">
            <Activity className="w-8 h-8 text-teal-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Route<span className="text-amber-400">Rethink</span></h1>
            <p className="text-teal-200/70 font-light text-sm italic">Intelligent disruption rerouting and optimization</p>
          </div>
        </header>

        <section className="glass-card p-8 mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-medium text-white/90">Analyze Disruption</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-teal-300/80 ml-1">Current Obstruction</label>
              <textarea 
                placeholder="e.g. Suez Canal blockage affecting MS Albatros, route Shanghai-Rotterdam"
                className="glass-input min-h-[100px]"
                value={formData.routeDetails}
                onChange={(e) => setFormData({...formData, routeDetails: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-teal-300/80 ml-1">Cargo & Volume</label>
                <input 
                  type="text" 
                  placeholder="e.g. 500 TEU PERISHABLES"
                  className="glass-input"
                  value={formData.cargoSpecs}
                  onChange={(e) => setFormData({...formData, cargoSpecs: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-teal-300/80 ml-1">Urgency</label>
                <select 
                  className="glass-input"
                  value={formData.urgency}
                  onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                  suppressHydrationWarning
                >
                  <option value="low">Standard (Low)</option>
                  <option value="medium">Priority (Medium)</option>
                  <option value="high">Critical (High)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-teal-300/80 ml-1">Budget Flexibility</label>
              <div className="flex space-x-4">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({...formData, budget: level})}
                    className={`flex-1 py-3 px-4 rounded-xl border transition-all duration-300 capitalize text-sm font-medium ${
                      formData.budget === level 
                        ? 'bg-amber-500/30 border-amber-500/50 text-amber-200 shadow-lg shadow-amber-900/20' 
                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                    }`}
                    suppressHydrationWarning
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold rounded-2xl shadow-xl shadow-teal-900/30 transition-all flex items-center justify-center space-x-2 group overflow-hidden relative"
              suppressHydrationWarning
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Computing Trajectories...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />
                  <span>Execute Route Optimization</span>
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </section>

        {error && (
          <div className="glass-card border-red-500/30 p-4 mb-8 flex items-center space-x-3 animate-shake">
            <AlertTriangle className="text-red-400 w-5 h-5" />
            <p className="text-red-200 text-sm font-medium">{error}</p>
          </div>
        )}

        {results && (
          <div className="space-y-8 animate-fade-up">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-1">Optimal Reroutes Identified</h3>
              <p className="text-teal-200/60 text-sm">Calculated based on current volatility metrics</p>
            </div>
            
            {results.map((option, idx) => (
              <div 
                key={idx} 
                className={`glass-card p-8 border-l-4 overflow-hidden relative transition-all hover:-translate-y-1 ${
                  idx === 0 ? 'border-l-amber-500 scale-105 shadow-2xl shadow-amber-500/10' : 'border-l-teal-500'
                }`}
              >
                {idx === 0 && (
                  <div className="absolute top-0 right-0 bg-amber-500/20 px-4 py-1 rounded-bl-xl border-l border-b border-amber-500/30">
                    <span className="text-amber-400 text-[10px] uppercase font-black tracking-widest">Recommended</span>
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        idx === 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-teal-500/20 text-teal-400'
                      }`}>
                        {option.rank}
                      </span>
                      <h4 className="text-xl font-bold text-white leading-tight">{option.description}</h4>
                    </div>

                    <p className="text-white/60 text-sm leading-relaxed italic border-l-2 border-white/10 pl-4">
                      "{option.justification}"
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="glass-subcard p-3">
                        <div className="flex items-center space-x-2 text-teal-300/70 mb-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] uppercase font-bold">Time Impact</span>
                        </div>
                        <p className="text-white font-medium text-sm">{option.timeEstimate}</p>
                      </div>
                      <div className="glass-subcard p-3">
                        <div className="flex items-center space-x-2 text-amber-300/70 mb-1">
                          <DollarSign className="w-3 h-3" />
                          <span className="text-[10px] uppercase font-bold">Cost Delta</span>
                        </div>
                        <p className="text-white font-medium text-sm">{option.costDelta}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-56 space-y-4">
                    <div className="glass-subcard p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Risk Rating</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <div 
                              key={s} 
                              className={`w-2 h-2 rounded-full ${s <= option.riskRating ? 'bg-amber-400 shadow-sm shadow-amber-400/50' : 'bg-white/10'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] text-white/40 uppercase font-bold px-1">Trade-offs</p>
                      <p className="text-xs text-teal-100/70 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                        {option.tradeOffs}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-teal-500/10 to-transparent p-3 rounded-lg border border-teal-500/20">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-teal-400" />
                        <span className="text-[10px] text-teal-300 uppercase font-bold">Best For</span>
                      </div>
                      <p className="text-xs text-white/80 mt-1">{option.bestFor}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-8">
              <button 
                onClick={() => setResults(null)}
                className="flex items-center space-x-2 text-white/40 hover:text-white transition-colors text-sm font-medium"
                suppressHydrationWarning
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Full Analysis</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-20 z-10 text-white/20 text-[10px] uppercase font-bold tracking-[0.2em]">
        Precision Logistics Intelligence &copy; 2026 RouteRethink Systems
      </footer>
    </main>
  );
}
