'use client';

import React, { useState } from 'react';
import { 
  AlertCircle, 
  Users, 
  DollarSign, 
  Clock, 
  Send, 
  ListOrdered, 
  LayoutDashboard, 
  ShieldAlert,
  ChevronRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export default function UrgencyRank() {
  const [needs, setNeeds] = useState('');
  const [volunteers, setVolunteers] = useState('');
  const [budget, setBudget] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    const fullPrompt = `
      COMMUNITY NEEDS:
      ${needs}

      RESOURCES AVAILABLE:
      Volunteers: ${volunteers || 'Not specified'}
      Budget: ${budget || 'Not specified'}
      Timeframe: ${timeframe || 'Not specified'}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.result);
      } else {
        setError(data.error || 'Failed to analyze needs.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-[var(--accent-green)] mt-6 mb-3 glow-text">{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-[var(--accent-orange)] mt-5 mb-2">{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-white mt-4 mb-2">{line.replace('### ', '')}</h3>;
      if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-1 text-gray-300">{line.replace('- ', '')}</li>;
      if (line.match(/^\d+\. /)) return <li key={i} className="ml-4 mb-1 text-gray-300 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
      if (line.trim() === '') return <div key={i} className="h-2" />;
      
      // Basic bolding handler
      const boldParts = line.split(/(\*\*.*?\*\*)/);
      const elements = boldParts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-white">{part.replace(/\*\*/g, '')}</strong>;
        }
        return part;
      });

      return <p key={i} className="text-gray-400 mb-2 leading-relaxed">{elements}</p>;
    });
  };

  return (
    <div className="min-h-screen px-4 py-8 md:p-12 lg:p-20 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-5xl flex items-center justify-between mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-blue)] rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.3)]">
            <LayoutDashboard className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white glow-text">UrgencyRank</h1>
            <p className="text-[var(--accent-green)] text-sm font-medium">Smart NGO Resource Allocation</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-[var(--accent-green)] transition-colors">Documentation</a>
          <a href="#" className="hover:text-[var(--accent-green)] transition-colors">API Access</a>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2 text-white">
            <Users className="w-4 h-4 text-[var(--accent-orange)]" />
            <span>Active Response Mode</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Input Form Section */}
        <section className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-1000">
          <div className="glass-panel p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-green)]/10 blur-3xl -mr-16 -mt-16 group-hover:bg-[var(--accent-green)]/20 transition-all" />
            
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[var(--accent-orange)]" />
              Community Needs Assessment
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Describe Community Needs</label>
                <textarea 
                  value={needs}
                  onChange={(e) => setNeeds(e.target.value)}
                  placeholder="Example: Flood victims in Sector 4 need clean water. 5 houses destroyed. Local clinic short on bandages..."
                  className="glass-input min-h-[150px] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Available Volunteers
                  </label>
                  <input 
                    type="text"
                    value={volunteers}
                    onChange={(e) => setVolunteers(e.target.value)}
                    placeholder="e.g. 25 people"
                    className="glass-input"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Available Budget
                  </label>
                  <input 
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. $500.00"
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Urgent Timeframe
                </label>
                <input 
                  type="text"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  placeholder="e.g. Next 48 hours"
                  className="glass-input"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                suppressHydrationWarning
                className="glass-button-primary mt-4 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Data...
                  </>
                ) : (
                  <>
                    Analyze Priority
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Stats / Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-6 flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-500 uppercase">Impact Score</span>
              <span className="text-2xl font-bold text-[var(--accent-green)]">9.8/10</span>
            </div>
            <div className="glass-panel p-6 flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-500 uppercase">Status</span>
              <span className="text-2xl font-bold text-white flex items-center gap-2">
                Active <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse-slow" />
              </span>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="animate-in fade-in slide-in-from-right-4 duration-1000">
          {!result && !isLoading && !error && (
            <div className="glass-panel h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center border-dashed">
              <div className="p-6 bg-white/5 rounded-full mb-6">
                <Send className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready for Analysis</h3>
              <p className="text-gray-500 max-w-sm">
                Enter community data and resource constraints to generate a prioritized deployment strategy.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="glass-panel h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-[var(--accent-green)] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-[var(--accent-green)] animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Gemini is Processing</h3>
              <p className="text-gray-400 max-w-sm">
                Evaluating urgency levels, volunteer efficiency, and deployment trade-offs...
              </p>
              <div className="mt-8 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-bounce delay-200" />
                <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-bounce delay-300" />
              </div>
            </div>
          )}

          {error && (
            <div className="glass-panel h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center border-red-500/30">
              <div className="p-6 bg-red-500/10 rounded-full mb-6">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Analysis Failed</h3>
              <p className="text-gray-500 max-w-sm">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="glass-button-secondary mt-6"
              >
                Try Again
              </button>
            </div>
          )}

          {result && (
            <div className="glass-panel h-full p-8 animate-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--accent-green)]" />
                  <h3 className="text-xl font-bold">Deployment Strategy</h3>
                </div>
                <span className="text-xs bg-[var(--accent-green)]/20 text-[var(--accent-green)] px-2 py-1 rounded font-bold uppercase tracking-wider">
                  AI Generated
                </span>
              </div>
              
              <div className="prose prose-invert max-w-none">
                {formatMarkdown(result)}
              </div>

              <div className="mt-12 p-6 glass-panel bg-white/5 border-none">
                <div className="flex items-start gap-4">
                  <ListOrdered className="w-6 h-6 text-[var(--accent-orange)] mt-1" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Impact Summary</h4>
                    <p className="text-sm text-gray-400">
                      This allocation strategy prioritizes lives saved and immediate community stability based on current resource limitations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="w-full max-w-5xl mt-20 pb-10 border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 opacity-50">
          <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center font-bold text-xs">UR</div>
          <span className="text-sm">UrgencyRank v1.0.4 - Built for Social Impact</span>
        </div>
        <div className="flex items-center gap-8 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <span className="hover:text-white transition-colors cursor-pointer">Transparency</span>
          <span className="hover:text-white transition-colors cursor-pointer">Ethical AI</span>
          <span className="hover:text-white transition-colors cursor-pointer">NGO Partners</span>
        </div>
      </footer>
    </div>
  );
}
