"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Signal, 
  BookOpen, 
  Send, 
  AlertTriangle, 
  Users, 
  BarChart3, 
  MessageSquare, 
  ArrowRight,
  Terminal as TerminalIcon,
  Zap,
  Quote,
  Loader2
} from "lucide-react";

type Mode = "signals" | "story";

interface Need {
  need: string;
  urgency: number;
  sentiment: string;
  population: string;
  implied: string;
}

interface AnalysisResult {
  needs?: Need[];
  recommendations?: string[];
  headline?: string;
  narrative?: string;
  metrics?: string[];
  quote?: string;
  cta?: string;
}

export default function ImpactSignalApp() {
  const [mode, setMode] = useState<Mode>("signals");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const [typedText, setTypedText] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (result?.narrative && mode === "story") {
      setTypedText("");
      let i = 0;
      const interval = setInterval(() => {
        setTypedText((prev) => prev + result.narrative![i]);
        i++;
        if (i >= result.narrative!.length) clearInterval(interval);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [result, mode]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setTypedText("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, mode }),
      });

      const data = await response.json();
      setResult(data);
      
      // Scroll to result after a short delay
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen relative pb-20">
      {/* Aurora Background */}
      <div className="aurora-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <nav className="p-6 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Zap className="text-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-white">ImpactSignal</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 mono">Intelligence System v2.5</p>
          </div>
        </div>

        <div className="flex gap-1 bg-black/40 p-1 rounded-full border border-white/10">
          <button 
            onClick={() => { setMode("signals"); setResult(null); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${mode === "signals" ? "bg-primary text-background" : "text-white/60 hover:text-white"}`}
          >
            <Signal size={14} />
            COMMUNITY SIGNALS
          </button>
          <button 
            onClick={() => { setMode("story"); setResult(null); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${mode === "story" ? "bg-secondary text-white" : "text-white/60 hover:text-white"}`}
          >
            <BookOpen size={14} />
            IMPACT STORY
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        <header className="mb-12 text-center fade-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            {mode === "signals" ? "Detect Needs." : "Tell Your Impact."}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {mode === "signals" 
              ? "Convert raw community noise from social media, forums, and messages into structured, actionable intelligence."
              : "Transform operational data—tasks, metrics, and outcomes—into emotionally resonant donor narratives."}
          </p>
        </header>

        <section className="glass-card rounded-3xl p-8 mb-12 fade-in stagger-1">
          <div className="mb-6 flex justify-between items-end">
            <label className="text-sm font-bold uppercase tracking-widest text-primary/80 mono">
              {mode === "signals" ? "SOURCE_INPUT_STREAM" : "OPERATIONAL_DATA_LOG"}
            </label>
            <span className="text-[10px] text-white/40 mono">SECURE_CHANNEL_ACTIVE</span>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "signals" 
              ? "Paste social media posts, community messages, or forum transcripts here..." 
              : "Enter task details: 'Provided 500 meals in Kibera, 5 volunteers involved, focused on school children...'"}
            className="w-full h-48 glass-input rounded-xl p-6 mb-6 resize-none font-medium placeholder:text-white/20"
          />

          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] text-white/30 mono">
                <div className="w-1.5 h-1.5 rounded-full bg-terminal-accent animate-pulse" />
                SYSTEM_READY
              </div>
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={loading || !input.trim()}
              className="btn-analyze rounded-lg disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  PROCESSING...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap size={18} />
                  ANALYZE {mode === "signals" ? "SIGNALS" : "STORY"}
                </span>
              )}
            </button>
          </div>
        </section>

        {loading && (
          <div className="space-y-6 animate-pulse">
            <div className="h-40 bg-white/5 rounded-2xl border border-white/5" />
            <div className="h-64 bg-white/5 rounded-2xl border border-white/5" />
          </div>
        )}

        <div ref={resultRef}>
          {result && mode === "signals" && (
            <div className="space-y-8 fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.needs?.map((need, idx) => (
                  <div key={idx} className="glass-card rounded-2xl p-6 border-l-4 border-l-primary/50 group hover:border-l-primary transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold mono">NEED_{idx + 1}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-white/40 uppercase font-bold mono">Urgency:</span>
                        <span className={`text-sm font-bold mono ${need.urgency > 7 ? 'text-alert' : 'text-primary'}`}>
                          {need.urgency}/10
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white/90">{need.need}</h3>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase text-white/40 font-bold mono">Sentiment</p>
                        <p className="text-sm text-white/70 italic">"{need.sentiment}"</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase text-white/40 font-bold mono">Target Group</p>
                        <p className="text-sm text-white/70">{need.population}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-[10px] uppercase text-white/40 font-bold mono mb-1">Implicit Signal</p>
                      <p className="text-sm text-primary/80 italic">{need.implied}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="terminal-panel rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 mb-4 text-terminal-accent">
                  <TerminalIcon size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Action_Recommendations.sh</span>
                </div>
                <ul className="space-y-3">
                  {result.recommendations?.map((rec, idx) => (
                    <li key={idx} className="flex gap-4 items-start text-terminal-accent/90">
                      <span className="text-terminal-accent/40">{idx + 1}.</span>
                      <span className="text-sm md:text-base leading-relaxed tracking-tight">{rec}</span>
                    </li>
                  ))}
                  <li className="flex gap-4 items-start">
                    <div className="cursor" />
                  </li>
                </ul>
              </div>
            </div>
          )}

          {result && mode === "story" && (
            <div className="space-y-8 fade-in">
              <div className="glass-card rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-secondary/40 to-primary/40 p-12 text-center">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">Generated Narrative</span>
                  <h3 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
                    {result.headline}
                  </h3>
                </div>
                
                <div className="p-8 md:p-12 bg-[#050810]/80">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium mono">
                      {typedText}
                      {typedText.length < (result.narrative?.length || 0) && <span className="cursor" />}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {result.metrics?.map((metric, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
                        <BarChart3 className="text-primary mb-2" size={20} />
                        <span className="text-sm font-bold text-white/90">{metric}</span>
                      </div>
                    ))}
                  </div>

                  {result.quote && (
                    <div className="mt-12 p-8 rounded-2xl bg-secondary/5 border border-secondary/20 relative">
                      <Quote className="absolute top-4 left-4 text-secondary/20" size={48} />
                      <p className="text-xl italic text-white/90 relative z-10 text-center">
                        "{result.quote}"
                      </p>
                    </div>
                  )}

                  <div className="mt-12 flex justify-center">
                    <button className="px-8 py-4 rounded-xl bg-white text-background font-bold flex items-center gap-3 hover:scale-105 transition-transform group">
                      {result.cta || "JOIN THE CAUSE"}
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-20 border-t border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="text-primary w-5 h-5" />
            <span className="font-bold text-white/40 tracking-tighter">ImpactSignal</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] uppercase font-bold text-white/20 hover:text-primary transition-colors tracking-widest mono">Deployment_Logs</a>
            <a href="#" className="text-[10px] uppercase font-bold text-white/20 hover:text-primary transition-colors tracking-widest mono">Neural_Protocol</a>
            <a href="#" className="text-[10px] uppercase font-bold text-white/20 hover:text-primary transition-colors tracking-widest mono">Security_Vault</a>
          </div>
          <p className="text-[10px] text-white/20 mono uppercase tracking-widest">© 2026 NGO_INTELLIGENCE_CORE</p>
        </div>
      </footer>
    </main>
  );
}
