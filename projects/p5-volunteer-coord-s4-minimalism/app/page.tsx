'use client';

import React, { useState } from 'react';
import { ArrowRight, Loader2, Sparkles, Sprout, Heart, Target } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      hours: formData.get('hours'),
      tasks: formData.get('tasks'),
      volunteers: formData.get('volunteers'),
      served: formData.get('served'),
      area: formData.get('area'),
      period: formData.get('period'),
    };

    const prompt = `
      Volunteer hours logged: ${data.hours}
      Tasks completed: ${data.tasks}
      Number of volunteers: ${data.volunteers}
      Community members served: ${data.served}
      Geographic area: ${data.area}
      Time period: ${data.period}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const json = await response.json();
      if (json.error) throw new Error(json.error);
      setResult(json.result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fdfdfd] text-[#121212] px-6 py-20 pb-32">
      <div className="max-w-[600px] mx-auto">
        {/* Hero Section */}
        <header className="mb-24 text-center">
          <div className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-100 group-hover:bg-[#3a6032] group-hover:text-white transition-all duration-500">
              <Sprout size={18} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-400">ImpactPulse</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
            Data into <br />
            <span className="text-[#3a6032]">Impact</span>.
          </h1>
          <p className="text-gray-400 text-lg font-light max-w-[400px] mx-auto leading-relaxed">
            Transform raw volunteer activity into stories of change.
          </p>
        </header>

        {/* Action Section */}
        <section className="space-y-20">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-1">
                <label className="minimal-label">Hours Logged</label>
                <input 
                  name="hours" 
                  type="number" 
                  placeholder="e.g. 450" 
                  className="minimal-input font-light" 
                  required 
                  suppressHydrationWarning
                  disabled={loading}
                />
              </div>
              <div className="space-y-1">
                <label className="minimal-label">Tasks Completed</label>
                <input 
                  name="tasks" 
                  type="text" 
                  placeholder="e.g. Tree plantation" 
                  className="minimal-input font-light" 
                  required 
                  suppressHydrationWarning
                  disabled={loading}
                />
              </div>
              <div className="space-y-1">
                <label className="minimal-label">Volunteers</label>
                <input 
                  name="volunteers" 
                  type="number" 
                  placeholder="e.g. 42" 
                  className="minimal-input font-light" 
                  required 
                  suppressHydrationWarning
                  disabled={loading}
                />
              </div>
              <div className="space-y-1">
                <label className="minimal-label">Members Served</label>
                <input 
                  name="served" 
                  type="number" 
                  placeholder="e.g. 120" 
                  className="minimal-input font-light" 
                  required 
                  suppressHydrationWarning
                  disabled={loading}
                />
              </div>
              <div className="space-y-1">
                <label className="minimal-label">Geographic Area</label>
                <input 
                  name="area" 
                  type="text" 
                  placeholder="e.g. North Delhi" 
                  className="minimal-input font-light" 
                  required 
                  suppressHydrationWarning
                  disabled={loading}
                />
              </div>
              <div className="space-y-1">
                <label className="minimal-label">Time Period</label>
                <input 
                  name="period" 
                  type="text" 
                  placeholder="e.g. March 2024" 
                  className="minimal-input font-light" 
                  required 
                  suppressHydrationWarning
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button 
                type="submit" 
                className="minimal-button group inline-flex items-center gap-3 disabled:bg-gray-100 disabled:text-gray-400"
                disabled={loading}
                suppressHydrationWarning
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Report</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Result Section */}
          {error && (
            <div className="py-6 border-t border-red-100 text-red-500 text-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-20 pt-20 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="space-y-16">
                {/* Clean data processing for visual hierarchy */}
                {result.split('\n').filter(line => line.trim()).map((line, i) => {
                  if (line.startsWith('#') || line.toUpperCase() === line.trim()) {
                    return (
                      <h3 key={i} className="text-2xl font-semibold text-[#121212] tracking-tight border-b border-gray-50 pb-4">
                        {line.replace(/#/g, '').trim()}
                      </h3>
                    );
                  }
                  if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
                    return (
                      <div key={i} className="flex gap-4 group">
                        <div className="w-1 h-1 bg-[#c96e31] mt-2.5 flex-shrink-0" />
                        <p className="text-gray-500 leading-relaxed font-light">{line.replace(/^[*|-]\s?/, '').trim()}</p>
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="text-lg leading-relaxed text-gray-600 font-light italic border-l-2 border-[#3a6032] pl-6 py-1">
                      {line.trim()}
                    </p>
                  );
                })}
              </div>

              {/* Stakeholder ready badge */}
              <div className="flex justify-center pt-12">
                <div className="inline-flex items-center gap-3 px-6 py-3 border border-gray-100 rounded-full text-[10px] uppercase tracking-widest text-[#3a6032] font-medium">
                  <Sparkles size={12} />
                  Ready for Stakeholders
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-40 pt-12 border-t border-gray-50 text-center">
          <p className="text-[10px] text-gray-300 tracking-[0.2em] uppercase">
            Efficiency through Minimalism &bull; 2024
          </p>
        </footer>
      </div>
    </main>
  );
}
