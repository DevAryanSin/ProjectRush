'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  ChevronRight,
  BrainCircuit,
  Database,
  Users,
  Target,
  Rocket
} from 'lucide-react';

export default function ModelCardPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    purpose: '',
    trainingData: '',
    intendedUsers: '',
    limitations: '',
    deploymentContext: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const assembledPrompt = `
      Model Purpose: ${formData.purpose}
      Training Data Description: ${formData.trainingData}
      Intended Users: ${formData.intendedUsers}
      Known Limitations: ${formData.limitations}
      Deployment Context: ${formData.deploymentContext}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: assembledPrompt }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text: string) => {
    // Simple parser for markdown-like sections
    const sections = text.split(/(?=#{1,3} |^\w+[:\n])/m);
    return sections.map((section, idx) => {
      const lines = section.trim().split('\n');
      const title = lines[0].replace(/^#{1,3} /, '').replace(/:$/, '');
      const content = lines.slice(1).join('\n').trim();

      if (!content && title.length > 50) return <p key={idx} className="mb-4 text-gray-300">{section}</p>;

      return (
        <div key={idx} className="mb-8 group">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white group-hover:text-teal-400 transition-colors">
            <ChevronRight className="w-5 h-5 text-teal-500" />
            {title}
          </h3>
          <div className="pl-7 text-gray-300 whitespace-pre-wrap leading-relaxed">
            {content || section}
          </div>
        </div>
      );
    });
  };

  return (
    <main className="relative min-h-screen pb-20 px-4 md:px-8">
      {/* Aurora Background */}
      <div className="aurora-container">
        <div className="aurora-orb orb-1" />
        <div className="aurora-orb orb-2" />
        <div className="aurora-orb orb-3" />
        <div className="aurora-orb orb-4" />
      </div>

      <div className="max-w-5xl mx-auto pt-16 md:pt-24 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
            <BrainCircuit className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-medium tracking-wider uppercase text-teal-400">AI Fairness Engine</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-2">
            Model<span className="gradient-text">Card</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto">
            Describe your AI model — auto-generate a <span className="text-white font-medium">bias-aware</span> model card.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-5">
            <div className="glass-card p-8 sticky top-8">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-400" />
                Model Specifications
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Model Purpose
                  </label>
                  <input
                    required
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    placeholder="e.g., Loan approval classifier"
                    className="w-full glass-input p-4 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                    <Database className="w-4 h-4" /> Training Data
                  </label>
                  <textarea
                    required
                    name="trainingData"
                    value={formData.trainingData}
                    onChange={handleInputChange}
                    placeholder="Describe the datasets used..."
                    className="w-full glass-input p-4 text-white h-24 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Intended Users
                  </label>
                  <input
                    required
                    name="intendedUsers"
                    value={formData.intendedUsers}
                    onChange={handleInputChange}
                    placeholder="Who will use this model?"
                    className="w-full glass-input p-4 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Known Limitations
                  </label>
                  <textarea
                    name="limitations"
                    value={formData.limitations}
                    onChange={handleInputChange}
                    placeholder="Any known issues or constraints?"
                    className="w-full glass-input p-4 text-white h-24 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                    <Rocket className="w-4 h-4" /> Deployment Context
                  </label>
                  <input
                    name="deploymentContext"
                    value={formData.deploymentContext}
                    onChange={handleInputChange}
                    placeholder="How will it be deployed?"
                    className="w-full glass-input p-4 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Ethics...
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-5 h-5" />
                      Generate Model Card
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            {error && (
              <div className="glass-card p-6 border-red-500/50 bg-red-500/5 flex items-start gap-4 mb-8">
                <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                <div>
                  <h4 className="text-red-500 font-bold mb-1">Analysis Error</h4>
                  <p className="text-red-200/70 text-sm">{error}</p>
                </div>
              </div>
            )}

            {!result && !loading && !error && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 glass-card border-dashed border-white/10 bg-transparent">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-400 mb-2">Ready for Inspection</h3>
                <p className="text-gray-500 max-w-sm">
                  Complete the form to generate a comprehensive, fairness-focused model card.
                </p>
              </div>
            )}

            {loading && (
              <div className="space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="glass-card p-8 overflow-hidden relative">
                    <div className="loading-shimmer absolute inset-0 opacity-20" />
                    <div className="h-6 w-1/3 bg-white/10 rounded mb-4" />
                    <div className="h-4 w-full bg-white/5 rounded mb-2" />
                    <div className="h-4 w-5/6 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            )}

            {result && (
              <div className="glass-card p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/10">
                  <h2 className="text-3xl font-black flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-teal-400" />
                    Audit Results
                  </h2>
                  <button 
                    onClick={() => window.print()}
                    className="text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                  >
                    Export PDF
                  </button>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  {parseResult(result)}
                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="p-6 rounded-2xl bg-teal-500/5 border border-teal-500/20 flex items-center gap-4">
                    <ShieldAlert className="w-6 h-6 text-teal-400" />
                    <p className="text-sm text-teal-200/70">
                      This model card was generated by an AI documentation specialist. Please review all ethical considerations before final deployment.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="mt-32 text-center opacity-30">
        <p className="text-sm tracking-widest uppercase">Ethical AI Framework • ModelCard 2026</p>
      </div>
    </main>
  );
}
