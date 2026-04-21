'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Users, 
  MapPin, 
  ClipboardCheck, 
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';

export default function FieldDebriefPage() {
  const [reportText, setReportText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [structuredReport, setStructuredReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!reportText.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setStructuredReport(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: reportText }),
      });

      if (!response.ok) throw new Error('Analysis failed. Please try again.');

      const data = await response.json();
      setStructuredReport(data.result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearForm = () => {
    setReportText('');
    setStructuredReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfb] text-[#1a1c1a]">
      {/* Navigation */}
      <nav className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-[#3d6d4a] p-1.5 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight">Field<span className="text-[#d97706]">Debrief</span></span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-[#3d6d4a]">Reports</a>
              <a href="#" className="hover:text-[#3d6d4a]">Volunteers</a>
              <a href="#" className="hover:text-[#3d6d4a]">Impact Tracking</a>
              <button className="bg-[#f3f4f1] px-4 py-1.5 rounded-md text-[#3d6d4a] hover:bg-[#ebedeb]">
                Support
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-8">
            <section>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Empower your data, <br />
                <span className="text-[#3d6d4a]">streamline your impact.</span>
              </h1>
              <p className="mt-4 text-slate-600 leading-relaxed max-w-md">
                Convert conversational volunteer field notes into structured, searchable NGO documentation in seconds.
              </p>
            </section>

            <div className="pro-card p-6 border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#3d6d4a]" />
                <h2 className="text-lg font-semibold text-slate-800">Field Report Submission</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="report" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Describe what happened in the field
                  </label>
                  <textarea
                    id="report"
                    className="input-pro min-h-[250px] resize-none text-slate-600 leading-relaxed scrollbar-thin transition-all"
                    placeholder="E.g., Today at the Downtown Relief Center, I (Sarah Miller) worked with 15 families. We distributed food kits and hygiene packs. Several mothers mentioned a lack of clean water in the housing blocks on 4th Ave. We used about 20 boxes of supplies. One child needed medical attention, which we flagged to the local clinic..."
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={clearForm}
                    className="text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
                  >
                    Clear report
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !reportText.trim()}
                    suppressHydrationWarning
                    className="btn-primary"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Process Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#fef9f3] border border-[#fde6d2] p-4 rounded-lg flex gap-3">
              <Info className="w-5 h-5 text-[#d97706] shrink-0" />
              <p className="text-sm text-[#854d0e] leading-snug">
                <strong>Tip:</strong> Be as descriptive as possible. Include names, numbers, locations, and specific challenges to get the most accurate structure.
              </p>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            {!structuredReport && !isAnalyzing && !error && (
              <div className="h-full min-h-[400px] pro-card border-dashed bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <ClipboardCheck className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Awaiting Data</h3>
                <p className="text-slate-500 max-w-sm">
                  Complete the field report on the left and click "Process Report" to see the structured NGO record here.
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="pro-card p-8 space-y-6">
                <div className="flex items-center gap-3 border-b pb-6">
                  <div className="w-10 h-10 skeleton rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 skeleton rounded w-1/4" />
                    <div className="h-3 skeleton rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 skeleton rounded w-1/3" />
                      <div className="h-4 skeleton rounded w-full" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="pro-card border-red-200 bg-red-50 p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-900 mb-1">Processing Error</h3>
                <p className="text-red-700 mb-6">{error}</p>
                <button 
                  onClick={handleAnalyze}
                  className="px-6 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Retry Analysis
                </button>
              </div>
            )}

            {structuredReport && (
              <div className="pro-card overflow-hidden">
                <div className="bg-[#3d6d4a] px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">Structured NGO Field Record</span>
                  </div>
                  <div className="text-white/80 text-xs font-medium bg-white/10 px-2 py-1 rounded">
                    PROCESSED BY GEMINI AI
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="prose prose-slate max-w-none">
                    {structuredReport.split('\n').map((line, idx) => {
                      // Very basic markdown partial rendering for professional look
                      if (line.startsWith('# ')) return <h1 key={idx} className="text-2xl font-bold mb-4">{line.replace('# ', '')}</h1>;
                      if (line.startsWith('## ')) return <h2 key={idx} className="text-xl font-bold mt-6 mb-3 text-slate-800 border-b pb-2">{line.replace('## ', '')}</h2>;
                      if (line.startsWith('### ')) return <h3 key={idx} className="text-lg font-bold mt-4 mb-2 text-slate-700">{line.replace('### ', '')}</h3>;
                      if (line.startsWith('**') && line.endsWith('**')) return <p key={idx} className="font-bold text-slate-800">{line.replace(/\*\*/g, '')}</p>;
                      
                      // Handle status badges
                      if (line.includes('GREEN')) return <p key={idx} className="my-2"><span className="badge badge-green">Green Status</span> {line.replace('GREEN', '')}</p>;
                      if (line.includes('YELLOW')) return <p key={idx} className="my-2"><span className="badge badge-yellow">Yellow Status</span> {line.replace('YELLOW', '')}</p>;
                      if (line.includes('RED')) return <p key={idx} className="my-2"><span className="badge badge-red">Red Status</span> {line.replace('RED', '')}</p>;

                      return <p key={idx} className="text-slate-600 leading-relaxed mb-2">{line}</p>;
                    })}
                  </div>

                  <div className="mt-10 pt-6 border-t flex flex-wrap gap-4">
                    <button className="flex items-center gap-2 text-sm font-semibold text-[#3d6d4a] hover:underline decoration-2 underline-offset-4">
                      Download PDF Report
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 text-sm font-semibold text-[#3d6d4a] hover:underline decoration-2 underline-offset-4">
                      Export to CSV
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 text-sm font-semibold text-[#3d6d4a] hover:underline decoration-2 underline-offset-4">
                      Add to Database
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-6 h-6 text-[#3d6d4a]" />
                <span className="text-xl font-bold tracking-tight">Field<span className="text-[#d97706]">Debrief</span></span>
              </div>
              <p className="text-slate-500 text-sm max-w-sm">
                Dedicated to improving local community impact through better data. FieldDebrief helps NGOs bridge the gap between field work and documentation.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-[#3d6d4a]">Best Practices</a></li>
                <li><a href="#" className="hover:text-[#3d6d4a]">Case Studies</a></li>
                <li><a href="#" className="hover:text-[#3d6d4a]">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4">Organization</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-[#3d6d4a]">About Us</a></li>
                <li><a href="#" className="hover:text-[#3d6d4a]">Partners</a></li>
                <li><a href="#" className="hover:text-[#3d6d4a]">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <p>© 2026 FieldDebrief. Supporting communities worldwide.</p>
            <div className="flex gap-4">
              <span>Secure Connection</span>
              <span>v1.2.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
