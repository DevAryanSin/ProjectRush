'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, Cpu, AlertTriangle, Send, Loader2 } from 'lucide-react';

export default function CrisisScript() {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    emergencyType: '',
    venueName: '',
    currentStatus: '',
    audience: '',
    tone: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const resultEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (result && resultEndRef.current) {
      resultEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.emergencyType || !formData.venueName || !formData.currentStatus) {
      setError('ERROR: REQUIRED FIELDS MISSING. ABORTING OPERATION.');
      return;
    }

    setError('');
    setResult('');
    setLoading(true);

    const promptText = `
Emergency Type: ${formData.emergencyType}
Venue Name: ${formData.venueName}
Current Status: ${formData.currentStatus}
Audience: ${formData.audience || 'General Public & Staff'}
Tone Needed: ${formData.tone || 'Calm, authoritative, clear'}
    `.trim();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'SYSTEM FAILURE. CONNECTION REFUSED.');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(`FATAL EXCEPTION: ${err.message || 'UNKNOWN ERROR OCCURRED'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col max-w-5xl mx-auto relative z-10">
      <div className="scanline-overlay"></div>
      
      {/* Header */}
      <header className="mb-8 border-b-2 border-[#39ff14] border-dashed pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Terminal className="w-8 h-8 text-[#39ff14]" />
          <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-[#39ff14] uppercase drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]">
            CrisisScript
          </h1>
        </div>
        <p className="text-[#008f11] text-sm md:text-base mt-2 flex items-center">
          <span className="mr-2 text-[#39ff14]">&gt;</span> 
          Generate public announcement scripts for any emergency type instantly
        </p>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Form Section */}
        <section className="terminal-box p-6 relative">
          <div className="absolute top-0 left-0 bg-[#39ff14] text-black text-xs font-bold px-2 py-1 uppercase">
            Input_Parameters
          </div>
          
          <form onSubmit={handleSubmit} className="mt-4 space-y-6">
            <div className="space-y-2">
              <label className="block text-[#008f11] text-sm uppercase">
                <span className="text-[#39ff14] mr-2">root@system:~#</span> Emergency Type *
              </label>
              <div className="flex items-center">
                <span className="text-[#39ff14] mr-2">&gt;</span>
                <input
                  type="text"
                  name="emergencyType"
                  value={formData.emergencyType}
                  onChange={handleInputChange}
                  className="terminal-input py-1"
                  placeholder="e.g. Fire, Active Shooter, Power Outage"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[#008f11] text-sm uppercase">
                <span className="text-[#39ff14] mr-2">root@system:~#</span> Venue Name *
              </label>
              <div className="flex items-center">
                <span className="text-[#39ff14] mr-2">&gt;</span>
                <input
                  type="text"
                  name="venueName"
                  value={formData.venueName}
                  onChange={handleInputChange}
                  className="terminal-input py-1"
                  placeholder="e.g. Grand Plaza Hotel"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[#008f11] text-sm uppercase">
                <span className="text-[#39ff14] mr-2">root@system:~#</span> Current Status *
              </label>
              <div className="flex items-center">
                <span className="text-[#39ff14] mr-2">&gt;</span>
                <input
                  type="text"
                  name="currentStatus"
                  value={formData.currentStatus}
                  onChange={handleInputChange}
                  className="terminal-input py-1"
                  placeholder="e.g. Evacuating 3rd floor, fire contained"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[#008f11] text-sm uppercase">
                <span className="text-[#39ff14] mr-2">root@system:~#</span> Target Audience
              </label>
              <div className="flex items-center">
                <span className="text-[#39ff14] mr-2">&gt;</span>
                <input
                  type="text"
                  name="audience"
                  value={formData.audience}
                  onChange={handleInputChange}
                  className="terminal-input py-1"
                  placeholder="e.g. Guests, Staff, Media (optional)"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[#008f11] text-sm uppercase">
                <span className="text-[#39ff14] mr-2">root@system:~#</span> Desired Tone
              </label>
              <div className="flex items-center">
                <span className="text-[#39ff14] mr-2">&gt;</span>
                <input
                  type="text"
                  name="tone"
                  value={formData.tone}
                  onChange={handleInputChange}
                  className="terminal-input py-1"
                  placeholder="e.g. Urgent, Calm, Firm (optional)"
                  autoComplete="off"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-3 border border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14] hover:text-black transition-colors font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  PROCESSING...
                </>
              ) : (
                <>
                  [ &gt; EXECUTE ]
                </>
              )}
            </button>
          </form>
        </section>

        {/* Output Output Section */}
        <section className="terminal-box p-6 relative flex flex-col min-h-[500px]">
          <div className="absolute top-0 right-0 bg-[#00ffff] text-black text-xs font-bold px-2 py-1 uppercase">
            Output_Buffer
          </div>
          
          <div className="mt-4 flex-grow overflow-auto">
            {error && (
              <div className="text-red-500 mb-4 p-3 border border-red-500 bg-red-950/30 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold">SYSTEM_ERROR</p>
                  <p className="text-sm break-words">{error}</p>
                </div>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="h-full flex flex-col items-center justify-center text-[#008f11] opacity-50 space-y-4">
                <ShieldAlert className="w-16 h-16" />
                <p className="uppercase tracking-widest text-sm text-center">
                  Awaiting input parameters...<br />
                  System on standby
                </p>
              </div>
            )}

            {loading && (
              <div className="space-y-2 text-[#39ff14]">
                <p>&gt; Initializing connection to Gemini-2.5-Flash node...</p>
                <p className="animate-pulse">&gt; Compiling emergency parameters...</p>
                <p>&gt; Generating contextual scripts...</p>
                <div className="flex gap-1 mt-4">
                  <div className="w-2 h-4 bg-[#39ff14] animate-bounce"></div>
                  <div className="w-2 h-4 bg-[#39ff14] animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-4 bg-[#39ff14] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="text-[#00ffff] border-b border-[#00ffff]/30 pb-2 flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  <span className="uppercase font-bold tracking-widest">Operation_Successful</span>
                </div>
                
                <div className="prose prose-invert prose-p:text-[#39ff14] prose-headings:text-[#00ffff] prose-strong:text-[#39ff14] prose-li:text-[#39ff14] max-w-none text-sm md:text-base leading-relaxed whitespace-pre-wrap font-mono pb-8">
                  {result.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i} className="text-[#00ffff] block mt-6 mb-2 text-lg underline decoration-dashed underline-offset-4">{part.replace(/\*\*/g, '')}</strong>;
                    }
                    // Handle list items manually since whitespace-pre-wrap might not style standard markdown lists perfectly
                    return <span key={i}>{part}</span>;
                  })}
                </div>
                <div ref={resultEndRef} />
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#008f11] flex justify-between text-xs text-[#008f11]">
            <span>STATUS: {loading ? 'PROCESSING' : result ? 'COMPLETED' : 'IDLE'}</span>
            <span className="flex items-center">
              SECURE_CONN <span className="inline-block w-2 h-2 rounded-full bg-[#39ff14] ml-2 animate-pulse"></span>
            </span>
          </div>
        </section>

      </main>
    </div>
  );
}
