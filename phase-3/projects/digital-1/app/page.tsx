'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Gavel, 
  Fingerprint, 
  FileText, 
  ArrowRight, 
  Copy, 
  CheckCircle2, 
  AlertOctagon,
  Cpu,
  Scale,
  Zap,
  Clock,
  ExternalLink,
  ChevronRight,
  Database,
  Lock,
  Search,
  Download
} from 'lucide-react';

export default function IPForgeApp() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'watermark' | 'legal'>('watermark');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Form States
  const [watermarkForm, setWatermarkForm] = useState({
    title: '',
    creator: '',
    org: '',
    type: 'Video/Image',
    date: ''
  });

  const [legalForm, setLegalForm] = useState({
    description: '',
    originalDate: '',
    infringingUrl: '',
    infringementType: 'Reproduction',
    evidence: ''
  });

  useEffect(() => {
    setMounted(true);
    setWatermarkForm(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
  }, []);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    let prompt = '';
    if (mode === 'watermark') {
      prompt = `WATERMARK GENERATION REQUEST:
- Asset Title: ${watermarkForm.title}
- Creator: ${watermarkForm.creator}
- Organization: ${watermarkForm.org}
- Asset Type: ${watermarkForm.type}
- Creation Date: ${watermarkForm.date}`;
    } else {
      prompt = `LEGAL CASE BUILDER REQUEST:
- Asset Description: ${legalForm.description}
- Original Publish Date: ${legalForm.originalDate}
- Infringing URL: ${legalForm.infringingUrl}
- Type of Infringement: ${legalForm.infringementType}
- Evidence Available: ${legalForm.evidence}`;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.text);
    } catch (error: any) {
      console.error('Protocol Error:', error);
      setResult(`ERROR: System protocol failed to synchronize. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen selection:bg-yellow-400 selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#e5e7eb]/80 backdrop-blur-md border-b-2 border-black/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-900 p-1.5 border-2 border-black">
            <Shield className="w-6 h-6 text-yellow-400" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">IP<span className="text-blue-900">Forge</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-gray-500">
          <a href="#" className="hover:text-blue-900 transition-colors">Documentation</a>
          <a href="#" className="hover:text-blue-900 transition-colors">Legal Framework</a>
          <div className="brutal-tag">v2.5-FLASH ACTIVE</div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 animate-bounce">
            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Priority DRM Protection</span>
          </div>
          <h1 className="text-6xl md:text-8xl mb-6 leading-none">
            DEFEND YOUR <span className="text-stroke text-transparent">ASSETS</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Mark your assets. Prove ownership. Build your case instantly. <br className="hidden md:block" />
            The unified protocol for digital sports media protection.
          </p>
        </header>

        {/* Mode Switcher */}
        <div className="mode-switch-container">
          <button 
            onClick={() => { setMode('watermark'); setResult(null); }}
            className={`mode-switch-btn flex items-center gap-2 ${mode === 'watermark' ? 'active' : 'inactive'}`}
          >
            <Fingerprint className="w-4 h-4" />
            Watermark Gen
          </button>
          <button 
            onClick={() => { setMode('legal'); setResult(null); }}
            className={`mode-switch-btn flex items-center gap-2 ${mode === 'legal' ? 'active' : 'inactive'}`}
          >
            <Scale className="w-4 h-4" />
            Legal Case Builder
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-12">
            <div className="neo-panel p-8 scanline">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-black text-white rounded-xl shadow-lg">
                  {mode === 'watermark' ? <Database className="w-6 h-6" /> : <Search className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-2xl italic leading-tight">
                    {mode === 'watermark' ? 'Asset Registration' : 'Violation Analysis'}
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Module Phase 01</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'watermark' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Asset Title</label>
                      <input 
                        type="text" 
                        required
                        placeholder="NBA Finals Game 7 Highlights"
                        className="w-full brutal-input"
                        value={watermarkForm.title}
                        onChange={(e) => setWatermarkForm({...watermarkForm, title: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Creator</label>
                        <input 
                          type="text" 
                          required
                          placeholder="John Doe"
                          className="w-full brutal-input"
                          value={watermarkForm.creator}
                          onChange={(e) => setWatermarkForm({...watermarkForm, creator: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Organization</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Media Corp"
                          className="w-full brutal-input"
                          value={watermarkForm.org}
                          onChange={(e) => setWatermarkForm({...watermarkForm, org: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Asset Type</label>
                        <select 
                          className="w-full brutal-input bg-transparent appearance-none"
                          value={watermarkForm.type}
                          onChange={(e) => setWatermarkForm({...watermarkForm, type: e.target.value})}
                        >
                          <option>Video/Image</option>
                          <option>Live Stream</option>
                          <option>Audio Broadcast</option>
                          <option>Proprietary Data</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Creation Date</label>
                        <input 
                          type="date" 
                          className="w-full brutal-input"
                          value={watermarkForm.date}
                          onChange={(e) => setWatermarkForm({...watermarkForm, date: e.target.value})}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Infringement Description</label>
                      <textarea 
                        required
                        placeholder="Detailed description of the stolen content and how it was modified..."
                        className="w-full brutal-input min-h-[120px] resize-none"
                        value={legalForm.description}
                        onChange={(e) => setLegalForm({...legalForm, description: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Infringing URL</label>
                      <input 
                        type="url" 
                        required
                        placeholder="https://shady-site.com/leaked-content"
                        className="w-full brutal-input"
                        value={legalForm.infringingUrl}
                        onChange={(e) => setLegalForm({...legalForm, infringingUrl: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Violation Type</label>
                        <select 
                          className="w-full brutal-input bg-transparent"
                          value={legalForm.infringementType}
                          onChange={(e) => setLegalForm({...legalForm, infringementType: e.target.value})}
                        >
                          <option>Reproduction</option>
                          <option>Unauthorized Sync</option>
                          <option>Commercial Piracy</option>
                          <option>Attribution Theft</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Original Publish Date</label>
                        <input 
                          type="date" 
                          required
                          className="w-full brutal-input"
                          value={legalForm.originalDate}
                          onChange={(e) => setLegalForm({...legalForm, originalDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Evidence / Logs</label>
                      <input 
                        type="text" 
                        placeholder="e.g. S3 logs, CDN records, Watermark Hash"
                        className="w-full brutal-input"
                        value={legalForm.evidence}
                        onChange={(e) => setLegalForm({...legalForm, evidence: e.target.value})}
                      />
                    </div>
                  </>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full brutal-button py-6 text-lg ${loading ? 'opacity-50 cursor-wait' : ''}`}
                >
                  {loading ? (
                    <span className="loading-dots">INITIALIZING PROTOCOL</span>
                  ) : (
                    <>
                      {mode === 'watermark' ? 'GENERATE PROTECTION' : 'BUILD LEGAL CASE'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Stats / Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="brutal-card bg-blue-50">
                <Clock className="w-5 h-5 mb-3 text-blue-900" />
                <div className="text-2xl font-black">2.4s</div>
                <div className="text-[10px] font-bold uppercase text-blue-900">Avg. Generation Time</div>
              </div>
              <div className="brutal-card bg-yellow-50">
                <CheckCircle2 className="w-5 h-5 mb-3 text-yellow-600" />
                <div className="text-2xl font-black">99.9%</div>
                <div className="text-[10px] font-bold uppercase text-yellow-600">Traceability Rate</div>
              </div>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            {!result && !loading && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-4 border-dashed border-gray-300 rounded-[2rem] text-center p-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-3xl text-gray-400 italic mb-4">Awaiting Secure Input</h3>
                <p className="text-gray-400 max-w-sm font-medium">
                  Submit the form to generate a cryptographically signed watermark or a structured legal enforcement plan.
                </p>
              </div>
            )}

            {loading && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center neo-panel p-12 text-center animate-pulse">
                <div className="relative">
                  <Cpu className="w-24 h-24 text-blue-900 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
                <h3 className="text-4xl italic mt-8 mb-4">FORGING DATA</h3>
                <p className="text-blue-900 font-black uppercase tracking-widest text-xs">Accessing Gemini 2.5-Flash Core...</p>
                <div className="mt-12 w-full max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden border-2 border-black">
                  <div className="h-full bg-blue-900 w-1/3 animate-[loading_2s_infinite_ease-in-out]" />
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl italic">FORGE OUTPUT</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Transaction ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={handleCopy}
                      className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-y-0"
                    >
                      {copySuccess ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <button className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-y-0">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="brutal-card bg-white min-h-[400px] font-mono text-sm leading-relaxed overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Shield className="w-32 h-32" />
                  </div>
                  
                  <div className="relative z-10 space-y-6">
                    {result.split('\n').map((line, i) => {
                      // Custom rendering for structured content
                      if (line.match(/^[1-5]\./) || line.match(/^\([1-5]\)/)) {
                        return (
                          <div key={i} className="flex gap-4 p-4 bg-blue-50 border-l-4 border-blue-900 group">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-black text-xs">
                              {line.match(/\d/)?.[0]}
                            </span>
                            <p className="font-bold text-blue-900 pt-1.5">{line.replace(/^[1-5]\./, '').replace(/^\([1-5]\)/, '')}</p>
                          </div>
                        );
                      }
                      if (line.toUpperCase() === line && line.length > 5 && line.length < 60) {
                        return (
                          <h4 key={i} className="text-xl font-black uppercase tracking-tighter pt-4 border-b-2 border-black/10 inline-block">
                            {line}
                          </h4>
                        );
                      }
                      if (line.includes('[') && line.includes(']')) {
                        return (
                          <div key={i} className="my-4 p-6 bg-black text-yellow-400 font-black text-xl tracking-[0.3em] text-center border-2 border-dashed border-yellow-400/50">
                            {line}
                          </div>
                        );
                      }
                      return <p key={i} className="text-gray-700 font-medium">{line}</p>;
                    })}
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <AlertOctagon className="w-8 h-8 flex-shrink-0" />
                  <div>
                    <h5 className="font-black uppercase text-sm mb-1">Institutional Verification Warning</h5>
                    <p className="text-xs font-bold leading-tight">
                      This record has been cryptographically tethered to the IPForge ledger. 
                      Unauthorized alteration of this document constitutes a violation of the Digital Rights Syndicate Protocol.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-8 h-8 text-yellow-400" />
                <span className="text-3xl font-black tracking-tighter uppercase italic">IPFORGE</span>
              </div>
              <p className="text-gray-400 font-medium max-w-sm mb-8">
                Building the future of digital rights management with high-speed AI analysis and immutable ownership protocols.
              </p>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 border border-gray-800 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h6 className="font-black uppercase tracking-widest text-xs mb-8 text-yellow-400">Core Services</h6>
              <ul className="space-y-4 font-bold text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer">Watermark Registry</li>
                <li className="hover:text-white cursor-pointer">Legal Case Forge</li>
                <li className="hover:text-white cursor-pointer">DMCA Automator</li>
                <li className="hover:text-white cursor-pointer">Asset Fingerprinting</li>
              </ul>
            </div>
            <div>
              <h6 className="font-black uppercase tracking-widest text-xs mb-8 text-yellow-400">Company</h6>
              <ul className="space-y-4 font-bold text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer">About Syndicate</li>
                <li className="hover:text-white cursor-pointer">Security Audit</li>
                <li className="hover:text-white cursor-pointer">Privacy Protocol</li>
                <li className="hover:text-white cursor-pointer">Contact Command</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">
              © 2026 DIGITAL RIGHTS MANAGEMENT SYNDICATE // ALL RIGHTS RESERVED
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global CSS for the loading bar */}
      <style jsx global>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
