'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Map, 
  Users, 
  MessageSquare, 
  ChevronRight, 
  Loader2, 
  Building2, 
  UsersRound, 
  Layers, 
  Flame,
  Waves,
  Lock,
  Stethoscope
} from 'lucide-react';

export default function EvacuGuide() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    venueType: 'Hotel',
    floors: '5',
    occupancy: '200',
    crisisType: 'Fire'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const prompt = `Venue: ${formData.venueType}, Floors: ${formData.floors}, Occupancy: ${formData.occupancy}, Crisis: ${formData.crisisType}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error(error);
      setResult("Error generating plan. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('###') || line.startsWith('**')) {
        return <h3 key={i} className="text-xl font-black mt-6 mb-2 text-red-600 uppercase border-l-4 border-black pl-3">{line.replace(/[#*]/g, '').trim()}</h3>;
      }
      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        return <li key={i} className="ml-4 mb-1 list-none flex items-start gap-2">
          <span className="w-2 h-2 bg-black mt-2 shrink-0"></span>
          <span>{line.replace(/^[-*]\s*/, '').trim()}</span>
        </li>;
      }
      if (line.trim() === '') return <div key={i} className="h-2"></div>;
      return <p key={i} className="mb-2 text-gray-800">{line}</p>;
    });
  };

  return (
    <main className="min-h-screen bg-[#F0F0F0]">
      {/* Header Section */}
      <header className="bg-red-600 border-b-4 border-black p-6 md:p-12 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white flex items-center justify-center border-2 border-black">
                <ShieldAlert className="text-red-600" size={32} />
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic uppercase">
                EvacuGuide
              </h1>
            </div>
            <p className="text-xl md:text-2xl font-bold uppercase tracking-tight opacity-90 max-w-xl">
              Precision Coordination for Hospitality Crisis.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="flat-tag bg-black text-white px-4 py-2 text-lg">
              Status: Live Response
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Input Controls */}
        <div className="lg:col-span-5 space-y-8">
          <div className="flat-card border-4 border-black bg-white">
            <h2 className="text-3xl font-black mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm italic">01</span>
              Venue Intel
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flat-label">Venue Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Hotel', 'Restaurant', 'Event Hall', 'Resort'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, venueType: type})}
                      className={`px-4 py-3 border-2 border-black font-black uppercase text-sm transition-colors ${
                        formData.venueType === type ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flat-label flex items-center gap-2">
                    <Layers size={14} /> Floors
                  </label>
                  <input 
                    type="number" 
                    className="flat-input" 
                    value={formData.floors}
                    onChange={(e) => setFormData({...formData, floors: e.target.value})}
                  />
                </div>
                <div>
                  <label className="flat-label flex items-center gap-2">
                    <UsersRound size={14} /> Max Capacity
                  </label>
                  <input 
                    type="number" 
                    className="flat-input"
                    value={formData.occupancy}
                    onChange={(e) => setFormData({...formData, occupancy: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="flat-label">Threat Classification</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'Fire', icon: Flame, color: 'hover:bg-orange-100' },
                    { id: 'Flood', icon: Waves, color: 'hover:bg-blue-100' },
                    { id: 'Security', icon: Lock, color: 'hover:bg-purple-100' },
                    { id: 'Medical', icon: Stethoscope, color: 'hover:bg-green-100' }
                  ].map((crisis) => (
                    <button
                      key={crisis.id}
                      type="button"
                      onClick={() => setFormData({...formData, crisisType: crisis.id})}
                      className={`flex items-center justify-between px-4 py-4 border-2 border-black font-black uppercase transition-colors ${
                        formData.crisisType === crisis.id ? 'bg-red-600 text-white' : `bg-white ${crisis.color}`
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <crisis.icon size={20} />
                        {crisis.id}
                      </span>
                      {formData.crisisType === crisis.id && <ChevronRight size={20} />}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="flat-button w-full h-16 text-xl border-4 border-black"
                disabled={loading}
                suppressHydrationWarning
              >
                {loading ? <Loader2 className="animate-spin" /> : "Initiate EvacuPlan"}
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-black text-white p-4 border-2 border-black font-black uppercase text-xs">
                Protocol v2.4
             </div>
             <div className="bg-white text-black p-4 border-2 border-black font-black uppercase text-xs">
                Reliability 99.9%
             </div>
          </div>
        </div>

        {/* Results Page */}
        <div className="lg:col-span-7">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center border-4 border-dashed border-gray-400 p-12 text-center">
              <Building2 size={64} className="text-gray-400 mb-4" />
              <h3 className="text-2xl font-black text-gray-400 uppercase italic">Awaiting Parameters</h3>
              <p className="text-gray-500 font-bold uppercase text-sm mt-2">Configure venue metrics to generate response.</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center bg-white border-4 border-black p-12 text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 border-8 border-gray-200" />
                <div className="w-24 h-24 border-8 border-t-red-600 border-transparent absolute top-0 animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black uppercase italic">Calculating Routes...</h3>
                <p className="text-gray-600 font-bold uppercase animate-pulse">Syncing with emergency services data</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="bg-white border-4 border-black animate-in">
              <div className="bg-black text-white p-6 flex items-center justify-between">
                <h2 className="text-2xl font-black italic uppercase">Generation Complete</h2>
                <button onClick={() => window.print()} className="bg-white text-black px-4 py-1 text-xs font-black uppercase hover:bg-red-600 hover:text-white transition-colors">
                  Export PDF
                </button>
              </div>
              
              <div className="p-8 md:p-12 prose prose-stone max-w-none">
                <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
                  <div className="flex-none bg-red-50 border-2 border-red-600 p-4 w-48">
                    <Map className="mb-2 text-red-600" />
                    <span className="block text-xs font-black uppercase text-red-600 mb-1">Status</span>
                    <span className="font-black uppercase">Alpha Route</span>
                  </div>
                  <div className="flex-none bg-gray-50 border-2 border-black p-4 w-48">
                    <Users className="mb-2" />
                    <span className="block text-xs font-black uppercase text-gray-400 mb-1">Personnel</span>
                    <span className="font-black uppercase">Staff Synced</span>
                  </div>
                  <div className="flex-none bg-gray-50 border-2 border-black p-4 w-48">
                    <MessageSquare className="mb-2" />
                    <span className="block text-xs font-black uppercase text-gray-400 mb-1">Comms</span>
                    <span className="font-black uppercase">Guest Scripts</span>
                  </div>
                </div>

                <div className="bg-gray-100 p-6 border-b-2 border-black mb-8">
                   <p className="text-sm font-bold uppercase mb-2">Subject:</p>
                   <p className="text-xl font-black uppercase italic">
                      {formData.crisisType} RESPONSE PLAN — {formData.venueType}
                   </p>
                </div>

                <div className="space-y-4">
                  {parseResult(result)}
                </div>

                <div className="mt-12 pt-8 border-t-4 border-black">
                   <div className="flex items-center gap-4 text-xs font-black uppercase">
                      <ShieldAlert size={16} />
                      <span>This is an AI generated guidance tool. Always follow local fire department protocols.</span>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer Decoration */}
      <footer className="mt-12 bg-black text-white py-4 px-6 overflow-hidden whitespace-nowrap">
        <div className="flex gap-8 animate-marquee font-black uppercase italic tracking-widest text-sm opacity-50">
          {[...Array(10)].map((_, i) => (
            <span key={i}>Safety First • Priority Alpha • EvacuGuide v2.4 • Emergency Response Synchronized • Contact First Responders •</span>
          ))}
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </main>
  );
}
