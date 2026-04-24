'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Gavel, 
  Link as LinkIcon, 
  Calendar, 
  FileText, 
  AlertCircle, 
  ChevronRight, 
  Loader2, 
  CheckCircle2,
  Scale,
  ClipboardList
} from 'lucide-react';

export default function CloneCourt() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    assetDescription: '',
    publishDate: '',
    infringingUrl: '',
    infringementType: '',
    evidence: ''
  });
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const assembledPrompt = `
      Asset Description: ${formData.assetDescription}
      Original Publish Date: ${formData.publishDate}
      Infringing URL: ${formData.infringingUrl}
      Type of Infringement: ${formData.infringementType}
      Evidence Available: ${formData.evidence}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: assembledPrompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate summary');
      
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top duration-700">
        <div className="inline-flex items-center justify-center p-4 neo-flat mb-6">
          <Scale className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-5xl font-bold text-primary mb-3 tracking-tight">CloneCourt</h1>
        <p className="text-lg text-foreground/70 font-medium max-w-2xl mx-auto">
          Build a legal case summary against a content thief in seconds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-5 space-y-8">
          <form onSubmit={handleSubmit} className="neo-flat p-8 space-y-6">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-foreground/80 ml-1 mb-2 block">Asset Description</span>
                <div className="relative">
                  <FileText className="absolute left-4 top-3.5 w-5 h-5 text-foreground/40" />
                  <textarea
                    name="assetDescription"
                    required
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 neo-inset focus:outline-none transition-all resize-none"
                    placeholder="Describe the original sports media asset..."
                    value={formData.assetDescription}
                    onChange={handleChange}
                  />
                </div>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-foreground/80 ml-1 mb-2 block">Publish Date</span>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-foreground/40" />
                    <input
                      type="date"
                      name="publishDate"
                      required
                      className="w-full pl-12 pr-4 py-3 neo-inset focus:outline-none transition-all"
                      value={formData.publishDate}
                      onChange={handleChange}
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-foreground/80 ml-1 mb-2 block">Infringement Type</span>
                  <div className="relative">
                    <AlertCircle className="absolute left-4 top-3.5 w-5 h-5 text-foreground/40" />
                    <select
                      name="infringementType"
                      required
                      className="w-full pl-12 pr-4 py-3 neo-inset focus:outline-none transition-all appearance-none"
                      value={formData.infringementType}
                      onChange={handleChange}
                    >
                      <option value="">Select type</option>
                      <option value="Unauthorized Re-upload">Unauthorized Re-upload</option>
                      <option value="Commercial Use">Commercial Use</option>
                      <option value="Derivitive Work">Derivitive Work</option>
                      <option value="Logo Removal">Logo Removal</option>
                    </select>
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-foreground/80 ml-1 mb-2 block">Infringing URL</span>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-3.5 w-5 h-5 text-foreground/40" />
                  <input
                    type="url"
                    name="infringingUrl"
                    required
                    className="w-full pl-12 pr-4 py-3 neo-inset focus:outline-none transition-all"
                    placeholder="https://..."
                    value={formData.infringingUrl}
                    onChange={handleChange}
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground/80 ml-1 mb-2 block">Evidence Available</span>
                <div className="relative">
                  <ClipboardList className="absolute left-4 top-3.5 w-5 h-5 text-foreground/40" />
                  <textarea
                    name="evidence"
                    required
                    rows={2}
                    className="w-full pl-12 pr-4 py-3 neo-inset focus:outline-none transition-all resize-none"
                    placeholder="Watermarks, meta-data, original files..."
                    value={formData.evidence}
                    onChange={handleChange}
                  />
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 neo-button flex items-center justify-center gap-2 text-primary font-bold text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Case...
                </>
              ) : (
                <>
                  <Gavel className="w-6 h-6" />
                  Build Case Summary
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7">
          {error && (
            <div className="neo-flat p-6 border-l-4 border-red-500 bg-red-50/50 flex items-start gap-4 animate-in fade-in slide-in-from-right">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="neo-flat p-12 h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
              <div className="p-6 neo-inset">
                <Shield className="w-16 h-16 text-foreground/20" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground/40 mb-2">Awaiting Evidence</h3>
                <p className="text-foreground/30 max-w-xs mx-auto">
                  Fill out the form to generate your automated legal case summary.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="neo-flat p-12 h-full flex flex-col items-center justify-center space-y-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                <Scale className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-primary">Analyzing Infringement</h3>
                <p className="text-foreground/50 animate-pulse">Consulting IP Database...</p>
              </div>
            </div>
          )}

          {result && (
            <div className="neo-flat p-8 h-full space-y-8 animate-in fade-in slide-in-from-right duration-500">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-foreground/5">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <h2 className="text-2xl font-bold text-primary">Case Summary Generated</h2>
              </div>
              
              <div className="max-w-none">
                {result.split('\n').map((line, i) => {
                  if (line.trim().startsWith('###') || line.toUpperCase().includes('CASE TITLE') || line.toUpperCase().includes('LEGAL BASIS')) {
                    return <h3 key={i} className="text-xl font-bold text-primary mt-6 mb-3 first:mt-0">{line.replace(/[#*]/g, '')}</h3>;
                  }
                  if (line.trim().startsWith('-') || line.trim().match(/^\d\./)) {
                    return (
                      <div key={i} className="flex gap-3 mb-2 ml-2">
                        <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <span className="text-foreground/80 leading-relaxed font-medium">{line.replace(/^[- \d\.]*/, '')}</span>
                      </div>
                    );
                  }
                  if (line.trim() === '') return <div key={i} className="h-2" />;
                  return <p key={i} className="text-foreground/80 leading-relaxed mb-4 font-medium">{line.replace(/[*]/g, '')}</p>;
                })}
              </div>

              <div className="mt-8 pt-8 border-t border-foreground/5">
                <div className="p-6 neo-inset bg-primary/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-sm font-bold text-primary uppercase tracking-wider">Legal Notice</span>
                  </div>
                  <p className="text-xs text-foreground/50 italic">
                    This summary is AI-generated for informational purposes and does not constitute formal legal advice. Please consult with a qualified IP attorney.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
