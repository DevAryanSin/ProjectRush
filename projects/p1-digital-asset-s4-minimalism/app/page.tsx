'use client';

import React, { useState } from 'react';

export default function AuthentiProofPage() {
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    creationDate: '',
    format: '',
    platform: '',
    details: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    const promptText = `
Asset Title: ${formData.title}
Creator: ${formData.creator}
Creation Date: ${formData.creationDate}
File Format: ${formData.format}
Platform First Published: ${formData.platform}
Watermark/Signature Details: ${formData.details}
    `.trim();

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze asset');

      let parsedResult;
      try {
        const text = data.result.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedResult = JSON.parse(text);
      } catch (err) {
        parsedResult = { summary: data.result, score: 'N/A', signals: [], anomalies: [] };
      }

      setResult(parsedResult);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-24 px-6 sm:px-12">
      <div className="max-w-2xl mx-auto">
        <header className="mb-24">
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-[var(--navy)] mb-6">
            AuthentiProof.
          </h1>
          <p className="text-xl text-slate-500 font-light leading-relaxed">
            Describe your asset's metadata — get an authenticity confidence score.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Asset Title"
              className="minimal-input"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <input
              type="text"
              name="creator"
              value={formData.creator}
              onChange={handleChange}
              placeholder="Creator Attribution"
              className="minimal-input"
              required
            />
            <input
              type="text"
              name="creationDate"
              value={formData.creationDate}
              onChange={handleChange}
              placeholder="Creation Date (e.g. YYYY-MM-DD)"
              className="minimal-input"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
             <input
              type="text"
              name="format"
              value={formData.format}
              onChange={handleChange}
              placeholder="File Format (e.g. MP4, RAW)"
              className="minimal-input"
              required
            />
             <input
              type="text"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              placeholder="Platform First Published"
              className="minimal-input"
              required
            />
          </div>
          
          <div>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Watermark, Signature, or Camera Metadata details"
              className="w-full bg-transparent border-b border-[var(--border)] py-4 px-0 focus:outline-none focus:border-[var(--navy)] transition-colors placeholder:text-slate-400 text-lg resize-none min-h-[120px]"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            suppressHydrationWarning
            className="minimal-button relative overflow-hidden group"
          >
            <span className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              Authenticate Asset
            </span>
            {isLoading && (
              <span className="absolute inset-0 flex items-center justify-center fade-in text-[var(--accent)]">
                Analyzing Metadata...
              </span>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-16 p-6 border border-slate-200 bg-white text-red-800 text-sm tracking-wide fade-in shadow-sm">
            ERROR: {error}
          </div>
        )}

        {result && (
          <div className="mt-24 fade-in">
            <div className="section-divider"></div>
            
            <div className="mb-16">
              <h2 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-4">Confidence Score</h2>
              <div className="text-7xl sm:text-8xl font-light text-[var(--navy)]">
                {result.score}%
              </div>
            </div>

            <div className="space-y-16">
              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-6">Verification Summary</h3>
                <p className="text-xl text-slate-800 leading-relaxed font-light">
                  {result.summary}
                </p>
              </div>

              {result.signals && result.signals.length > 0 && (
                <div>
                   <h3 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-6">Originality Signals</h3>
                   <ul className="space-y-4">
                     {result.signals.map((s: string, i: number) => (
                       <li key={i} className="flex gap-6 border-b border-[var(--border)] pb-4 items-start">
                         <span className="text-[var(--accent)] font-medium mt-1 uppercase text-xs tracking-widest">POS</span>
                         <span className="text-slate-800 text-lg font-light leading-relaxed">{s}</span>
                       </li>
                     ))}
                   </ul>
                </div>
              )}

              {result.anomalies && result.anomalies.length > 0 && (
                <div>
                   <h3 className="text-xs tracking-[0.2em] uppercase text-red-800 mb-6">Suspicious Anomalies</h3>
                   <ul className="space-y-4">
                     {result.anomalies.map((a: string, i: number) => (
                       <li key={i} className="flex gap-6 border-b border-[var(--border)] pb-4 items-start">
                         <span className="text-red-700 font-medium mt-1 uppercase text-xs tracking-widest">ERR</span>
                         <span className="text-slate-800 text-lg font-light leading-relaxed">{a}</span>
                       </li>
                     ))}
                   </ul>
                </div>
              )}
            </div>
            
            <div className="section-divider mb-8"></div>
            <p className="text-center text-xs text-slate-400 tracking-widest uppercase">
              End of Report
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
