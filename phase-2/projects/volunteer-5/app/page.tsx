'use client';

import React, { useState, useEffect } from 'react';
import { Search, PenTool, BookOpen, Clock, AlertCircle } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    projects: '',
    skills: '',
    challenges: '',
    upcoming: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const promptText = `
    Current NGO Projects: ${formData.projects}
    Current Volunteer Skills Available: ${formData.skills}
    Project Challenges Faced: ${formData.challenges}
    Upcoming Initiatives: ${formData.upcoming}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate analysis');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="paper-container min-h-screen">
      <header className="mb-12 border-b-2 border-primary pb-8">
        <div className="flex justify-between items-end mb-4">
          <div className="text-sm font-semibold tracking-widest text-primary uppercase font-serif">
            Vol. CXLV ... No. 50,211
          </div>
          <div className="text-sm font-serif italic text-secondary">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold text-center heading-font mb-4 text-[#1a1a1a] tracking-tight">
          SkillGapFinder
        </h1>
        <div className="newspaper-rule"></div>
        <p className="text-xl md:text-2xl text-center italic text-secondary heading-font max-w-3xl mx-auto">
          Describe your NGO projects — find the volunteer skill gaps holding you back
        </p>
      </header>

      <main>
        <div className="column-layout">
          {/* Left Column: Input Form */}
          <section className="pr-0 md:pr-8 md:border-r border-border">
            <h2 className="text-2xl font-bold heading-font mb-6 pb-2 border-b border-border flex items-center gap-2 text-primary">
              <PenTool size={24} />
              Report Current Status
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="projects" className="label-text flex items-center gap-2">
                  <BookOpen size={16} /> Current NGO Projects
                </label>
                <textarea
                  id="projects"
                  name="projects"
                  rows={3}
                  className="input-field"
                  placeholder="E.g. Weekly food drive, community garden, after-school tutoring..."
                  value={formData.projects}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="skills" className="label-text flex items-center gap-2">
                  <Search size={16} /> Volunteer Skills Available
                </label>
                <textarea
                  id="skills"
                  name="skills"
                  rows={3}
                  className="input-field"
                  placeholder="E.g. 5 drivers, 2 teachers, general manual labor..."
                  value={formData.skills}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="challenges" className="label-text flex items-center gap-2">
                  <AlertCircle size={16} /> Project Challenges Faced
                </label>
                <textarea
                  id="challenges"
                  name="challenges"
                  rows={3}
                  className="input-field"
                  placeholder="E.g. Struggling with social media outreach, accounting is messy..."
                  value={formData.challenges}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="upcoming" className="label-text flex items-center gap-2">
                  <Clock size={16} /> Upcoming Initiatives
                </label>
                <textarea
                  id="upcoming"
                  name="upcoming"
                  rows={3}
                  className="input-field"
                  placeholder="E.g. Launching a new website next month, organizing a fundraiser gala..."
                  value={formData.upcoming}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="submit-btn flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-pulse">Analyzing Needs...</span>
                  ) : (
                    <>Run Gap Analysis</>
                  )}
                </button>
              </div>
              
              {error && (
                <div className="mt-4 p-4 border border-red-800 bg-red-50 text-red-900 text-sm font-serif italic">
                  <strong>Error:</strong> {error}
                </div>
              )}
            </form>
          </section>

          {/* Right Column: Results */}
          <section className="pl-0 md:pl-4">
            <h2 className="text-2xl font-bold heading-font mb-6 pb-2 border-b border-border flex items-center gap-2 text-primary">
              <Search size={24} />
              Strategic Analysis
            </h2>
            
            <div className="prose prose-stone max-w-none">
              {!result && !loading && (
                <div className="text-secondary italic text-lg leading-relaxed mt-12 text-center border p-8 border-dashed border-border bg-white/50">
                  Awaiting operational data. Submit the report to generate a comprehensive skill gap analysis and recruitment strategy.
                </div>
              )}

              {loading && (
                <div className="space-y-4 animate-pulse mt-8">
                  <div className="h-8 bg-gray-200 w-3/4 mb-6"></div>
                  <div className="h-4 bg-gray-200 w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 w-5/6 mb-6"></div>
                  <div className="h-6 bg-gray-200 w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 w-4/5 mb-2"></div>
                </div>
              )}

              {result && !loading && (
                <div className="analysis-result">
                  {/* Custom rendering of markdown-like text to fit the newspaper style */}
                  {result.split('\n').map((paragraph, index) => {
                    if (paragraph.trim().startsWith('##')) {
                      return <h3 key={index} className="text-xl font-bold heading-font mt-8 mb-4 text-primary border-b border-border pb-2">{paragraph.replace(/#/g, '').trim()}</h3>;
                    }
                    if (paragraph.trim().startsWith('#')) {
                      return <h2 key={index} className="text-2xl font-bold heading-font mt-10 mb-4 text-[#1a1a1a] uppercase tracking-wider">{paragraph.replace(/#/g, '').trim()}</h2>;
                    }
                    if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                      return <p key={index} className="font-bold mt-4 mb-2">{paragraph.replace(/\*\*/g, '')}</p>;
                    }
                    if (paragraph.trim().startsWith('* ')) {
                      return <li key={index} className="ml-4 mb-2 list-disc">{paragraph.substring(2).replace(/\*\*/g, '')}</li>;
                    }
                    if (paragraph.trim() === '') return <br key={index} />;
                    return <p key={index} className="mb-4 leading-relaxed text-justify">{paragraph.replace(/\*\*/g, '')}</p>;
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-secondary font-serif">
        <p>© {new Date().getFullYear()} SkillGapFinder · Empowering NGO Operations</p>
      </footer>
    </div>
  );
}
