'use client';

import { useState } from 'react';
import { ShieldCheck, Send, AlertOctagon, RefreshCw, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function DMCAForge() {
  const [formData, setFormData] = useState({
    rightsHolder: '',
    description: '',
    originalUrl: '',
    infringingUrl: '',
    date: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rightsHolder || !formData.description || !formData.infringingUrl) {
        setError("Please fill out required fields (Rights Holder, Description, Infringing URL)");
        return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);

    const promptString = `Rights Holder: ${formData.rightsHolder}\nAsset Description: ${formData.description}\nOriginal URL: ${formData.originalUrl || 'Not provided'}\nInfringing URL: ${formData.infringingUrl}\nDate of Infringement: ${formData.date || 'Not provided'}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptString }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate notice');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearForm = () => {
    setFormData({
        rightsHolder: '',
        description: '',
        originalUrl: '',
        infringingUrl: '',
        date: ''
    });
    setResult(null);
    setError(null);
  };

  const formatResult = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (!line.trim()) return <div key={idx} className="h-4" />;
      
      const parts = line.split(/(\*\*.*?\*\*)/g);
      
      return (
        <p key={idx} className="mb-2 text-[#050B14] leading-relaxed text-lg">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-black bg-[#FFD600] px-1">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F2F5]">
      {/* HEADER ENTIRELY FLAT NO SHADOWS */}
      <header className="bg-[#050B14] text-[#FFFFFF] border-b-8 border-[#FFD600] py-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck size={40} className="text-[#FFD600]" strokeWidth={2.5} />
                    <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#FFD600] m-0 leading-none">DMCA FORGE</h1>
                </div>
                <h2 className="text-xl md:text-2xl font-bold uppercase text-[#F0F2F5] m-0 tracking-wide mt-2">Protecting the Integrity of Digital Sports Media</h2>
            </div>
            <div className="bg-[#FF2E00] text-white px-4 py-2 font-black text-xl border-4 border-white inline-flex items-center gap-2 self-start md:self-center">
                <AlertOctagon strokeWidth={3} />
                <span>ACTIVE ENFORCEMENT</span>
            </div>
        </div>
      </header>

      <main className="flex-grow p-6 lg:p-12 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: FORM */}
            <div className="lg:col-span-5 flex flex-col h-full">
                <div className="bg-[#FFD600] border-4 border-[#050B14] p-6 mb-8 flex items-center gap-4">
                     <FileText size={32} className="text-[#050B14]" strokeWidth={2.5} />
                     <div>
                        <h3 className="text-2xl m-0 leading-none text-[#050B14]">ASSET DETAILS</h3>
                        <p className="font-bold text-[#050B14] mt-1 text-sm uppercase">Fill out the incident report</p>
                     </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-grow">
                    <div className="flex flex-col gap-2">
                        <label className="font-black text-lg uppercase flex items-center gap-2 text-[#050B14]">
                            <ChevronRight size={20} className="text-[#FF2E00]" strokeWidth={4} /> Rights Holder Name *
                        </label>
                        <input 
                            type="text" 
                            name="rightsHolder"
                            className="flat-input" 
                            placeholder="e.g. Global Sports Entertainment Inc."
                            value={formData.rightsHolder}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-black text-lg uppercase flex items-center gap-2 text-[#050B14]">
                            <ChevronRight size={20} className="text-[#FF2E00]" strokeWidth={4} /> Asset Description *
                        </label>
                        <textarea 
                            name="description"
                            className="flat-input resize-none" 
                            placeholder="Describe the original copyrighted work in detail..."
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="font-black text-lg uppercase flex items-center gap-2 text-[#050B14]">
                                <ChevronRight size={20} className="text-[#FF2E00]" strokeWidth={4} /> Original URL
                            </label>
                            <input 
                                type="url" 
                                name="originalUrl"
                                className="flat-input" 
                                placeholder="https://..."
                                value={formData.originalUrl}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-black text-lg uppercase flex items-center gap-2 text-[#050B14]">
                                <ChevronRight size={20} className="text-[#FF2E00]" strokeWidth={4} /> Date Found
                            </label>
                            <input 
                                type="date" 
                                name="date"
                                className="flat-input" 
                                value={formData.date}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-black text-lg uppercase flex items-center gap-2 text-[#FF2E00]">
                            <AlertOctagon size={20} strokeWidth={3} /> Infringing URL *
                        </label>
                        <input 
                            type="url" 
                            name="infringingUrl"
                            className="flat-input border-4 border-[#FF2E00] focus:border-[#050B14]" 
                            placeholder="https://..."
                            value={formData.infringingUrl}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="mt-4 mt-auto pt-6">
                        <button 
                            type="submit" 
                            className="flat-button"
                            disabled={loading}
                            suppressHydrationWarning
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="animate-spin text-[#050B14]" size={24} strokeWidth={3} />
                                    <span>Forging Notice...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={24} strokeWidth={3} />
                                    <span>Draft Takedown Notice</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* RIGHT COLUMN: RESULTS */}
            <div className="lg:col-span-7 flex flex-col h-full mt-12 lg:mt-0">
                <div className="bg-[#050B14] border-4 border-[#050B14] p-6 mb-8 flex items-center gap-4 text-white hover:bg-[#0A1428] transition-colors">
                     <CheckCircle2 size={32} className="text-[#FFD600]" strokeWidth={2.5} />
                     <div>
                        <h3 className="text-2xl m-0 leading-none text-[#FFD600]">GENERATED NOTICE</h3>
                        <p className="font-bold mt-1 text-sm uppercase text-[#CED4DA]">Ready for submission</p>
                     </div>
                </div>

                <div className="flat-panel flex-grow p-8 min-h-[500px] flex flex-col relative shadow-none">
                    {error && (
                        <div className="bg-[#FF2E00] text-white p-6 border-4 border-[#050B14] mb-6 flex items-start gap-4">
                            <AlertOctagon size={32} strokeWidth={2.5} className="shrink-0 mt-1" />
                            <div>
                                <h4 className="text-xl font-black m-0 mb-2 uppercase">System Error</h4>
                                <p className="font-bold">{error}</p>
                            </div>
                        </div>
                    )}

                    {!result && !error && !loading && (
                        <div className="flex-grow flex flex-col items-center justify-center text-center opacity-30 mt-12 mb-12">
                            <ShieldCheck size={120} strokeWidth={1} className="mb-6 text-[#050B14]" />
                            <h3 className="text-3xl font-black text-[#050B14]">AWAITING INPUT</h3>
                            <p className="font-bold uppercase tracking-widest mt-2 text-[#050B14]">Fill the form to generate a DMCA notice</p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex-grow flex flex-col items-center justify-center text-center mt-12 mb-12">
                            <div className="animate-pulse bg-[#FFD600] w-24 h-24 border-4 border-[#050B14] flex items-center justify-center mb-6 shadow-none">
                                <RefreshCw className="animate-spin text-[#050B14]" size={48} strokeWidth={2} />
                            </div>
                            <h3 className="text-3xl font-black text-[#050B14]">PROCESSING EVIDENCE</h3>
                            <p className="font-bold uppercase tracking-widest mt-2 text-[#050B14] animate-pulse">Drafting legal documentation...</p>
                        </div>
                    )}

                    {result && !loading && (
                        <div className="flex-grow flex flex-col h-full animate-in fade-in duration-500">
                            <div className="flex flex-col flex-grow">
                                {formatResult(result)}
                            </div>
                            <div className="mt-12 pt-6 border-t-4 border-[#050B14] flex flex-col sm:flex-row gap-4 justify-between items-center">
                                <span className="font-black text-sm uppercase px-4 py-2 bg-[#050B14] text-[#FFD600] border-2 border-[#050B14]">
                                    END OF DOCUMENT
                                </span>
                                <button 
                                    onClick={clearForm}
                                    className="bg-transparent border-4 border-[#050B14] text-[#050B14] px-6 py-2 font-black uppercase hover:bg-[#050B14] hover:text-[#FFD600] transition-colors flex items-center gap-2"
                                    suppressHydrationWarning
                                >
                                    <RefreshCw size={18} strokeWidth={3} /> Start New
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
