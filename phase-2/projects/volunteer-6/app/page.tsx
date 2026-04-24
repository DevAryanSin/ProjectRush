'use client';

import React, { useState } from 'react';
import { Sparkles, Calendar, Users, DollarSign, MapPin, Clock, AlertTriangle, Loader2, Heart } from 'lucide-react';

export default function EventPlannerPage() {
  const [formData, setFormData] = useState({
    need: '',
    volunteers: '',
    budget: '',
    location: '',
    timeframe: '',
    constraints: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const prompt = `
Community Need: ${formData.need}
Available Volunteers: ${formData.volunteers}
Budget: ${formData.budget}
Location/Area: ${formData.location}
Timeframe: ${formData.timeframe}
Constraints: ${formData.constraints}
    `.trim();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate event plan.');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = (text: string) => {
    return text.split('\n\n').map((paragraph, idx) => {
      if (paragraph.startsWith('##')) {
        return <h3 key={idx} className="text-2xl font-display text-green-700 mt-6 mb-3">{paragraph.replace(/##/g, '').trim()}</h3>;
      }
      if (paragraph.startsWith('#')) {
        return <h2 key={idx} className="text-3xl font-display text-green-800 mt-8 mb-4">{paragraph.replace(/#/g, '').trim()}</h2>;
      }
      
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      
      return (
        <p key={idx} className="mb-4 text-green-900 leading-relaxed text-lg">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="font-bold text-green-800">{part.slice(2, -2)}</strong>;
            }
            if (part.includes('\n* ') || part.includes('\n- ')) {
               const lines = part.split('\n');
               return lines.map((line, j) => {
                 if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                   return <li key={j} className="ml-6 list-disc mb-1">{line.replace(/^(\* |- )/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>;
                 }
                 return <span key={j}>{line}<br/></span>;
               });
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-green-50 p-6 md:p-12 font-body selection:bg-yellow-300 selection:text-green-900">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-5 bg-yellow-200 rounded-full clay-shadow mb-4">
            <Sparkles className="w-14 h-14 text-yellow-600" />
          </div>
          <h1 className="text-6xl md:text-7xl font-display text-green-800 tracking-tight">EventPlanner</h1>
          <p className="text-2xl text-green-700 font-medium max-w-2xl mx-auto">Describe a community need — generate a complete volunteer event plan</p>
        </header>

        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-5">
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2rem] clay-shadow space-y-6">
              <h2 className="text-3xl font-display text-green-800 mb-6 pb-4 border-b-4 border-green-50">Event Details</h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-green-800 font-bold ml-2 text-lg" htmlFor="need">
                  <Heart className="w-6 h-6 text-yellow-500" /> Community Need
                </label>
                <textarea 
                  id="need" name="need" required
                  value={formData.need} onChange={handleChange}
                  placeholder="e.g. Empty lot filled with trash, kids need a safe place to play"
                  className="w-full bg-green-50 border-none p-5 rounded-3xl clay-inner focus:ring-4 focus:ring-yellow-300 outline-none transition-all text-green-900 placeholder-green-400 min-h-[120px] resize-none text-lg"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-green-800 font-bold ml-2 text-lg" htmlFor="volunteers">
                  <Users className="w-6 h-6 text-yellow-500" /> Available Volunteers
                </label>
                <input 
                  type="text" id="volunteers" name="volunteers" required
                  value={formData.volunteers} onChange={handleChange}
                  placeholder="e.g. 15 high school students"
                  className="w-full bg-green-50 border-none p-5 rounded-full clay-inner focus:ring-4 focus:ring-yellow-300 outline-none transition-all text-green-900 placeholder-green-400 text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-green-800 font-bold ml-2 text-lg" htmlFor="budget">
                    <DollarSign className="w-6 h-6 text-yellow-500" /> Budget
                  </label>
                  <input 
                    type="text" id="budget" name="budget" required
                    value={formData.budget} onChange={handleChange}
                    placeholder="$200"
                    className="w-full bg-green-50 border-none p-5 rounded-full clay-inner focus:ring-4 focus:ring-yellow-300 outline-none transition-all text-green-900 placeholder-green-400 text-lg"
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-green-800 font-bold ml-2 text-lg" htmlFor="timeframe">
                    <Clock className="w-6 h-6 text-yellow-500" /> Timeframe
                  </label>
                  <input 
                    type="text" id="timeframe" name="timeframe" required
                    value={formData.timeframe} onChange={handleChange}
                    placeholder="This Saturday"
                    className="w-full bg-green-50 border-none p-5 rounded-full clay-inner focus:ring-4 focus:ring-yellow-300 outline-none transition-all text-green-900 placeholder-green-400 text-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-green-800 font-bold ml-2 text-lg" htmlFor="location">
                  <MapPin className="w-6 h-6 text-yellow-500" /> Location / Area
                </label>
                <input 
                  type="text" id="location" name="location" required
                  value={formData.location} onChange={handleChange}
                  placeholder="Downtown Community Center"
                  className="w-full bg-green-50 border-none p-5 rounded-full clay-inner focus:ring-4 focus:ring-yellow-300 outline-none transition-all text-green-900 placeholder-green-400 text-lg"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-green-800 font-bold ml-2 text-lg" htmlFor="constraints">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" /> Constraints
                </label>
                <input 
                  type="text" id="constraints" name="constraints"
                  value={formData.constraints} onChange={handleChange}
                  placeholder="No heavy lifting for some volunteers"
                  className="w-full bg-green-50 border-none p-5 rounded-full clay-inner focus:ring-4 focus:ring-yellow-300 outline-none transition-all text-green-900 placeholder-green-400 text-lg"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 px-6 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold text-2xl rounded-full clay-btn transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
              >
                {loading ? (
                  <><Loader2 className="w-8 h-8 animate-spin" /> Planning...</>
                ) : (
                  <><Calendar className="w-8 h-8" /> Generate Plan</>
                )}
              </button>
            </form>
          </div>

          <div className="md:col-span-7">
            {error && (
              <div className="bg-red-100 p-8 rounded-[2rem] clay-shadow text-red-800 flex items-start gap-4 mb-8">
                <AlertTriangle className="w-10 h-10 shrink-0 text-red-500" />
                <div>
                  <h3 className="font-bold text-2xl mb-2 font-display">Oops! Something went wrong.</h3>
                  <p className="text-lg">{error}</p>
                </div>
              </div>
            )}

            {result ? (
              <div className="bg-white p-10 md:p-12 rounded-[2.5rem] clay-shadow animate-in fade-in duration-500">
                <div className="inline-block px-5 py-2 bg-green-100 text-green-800 font-bold rounded-full mb-8 text-sm uppercase tracking-wider">
                  Your Event Plan
                </div>
                <div className="prose prose-green max-w-none prose-headings:font-display prose-p:font-medium prose-p:text-lg">
                  {renderResult(result)}
                </div>
              </div>
            ) : !loading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-green-100/50 border-4 border-dashed border-green-200 rounded-[2.5rem]">
                <Sparkles className="w-20 h-20 text-green-300 mb-6" />
                <h3 className="text-4xl font-display text-green-700 mb-4">Ready to Plan</h3>
                <p className="text-green-600 max-w-md text-xl">Fill out the details on the left and we'll generate a comprehensive volunteer event plan tailored to your community.</p>
              </div>
            )}

            {loading && (
              <div className="bg-white h-full p-12 rounded-[2.5rem] clay-shadow flex flex-col items-center justify-center space-y-8 animate-pulse min-h-[400px]">
                <div className="relative">
                  <div className="w-32 h-32 bg-yellow-200 rounded-full clay-shadow"></div>
                  <Loader2 className="w-16 h-16 text-yellow-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
                </div>
                <p className="text-3xl text-green-800 font-display">Crafting the perfect event...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
