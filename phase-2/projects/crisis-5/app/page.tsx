'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Send, AlertTriangle, Clock, Users, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';

export default function PostMortemPro() {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    whatHappened: '',
    timeline: '',
    whatWentWell: '',
    whatFailed: '',
    teamsInvolved: '',
    outcome: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    const prompt = `
      What Happened: ${formData.whatHappened}
      Timeline of Events: ${formData.timeline}
      What Went Well: ${formData.whatWentWell}
      What Failed: ${formData.whatFailed}
      Teams Involved: ${formData.teamsInvolved}
      Outcome: ${formData.outcome}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate post-mortem');
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to parse markdown-like text to formatted HTML
  const formatResultText = (text: string) => {
    const sections = text.split('\n\n').filter(s => s.trim().length > 0);
    
    return sections.map((section, idx) => {
      // Check if heading (starts with ## or **)
      if (section.startsWith('## ') || (section.startsWith('**') && section.endsWith('**') && section.length < 100 && !section.includes('\n'))) {
        const title = section.replace(/[#*]/g, '').trim();
        return (
          <h2 key={idx} className="text-xl md:text-2xl font-bold mt-8 mb-4 uppercase tracking-wider border-b border-[var(--border)] pb-2 text-[var(--accent)] font-heading">
            {title}
          </h2>
        );
      }
      
      // Check if list item
      if (section.includes('\n* ') || section.includes('\n- ') || section.startsWith('* ') || section.startsWith('- ')) {
        const items = section.split(/\n?(?:[*-]\s)/).filter(i => i.trim().length > 0);
        return (
          <ul key={idx} className="list-disc pl-5 mb-4 space-y-2">
            {items.map((item, i) => {
              // Extract bold prefixes like **Step 1:**
              const boldMatch = item.match(/^\*\*(.*?)\*\*(.*)/);
              if (boldMatch) {
                return (
                  <li key={i} className="mb-2">
                    <strong className="font-semibold text-[var(--foreground)]">{boldMatch[1]}</strong>
                    <span>{boldMatch[2].replace(/\*/g, '')}</span>
                  </li>
                );
              }
              return <li key={i} className="mb-2">{item.replace(/\*/g, '')}</li>;
            })}
          </ul>
        );
      }

      // Check if numbered list
      if (section.match(/^\d+\./m)) {
        const items = section.split(/\n?(?:\d+\.\s)/).filter(i => i.trim().length > 0);
        return (
          <ol key={idx} className="list-decimal pl-5 mb-4 space-y-2">
            {items.map((item, i) => {
              const boldMatch = item.match(/^\*\*(.*?)\*\*(.*)/);
              if (boldMatch) {
                return (
                  <li key={i} className="mb-2 pl-1 marker:font-bold">
                    <strong className="font-semibold text-[var(--foreground)]">{boldMatch[1]}</strong>
                    <span>{boldMatch[2].replace(/\*/g, '')}</span>
                  </li>
                );
              }
              return <li key={i} className="mb-2 pl-1 marker:font-bold">{item.replace(/\*/g, '')}</li>;
            })}
          </ol>
        );
      }

      // Format bold text within normal paragraph
      const formattedText = section.split(/(\*\*.*?\*\*)/).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return <p key={idx} className="mb-4 text-justify">{formattedText}</p>;
    });
  };

  if (!isMounted) return null;

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-12 px-4 sm:px-6 lg:px-8 selection:bg-[var(--accent)] selection:text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Header - Editorial Style */}
        <header className="mb-12 text-center border-b-4 border-double border-[var(--border)] pb-8 relative">
          <div className="absolute top-0 left-0 w-full flex justify-between text-xs uppercase tracking-widest text-gray-500 font-body mb-4 hidden md:flex">
            <span>Vol. 1</span>
            <span>{currentDate}</span>
            <span>Hospitality Edition</span>
          </div>
          
          <div className="mt-8 mb-2 flex items-center justify-center gap-3 text-[var(--accent)]">
            <FileText size={28} />
            <span className="uppercase tracking-widest text-sm font-semibold">Incident Report Generator</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 font-heading tracking-tight" style={{ fontVariant: 'small-caps' }}>
            PostMortemPro
          </h1>
          
          <div className="newspaper-rule"></div>
          
          <p className="text-xl md:text-2xl italic font-serif max-w-3xl mx-auto text-gray-700 leading-relaxed">
            After a crisis — auto-generate a complete incident post-mortem report.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Input Form Column */}
          <div className="lg:col-span-4 lg:border-r border-[var(--border)] lg:pr-12 relative">
            <div className="sticky top-6">
              <div className="mb-6 border-b border-[var(--border)] pb-2">
                <h2 className="text-xl font-bold uppercase tracking-widest font-heading">Submit Brief</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6 font-body">
                <div>
                  <label htmlFor="whatHappened" className="block text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-[var(--accent)]"/> The Incident
                  </label>
                  <textarea
                    id="whatHappened"
                    name="whatHappened"
                    required
                    value={formData.whatHappened}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] focus:ring-0 px-0 py-2 resize-none outline-none transition-colors"
                    placeholder="Briefly describe what occurred..."
                  />
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Clock size={16} className="text-[var(--accent)]"/> Timeline
                  </label>
                  <textarea
                    id="timeline"
                    name="timeline"
                    required
                    value={formData.timeline}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] focus:ring-0 px-0 py-2 resize-none outline-none transition-colors"
                    placeholder="Key events and times..."
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:grid-cols-1">
                  <div>
                    <label htmlFor="whatWentWell" className="block text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[var(--accent)]"/> What Worked
                    </label>
                    <textarea
                      id="whatWentWell"
                      name="whatWentWell"
                      required
                      value={formData.whatWentWell}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] focus:ring-0 px-0 py-2 resize-none outline-none transition-colors"
                      placeholder="Successes in response..."
                    />
                  </div>

                  <div>
                    <label htmlFor="whatFailed" className="block text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                      <XCircle size={16} className="text-[var(--accent)]"/> What Failed
                    </label>
                    <textarea
                      id="whatFailed"
                      name="whatFailed"
                      required
                      value={formData.whatFailed}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] focus:ring-0 px-0 py-2 resize-none outline-none transition-colors"
                      placeholder="Breakdowns in response..."
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="teamsInvolved" className="block text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Users size={16} className="text-[var(--accent)]"/> Teams
                  </label>
                  <input
                    type="text"
                    id="teamsInvolved"
                    name="teamsInvolved"
                    required
                    value={formData.teamsInvolved}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] focus:ring-0 px-0 py-2 outline-none transition-colors"
                    placeholder="Security, Front Desk, EMTs..."
                  />
                </div>

                <div>
                  <label htmlFor="outcome" className="block text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <ShieldAlert size={16} className="text-[var(--accent)]"/> Outcome
                  </label>
                  <input
                    type="text"
                    id="outcome"
                    name="outcome"
                    required
                    value={formData.outcome}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] focus:ring-0 px-0 py-2 outline-none transition-colors"
                    placeholder="Final resolution..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--foreground)] text-[var(--background)] py-4 px-6 uppercase tracking-widest text-sm font-bold hover:bg-[var(--accent)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-heading"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Drafting Report...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Generate Report
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-8 min-h-[500px]">
            {error && (
              <div className="p-6 border-2 border-[var(--accent)] bg-red-50/50 mb-8">
                <div className="flex items-center gap-3 text-[var(--accent)] font-bold uppercase tracking-widest mb-2 font-heading">
                  <AlertTriangle size={24} />
                  Error in Publishing
                </div>
                <p className="font-serif italic text-lg">{error}</p>
              </div>
            )}

            {!result && !isSubmitting && !error && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 border-2 border-dashed border-[var(--border)] p-12">
                <FileText size={64} className="mb-6 text-[var(--accent)]" />
                <h3 className="text-2xl font-heading mb-2">Awaiting Incident Details</h3>
                <p className="font-serif italic max-w-md">
                  Submit the brief via the left column to auto-generate a comprehensive editorial-style post-mortem analysis.
                </p>
              </div>
            )}

            {isSubmitting && (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-[var(--border)] rounded-full border-t-[var(--accent)] animate-spin"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[var(--accent)]">
                    <FileText size={32} />
                  </div>
                </div>
                <div className="text-xl font-heading uppercase tracking-widest animate-pulse">
                  Typesetting Analysis...
                </div>
              </div>
            )}

            {result && !isSubmitting && (
              <article className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
                <div className="mb-8 border-b-2 border-[var(--foreground)] pb-4">
                  <p className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] inline-block"></span>
                    Official Record
                  </p>
                  <h2 className="text-4xl md:text-5xl font-black font-heading leading-tight mb-4 uppercase">
                    Incident Analysis & Post-Mortem Review
                  </h2>
                  <div className="flex items-center gap-4 text-sm uppercase tracking-widest text-gray-600 font-semibold">
                    <span>Generated: {new Date().toLocaleTimeString()}</span>
                    <span>•</span>
                    <span>Status: Confidential</span>
                  </div>
                </div>
                
                <div className="prose prose-lg max-w-none text-[var(--foreground)] font-body">
                  <div className="column-text">
                    {formatResultText(result)}
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t border-[var(--border)] flex justify-between items-center text-sm uppercase tracking-widest font-bold text-gray-500">
                  <span>End of Report</span>
                  <span>PostMortemPro © {new Date().getFullYear()}</span>
                </div>
              </article>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
