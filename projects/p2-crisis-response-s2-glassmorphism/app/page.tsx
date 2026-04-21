'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, Activity, Clock, 
  MapPin, Users, Send, AlertTriangle, 
  CheckCircle, Zap, Shield, FileText, Plus, Beaker, ChevronRight
} from 'lucide-react';

export default function CrisisSync() {
  const [venue, setVenue] = useState('');
  const [crisisType, setCrisisType] = useState('');
  const [status, setStatus] = useState('');
  const [teams, setTeams] = useState<string[]>([]);
  const [timeElapsed, setTimeElapsed] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const teamOptions = ['Security', 'Medical', 'Management', 'Engineering', 'Guest Services'];

  const toggleTeam = (t: string) => {
    setTeams(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venue || !crisisType || !status || !timeElapsed) {
      setError('Please fill in all core fields to generate accurate coordination.');
      return;
    }
    setError('');
    setIsLoading(true);
    setResult('');
    
    const promptText = `
      Venue Type: ${venue}
      Crisis Type: ${crisisType}
      Current Status: ${status}
      Teams Available: ${teams.join(', ') || 'None specified'}
      Time Elapsed: ${timeElapsed}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync crisis data.');
      }
      
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred connecting to coordination link.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatResult = (text: string) => {
    // Split into sections separated by double newlines or markdown headers.
    const blocks = text.split(/(?=\n### )|(?=\n## )|(?=\n# )|\n\n/);
    
    return blocks.map((block, i) => {
      if (!block.trim()) return null;
      let isImmediate = block.toUpperCase().includes('IMMEDIATE');
      let isShortTerm = block.toUpperCase().includes('SHORT-TERM') || block.toUpperCase().includes('SHORT TERM');
      let isEscalation = block.toUpperCase().includes('ESCALATION');

      const lines = block.trim().split('\n');
      const headerLine = lines[0].replace(/^#+\s*/, '').replace(/\*\*/g, '');
      const contentLines = lines.slice(1).map(line => line.trim()).filter(line => line);

      if (isImmediate || isShortTerm || isEscalation) {
         let bgColor = isImmediate ? 'bg-red-500/10 border-red-500/30' : 
                       isShortTerm ? 'bg-blue-500/10 border-blue-500/30' : 'bg-orange-500/10 border-orange-500/30';
         let textColor = isImmediate ? 'text-[#ff453a]' : 
                         isShortTerm ? 'text-[#64d2ff]' : 'text-[#ffd60a]';
         let Icon = isImmediate ? Zap : isShortTerm ? Clock : AlertTriangle;
         return (
            <div key={i} className={`mb-6 p-5 rounded-2xl border ${bgColor} relative overflow-hidden backdrop-blur-sm`}>
              {isEscalation && <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-bl-full blur-2xl pointer-events-none"></div>}
              <h3 className={`text-xl font-bold ${textColor} mb-4 flex items-center gap-2`}>
                 <Icon size={22} className={isImmediate ? "urgent-marker" : ""} /> {headerLine}
              </h3>
              <ul className="space-y-3">
                 {contentLines.map((line, j) => {
                    const lineText = line.replace(/^[\*\-\•]\s*/, '');
                    return (
                       <li key={j} className="text-white text-sm md:text-base flex items-start gap-3">
                         <span className={`${textColor} mt-1`}><ChevronRight size={16} /></span>
                         <span dangerouslySetInnerHTML={{ __html: lineText.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }} />
                       </li>
                    );
                 })}
              </ul>
            </div>
         );
      }
      
      // Standard block
      return (
         <div key={i} className="mb-6">
           <h3 className="text-lg font-bold text-white mb-2">{headerLine}</h3>
           {contentLines.map((line, j) => (
              <p key={j} className="text-white/80 text-sm md:text-base mb-2 leading-relaxed" 
                 dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }} />
           ))}
         </div>
      );
    });
  };

  return (
    <main className="min-h-screen py-10 px-4 md:px-8 relative z-10 flex flex-col items-center">
      {/* Background Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      <header className="w-full max-w-3xl mb-10 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(255,59,48,0.3)]">
            <ShieldAlert className="text-[#ff453a]" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-0 leading-tight">CrisisSync</h1>
            <p className="text-white/50 text-sm tracking-wide uppercase font-semibold">Live Coordination Node</p>
          </div>
        </div>
        <div className="hidden md:flex gap-2 items-center text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70">
          <div className="w-2 h-2 rounded-full bg-[#32d74b] animate-pulse"></div> Secure Link Active
        </div>
      </header>

      <div className="w-full max-w-3xl glass-panel p-6 md:p-8 z-20 transition-all">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Initiate Protocol</h2>
          <p className="text-white/60">Input incident parameters to instantly synchronize rescue and recovery efforts.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50 ml-1 flex items-center gap-2">
                <MapPin size={14} /> Venue Profile
              </label>
              <input 
                type="text" 
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Resort Atrium, 5th Floor Corridor" 
                className="w-full p-4 glass-input text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50 ml-1 flex items-center gap-2">
                <Activity size={14} /> Critical Event Type
              </label>
              <input 
                type="text" 
                value={crisisType}
                onChange={(e) => setCrisisType(e.target.value)}
                placeholder="e.g. Structural Fire, Perimeter Breach" 
                className="w-full p-4 glass-input text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50 ml-1 flex items-center gap-2">
              <FileText size={14} /> Situation Brief
            </label>
            <textarea 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Describe what is visible right now. Are there casualties? Trapped individuals?" 
              className="w-full p-4 glass-input text-sm h-32 resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50 ml-1 flex items-center gap-2">
                <Clock size={14} /> Time Elapsed
              </label>
              <input 
                type="text" 
                value={timeElapsed}
                onChange={(e) => setTimeElapsed(e.target.value)}
                placeholder="e.g. 5 minutes ago" 
                className="w-full p-3 glass-input text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50 ml-1 flex items-center gap-2">
                <Users size={14} /> Assets Deployed
              </label>
              <div className="flex flex-wrap gap-2">
                {teamOptions.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTeam(t)}
                    suppressHydrationWarning
                    className={`px-3 py-1.5 text-xs font-medium transition-all ${teams.includes(t) ? 'glass-tag active' : 'glass-tag hover:bg-white/10'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 text-sm flex items-start gap-3 backdrop-blur-sm">
               <AlertTriangle size={18} className="flex-shrink-0 mt-0.5 text-red-400" />
               <p>{error}</p>
            </div>
          )}

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              suppressHydrationWarning
              className="w-full p-4 rounded-xl glass-button flex items-center justify-center gap-2 text-lg uppercase tracking-wider group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  <span>Synchronizing...</span>
                </>
              ) : (
                <>
                  <Activity size={22} className="group-hover:animate-pulse" />
                  <span>Generate Coordination Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="w-full max-w-3xl mt-8 glass-panel overflow-hidden relative">
          <div className="absolute inset-0 loader-pulse opacity-50"></div>
          <div className="p-8 flex items-center gap-4">
             <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
             <div>
               <h3 className="text-white font-bold mb-1">Synthesizing Critical Directives</h3>
               <p className="text-white/50 text-sm">Consulting tactical models and building role-specific workflows...</p>
             </div>
          </div>
        </div>
      )}

      {result && !isLoading && (
        <div className="w-full max-w-3xl mt-8 result-card glass-panel p-6 md:p-8 relative overflow-hidden z-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <CheckCircle className="text-[#32d74b]" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-wide">Live Action Plan</h2>
                <p className="text-xs text-white/50 uppercase tracking-widest mt-1">Generated • High Priority</p>
              </div>
            </div>
            <button suppressHydrationWarning className="px-4 py-2 text-xs font-semibold bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
               <Shield size={14} /> Acknowledge All
            </button>
          </div>

          <div className="result-content prose prose-invert max-w-none text-white/80">
            {formatResult(result)}
          </div>
        </div>
      )}
      
      <footer className="w-full max-w-3xl mt-16 pb-8 text-center text-white/30 text-xs tracking-widest uppercase flex items-center justify-center gap-4">
        <span>CrisisSync Secure Link</span>
        <span className="w-1 h-1 rounded-full bg-white/20"></span>
        <span>Internal Use Only</span>
      </footer>
    </main>
  );
}
