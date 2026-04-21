'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Building2, 
  AlertTriangle, 
  Users, 
  DoorOpen, 
  Send, 
  Loader2, 
  FileText,
  Clock,
  PhoneCall,
  ClipboardCheck,
  ChevronRight
} from 'lucide-react';

export default function ResponderBrief() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    venueName: '',
    venueType: '',
    crisisType: '',
    currentStatus: '',
    casualties: '',
    accessPoints: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const fullPrompt = `
      Venue: ${formData.venueName} (${formData.venueType})
      Crisis Type: ${formData.crisisType}
      Current Status: ${formData.currentStatus}
      Casualties/Affected: ${formData.casualties}
      Access Points: ${formData.accessPoints}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatResult = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('###') || line.startsWith('**')) {
        return <h3 key={i} className="text-blue-400 font-bold mt-4 mb-2 uppercase tracking-wider text-sm technical-text">{line.replace(/[#*]/g, '')}</h3>;
      }
      if (line.includes(':')) {
        const [label, ...rest] = line.split(':');
        return (
          <p key={i} className="mb-1 text-slate-300 leading-relaxed">
            <span className="text-white font-medium">{label}:</span>{rest.join(':')}
          </p>
        );
      }
      return <p key={i} className="mb-2 text-slate-400 leading-relaxed">{line}</p>;
    });
  };

  return (
    <main className="min-h-screen bg-[#05070a] text-slate-200 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Abstract Background Accents */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl glass-card animate-pulse-glow">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white mb-1">
                Responder<span className="text-blue-500">Brief</span>
              </h1>
              <p className="text-slate-400 font-medium">Accelerated Crisis Coordination Interface</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 glass-card rounded-full text-xs font-semibold technical-text text-blue-400 uppercase tracking-widest border-blue-500/30">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            System Live: Operational
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Section */}
          <section className="lg:col-span-5">
            <div className="glass-card rounded-3xl p-8 border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText className="w-24 h-24 text-white" />
              </div>
              
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-blue-500" />
                Situational Input
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-3 h-3" /> Venue Name
                    </label>
                    <input
                      required
                      type="text"
                      name="venueName"
                      value={formData.venueName}
                      onChange={handleInputChange}
                      placeholder="e.g. Grand Plaza Hotel"
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <DoorOpen className="w-3 h-3" /> Venue Type
                    </label>
                    <select
                      name="venueType"
                      value={formData.venueType}
                      onChange={handleInputChange}
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white appearance-none"
                    >
                      <option value="Hotel">Hotel</option>
                      <option value="Resort">Resort</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Event Space">Event Space</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-500" /> Crisis Type
                  </label>
                  <input
                    required
                    type="text"
                    name="crisisType"
                    value={formData.crisisType}
                    onChange={handleInputChange}
                    placeholder="e.g. Structural Fire, Active Threat, Flood"
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Current Status
                  </label>
                  <textarea
                    required
                    name="currentStatus"
                    value={formData.currentStatus}
                    onChange={handleInputChange}
                    placeholder="Immediate situation overview..."
                    className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 min-h-[80px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-3 h-3" /> Casualties
                    </label>
                    <input
                      type="text"
                      name="casualties"
                      value={formData.casualties}
                      onChange={handleInputChange}
                      placeholder="Affected persons count"
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Access Points
                    </label>
                    <input
                      type="text"
                      name="accessPoints"
                      value={formData.accessPoints}
                      onChange={handleInputChange}
                      placeholder="Main entries, loading docks"
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  suppressHydrationWarning
                  className="w-full glow-button rounded-xl py-4 flex items-center justify-center gap-3 text-white font-bold tracking-wide shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      GENERATING BRIEF...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      TRANSMIT TO RESPONDERS
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* Results Section */}
          <section className="lg:col-span-7 h-full">
            {!result && !loading && !error && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center glass-card rounded-3xl border-dashed border-white/10 p-12 text-center group">
                <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <ShieldAlert className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ready for Analysis</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Complete the form to generate a high-priority situational brief for incoming emergency crews.
                </p>
                <div className="mt-8 flex gap-4 text-[10px] technical-text font-bold text-slate-600 uppercase tracking-widest">
                  <span className="px-3 py-1 glass-card rounded-md">EMS</span>
                  <span className="px-3 py-1 glass-card rounded-md">FIRE</span>
                  <span className="px-3 py-1 glass-card rounded-md">POLICE</span>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center glass-card rounded-3xl border-white/5 p-12 text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Analyzing Data</h3>
                <p className="text-slate-400 technical-text">Processing situational awareness brief...</p>
                <div className="mt-8 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
                </div>
              </div>
            )}

            {error && (
              <div className="glass-card rounded-3xl border-red-500/20 p-8 flex items-start gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Transmission Error</h3>
                  <p className="text-red-400/80 text-sm mb-4">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
                  >
                    Clear Error
                  </button>
                </div>
              </div>
            )}

            {result && (
              <div className="glass-card rounded-3xl border-white/5 p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white/5 px-8 py-5 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-bold technical-text text-white tracking-tight">SITUATIONAL BRIEF: 001-A</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <PhoneCall className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="max-h-[500px] overflow-y-auto pr-4 scrollbar-thin">
                    {formatResult(result)}
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest technical-text">Verified</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest technical-text">Responder Copy Sent</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </main>
  );
}
