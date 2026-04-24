'use client';

import { useState, useEffect } from 'react';
import { Send, MapPin, Users, AlertTriangle, RefreshCcw, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function StaffPulse() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Fix for hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setResult(data.result);
      } else {
        setError(data.error || "Failed to synchronize team status.");
      }
    } catch (err) {
      setError("Network error: Unable to reach coordination server.");
    } finally {
      setLoading(false);
    }
  };

  const parseSections = (text: string) => {
    const sections = [
      { id: 1, title: 'Team Status Map', icon: Users, color: 'text-blue-500' },
      { id: 2, title: 'Zone Coverage Assessment', icon: MapPin, color: 'text-green-500' },
      { id: 3, title: 'Top 3 Coverage Gaps', icon: AlertTriangle, color: 'text-amber-500' },
      { id: 4, title: 'Redeployment Recommendations', icon: Activity, color: 'text-purple-500' }
    ];

    return sections.map(section => {
      // Look for markers like (1), 1., or **Title**
      const pattern = new RegExp(`(?:\\(${section.id}\\)|${section.id}\\.|\\*\\*${section.title}\\*\\*|### ${section.title})([\\s\\S]*?)(?=\\(|\\d\\.|\\*\\*|###|$)`, 'i');
      const match = text.match(pattern);
      
      return {
        ...section,
        content: match ? match[1].trim() : (text.includes(section.title) ? "Content identified but formatting varies." : null)
      };
    });
  };

  const parsedData = result ? parseSections(result) : null;
  const hasParsedContent = parsedData?.some(d => d.content);

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8">
      <header className="max-w-4xl mx-auto pt-12 pb-16 text-center">
        <div className="inline-flex items-center gap-2 neo-out px-6 py-2 mb-8 text-amber-600 font-bold text-sm tracking-widest uppercase">
          <ShieldAlert size={16} />
          Emergency Operations Mode
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-gray-800 tracking-tighter mb-4">
          StaffPulse
        </h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
          Staff check-in during a crisis — get a live team status synthesis
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <section className="neo-out p-1 md:p-8 mb-16 overflow-hidden">
          <div className="p-6 md:p-0">
            <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-amber-500" size={24} />
              Incoming Status Updates
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="neo-in p-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Format: [Name], [Location], [Status] - [Observation]&#10;Example: Marcus, Lobby, Safe - monitoring exits. Elena, Floor 3, Assisting guests with evacuation..."
                  className="w-full h-48 bg-transparent p-6 text-gray-700 placeholder-gray-400 border-none outline-none resize-none font-medium text-lg leading-relaxed"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 neo-btn text-gray-800 font-black text-xl tracking-wide flex items-center justify-center gap-3 hover:text-amber-600 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCcw className="animate-spin" size={24} />
                    Processing Intel...
                  </>
                ) : (
                  <>
                    <Send size={24} />
                    Synthesize Situation Map
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {error && (
          <div className="neo-out p-6 mb-12 border-l-8 border-red-500 bg-red-50/10">
            <p className="text-red-600 font-bold flex items-center gap-2">
              <AlertTriangle size={20} />
              {error}
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-6">
              <div className="h-px flex-1 bg-gray-300"></div>
              <span className="text-gray-400 font-black tracking-[0.3em] text-xs uppercase">Tactical Overview</span>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            {hasParsedContent ? (
              <div className="grid grid-cols-1 gap-10">
                {parsedData?.map((section) => section.content && (
                  <div key={section.id} className="neo-out p-8 transition-transform hover:scale-[1.005]">
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200/50">
                      <div className={`neo-in p-3 rounded-2xl ${section.color}`}>
                        <section.icon size={24} />
                      </div>
                      <h3 className="text-2xl font-black text-gray-700 tracking-tight">
                        {section.title}
                      </h3>
                    </div>
                    <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="neo-out p-10 text-gray-700 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                {result}
              </div>
            )}

            <div className="neo-out p-8 bg-amber-500/5 border border-amber-500/10">
              <div className="flex items-center gap-3 text-amber-600 font-bold mb-4">
                <ShieldAlert size={20} />
                Critical Reminder
              </div>
              <p className="text-gray-600 italic">
                AI synthesis is a decision-support tool. Always prioritize local safety protocols and direct communications where possible.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto mt-24 text-center">
        <div className="neo-in inline-block px-8 py-4 text-gray-400 font-bold tracking-widest text-xs uppercase">
          StaffPulse v1.0 • Hospitality Emergency Management System
        </div>
      </footer>
    </div>
  );
}
