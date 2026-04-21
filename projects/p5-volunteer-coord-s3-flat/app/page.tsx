'use client';

import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Send, 
  Users, 
  Clock, 
  MapPin, 
  Wrench, 
  AlertCircle,
  Loader2,
  ChevronRight,
  Target,
  BarChart3
} from 'lucide-react';

export default function TaskForge() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    problem: '',
    volunteerCount: '',
    timeframe: '',
    area: '',
    resources: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const fullPrompt = `
      Problem: ${formData.problem}
      Volunteers Available: ${formData.volunteerCount}
      Timeframe: ${formData.timeframe}
      Geographic Area: ${formData.area}
      Resources Available: ${formData.resources}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
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

  const renderResult = () => {
    if (!result) return null;

    // Simple markdown-ish parsing for a flat UI look
    const sections = result.split(/\n(?=\d\.|Task \d:|\d\sTask:)/g);
    
    return (
      <div className="space-y-6 mt-12 animate-fade-in">
        <h2 className="text-3xl font-black bg-primary text-white p-4 inline-block border-4 border-black">
          Action Plan
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((section, idx) => {
            if (!section.trim()) return null;
            return (
              <div key={idx} className="flat-card bg-white border-4 border-black flex flex-col h-full">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary p-2 border-2 border-black inline-block">
                    <ClipboardCheck className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap text-sm font-medium leading-relaxed">
                      {section.replace(/[*#]/g, '').trim()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-bg-main selection:bg-accent selection:text-white">
      {/* HEADER SECTION --- FULL WIDTH */}
      <header className="bg-primary border-b-8 border-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-secondary p-1 border-2 border-black">
                <Target size={32} className="text-white" strokeWidth={3} />
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                TASKFORGE
              </h1>
            </div>
            <p className="text-xl md:text-2xl font-bold opacity-90 border-l-4 border-accent pl-4">
              Community problems to actionable volunteer plans.
            </p>
          </div>
          <div className="hidden lg:block">
            <BarChart3 size={120} className="text-accent opacity-50" strokeWidth={1} />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* INPUT FORM SECTION */}
          <div className="lg:col-span-2">
            <div className="flat-card bg-secondary text-white space-y-6">
              <h3 className="text-2xl font-black border-b-4 border-black pb-2">
                Define the Mission
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black flex items-center gap-2">
                    <AlertCircle size={16} /> THE PROBLEM
                  </label>
                  <textarea
                    name="problem"
                    required
                    placeholder="Describe the community need..."
                    className="flat-input h-32 text-black"
                    value={formData.problem}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-black flex items-center gap-2 uppercase">
                      <Users size={16} /> Volume
                    </label>
                    <input
                      name="volunteerCount"
                      type="text"
                      placeholder="e.g. 50 people"
                      className="flat-input text-black"
                      value={formData.volunteerCount}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black flex items-center gap-2 uppercase">
                      <Clock size={16} /> Timeline
                    </label>
                    <input
                      name="timeframe"
                      type="text"
                      placeholder="e.g. 2 weeks"
                      className="flat-input text-black"
                      value={formData.timeframe}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black flex items-center gap-2 uppercase">
                    <MapPin size={16} /> Geography
                  </label>
                  <input
                    name="area"
                    type="text"
                    placeholder="e.g. Downtown area"
                    className="flat-input text-black"
                    value={formData.area}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black flex items-center gap-2 uppercase">
                    <Wrench size={16} /> Resources
                  </label>
                  <input
                    name="resources"
                    type="text"
                    placeholder="e.g. Tools, trucks, meals"
                    className="flat-input text-black"
                    value={formData.resources}
                    onChange={handleInputChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  suppressHydrationWarning
                  className="flat-button w-full bg-primary justify-center text-xl hover:bg-black group"
                >
                  {loading ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      GENERATE BREAKDOWN 
                      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* RESULTS SECTION */}
          <div className="lg:col-span-3">
            {!result && !loading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border-8 border-dashed border-black opacity-30">
                <Send size={80} className="mb-4" />
                <p className="text-2xl font-black italic">
                  Input your community mission to forge a plan.
                </p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 bg-primary border-8 border-black animate-bounce mb-8"></div>
                <h3 className="text-3xl font-black">FORGING TASKS...</h3>
                <p className="text-lg font-bold opacity-60">Synthesizing data into action units.</p>
              </div>
            )}

            {error && (
              <div className="flat-card bg-red-500 text-white border-8 border-black">
                <h3 className="text-2xl font-black flex items-center gap-2">
                  <AlertCircle /> SYSTEM ERROR
                </h3>
                <p className="mt-4 font-bold">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-6 flat-button bg-black text-xs"
                >
                  TRY AGAIN
                </button>
              </div>
            )}

            {renderResult()}
          </div>
        </div>
      </div>

      <footer className="bg-bg-section border-t-8 border-black py-12 px-6 mt-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-black text-xl">TASKFORGE © 2026</p>
          <div className="flex gap-4">
            <span className="bg-primary w-8 h-8 border-2 border-black"></span>
            <span className="bg-secondary w-8 h-8 border-2 border-black"></span>
            <span className="bg-accent w-8 h-8 border-2 border-black"></span>
          </div>
          <p className="font-bold opacity-60">DESIGNED FOR IMPACT.</p>
        </div>
      </footer>
    </main>
  );
}
