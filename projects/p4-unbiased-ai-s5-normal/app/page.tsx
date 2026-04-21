'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Database,
  CheckCircle2,
  ChevronRight,
  Zap,
  RefreshCw,
  Info
} from 'lucide-react';

interface Step {
  id: number;
  technique: string;
  implementation: string;
  effort: string;
  reduction: string;
}

export default function FixItFlow() {
  const [outcome, setOutcome] = useState('');
  const [groups, setGroups] = useState('');
  const [modelType, setModelType] = useState('Classification');
  const [interventions, setInterventions] = useState({
    data: true,
    model: true,
    postProcessing: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Step[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseResponse = (text: string): Step[] => {
    const steps: Step[] = [];
    // Enhanced split to catch various formatting styles
    const stepBlocks = text.split(/(?:STEP|Step)\s+\d+[:.]?/g).filter(s => s.trim().length > 0);
    
    stepBlocks.forEach((block, index) => {
      if (index >= 5) return;
      
      const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      let technique = "Wait...";
      let implementation = "";
      let effort = "Medium";
      let reduction = "Significant";

      const techniqueMatch = block.match(/(?:TECHNIQUE|Technique|Name):?\s*(.*)/i);
      const implementationMatch = block.match(/(?:IMPLEMENTATION|Implementation):?\s*([\s\S]*?)(?=EFFORT|Effort|REDUCTION|Reduction|$)/i);
      const effortMatch = block.match(/(?:EFFORT|Effort):?\s*(.*)/i);
      const reductionMatch = block.match(/(?:REDUCTION|Reduction|Impact):?\s*(.*)/i);

      if (techniqueMatch) technique = techniqueMatch[1].trim();
      else if (lines[0]) technique = lines[0].replace(/^[ \-*:]+/, '');

      if (implementationMatch) implementation = implementationMatch[1].trim();
      else implementation = block;

      if (effortMatch) effort = effortMatch[1].trim();
      if (reductionMatch) reduction = reductionMatch[1].trim();

      steps.push({
        id: index + 1,
        technique,
        implementation,
        effort,
        reduction
      });
    });

    if (steps.length === 0 && text.length > 0) {
      return [{
        id: 1,
        technique: "Analysis Outcome",
        implementation: text,
        effort: "Variable",
        reduction: "High Impact"
      }];
    }

    return steps;
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    const interventionList = Object.entries(interventions)
      .filter(([_, val]) => val)
      .map(([key]) => key)
      .join(', ');

    const prompt = `
      Biased Outcome: ${outcome}
      Affected Groups: ${groups}
      Model Type: ${modelType}
      Available Interventions: ${interventionList}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.result) {
        setResult(parseResponse(data.result));
      } else {
        throw new Error(data.error || 'Failed to generate results');
      }
    } catch (err) {
      setError('An error occurred during bias analysis. Please verify your Gemini API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7c3aed] rounded flex items-center justify-center text-white">
              <ShieldCheck size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">FixItFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-[#7c3aed] transition-colors">Documentation</a>
            <a href="#" className="hover:text-[#7c3aed] transition-colors">Methodology</a>
            <a href="#" className="px-4 py-2 bg-slate-100 text-slate-800 rounded-md hover:bg-slate-200 transition-colors">Enterprise Portal</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Form Sidebar */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Bias Diagnostic</h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Analyze discriminatory outcomes in automated systems to generate an ethical remediation plan.
              </p>
            </div>

            <form onSubmit={handleAnalyze} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Biased Outcome Observed</label>
                  <textarea 
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder="Describe the discrepancy... e.g. lower approval rates for minority zip codes."
                    className="w-full min-h-[120px] p-3 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] outline-none transition-all placeholder:text-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Disadvantaged Groups</label>
                  <input 
                    type="text"
                    value={groups}
                    onChange={(e) => setGroups(e.target.value)}
                    placeholder="e.g. Ethnicity, Gender, Age"
                    className="w-full p-3 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] outline-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Model Type</label>
                    <select 
                      value={modelType}
                      onChange={(e) => setModelType(e.target.value)}
                      className="w-full p-3 text-sm border border-slate-200 rounded-md bg-slate-50 focus:ring-2 focus:ring-[#7c3aed] outline-none"
                    >
                      <option>Classification</option>
                      <option>Regression</option>
                      <option>NLP / LLM</option>
                      <option>Ranking</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Risk Level</label>
                    <div className="h-[46px] flex items-center px-4 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-red-600">
                      CRITICAL
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Intervention Access</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-md hover:bg-slate-50 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={interventions.data} 
                        onChange={() => setInterventions({...interventions, data: !interventions.data})}
                        className="w-4 h-4 accent-[#7c3aed]"
                      />
                      <span className="text-sm font-medium">Training Data (Pre-processing)</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-md hover:bg-slate-50 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={interventions.model} 
                        onChange={() => setInterventions({...interventions, model: !interventions.model})}
                        className="w-4 h-4 accent-[#7c3aed]"
                      />
                      <span className="text-sm font-medium">Model Code (In-processing)</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-md hover:bg-slate-50 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={interventions.postProcessing} 
                        onChange={() => setInterventions({...interventions, postProcessing: !interventions.postProcessing})}
                        className="w-4 h-4 accent-[#7c3aed]"
                      />
                      <span className="text-sm font-medium">Results (Post-processing)</span>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  suppressHydrationWarning
                  className="w-full py-4 bg-[#6d28d9] hover:bg-[#5b21b6] disabled:bg-slate-400 text-white font-bold rounded-md shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      Running Neural Audit...
                    </>
                  ) : (
                    <>
                      Generate Action Plan
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results Area */}
          <div className="flex-1">
            {!result && !isLoading && !error && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-lg border border-dashed border-slate-300 p-8 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Analysis Pending</h3>
                <p className="text-slate-500 max-w-sm mb-8">
                  Submit your model observation to receive a detailed debiasing plan based on ethical AI principles.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg text-left">
                  <div className="p-4 bg-slate-50 rounded border border-slate-100 flex items-center gap-3">
                    <Database size={20} className="text-[#8b5cf6]" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Data Reweighting</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded border border-slate-100 flex items-center gap-3">
                    <Zap size={20} className="text-[#8b5cf6]" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Threshold Calibration</span>
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-full animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-100 w-1/3 rounded animate-pulse"></div>
                      <div className="h-3 bg-slate-100 w-1/4 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-12">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-6">
                        <div className="w-1 bg-slate-100 rounded h-24 animate-pulse"></div>
                        <div className="flex-1 space-y-4">
                          <div className="h-4 bg-slate-50 w-full rounded animate-pulse"></div>
                          <div className="h-20 bg-slate-50 w-full rounded animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 p-8 rounded-lg">
                <div className="flex items-start gap-4 text-red-600">
                  <AlertTriangle className="shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-lg mb-1">Diagnostic Failed</h4>
                    <p className="text-sm opacity-90">{error}</p>
                    <button 
                      onClick={() => setError(null)} 
                      className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded uppercase tracking-wider hover:bg-red-700 transition-colors"
                    >
                      Reset and Retry
                    </button>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-50 p-2 rounded-full">
                      <CheckCircle2 className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 leading-tight">Remediation Strategy</h2>
                      <p className="text-xs text-slate-500 font-medium">FIXITFLOW PERSCRIPTIVE AUDIT • JAN 2026</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors uppercase tracking-widest">
                    Export Analysis
                  </button>
                </div>

                <div className="space-y-6">
                  {result.map((step) => (
                    <div key={step.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:border-[#8b5cf6] transition-all">
                      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-black text-slate-200">{step.id.toString().padStart(2, '0')}</span>
                          <h3 className="font-bold text-[#4c1d95] tracking-tight uppercase text-sm">
                            {step.technique}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase border ${
                            step.effort.toLowerCase().includes('low') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            step.effort.toLowerCase().includes('high') ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                            'bg-violet-50 text-violet-700 border-violet-100'
                          }`}>
                            Effort: {step.effort}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-line font-medium italic">
                          "{step.implementation}"
                        </p>
                        <div className="bg-slate-50 p-4 rounded flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Projected Bias Impact</span>
                          <div className="flex items-center gap-2 text-green-700">
                            <Zap size={14} className="fill-green-600" />
                            <span className="text-sm font-black">{step.reduction}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#1e1b4b] p-8 rounded-lg text-white relative overflow-hidden">
                  <div className="absolute -bottom-8 -right-8 text-white/5">
                    <ShieldCheck size={240} strokeWidth={1} />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-3">Professional Certification</h4>
                    <p className="text-slate-300 text-sm max-w-lg mb-6 leading-relaxed">
                      This action plan adheres to the Algorithmic Accountability Act requirements. Implementation should be followed by a secondary audit.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button className="px-6 py-2.5 bg-white text-indigo-950 text-[10px] font-black rounded uppercase tracking-widest hover:bg-slate-100 transition-colors">
                        Approve for Deployment
                      </button>
                      <button className="px-6 py-2.5 bg-indigo-900/50 text-white text-[10px] font-black rounded uppercase tracking-widest border border-indigo-700 hover:bg-indigo-800 transition-colors">
                        Schedule Peer Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={24} className="text-[#6d28d9]" />
              <span className="text-xl font-bold tracking-tighter">FixItFlow</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Industrial grade bias detection and mitigation systems for enterprise machine learning workflows. Ensuring fairness at scale.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-widest">Platform</h5>
            <ul className="space-y-2 text-slate-500 text-sm font-medium">
              <li><a href="#" className="hover:text-[#6d28d9]">Core Engine</a></li>
              <li><a href="#" className="hover:text-[#6d28d9]">Ethical Proxies</a></li>
              <li><a href="#" className="hover:text-[#6d28d9]">Auto-Mitigation</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-widest">Compliance</h5>
            <ul className="space-y-2 text-slate-500 text-sm font-medium">
              <li><a href="#" className="hover:text-[#6d28d9]">GDPR Article 22</a></li>
              <li><a href="#" className="hover:text-[#6d28d9]">Algorithmic Fairness</a></li>
              <li><a href="#" className="hover:text-[#6d28d9]">SEC Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs font-medium">© 2026 Aligned Systems Global. Verified by Ethics Council.</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-tighter text-slate-400">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Ops</a>
            <a href="#" className="hover:text-slate-900 transition-colors">System Status</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Legal Framework</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
