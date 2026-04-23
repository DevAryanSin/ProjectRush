'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Shield, Zap, Info, ShieldCheck, ChevronRight, Scale, Clock, Activity } from 'lucide-react';

function processText(str: string, index: number) {
  const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return (
    <span key={index}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-[#f7ba14] font-semibold">{part.slice(2, -2)}</strong>;
        } else if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={i} className="text-gray-200 italic">{part.slice(1, -1)}</em>;
        }
        return part;
      })}
    </span>
  );
}

function parseMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentList: React.ReactNode[] = [];
  let inList = false;
  let isNumberList = false;

  const closeList = (index: number) => {
    if (inList) {
      if (isNumberList) {
        elements.push(<ol key={`ol-${index}`} className="space-y-3 mb-6 ml-2">{currentList}</ol>);
      } else {
        elements.push(<ul key={`ul-${index}`} className="space-y-3 mb-6 ml-2">{currentList}</ul>);
      }
      currentList = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('#')) {
      closeList(index);
      const level = trimmed.match(/^#+/)?.[0].length || 1;
      const content = trimmed.replace(/^#+\s*/, '');
      const Tag = `h${Math.min(level + 2, 6)}` as keyof React.JSX.IntrinsicElements;
      
      elements.push(
        <Tag key={index} className={`font-bold text-white mt-8 mb-4 tracking-tight ${level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg'}`}>
          {processText(content, index)}
        </Tag>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (inList && isNumberList) closeList(index);
      inList = true;
      isNumberList = false;
      const content = trimmed.substring(2);
      currentList.push(
        <li key={index} className="flex gap-3 items-start text-gray-300">
          <span className="text-[#f7ba14] mt-1 font-bold text-lg leading-none">•</span>
          <span className="leading-relaxed">{processText(content, index)}</span>
        </li>
      );
    } else if (trimmed.match(/^\d+\.\s/)) {
      if (inList && !isNumberList) closeList(index);
      inList = true;
      isNumberList = true;
      const content = trimmed.replace(/^\d+\.\s/, '');
      const num = trimmed.match(/^\d+/)?.[0];
      currentList.push(
        <li key={index} className="flex gap-3 items-start text-gray-300">
          <span className="text-[#4474fa] font-bold mt-0.5 tabular-nums">{num}.</span>
          <span className="leading-relaxed">{processText(content, index)}</span>
        </li>
      );
    } else if (trimmed === '') {
      // blank line might close list, or maybe we keep list open? Let's close it.
      closeList(index);
    } else {
      closeList(index);
      elements.push(
        <p key={index} className="text-gray-300 leading-relaxed mb-4">
          {processText(trimmed, index)}
        </p>
      );
    }
  });

  closeList(lines.length);
  return <>{elements}</>;
}


export default function RightsDesk() {
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const endOfResultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputVal }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.result || 'An error occurred.');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to RightsDesk API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (result || error) {
      setTimeout(() => {
        endOfResultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [result, error]);

  const presetQuestions = [
    "How do I protect highlights of our semi-final match from unauthorized Twitter clipping?",
    "Asset Registration: 4K Drone footage of Stadium opening ceremony, 10 min length.",
    "Can fan-run Instagram pages legally monetize memes using our official broadcast footage?"
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#f7ba14] selection:text-black">
      {/* Header */}
      <header className="glass-card !border-x-0 !border-t-0 !rounded-none px-6 py-4 sticky top-0 z-50 flex items-center justify-between bg-[var(--bg-dark)]/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#4474fa] to-blue-800 p-2 rounded-xl shadow-[0_0_15px_rgba(68,116,250,0.3)] border border-[#4474fa]/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white mb-0.5 leading-none font-display">
              RightsDesk
            </h1>
            <p className="text-[10px] text-gray-400 font-semibold tracking-[0.2em] uppercase">
              Digital Media Integrity
            </p>
          </div>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-semibold text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Dashboard</a>
          <a href="#" className="hover:text-white transition-colors">Assets</a>
          <a href="#" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#f7ba14] drop-shadow-[0_0_8px_rgba(247,186,20,0.4)]">Advisor</a>
        </nav>
        <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]"></div>
          <span className="text-xs text-gray-300 font-semibold tracking-wider uppercase hidden sm:inline">Secure</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto p-4 sm:p-6 lg:p-10 flex flex-col lg:flex-row gap-6 lg:gap-10 max-w-7xl">
        
        {/* Left Panel / Intro */}
        <div className="lg:w-[35%] flex flex-col gap-6">
          <div className="glass-card p-8 flex-1 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#4474fa] opacity-20 rounded-full blur-3xl transition-all duration-700 group-hover:opacity-30"></div>
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#f7ba14] opacity-10 rounded-full blur-3xl transition-all duration-700 group-hover:opacity-20"></div>
            
            <div className="relative z-10">
              <Badge text="Rights Advisory AI" icon={<Activity className="w-3.5 h-3.5" />} />
              
              <h2 className="text-4xl sm:text-5xl font-bold mt-6 mb-5 leading-tight font-display tracking-tight">
                IP <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#4474fa] to-blue-300">Control</span> <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 text-3xl sm:text-4xl">System</span>
              </h2>
              
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 font-medium">
                Identify, track, and flag unauthorized use of official sports media. 
                Register your assets or ask natural language questions about licensing and rights.
              </p>
              
              <div className="space-y-5">
                <FeatureItem icon={<ShieldCheck />} title="Authentication" desc="Verify assets globally in real-time." />
                <FeatureItem icon={<Scale />} title="Licensing Strategy" desc="Expert legal pathways & options." />
                <FeatureItem icon={<Clock />} title="Anomaly Tracking" desc="Monitor propagation immediately." />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel / Interaction */}
        <div className="lg:w-[65%] flex flex-col gap-6 relative z-10">
          
          {/* Input Card */}
          <div className={`glass-card p-2 md:p-3 relative transition-all duration-500 overflow-hidden ${isLoading ? 'border-[#4474fa] shadow-[0_0_30px_rgba(68,116,250,0.15)] animated-border' : 'hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]'}`}>
            <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className="w-full bg-black/20 border border-white/5 rounded-2xl text-white pl-16 pr-6 py-5 text-lg placeholder-gray-500 focus:outline-none focus:border-[#4474fa]/50 focus:bg-black/40 transition-all font-medium"
                  placeholder="Describe an asset or ask a question..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  suppressHydrationWarning
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                suppressHydrationWarning
                disabled={isLoading || !inputVal.trim()}
                className="bg-white text-black sm:w-auto w-full px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group whitespace-nowrap"
              >
                {isLoading ? 'Processing...' : 'Analyze Now'}
                {!isLoading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>

          {/* Quick Prompts */}
          {!result && !isLoading && !error && (
            <div className="flex flex-col gap-3">
               <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase ml-1">Suggested Inquiries</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputVal(q)}
                    className="glass-card !border-white/5 bg-white/[0.02] hover:bg-white/[0.06] p-4 text-sm text-gray-400 hover:text-white transition-all duration-300 text-left hover:border-[#f7ba14]/30 group"
                  >
                    <span className="line-clamp-2 md:line-clamp-none">{q}</span>
                    <ChevronRight className="w-4 h-4 mt-2 text-[#f7ba14] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Area */}
          {(isLoading || result || error) && (
            <div className="glass-card flex-1 min-h-[400px] flex flex-col overflow-hidden relative">
              {/* Header of results */}
              <div className="border-b border-white/10 px-6 py-5 bg-black/40 flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-3 uppercase tracking-wider text-sm">
                  <Zap className="w-5 h-5 text-[#f7ba14] drop-shadow-[0_0_8px_rgba(247,186,20,0.5)]" />
                  RightsDesk Analysis
                </h3>
              </div>
              
              <div className="p-6 md:p-10 flex-1 overflow-y-auto">
                {isLoading && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-[#4474fa] animate-spin"></div>
                      <div className="w-16 h-16 rounded-full border-b-2 border-l-2 border-[#f7ba14] animate-spin absolute inset-0 animation-delay-500"></div>
                      <Shield className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 pulse" />
                    </div>
                    <p className="font-medium animate-pulse tracking-wide uppercase text-sm">Authenticating & Analyzing...</p>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-6 rounded-2xl flex items-start gap-4">
                    <div className="bg-red-500/20 p-2 rounded-lg">
                      <Info className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-red-400">System Error</h4>
                      <p className="text-sm opacity-90">{error}</p>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="w-full">
                    {parseMarkdown(result)}
                  </div>
                )}
                <div ref={endOfResultRef} />
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// Subcomponents
function Badge({ text, icon }: { text: string, icon?: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 bg-[#4474fa]/10 border border-[#4474fa]/30 text-[#4474fa] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(68,116,250,0.15)] w-fit backdrop-blur-sm">
      {icon}
      {text}
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4 items-start group">
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#4474fa]/50 group-hover:bg-[#4474fa]/10 transition-all duration-300">
        <div className="text-gray-400 group-hover:text-[#4474fa] transition-colors [&>svg]:w-5 [&>svg]:h-5">
          {icon}
        </div>
      </div>
      <div className="pt-1">
        <h4 className="text-white font-bold mb-1 group-hover:text-[#4474fa] transition-colors text-sm uppercase tracking-wide">{title}</h4>
        <p className="text-sm text-gray-500 font-medium">{desc}</p>
      </div>
    </div>
  );
}
