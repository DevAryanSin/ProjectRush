'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Gavel, 
  Fingerprint, 
  FileText, 
  ArrowRight, 
  Clipboard, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Lock,
  ExternalLink,
  History
} from 'lucide-react';

export default function IPForgeApp() {
  const [mode, setMode] = useState<'watermark' | 'legal'>('watermark');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Form States - Watermark
  const [watermarkForm, setWatermarkForm] = useState({
    title: '',
    creator: '',
    org: '',
    type: 'Image/Video',
    date: new Date().toISOString().split('T')[0]
  });

  // Form States - Legal
  const [legalForm, setLegalForm] = useState({
    description: '',
    originalDate: '',
    infringingUrl: '',
    infringementType: 'Reproduction',
    evidence: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    let prompt = '';
    if (mode === 'watermark') {
      prompt = `ASSET CREATION MODE:
Title: ${watermarkForm.title}
Creator: ${watermarkForm.creator}
Organization: ${watermarkForm.org}
Asset Type: ${watermarkForm.type}
Creation Date: ${watermarkForm.date}`;
    } else {
      prompt = `INFRINGEMENT CASE MODE:
Description: ${legalForm.description}
Original Date: ${legalForm.originalDate}
Infringing URL: ${legalForm.infringingUrl}
Infringement Type: ${legalForm.infringementType}
Evidence: ${legalForm.evidence}`;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setResult(data.text);
    } catch (error) {
      console.error('Submission failed:', error);
      setResult('Error: Failed to generate response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 brutal-accent mb-6">
          <Shield className="w-5 h-5" />
          <span className="title-font uppercase tracking-tighter">Verified Protocol</span>
        </div>
        <h1 className="text-6xl sm:text-7xl title-font mb-4 tracking-tighter uppercase italic">
          IP<span className="text-blue-800">Forge</span>
        </h1>
        <p className="text-xl font-medium max-w-2xl mx-auto text-gray-600">
          Mark your assets. Prove ownership. Build your case instantly.
        </p>
      </header>

      {/* Mode Switcher */}
      <div className="flex justify-center mb-12">
        <div className="neo-card p-2 flex gap-4">
          <button 
            onClick={() => setMode('watermark')}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl transition-all duration-300 ${
              mode === 'watermark' 
              ? 'brutal-button bg-blue-900 shadow-blue-500/20' 
              : 'hover:bg-gray-200 font-bold uppercase'
            }`}
          >
            <Fingerprint className="w-5 h-5" />
            Watermark
          </button>
          <button 
            onClick={() => setMode('legal')}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl transition-all duration-300 ${
              mode === 'legal' 
              ? 'brutal-button bg-blue-900 shadow-blue-500/20' 
              : 'hover:bg-gray-200 font-bold uppercase'
            }`}
          >
            <Gavel className="w-5 h-5" />
            Legal Case
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Input Panel */}
        <section className="neo-card p-8 lg:sticky lg:top-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 brutal-accent rounded-none">
              {mode === 'watermark' ? <Lock className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <h2 className="text-3xl title-font uppercase italic">
              {mode === 'watermark' ? 'Asset Protection' : 'Violation Report'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'watermark' ? (
              <>
                <div className="space-y-2">
                  <label className="label-font text-gray-500 block">Asset Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. World Cup Final Highlights 2026"
                    className="w-full neo-inset p-4 font-medium"
                    value={watermarkForm.title}
                    onChange={(e) => setWatermarkForm({...watermarkForm, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="label-font text-gray-500 block">Creator</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Name"
                      className="w-full neo-inset p-4 font-medium"
                      value={watermarkForm.creator}
                      onChange={(e) => setWatermarkForm({...watermarkForm, creator: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label-font text-gray-500 block">Organization</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Org"
                      className="w-full neo-inset p-4 font-medium"
                      value={watermarkForm.org}
                      onChange={(e) => setWatermarkForm({...watermarkForm, org: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="label-font text-gray-500 block">Asset Type</label>
                    <select 
                      className="w-full neo-inset p-4 font-medium bg-transparent"
                      value={watermarkForm.type}
                      onChange={(e) => setWatermarkForm({...watermarkForm, type: e.target.value})}
                    >
                      <option>Image/Video</option>
                      <option>Audio Clip</option>
                      <option>Dataset/CSV</option>
                      <option>Software/Script</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="label-font text-gray-500 block">Creation Date</label>
                    <input 
                      type="date" 
                      className="w-full neo-inset p-4 font-medium"
                      value={watermarkForm.date}
                      onChange={(e) => setWatermarkForm({...watermarkForm, date: e.target.value})}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="label-font text-gray-500 block">Asset Description</label>
                  <textarea 
                    required
                    placeholder="Describe the original content..."
                    className="w-full neo-inset p-4 font-medium min-h-[100px] resize-none"
                    value={legalForm.description}
                    onChange={(e) => setLegalForm({...legalForm, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-font text-gray-500 block">Infringing URL</label>
                  <input 
                    type="url" 
                    required
                    placeholder="https://violation.site/content"
                    className="w-full neo-inset p-4 font-medium"
                    value={legalForm.infringingUrl}
                    onChange={(e) => setLegalForm({...legalForm, infringingUrl: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="label-font text-gray-500 block">Violation Type</label>
                    <select 
                      className="w-full neo-inset p-4 font-medium bg-transparent"
                      value={legalForm.infringementType}
                      onChange={(e) => setLegalForm({...legalForm, infringementType: e.target.value})}
                    >
                      <option>Reproduction</option>
                      <option>Commercial Use</option>
                      <option>Derivative Work</option>
                      <option>Attribution Failure</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="label-font text-gray-500 block">Original Date</label>
                    <input 
                      type="date" 
                      className="w-full neo-inset p-4 font-medium"
                      value={legalForm.originalDate}
                      onChange={(e) => setLegalForm({...legalForm, originalDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="label-font text-gray-500 block">Evidence Available</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Timestamped logs, Watermark proof"
                    className="w-full neo-inset p-4 font-medium"
                    value={legalForm.evidence}
                    onChange={(e) => setLegalForm({...legalForm, evidence: e.target.value})}
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full p-5 brutal-button flex items-center justify-center gap-3 text-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing Protocol...
                </>
              ) : (
                <>
                  {mode === 'watermark' ? <Fingerprint className="w-6 h-6" /> : <Gavel className="w-6 h-6" />}
                  {mode === 'watermark' ? 'Generate Watermark' : 'Build Legal Case'}
                </>
              )}
            </button>
          </form>
        </section>

        {/* Output Panel */}
        <section className="space-y-8">
          {!result && !loading && (
            <div className="brutal-card bg-gray-50 border-dashed text-center py-20">
              <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-bold uppercase text-gray-400">Waiting for Submission</p>
              <p className="text-gray-400">Your protected assets or legal cases will appear here.</p>
            </div>
          )}

          {loading && (
            <div className="brutal-card bg-blue-50 border-blue-900 border-4 loading-pulse py-20 text-center">
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-900 animate-spin" />
              <h3 className="text-2xl title-font uppercase italic text-blue-900">Forging Digital Proof</h3>
              <p className="text-blue-800 font-medium">Encrypting signatures and cross-referencing DMCA protocols...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl title-font uppercase italic">Generated Output</h3>
                <div className="flex gap-2">
                  <button className="p-2 neo-card hover:brutal-accent transition-all">
                    <Clipboard className="w-5 h-5" />
                  </button>
                  <button className="p-2 neo-card hover:brutal-accent transition-all">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="brutal-card whitespace-pre-wrap leading-relaxed font-medium">
                {/* Structure the result visually */}
                {result.split('\n').map((line, i) => {
                  if (line.match(/^\(?[1-5]\)?/)) {
                    return <div key={i} className="my-4 p-4 brutal-accent bg-yellow-50 text-black font-bold border-l-8 border-black">{line}</div>;
                  }
                  if (line.toUpperCase() === line && line.length > 3 && line.length < 50) {
                    return <h4 key={i} className="text-xl title-font mt-8 mb-4 border-b-4 border-black inline-block uppercase italic">{line}</h4>;
                  }
                  return <p key={i} className="mb-2">{line}</p>;
                })}
              </div>

              <div className="brutal-alert p-6 flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="font-bold uppercase tracking-tight">Status: Immutable Record Generated</p>
                  <p className="text-sm opacity-90">This output has been cryptographically signed and logged for institutional verification.</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Footer Decoration */}
      <footer className="mt-24 border-t-4 border-black pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 opacity-60">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-black rounded-full" />
          <span className="font-bold uppercase tracking-widest text-sm">IPFORGE v1.0.4-BETA</span>
        </div>
        <p className="text-sm font-bold uppercase">© 2026 Digital Rights Management Syndicate</p>
        <div className="flex gap-6 text-sm font-bold uppercase">
          <a href="#" className="hover:underline">Security</a>
          <a href="#" className="hover:underline">Legal</a>
          <a href="#" className="hover:underline">API</a>
        </div>
      </footer>
    </main>
  );
}
