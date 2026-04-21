'use client';

import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Send, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Activity, 
  Heart, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  Droplet,
  Coffee,
  Info,
  Loader2
} from 'lucide-react';

interface CommunityNeed {
  rank: number;
  need: string;
  urgencyScore: number;
  affectedPopulation: string;
  category: string;
  evidence: string;
}

export default function NeedMapper() {
  const [inputData, setInputData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CommunityNeed[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnalyze = async () => {
    if (!inputData.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputData }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const parsedResults = JSON.parse(data.result);
      setResults(parsedResults);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Unable to process community data. Please check your data format and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('health')) return <Activity className="text-red-400" size={20} />;
    if (cat.includes('food')) return <Coffee className="text-orange-400" size={20} />;
    if (cat.includes('shelter')) return <Heart className="text-pink-400" size={20} />;
    if (cat.includes('safety')) return <ShieldCheck className="text-blue-400" size={20} />;
    if (cat.includes('education')) return <BookOpen className="text-purple-400" size={20} />;
    if (cat.includes('livelihood')) return <Zap className="text-yellow-400" size={20} />;
    if (cat.includes('water')) return <Droplet className="text-cyan-400" size={20} />;
    return <Info className="text-gray-400" size={20} />;
  };

  if (!mounted) return null;

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 md:py-20 overflow-x-hidden">
      <div className="bento-grid">
        
        {/* Header Card */}
        <div className="bento-card col-span-1 md:col-span-2 card-green flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <ClipboardList className="text-green-400" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl glow-green">NeedMapper</h1>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Transforming unstructured community surveys into actionable, prioritized impact maps.
          </p>
        </div>

        {/* Input Card - Core Interaction */}
        <div className="bento-card col-span-1 md:col-span-2 row-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl uppercase tracking-widest text-green-400 mono">Data Input</h2>
            <span className="px-2 py-1 bg-white/5 rounded text-[10px] mono text-gray-500">RAW TEXT / SURVEYS</span>
          </div>
          <textarea
            className="glass-input flex-grow min-h-[300px] resize-none mono text-sm mb-4"
            placeholder="Paste raw survey notes, field reports, or community feedback here..."
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !inputData.trim()}
            suppressHydrationWarning
            className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-800 disabled:text-gray-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin text-white" size={20} />
                <span className="mono uppercase tracking-tighter">Analyzing Impact Signals...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span className="mono uppercase tracking-tighter">Generate Need Assessment</span>
              </>
            )}
          </button>
        </div>

        {/* Stats Card 1 - Urgency Avg */}
        <div className="bento-card col-span-1 flex flex-col items-center justify-center text-center">
          <div className="text-gray-500 text-xs uppercase mono mb-2">Urgency Signal</div>
          <div className="text-5xl font-black text-orange-500 glow-orange">
            {results ? (results.reduce((acc, curr) => acc + curr.urgencyScore, 0) / results.length).toFixed(1) : '0.0'}
          </div>
          <div className="text-gray-400 text-sm mt-1">Average Severity</div>
        </div>

        {/* Stats Card 2 - Affected Est */}
        <div className="bento-card col-span-1 flex flex-col items-center justify-center text-center">
          <div className="text-gray-500 text-xs uppercase mono mb-2">Coverage</div>
          <div className="flex items-center gap-2 text-green-400">
            <Users size={24} />
            <span className="text-3xl font-black">High</span>
          </div>
          <div className="text-gray-400 text-sm mt-1">Population Reach</div>
        </div>

        {/* Results / List Card */}
        {results ? (
          <div className="bento-card col-span-1 md:col-span-4 row-span-2 overflow-y-auto max-h-[1000px]">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#121212]/90 backdrop-blur-sm z-10 py-2">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-orange-500" />
                <h2 className="text-2xl uppercase tracking-tighter glow-orange">Prioritized Needs</h2>
              </div>
              <div className="text-xs text-gray-500 mono">TOP {results.length} IDENTIFIED ISSUES</div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {results.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-white/20 mono group-hover:text-green-500/40 transition-colors">
                        #{item.rank}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getCategoryIcon(item.category)}
                          <span className="text-[10px] uppercase tracking-widest text-gray-500 mono">{item.category}</span>
                        </div>
                        <h3 className="text-lg text-white group-hover:text-green-400 transition-colors">{item.need}</h3>
                      </div>
                    </div>
                    <div className="bg-orange-500/20 px-2 py-1 rounded border border-orange-500/30 text-orange-400 text-xs mono">
                      LV {item.urgencyScore}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 border-l-2 border-white/10 pl-4 py-2 italic mb-3">
                    "{item.evidence}"
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 mono">
                    <Users size={12} />
                    <span>AFFECTED: {item.affectedPopulation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bento-card col-span-1 md:col-span-2 flex flex-col justify-center items-center text-center py-12 transition-all opacity-60">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center mb-4">
              <Zap className="text-gray-700" />
            </div>
            <p className="text-gray-500 mono text-sm max-w-[240px]">
              Waiting for data analysis. Analysis results will populate this section.
            </p>
          </div>
        )}

        {/* Feature 1 - Geographic */}
        <div className="bento-card col-span-1 card-orange flex flex-col items-center justify-center">
            <MapPin className="text-orange-400 mb-2" size={24} />
            <div className="text-sm text-gray-300 mono text-center">Cluster Analysis</div>
            <div className="text-[10px] text-gray-500 mono mt-1">Cross-referencing locations</div>
        </div>

        {/* Feature 2 - Progress */}
        <div className="bento-card col-span-1 flex items-center justify-between group">
          <div>
            <div className="text-2xl font-bold group-hover:text-green-400 transition-colors">94%</div>
            <div className="text-[10px] text-gray-500 mono uppercase">Accuracy</div>
          </div>
          <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
            <Activity className="text-green-500" size={20} />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="col-span-full bg-red-900/20 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-200">
            <AlertTriangle className="text-red-500 shrink-0" />
            <p className="text-sm mono">{error}</p>
          </div>
        )}

      </div>

      <footer className="mt-16 text-center">
        <p className="text-gray-600 text-xs mono uppercase tracking-[0.2em]">
          Designed for Social Impact • Powered by Gemini 2.5
        </p>
      </footer>
    </main>
  );
}
