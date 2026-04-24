'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Fingerprint, 
  Binary, 
  Cpu, 
  AlertTriangle, 
  ChevronRight, 
  Loader2,
  Copy,
  CheckCircle2,
  Download
} from 'lucide-react';

export default function WatermarkIQ() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    assetTitle: '',
    creatorName: '',
    organization: '',
    assetType: 'Video',
    creationDate: ''
  });

  useEffect(() => {
    setMounted(true);
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, creationDate: today }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const prompt = `Asset Details:
    - Title: ${formData.assetTitle}
    - Creator: ${formData.creatorName}
    - Organization: ${formData.organization}
    - Type: ${formData.assetType}
    - Created On: ${formData.creationDate}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Generation failed');
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="mb-12 border-b-[8px] border-black pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="brutalist-badge">AUTHENTICATION PROTOCOL v1.0</div>
            <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter">
              WATERMARK<span className="text-white bg-black px-2">IQ</span>
            </h1>
            <p className="text-xl md:text-2xl font-bold uppercase tracking-tight max-w-2xl">
              Generate invisible watermark signatures for any digital asset. 
              Protect your intellectual property with AI-encoded steganography.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="brutalist-card p-4 bg-black text-[#eaff00] flex items-center gap-4">
              <Binary size={48} strokeWidth={3} />
              <div className="font-black leading-none">
                <div className="text-2xl">SECURED</div>
                <div className="text-sm">END-TO-END</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Input Form Section */}
        <section className="lg:col-span-5">
          <div className="brutalist-card p-6 md:p-8">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
              <ShieldCheck size={32} /> ASSET DATA
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="brutalist-label">Asset Title</label>
                <input
                  required
                  type="text"
                  name="assetTitle"
                  placeholder="E.G. CHAMPIONSHIP HIGHLIGHTS 2024"
                  className="brutalist-input"
                  value={formData.assetTitle}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="brutalist-label">Creator Name</label>
                  <input
                    required
                    type="text"
                    name="creatorName"
                    placeholder="NAME"
                    className="brutalist-input"
                    value={formData.creatorName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="brutalist-label">Organization</label>
                  <input
                    required
                    type="text"
                    name="organization"
                    placeholder="ORG"
                    className="brutalist-input"
                    value={formData.organization}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="brutalist-label">Asset Type</label>
                  <select
                    name="assetType"
                    className="brutalist-input appearance-none"
                    value={formData.assetType}
                    onChange={handleInputChange}
                  >
                    <option>Video</option>
                    <option>Image</option>
                    <option>Audio</option>
                    <option>PDF / Document</option>
                    <option>3D Model</option>
                  </select>
                </div>
                <div>
                  <label className="brutalist-label">Creation Date</label>
                  <input
                    required
                    type="date"
                    name="creationDate"
                    className="brutalist-input"
                    value={formData.creationDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="brutalist-button text-2xl mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> ENCODING...
                  </>
                ) : (
                  <>
                    GENERATE SIGNATURE <ChevronRight size={28} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 brutalist-card p-4 bg-black text-[#eaff00] flex items-start gap-4">
            <AlertTriangle className="shrink-0" size={24} />
            <p className="font-bold text-sm uppercase">
              Warning: Once a signature is generated, it is unique and should be kept confidential. 
              Multiple signatures for the same asset may cause authentication conflicts.
            </p>
          </div>
        </section>

        {/* Results Section */}
        <section className="lg:col-span-7">
          {!result && !loading && !error && (
            <div className="h-full min-h-[400px] border-4 border-dashed border-black flex flex-col items-center justify-center p-12 text-center opacity-40">
              <Cpu size={80} strokeWidth={1} className="mb-6" />
              <h3 className="text-2xl font-black uppercase">Awaiting Input</h3>
              <p className="font-bold">Provide asset details to generate a unique digital signature.</p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] brutalist-card p-12 flex flex-col items-center justify-center text-center bg-white">
              <div className="relative mb-8">
                <Loader2 size={100} strokeWidth={3} className="animate-spin text-[#eaff00]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Fingerprint size={40} className="text-black" />
                </div>
              </div>
              <h3 className="text-4xl font-black mb-4">PROCESSING HASH</h3>
              <div className="w-full bg-black h-4 border-2 border-black overflow-hidden">
                <div className="bg-[#eaff00] h-full animate-[loading_2s_infinite_linear]" style={{ width: '30%' }}></div>
              </div>
            </div>
          )}

          {error && (
            <div className="brutalist-card p-8 bg-red-100 border-red-600">
              <h3 className="text-2xl font-black text-red-600 mb-4 flex items-center gap-2">
                <AlertTriangle /> SYSTEM ERROR
              </h3>
              <p className="font-bold text-lg text-red-800">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-6 px-4 py-2 border-2 border-black font-black uppercase hover:bg-black hover:text-white transition-colors"
              >
                Dismiss
              </button>
            </div>
          )}

          {result && (
            <div className="brutalist-card bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 bg-black text-[#eaff00] flex justify-between items-center">
                <h3 className="text-2xl font-black flex items-center gap-2">
                  <Fingerprint /> WATERMARK GENERATED
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={copyToClipboard}
                    className="p-2 border-2 border-[#eaff00] hover:bg-[#eaff00] hover:text-black transition-colors"
                    title="Copy Signature"
                  >
                    {copied ? <CheckCircle2 size={24} /> : <Copy size={24} />}
                  </button>
                  <button className="p-2 border-2 border-[#eaff00] hover:bg-[#eaff00] hover:text-black transition-colors" title="Download Report">
                    <Download size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                <div className="prose prose-xl max-w-none font-bold">
                  {result.split('\n').map((line, i) => {
                    if (line.startsWith('#') || line.toUpperCase().includes('SIGNATURE') || line.toUpperCase().includes('TOKEN')) {
                      return <h4 key={i} className="text-2xl font-black mt-6 mb-2 text-black uppercase">{line.replace(/^#+\s*/, '')}</h4>;
                    }
                    if (line.trim() === '') return <br key={i} />;
                    return <p key={i} className="mb-4 leading-relaxed">{line}</p>;
                  })}
                </div>

                <div className="mt-8 pt-8 border-t-4 border-black">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px] border-4 border-black p-4 bg-[#eaff00]">
                      <div className="text-xs font-black uppercase">Tracking Status</div>
                      <div className="text-2xl font-black">ACTIVE</div>
                    </div>
                    <div className="flex-1 min-w-[200px] border-4 border-black p-4 bg-black text-white">
                      <div className="text-xs font-black uppercase">Encryption Level</div>
                      <div className="text-2xl font-black">AES-256-X</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Decorative Footer */}
      <footer className="mt-24 border-t-[8px] border-black pt-8 pb-12 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-4xl font-black mx-8">
              WATERMARKIQ // PROTECTION PROTOCOL // UNTRACEABLE STEGANOGRAPHY // ASSET AUTHENTICATION // 
            </span>
          ))}
        </div>
      </footer>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </main>
  );
}
