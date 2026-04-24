'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Globe, 
  Lock, 
  UserCheck, 
  DollarSign, 
  Send, 
  Loader2, 
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function LicenseGen() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    assetType: '',
    permittedUses: '',
    prohibitedUses: '',
    attribution: '',
    commercialTerms: '',
    territory: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const prompt = `
      Asset Type: ${formData.assetType}
      Permitted Uses: ${formData.permittedUses}
      Prohibited Uses: ${formData.prohibitedUses}
      Attribution Requirements: ${formData.attribution}
      Commercial Terms: ${formData.commercialTerms}
      Territory: ${formData.territory}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatResult = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.match(/^#+\s/)) {
        return <h3 key={index} className="text-xl font-bold mt-6 mb-3 text-indigo-700">{line.replace(/^#+\s/, '')}</h3>;
      }
      if (line.match(/^\d+\.\s/)) {
        return <p key={index} className="ml-4 mb-2 text-slate-700 leading-relaxed font-semibold">{line}</p>;
      }
      if (line.trim() === '') return <br key={index} />;
      return <p key={index} className="mb-2 text-slate-600 leading-relaxed">{line}</p>;
    });
  };

  return (
    <main className="min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 animate-float">
          <div className="inline-flex items-center justify-center p-4 clay-card clay-lavender mb-2">
            <ShieldCheck size={48} strokeWidth={2.5} />
          </div>
          <h1 className="text-6xl md:text-7xl puffy-text text-white tracking-tight">
            LicenseGen
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 font-medium max-w-2xl mx-auto">
            Input your asset details — get a custom license agreement generated instantly
          </p>
        </div>

        {/* Form Section */}
        {!result && (
          <div className="clay-card p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-indigo-700 font-bold ml-2">
                  <FileText size={18} /> Asset Type
                </label>
                <input
                  required
                  name="assetType"
                  value={formData.assetType}
                  onChange={handleInputChange}
                  placeholder="e.g. NBA Game Highlight Video"
                  className="w-full p-4 clay-input text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-indigo-700 font-bold ml-2">
                  <Globe size={18} /> Territory
                </label>
                <input
                  required
                  name="territory"
                  value={formData.territory}
                  onChange={handleInputChange}
                  placeholder="e.g. Worldwide / North America"
                  className="w-full p-4 clay-input text-slate-700"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-indigo-700 font-bold ml-2">
                  <CheckCircle2 size={18} /> Permitted Uses
                </label>
                <textarea
                  required
                  name="permittedUses"
                  value={formData.permittedUses}
                  onChange={handleInputChange}
                  placeholder="What can they do with it?"
                  rows={3}
                  className="w-full p-4 clay-input text-slate-700 resize-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-indigo-700 font-bold ml-2">
                  <Lock size={18} /> Prohibited Uses
                </label>
                <textarea
                  required
                  name="prohibitedUses"
                  value={formData.prohibitedUses}
                  onChange={handleInputChange}
                  placeholder="What is strictly forbidden?"
                  rows={3}
                  className="w-full p-4 clay-input text-slate-700 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-indigo-700 font-bold ml-2">
                  <UserCheck size={18} /> Attribution
                </label>
                <input
                  required
                  name="attribution"
                  value={formData.attribution}
                  onChange={handleInputChange}
                  placeholder="e.g. Must tag @organization"
                  className="w-full p-4 clay-input text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-indigo-700 font-bold ml-2">
                  <DollarSign size={18} /> Commercial Terms
                </label>
                <input
                  required
                  name="commercialTerms"
                  value={formData.commercialTerms}
                  onChange={handleInputChange}
                  placeholder="e.g. Non-commercial / Paid License"
                  className="w-full p-4 clay-input text-slate-700"
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 clay-button clay-lavender flex items-center justify-center gap-3 text-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Generating Legal Document...
                    </>
                  ) : (
                    <>
                      <Send size={24} />
                      Generate License Agreement
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="clay-card clay-mint p-6 flex items-center gap-4 text-emerald-800 animate-in zoom-in duration-300">
            <AlertCircle className="shrink-0" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {/* Result Section */}
        {result && (
          <div className="clay-card p-8 md:p-12 animate-in slide-in-from-top-12 duration-700">
            <div className="flex justify-between items-center mb-8 border-b-2 border-indigo-50 pb-6">
              <h2 className="text-3xl text-indigo-800 puffy-text flex items-center gap-3">
                <FileText size={32} />
                Draft Agreement
              </h2>
              <button 
                onClick={() => window.print()}
                className="p-3 clay-button clay-mint flex items-center gap-2 hover:scale-105"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Print / Save PDF</span>
              </button>
            </div>
            
            <div className="prose prose-indigo max-w-none bg-white/50 p-6 rounded-3xl clay-input overflow-hidden">
              {formatResult(result)}
            </div>

            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setResult(null)}
                className="px-8 py-4 clay-button text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Create Another License
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-indigo-200/60 font-medium pb-8">
          <p>© {new Date().getFullYear()} LicenseGen — Sports Media IP Rights Management</p>
        </footer>
      </div>
    </main>
  );
}
