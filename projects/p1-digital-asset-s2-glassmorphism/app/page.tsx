'use client';

import React, { useState } from 'react';
import { Network, Activity, Globe, ShieldAlert, Cpu, Share2, Loader2, Calendar, FileType } from 'lucide-react';

export default function PropagationMap() {
  const [formData, setFormData] = useState({
    assetName: '',
    assetType: 'video',
    publishDate: '',
    originalPlatform: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    const promptText = `Name: ${formData.assetName}, Type: ${formData.assetType}, Publish Date: ${formData.publishDate}, Platform: ${formData.originalPlatform}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const renderText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl font-semibold text-yellow-500 mt-6 mb-3 flex items-center gap-2">
            <Share2 className="w-5 h-5" /> 
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-2xl font-bold text-white mt-6 mb-4">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // Sub-headings (bold text that serves as a line item)
      if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
        return <h4 key={idx} className="text-lg font-medium text-white mt-4 mb-2">{line.replace(/\*\*/g, '')}</h4>;
      }
      // List items
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return <li key={idx} className="ml-6 list-disc text-slate-300 py-1">{renderInline(line.substring(2))}</li>;
      }
      // Empty lines
      if (line.trim() === '') return <div key={idx} className="h-2"></div>;
      
      // Standard paragraphs
      return <p key={idx} className="text-slate-300 leading-relaxed mb-2">{renderInline(line)}</p>;
    });
  };

  const renderInline = (text: string) => {
    // Basic markdown bold parser
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-yellow-400 font-medium">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center py-16 px-4 sm:px-6">
      {/* Immersive Background Orbs */}
      <div className="bg-orb-1"></div>
      <div className="bg-orb-2"></div>
      <div className="bg-orb-3"></div>

      {/* Header Section */}
      <header className="max-w-[680px] w-full mb-10 text-center animate-fade-in-up">
        <div className="inline-flex items-center justify-center p-3 rounded-full glass-panel mb-6 shadow-[0_0_30px_rgba(30,58,138,0.5)]">
          <Network className="w-10 h-10 text-yellow-500" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-glow mb-4">
          Propagation<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 font-light">Map</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 font-light max-w-lg mx-auto">
          Describe a media asset — understand how it has likely spread across platforms.
        </p>
      </header>

      {/* Main Analysis Form */}
      <main className="max-w-[680px] w-full flex flex-col gap-8">
        <div className="glass-panel rounded-3xl p-6 md:p-8 animate-fade-in-up delay-100 relative overflow-hidden group">
          {/* Subtle top edge glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50"></div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Asset Name / ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Activity className="h-4 w-4 text-yellow-500/70" />
                  </div>
                  <input
                    type="text"
                    name="assetName"
                    required
                    suppressHydrationWarning
                    disabled={loading}
                    value={formData.assetName}
                    onChange={handleInputChange}
                    placeholder="e.g. UCL Final Highlights"
                    className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm placeholder-slate-400/70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Media Type</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <FileType className="h-4 w-4 text-blue-400/70" />
                  </div>
                  <select
                    name="assetType"
                    suppressHydrationWarning
                    disabled={loading}
                    value={formData.assetType}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm appearance-none cursor-pointer"
                  >
                    <option value="video" className="bg-slate-900">Video Content</option>
                    <option value="image" className="bg-slate-900">High-Res Image</option>
                    <option value="article" className="bg-slate-900">Text/Article</option>
                    <option value="audio" className="bg-slate-900">Audio/Podcast</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Publish Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-emerald-400/70" />
                  </div>
                  <input
                    type="date"
                    name="publishDate"
                    required
                    suppressHydrationWarning
                    disabled={loading}
                    value={formData.publishDate}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Original Platform</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Globe className="h-4 w-4 text-purple-400/70" />
                  </div>
                  <input
                    type="text"
                    name="originalPlatform"
                    required
                    suppressHydrationWarning
                    disabled={loading}
                    value={formData.originalPlatform}
                    onChange={handleInputChange}
                    placeholder="e.g. Official App, YouTube"
                    className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm placeholder-slate-400/70"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              suppressHydrationWarning
              disabled={loading}
              className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-blue-800 to-yellow-600 hover:from-blue-700 hover:to-yellow-500 border border-white/10 text-white font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.25)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Simulating Propagation Pattern...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-5 h-5 text-yellow-200 group-hover:scale-110 transition-transform" />
                  <span className="text-lg">Run Pattern Analysis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="glass-panel rounded-xl p-5 border border-red-500/30 bg-red-950/30 text-red-100 animate-fade-in-up flex gap-3 items-start shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-6 h-6 text-red-500 shrink-0" />
            <p className="text-sm font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* Results Presentation */}
        {result && (
          <div className="flex flex-col gap-5 animate-fade-in-up delay-200">
            <h2 className="text-2xl font-semibold px-2 flex items-center gap-3 text-white/90">
              <Activity className="w-6 h-6 text-blue-400" />
              Intelligence Report
            </h2>
            <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden backdrop-blur-xl">
               {/* Decorative shine */}
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"></div>
               {/* Internal Result UI */}
               <div className="prose prose-invert max-w-none text-slate-200">
                 {renderText(result)}
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
