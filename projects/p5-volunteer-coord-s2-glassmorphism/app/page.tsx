'use client';

import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  Languages, 
  Briefcase, 
  Target, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export default function VolunteerMatchPage() {
  const [formData, setFormData] = useState({
    skills: '',
    availability: '',
    location: '',
    languages: '',
    experience: '',
    task: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const userPrompt = `
      Volunteer Profile:
      - Skills: ${formData.skills}
      - Availability: ${formData.availability}
      - Location: ${formData.location}
      - Languages: ${formData.languages}
      - Experience: ${formData.experience}

      Community Task Description:
      ${formData.task}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to analyze match');
      
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="glass-container min-h-screen py-12 px-4 relative flex flex-col items-center">
      {/* Background Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* Header */}
      <header className="relative z-10 text-center mb-12 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4">
          <Users className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium tracking-wide uppercase">Volunteer Coordination Tool</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold font-syne mb-4 gradient-text">
          VolunteerMatch
        </h1>
        <p className="text-lg text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
          Connect talent with purpose. Our AI-driven engine analyzes community needs to find your perfect mission.
        </p>
      </header>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[720px] space-y-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        
        {/* Input Form */}
        <div className="glass-card p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-emerald-300 ml-1">
                  <CheckCircle2 className="w-4 h-4" /> Skills & Expertise
                </label>
                <input
                  required
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g. Teaching, Gardening, Coding"
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm"
                  suppressHydrationWarning
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-orange-300 ml-1">
                  <Clock className="w-4 h-4" /> Availability
                </label>
                <input
                  required
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  placeholder="e.g. 5 hours/week, Weekends"
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm"
                  suppressHydrationWarning
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-emerald-300 ml-1">
                  <MapPin className="w-4 h-4" /> Location
                </label>
                <input
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Downtown, Remote"
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm"
                  suppressHydrationWarning
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-orange-300 ml-1">
                  <Languages className="w-4 h-4" /> Languages
                </label>
                <input
                  required
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  placeholder="e.g. English, Spanish"
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm"
                  suppressHydrationWarning
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-emerald-300 ml-1">
                <Briefcase className="w-4 h-4" /> Experience Level
              </label>
              <input
                required
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Years of experience or key background"
                className="w-full glass-input rounded-xl px-4 py-3 text-sm"
                suppressHydrationWarning
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-orange-300 ml-1">
                <Target className="w-4 h-4" /> Community Task / Need
              </label>
              <textarea
                required
                name="task"
                value={formData.task}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe the task that needs a volunteer..."
                className="w-full glass-input rounded-xl px-4 py-3 text-sm resize-none"
                suppressHydrationWarning
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              suppressHydrationWarning
              className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Match Potential...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Get Match Analysis</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="glass-card p-6 border-red-500/50 bg-red-500/10 flex items-start gap-4 animate-fade-up">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div className="text-red-200 text-sm">
              <span className="font-bold block mb-1">Analysis Error</span>
              {error}
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4 ml-2">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-emerald-500/50"></div>
              <h2 className="text-xl font-bold font-syne text-emerald-400 uppercase tracking-widest">Match Result</h2>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-emerald-500/50"></div>
            </div>

            <div className="glass-card p-8 space-y-8 relative overflow-hidden">
               {/* Decorative Gradient Orb in result */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -z-10"></div>
               
               <div className="prose prose-invert max-w-none prose-sm">
                 {result.split('\n').map((line, i) => {
                   if (!line.trim()) return <br key={i} />;
                   
                   // Highlight score if present
                   if (line.toLowerCase().includes('match score')) {
                     return (
                       <div key={i} className="flex flex-col mb-4 items-center gap-2 p-6 glass-card border-none bg-emerald-500/5">
                         <span className="text-emerald-300 font-syne font-bold text-4xl">{line.split(':')?.[1]?.trim() || line}</span>
                         <span className="text-xs uppercase tracking-tighter text-emerald-500/60 font-black">Overall Compatibility</span>
                       </div>
                     );
                   }

                   // Section Headers
                   if (line.includes(':') && line.length < 50) {
                     return (
                       <h3 key={i} className="text-orange-400 font-bold flex items-center gap-2 mt-6 first:mt-0">
                         <ChevronRight className="w-4 h-4" />
                         {line}
                       </h3>
                     );
                   }

                   return <p key={i} className="text-slate-300 leading-relaxed font-light pl-6 relative border-l border-emerald-900/50 py-1">{line}</p>;
                 })}
               </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-2 transition-colors"
              >
                Back to Analysis <ArrowRight className="w-3 h-3 -rotate-90" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 relative z-10 text-slate-500 text-xs font-light tracking-[0.2em] uppercase">
        © 2026 VolunteerMatch AI Solutions • Community First
      </footer>
    </main>
  );
}
