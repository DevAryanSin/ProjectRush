'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Database, Activity, RefreshCw, AlertTriangle, CheckSquare } from 'lucide-react';

export default function Page() {
  const [formData, setFormData] = useState({
    taskCompleted: '',
    volunteerDetails: '',
    beneficiariesHelped: '',
    resourcesUsed: '',
    outcomesAchieved: '',
    location: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [typing, setTyping] = useState('');
  const resultEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (result && typing.length < result.length) {
      const timeout = setTimeout(() => {
        setTyping(result.slice(0, typing.length + 3));
      }, 5);
      return () => clearTimeout(timeout);
    } else if (result && typing.length >= result.length) {
      if (resultEndRef.current) {
        resultEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [result, typing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    setTyping('');

    const promptText = `
      Task Completed: ${formData.taskCompleted}
      Volunteer Details: ${formData.volunteerDetails}
      Beneficiaries Helped: ${formData.beneficiariesHelped}
      Resources Used: ${formData.resourcesUsed}
      Outcomes Achieved: ${formData.outcomesAchieved}
      Location: ${formData.location}
    `;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate story');
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'System failure occurred during processing');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center items-start">
      <main className="w-full max-w-5xl terminal-border bg-black/90 p-1 md:p-[2px] mt-4 md:mt-8 relative z-10">
        
        {/* Fake window chrome */}
        <div className="bg-[#111] border-b border-[var(--term-border)] p-2 flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Terminal size={16} className="text-[var(--term-text)]" />
            <span className="text-xs uppercase tracking-wider text-[var(--term-text)] font-bold">root@tasknarrator-sc:~</span>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-600 border border-gray-500"></div>
            <div className="w-3 h-3 rounded-full bg-gray-600 border border-gray-500"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--term-border)] border border-[var(--term-border)]"></div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tighter uppercase glitch text-[var(--term-text)]" data-text="TaskNarrator">
              TaskNarrator
            </h1>
            <p className="text-[var(--term-text-dim)] border-l-2 border-[var(--term-text-dim)] pl-4 py-1">
              $ system_desc --info<br />
              &gt; Completed task details — generate a donor-motivating impact story<br />
              &gt; Status: <span className="text-[var(--term-border)] blink-cursor">ONLINE</span>
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
            {/* Input Form */}
            <section className="terminal-dashed-border p-6 relative">
              <div className="absolute -top-3 left-4 bg-black px-2 text-xs uppercase text-[var(--term-accent)] font-bold tracking-widest flex items-center gap-2">
                <Database size={14} /> Data_Input_Module
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6 mt-2">
                
                <div className="space-y-1">
                  <label className="block text-sm uppercase text-[var(--term-text-dim)]">
                    <span className="text-[var(--term-accent)]">$</span> Task_Completed
                  </label>
                  <div className="flex items-start">
                    <span className="text-[var(--term-text)] mr-2 mt-1">&gt;</span>
                    <input
                      required
                      type="text"
                      name="taskCompleted"
                      value={formData.taskCompleted}
                      onChange={handleChange}
                      placeholder="e.g. Distributed 500 meal kits"
                      className="terminal-input"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm uppercase text-[var(--term-text-dim)]">
                    <span className="text-[var(--term-accent)]">$</span> Volunteer_Details
                  </label>
                  <div className="flex items-start">
                    <span className="text-[var(--term-text)] mr-2 mt-1">&gt;</span>
                    <input
                      required
                      type="text"
                      name="volunteerDetails"
                      value={formData.volunteerDetails}
                      onChange={handleChange}
                      placeholder="e.g. Team of 12 local youths"
                      className="terminal-input"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm uppercase text-[var(--term-text-dim)]">
                    <span className="text-[var(--term-accent)]">$</span> Beneficiaries_Helped
                  </label>
                  <div className="flex items-start">
                    <span className="text-[var(--term-text)] mr-2 mt-1">&gt;</span>
                    <input
                      required
                      type="text"
                      name="beneficiariesHelped"
                      value={formData.beneficiariesHelped}
                      onChange={handleChange}
                      placeholder="e.g. 150 elderly residents"
                      className="terminal-input"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm uppercase text-[var(--term-text-dim)]">
                    <span className="text-[var(--term-accent)]">$</span> Resources_Used
                  </label>
                  <div className="flex items-start">
                    <span className="text-[var(--term-text)] mr-2 mt-1">&gt;</span>
                    <input
                      required
                      type="text"
                      name="resourcesUsed"
                      value={formData.resourcesUsed}
                      onChange={handleChange}
                      placeholder="e.g. 2 delivery vans, $500 groceries"
                      className="terminal-input"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm uppercase text-[var(--term-text-dim)]">
                    <span className="text-[var(--term-accent)]">$</span> Outcomes_Achieved
                  </label>
                  <div className="flex items-start">
                    <span className="text-[var(--term-text)] mr-2 mt-1">&gt;</span>
                    <textarea
                      required
                      name="outcomesAchieved"
                      value={formData.outcomesAchieved}
                      onChange={handleChange}
                      placeholder="e.g. Food security for the weekend..."
                      className="terminal-input resize-none h-20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm uppercase text-[var(--term-text-dim)]">
                    <span className="text-[var(--term-accent)]">$</span> Location
                  </label>
                  <div className="flex items-start">
                    <span className="text-[var(--term-text)] mr-2 mt-1">&gt;</span>
                    <input
                      required
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Downtown Community Center"
                      className="terminal-input"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="terminal-button w-full sm:w-auto flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        PROCESSING...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        [&gt; EXECUTE GENERATE_STORY]
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>

            {/* Output Display */}
            <section className="terminal-dashed-border p-6 relative bg-[#020502] min-h-[400px] flex flex-col">
              <div className="absolute -top-3 left-4 bg-black px-2 text-xs uppercase text-[var(--term-accent)] font-bold tracking-widest flex items-center gap-2">
                <Activity size={14} /> Output_Terminal
              </div>

              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-[var(--term-text-dim)] space-y-4">
                  <RefreshCw size={32} className="animate-spin text-[var(--term-border)]" />
                  <p className="uppercase tracking-widest text-sm text-center">
                    Connecting to narrative engine...
                    <br />Synthesizing impact vectors...
                    <br />Generating emotional resonance...
                  </p>
                  <div className="w-full max-w-xs h-1 bg-[var(--term-bg)] border border-[var(--term-text-dim)] mt-4">
                    <div className="h-full bg-[var(--term-border)] animate-pulse w-full origin-left" style={{ animationDuration: '2s' }}></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-[var(--term-error)] border border-[var(--term-error)] p-4 bg-[#1a0505] flex items-start gap-3 mt-4">
                  <AlertTriangle size={24} className="shrink-0" />
                  <div>
                    <h3 className="font-bold uppercase mb-1">ERR_CRITICAL_FAILURE</h3>
                    <p className="text-sm">{error}</p>
                    <p className="text-xs mt-2 opacity-70">Check connection and retry sequence.</p>
                  </div>
                </div>
              )}

              {!loading && !error && !result && (
                <div className="flex-1 flex flex-col items-center justify-center text-[var(--term-text-dim)] opacity-50">
                  <CheckSquare size={48} className="mb-4" />
                  <p className="uppercase text-sm tracking-widest">Awaiting input execution</p>
                  <p className="text-xs mt-2">&gt; System idle <span className="blink-cursor">_</span></p>
                </div>
              )}

              {result && !loading && (
                <div className="mt-2 text-sm md:text-base leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                  <div className="text-[var(--term-accent)] mb-4 uppercase text-xs tracking-widest pb-2 border-b border-[var(--term-text-dim)]">
                    // NARRATIVE_GENERATED_SUCCESSFULLY
                  </div>
                  {typing}
                  {typing.length >= result.length && <span className="blink-cursor inline-block ml-1 w-2 h-4 bg-[var(--term-text)] align-middle"></span>}
                  <div ref={resultEndRef} />
                </div>
              )}
            </section>

          </div>
          
          {/* Footer */}
          <footer className="mt-12 text-center text-[var(--term-text-dim)] text-xs uppercase tracking-widest border-t border-[var(--term-text-dim)] pt-4">
            TaskNarrator System v1.0.0 | Sec-Level: GREEN | Authorized Personnel Only
          </footer>

        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #050a05;
          border-left: 1px dashed var(--term-text-dim);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--term-text-dim);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--term-border);
        }
      `}} />
    </div>
  );
}
