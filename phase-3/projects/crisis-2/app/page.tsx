"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Terminal as TerminalIcon, 
  Send, 
  Users, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Megaphone, 
  Share2, 
  Briefcase,
  ChevronRight,
  Loader2,
  XCircle,
  Info
} from 'lucide-react';

type Mode = 'guidance' | 'broadcast';

const SYSTEM_PROMPT = `You are a real-time crisis communication AI.

If the input is about a guest in danger:
* Provide:
  (1) 5 simple immediate actions
  (2) 3 critical things NOT to do
  (3) One calming reassurance sentence
* Use extremely simple language

If the input is about organizational communication:
* Generate:
  (1) PA announcement (≤3 sentences)
  (2) Staff briefing (5 bullet points)
  (3) Social media statement (≤280 characters)
* Tailor tone to audience

Always:
* Be clear, calm, and precise
* Avoid unnecessary complexity
* Prioritize real-world usability

USER INPUT: `;

export default function CrisisFlow() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>('guidance');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [guidanceData, setGuidanceData] = useState({
    type: '',
    location: '',
    people: '',
    dangers: ''
  });

  const [broadcastData, setBroadcastData] = useState({
    type: '',
    venue: '',
    situation: '',
    audience: '',
    tone: 'Professional & Calm'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setOutput('');

    let prompt = '';
    if (mode === 'guidance') {
      prompt = `${SYSTEM_PROMPT} 
      GUEST IN DANGER - EMERGENCY PROTOCOL REQUEST:
      Emergency Type: ${guidanceData.type}
      Guest Location: ${guidanceData.location}
      Number of People: ${guidanceData.people}
      Visible Dangers: ${guidanceData.dangers}`;
    } else {
      prompt = `${SYSTEM_PROMPT} 
      ORGANIZATIONAL COMMUNICATION - BROADCAST REQUEST:
      Emergency Type: ${broadcastData.type}
      Venue Name: ${broadcastData.venue}
      Current Situation: ${broadcastData.situation}
      Target Audience: ${broadcastData.audience}
      Requested Tone: ${broadcastData.tone}`;
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
        setOutput(data.text);
      }
    } catch (err) {
      setError('System communication failure. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Visual background layers */}
      <div className="aurora-container">
        <div className="aurora-orb orb-1" />
        <div className="aurora-orb orb-2" />
        <div className="aurora-orb orb-3" />
      </div>
      <div className="grain-overlay" />

      {/* Header */}
      <header className="w-full max-w-6xl mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
              <ShieldAlert className="text-cyan-400" size={28} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              CrisisFlow
            </h1>
          </div>
          <p className="text-slate-400 font-mono text-xs tracking-widest uppercase">
            Guide individuals. Align communication. Control the narrative.
          </p>
        </div>

        <div className="flex bg-white/5 border border-white/10 p-1 rounded-sm">
          <button 
            onClick={() => setMode('guidance')}
            className={`px-6 py-2 text-xs font-mono tracking-tighter transition-all ${mode === 'guidance' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 hover:text-white'}`}
          >
            [ GUEST GUIDANCE ]
          </button>
          <button 
            onClick={() => setMode('broadcast')}
            className={`px-6 py-2 text-xs font-mono tracking-tighter transition-all ${mode === 'broadcast' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-500 hover:text-white'}`}
          >
            [ BROADCAST SCRIPTS ]
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6 animate-in fade-in slide-in-from-left-4 duration-1000 delay-200">
          <div className="glass-panel p-8 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400/70 mb-4">
              <TerminalIcon size={14} />
              <span>SYSTEM_INPUT_V1.0</span>
            </div>

            {mode === 'guidance' ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Emergency Type</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Active Fire, Flash Flood"
                    className="input-field"
                    value={guidanceData.type}
                    onChange={(e) => setGuidanceData({...guidanceData, type: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Guest Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                    <input 
                      type="text" 
                      placeholder="e.g. Room 402, Main Lobby"
                      className="input-field pl-10"
                      value={guidanceData.location}
                      onChange={(e) => setGuidanceData({...guidanceData, location: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">People Count</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                      <input 
                        type="number" 
                        placeholder="0"
                        className="input-field pl-10"
                        value={guidanceData.people}
                        onChange={(e) => setGuidanceData({...guidanceData, people: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Visible Dangers</label>
                    <div className="relative">
                      <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                      <input 
                        type="text" 
                        placeholder="e.g. Smoke, Water"
                        className="input-field pl-10"
                        value={guidanceData.dangers}
                        onChange={(e) => setGuidanceData({...guidanceData, dangers: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Emergency Category</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Chemical Spill, Earthquake"
                    className="input-field"
                    value={broadcastData.type}
                    onChange={(e) => setBroadcastData({...broadcastData, type: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Venue Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Grand Plaza Hotel"
                    className="input-field"
                    value={broadcastData.venue}
                    onChange={(e) => setBroadcastData({...broadcastData, venue: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Current Situation</label>
                  <textarea 
                    placeholder="Briefly describe what is happening..."
                    className="input-field min-h-[80px] resize-none py-3"
                    value={broadcastData.situation}
                    onChange={(e) => setBroadcastData({...broadcastData, situation: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Target Audience</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Guests, Press"
                      className="input-field"
                      value={broadcastData.audience}
                      onChange={(e) => setBroadcastData({...broadcastData, audience: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Output Tone</label>
                    <select 
                      className="input-field appearance-none bg-white/5"
                      value={broadcastData.tone}
                      onChange={(e) => setBroadcastData({...broadcastData, tone: e.target.value})}
                    >
                      <option className="bg-slate-900">Professional & Calm</option>
                      <option className="bg-slate-900">Urgent & Direct</option>
                      <option className="bg-slate-900">Reassuring</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button 
              disabled={loading}
              onClick={handleGenerate}
              className={`btn-command w-full flex items-center justify-center gap-3 ${loading ? 'opacity-50' : 'active:scale-[0.98]'}`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Radio size={18} className="text-cyan-400" />
              )}
              <span className="uppercase tracking-widest font-bold">
                {loading ? 'Processing...' : `[ Initiate ${mode === 'guidance' ? 'Guidance' : 'Broadcast'} ]`}
              </span>
            </button>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono animate-in fade-in slide-in-from-bottom-2">
                <XCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 px-2 py-4 border-t border-white/5">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                <Info size={10} className="text-blue-400" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
              System is operating in real-time mode. Output is generated via secure neural protocols for immediate deployment.
            </p>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 h-full min-h-[500px] animate-in fade-in slide-in-from-right-4 duration-1000 delay-400">
          <div className="terminal-panel glass-panel h-full flex flex-col">
            <div className="terminal-header">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>COMM_LINK_ENCRYPTED // {mode.toUpperCase()}_OUTPUT</span>
              </div>
              <div className="flex gap-4">
                <span>LN: 001-420</span>
                <span>UTF-8</span>
              </div>
            </div>

            <div className="terminal-content flex-1 overflow-auto">
              <div className="scanline" />
              
              {!output && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-4 opacity-50">
                  <TerminalIcon size={48} strokeWidth={1} />
                  <div className="text-center">
                    <p className="font-mono text-xs uppercase tracking-widest mb-1">Awaiting Command Input</p>
                    <p className="text-[10px] font-mono">Initialize protocol to view generated scripts</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="h-full flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-cyan-500/20 rounded-full animate-ping" />
                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 animate-spin" size={32} />
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-cyan-400 font-mono text-sm animate-pulse tracking-widest">ANALYZING PARAMETERS...</p>
                    <p className="text-slate-500 font-mono text-[10px]">GENERATING COORDINATED RESPONSE</p>
                  </div>
                </div>
              )}

              {output && !loading && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  {/* Content rendered as structured blocks */}
                  <div className="space-y-6">
                    {mode === 'guidance' ? (
                      <GuidanceOutput text={output} />
                    ) : (
                      <BroadcastOutput text={output} />
                    )}
                  </div>
                  
                  <div className="pt-8 border-t border-emerald-500/10 flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                      <CheckCircle2 size={12} />
                      <span>PROTOCOL GENERATED SUCCESSFULLY</span>
                    </div>
                    <button 
                      onClick={() => {
                        window.print();
                      }}
                      className="text-[10px] font-mono hover:text-white transition-colors"
                    >
                      [ PRINT_HARD_COPY ]
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 w-full px-6 py-2 bg-black/40 border-t border-white/5 backdrop-blur-sm flex items-center justify-between z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-mono text-emerald-500/70 tracking-widest uppercase">System Online</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span>Lat: 34.0522° N</span>
            <span>Lon: 118.2437° W</span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-slate-600">
          © 2026 CRISISFLOW // FUSION_TERMINAL_V2.5
        </div>
      </footer>
    </main>
  );
}

// Sub-components for structured rendering
function GuidanceOutput({ text }: { text: string }) {
  // Simple heuristic parsing
  const sections = text.split(/\d\.\s|DO NOT:|REASSURANCE:|Finally/i).filter(Boolean);
  
  return (
    <div className="space-y-8 font-mono">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <ChevronRight size={20} />
        </div>
        <div className="flex-1">
          <p className="text-cyan-400 text-xs font-bold mb-4 uppercase tracking-[0.2em]">Immediate Action Steps</p>
          <div className="space-y-4">
            {text.split('\n').filter(l => l.match(/^\d\./)).map((line, i) => (
              <div key={i} className="flex gap-4 group">
                <span className="text-emerald-500 opacity-50">{line.split('.')[0]}.</span>
                <p className="text-slate-200 group-hover:text-white transition-colors">{line.split('.').slice(1).join('.').trim()}</p>
              </div>
            ))}
            {/* Fallback if parsing fails */}
            {!text.includes('1.') && <p className="text-slate-300 whitespace-pre-wrap">{text}</p>}
          </div>
        </div>
      </div>

      {(text.toLowerCase().includes('not') || text.toLowerCase().includes('avoid')) && (
        <div className="p-6 bg-red-500/5 border border-red-500/10 space-y-4">
          <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-widest">
            <AlertTriangle size={14} />
            <span>Critical Warnings</span>
          </div>
          <div className="space-y-2 text-slate-400 text-sm italic">
            {text.split('\n')
              .filter(l => l.toUpperCase().includes('NOT') || l.toLowerCase().includes('avoid'))
              .slice(0, 3)
              .map((line, i) => (
                <p key={i}>— {line.trim()}</p>
              ))
            }
          </div>
        </div>
      )}

      <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-sm">
        <p className="text-emerald-400 text-sm leading-relaxed text-center font-medium italic">
          "{text.split('\n').pop()?.trim() || "Stay calm, help is on the way."}"
        </p>
      </div>
    </div>
  );
}

function BroadcastOutput({ text }: { text: string }) {
  return (
    <div className="space-y-8 font-mono">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest">
            <Megaphone size={14} />
            <span>PA System Script</span>
          </div>
          <div className="p-4 bg-purple-500/5 border border-purple-500/10 text-slate-200 text-sm leading-relaxed border-l-2 border-l-purple-500">
            {text.split('\n').find(l => l.length > 50 && !l.includes('*')) || text.split('\n')[0]}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <Briefcase size={14} />
            <span>Staff Briefing Protocol</span>
          </div>
          <div className="space-y-2">
            {text.split('\n').filter(l => l.includes('*') || l.includes('-')).map((bullet, i) => (
              <div key={i} className="flex gap-3 text-slate-300 text-sm">
                <span className="text-cyan-500 shrink-0">{">>"}</span>
                <p>{bullet.replace(/^[\*\-\s]+/, '').trim()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Share2 size={14} />
            <span>Social Output</span>
          </div>
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 text-emerald-100/80 text-sm font-medium italic">
            {text.split('\n').find(l => l.length < 280 && l.length > 20 && (l.includes('#') || !l.includes('*'))) || "Coordinating with emergency services. Please stay tuned for official updates."}
          </div>
        </div>
      </div>
    </div>
  );
}
