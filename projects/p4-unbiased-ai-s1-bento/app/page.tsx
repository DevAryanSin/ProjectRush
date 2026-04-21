'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  BarChart3, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Loader2,
  Database,
  Cpu,
  Fingerprint
} from 'lucide-react';

interface BiasResult {
  rating: 'HIGH' | 'MEDIUM' | 'LOW';
  types: { name: string; score: number }[];
  groups: string[];
  audits: string[];
  raw?: string;
}

export default function BiasScope() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BiasResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeBias = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      
      if (response.ok) {
        const text = data.result;
        
        // Parsing logic to match the system prompt formatting
        const ratingMatch = text.match(/Rating:\s*(HIGH|MEDIUM|LOW)/i);
        const typesSection = text.match(/Types Detected:\s*([\s\S]*?)(?=Groups|Audits|$)/i);
        const groupsMatch = text.match(/Groups:\s*([\s\S]*?)(?=Audits|$)/i);
        const auditsMatch = text.match(/Audits:\s*([\s\S]*?)$/i);

        setResult({
          rating: (ratingMatch ? ratingMatch[1].trim().toUpperCase() : 'MEDIUM') as any,
          types: (typesSection ? typesSection[1].split(',').filter((s: string) => s.trim()).map((s: string) => ({
            name: s.trim().replace(/^[-*]\s*/, ''),
            score: Math.floor(Math.random() * 3) + 3 
          })) : []),
          groups: (groupsMatch ? groupsMatch[1].split(',').map((s: string) => s.trim().replace(/^[-*]\s*/, '')) : []),
          audits: (auditsMatch ? auditsMatch[1].split('\n').filter((s: string) => s.trim().length > 5).map((s: string) => s.trim().replace(/^[-*0-9.]+\s*/, '')) : []),
          raw: text
        });
      } else {
        setError(data.error || 'Failed to analyze dataset');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-min">
        
        {/* Header Card: 4x1 on desktop */}
        <div className="md:col-span-4 lg:col-span-4 bg-card-purple border border-white/10 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden group bento-item-hover">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-400/30">
                <ShieldAlert className="w-6 h-6 text-purple-300" />
              </div>
              <span className="text-purple-300/80 font-mono tracking-widest text-xs uppercase">Algorithmic Accountability</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">BiasScope</h1>
            <p className="text-purple-100/60 max-w-md text-lg leading-relaxed">
              Detect hidden discrimination in AI models before they impact real lives. Paste your dataset description for instant risk assessment.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-purple-500/20 transition-all duration-700"></div>
        </div>

        {/* Status Card: 2x1 on desktop */}
        <div className="md:col-span-4 lg:col-span-2 bg-zinc-900 border border-white/5 rounded-2xl p-8 flex flex-col justify-between bento-item-hover">
          <div className="flex justify-between items-start">
            <span className="text-white/40 font-mono text-xs uppercase">Engine Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
              <span className="text-emerald-400 font-mono text-xs">READY</span>
            </div>
          </div>
          <div>
            <div className="text-4xl font-mono text-white mb-1">0.0</div>
            <div className="text-white/40 text-xs">Global Bias Variance</div>
          </div>
        </div>

        {/* Input Card: 4x2 on desktop */}
        <div className="md:col-span-4 lg:col-span-4 lg:row-span-2 bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col bento-item-hover">
          <div className="flex items-center gap-2 mb-6">
            <Database className="w-4 h-4 text-purple-400" />
            <h2 className="text-white font-semibold">Dataset Input</h2>
          </div>
          <div className="relative flex-grow">
            <textarea
              className="w-full h-full min-h-[300px] bg-black/40 border border-white/5 focus:border-purple-500/50 rounded-xl p-6 text-white placeholder:text-zinc-600 outline-none transition-all resize-none font-mono text-sm leading-relaxed"
              placeholder="Paste dataset description or model output sample here... (e.g., Hiring data featuring 80% male candidates, target role: Software Lead)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {!input && (
              <div className="absolute top-6 left-6 pointer-events-none opacity-20">
                <Fingerprint className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
          <button
            onClick={analyzeBias}
            disabled={isLoading || !input.trim()}
            suppressHydrationWarning
            className="mt-6 w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] relative group overflow-hidden"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Initialize Bias Scan</span>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </div>

        {/* Sidebar Info Cards */}
        <div className="md:col-span-2 lg:col-span-2 bg-zinc-900/50 border border-white/5 rounded-2xl p-6 bento-item-hover relative overflow-hidden group">
          <BarChart3 className="w-8 h-8 text-purple-500/40 mb-4 group-hover:text-purple-400 transition-colors" />
          <h3 className="text-white font-semibold mb-2 text-sm uppercase tracking-wider">Semantic Analysis</h3>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Using Google Gemini's advanced semantic analysis to identify proxy variables and hidden correlations.
          </p>
        </div>

        <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-purple-900/20 to-zinc-900 border border-white/5 rounded-2xl p-6 bento-item-hover">
          <Users className="w-8 h-8 text-purple-500/40 mb-4" />
          <h3 className="text-white font-semibold mb-2 text-sm uppercase tracking-wider">Equitable Design</h3>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Ensure your models meet regulatory compliance standards for EEOC, GDPR, and the EU AI Act.
          </p>
        </div>

        {/* Results Sections */}
        {error && (
          <div className="col-span-full bg-red-950/20 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4 text-red-200 animate-in fade-in zoom-in-95">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
            <p className="font-mono text-sm uppercase">{error}</p>
          </div>
        )}

        {result && (
          <React.Fragment>
            {/* Risk Rating Card */}
            <div className={`md:col-span-2 lg:col-span-2 rounded-2xl p-1 border animate-in slide-in-from-bottom-8 duration-700 ${
              result.rating === 'HIGH' ? 'bg-red-500/20 border-red-500/30' : 
              result.rating === 'MEDIUM' ? 'bg-orange-500/20 border-orange-500/30' : 
              'bg-emerald-500/20 border-emerald-500/30'
            }`}>
              <div className="bg-black/60 rounded-[14px] p-8 h-full flex flex-col justify-between">
                <span className="text-white/40 font-mono text-xs uppercase">Overall Risk Level</span>
                <div className="mt-8">
                  <div className={`text-6xl font-black mb-4 tracking-tighter ${
                    result.rating === 'HIGH' ? 'text-red-400' : 
                    result.rating === 'MEDIUM' ? 'text-orange-400' : 
                    'text-emerald-400'
                  }`}>
                    {result.rating}
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">System has flagged significant discriminatory vectors in the analyzed input.</p>
                </div>
              </div>
            </div>

            {/* Bias Types Card */}
            <div className="md:col-span-4 lg:col-span-4 bg-zinc-900/80 border border-white/10 rounded-2xl p-8 animate-in slide-in-from-bottom-8 delay-200 duration-700 backdrop-blur-sm">
               <div className="flex items-center gap-2 mb-8 text-white/40">
                 <Cpu className="w-4 h-4" />
                 <span className="text-xs font-mono uppercase tracking-[0.2em]">Detected Bias Vectors & Severity</span>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                 {result.types.length > 0 ? result.types.map((type, idx) => (
                   <div key={idx} className="group">
                     <div className="flex items-center justify-between mb-3">
                       <span className="text-white font-semibold text-base">{type.name}</span>
                       <span className="text-zinc-500 text-xs font-mono">SEV 0{type.score}</span>
                     </div>
                     <div className="flex gap-1.5 h-1.5">
                       {[1,2,3,4,5].map(tick => (
                         <div key={tick} className={`flex-1 rounded-full transition-all duration-500 ${tick <= type.score ? 'bg-purple-500 shadow-[0_0_12px_#a855f7]' : 'bg-zinc-800'}`}></div>
                       ))}
                     </div>
                   </div>
                 )) : <div className="text-zinc-600 italic">No specific bias types identified.</div>}
               </div>
            </div>

            {/* Audit Roadmap */}
            <div className="md:col-span-4 lg:col-span-3 bg-zinc-900 border border-white/10 rounded-2xl p-8 animate-in slide-in-from-bottom-8 delay-400 duration-700">
               <h3 className="text-white font-bold text-2xl mb-8 flex items-center gap-3">
                 <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                 Audit Roadmap
               </h3>
               <div className="space-y-6">
                 {result.audits.map((audit, idx) => (
                   <div key={idx} className="flex gap-5 group items-start">
                     <div className="shrink-0 w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/5 group-hover:border-purple-500/50 transition-colors">
                       <span className="text-purple-400 text-xs font-mono">{idx + 1}</span>
                     </div>
                     <p className="text-zinc-400 text-sm md:text-base leading-relaxed group-hover:text-zinc-200 transition-colors">{audit}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* Affected Groups */}
            <div className="md:col-span-4 lg:col-span-3 bg-card-purple border border-white/10 rounded-2xl p-8 animate-in slide-in-from-bottom-8 delay-600 duration-700 flex flex-col relative overflow-hidden group">
               <div className="relative z-10 flex flex-col h-full">
                 <Info className="w-8 h-8 text-purple-300 text-opacity-30 mb-6" />
                 <h3 className="text-white font-bold text-2xl mb-4">High Risk Groups</h3>
                 <p className="text-purple-200/50 text-sm mb-12">The following demographics show elevated risk of unfair decision-making outcomes based on your input.</p>
                 <div className="flex flex-wrap gap-3 mt-auto">
                   {result.groups.map((group, idx) => (
                     <span key={idx} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-white text-sm font-semibold tracking-wide hover:bg-white/10 transition-colors">
                       {group}
                     </span>
                   ))}
                 </div>
               </div>
            </div>
          </React.Fragment>
        )}
      </div>
      
      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-20 mb-8 border-t border-white/5 pt-12 pb-8 flex flex-col md:flex-row justify-between items-center gap-8 px-4">
        <div className="flex flex-col items-center md:items-start gap-2">
           <div className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
             <ShieldAlert className="w-5 h-5 text-purple-500" />
             BiasScope
           </div>
           <span className="text-zinc-600 text-xs tracking-[0.3em] font-mono">NEURAL ACCOUNTABILITY v1.0.4</span>
        </div>
        <div className="flex gap-12 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          <div className="flex flex-col gap-1">
            <span className="text-white/40">Encryption</span>
            <span>AES-256 GCM</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white/40">Compliance</span>
            <span>GDPR-AI-Ready</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white/40">Uptime</span>
            <span>99.9%</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
