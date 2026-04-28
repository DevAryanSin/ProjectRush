'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  ShieldAlert, 
  ChevronRight, 
  Cpu, 
  Scale, 
  TrendingUp, 
  Lock, 
  Info,
  Loader2,
  RefreshCw,
  FileText,
  AlertCircle
} from 'lucide-react';

type Mode = 'demand' | 'contract';

export default function SignalContract() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>('demand');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Demand Inputs
  const [demandInputs, setDemandInputs] = useState({
    industry: '',
    signals: '',
    inventory: ''
  });

  // Contract Inputs
  const [contractInputs, setContractInputs] = useState({
    type: '',
    scenario: '',
    role: 'Buyer',
    jurisdiction: '',
    risk: 'Medium'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          inputs: mode === 'demand' ? demandInputs : contractInputs
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResult(data.text);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-20 max-w-5xl mx-auto">
      {/* Header Section */}
      <header className="mb-16 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="p-3 bg-white clay-card rounded-2xl">
            <Cpu className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-editorial text-primary tracking-tight">
            SignalContract
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-gray-600 font-ui max-w-2xl mx-auto">
          Predict demand. Protect your agreements.
        </p>
        <div className="editorial-rule w-1/3 mx-auto mt-8" />
      </header>

      {/* Mode Switcher */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-12 animate-fade-in stagger-1">
        <button 
          onClick={() => setMode('demand')}
          className={`flex items-center gap-3 px-8 py-4 rounded-3xl transition-all duration-300 font-ui text-lg ${
            mode === 'demand' 
              ? 'clay-button bg-primary text-white scale-105' 
              : 'clay-card bg-white text-gray-500 hover:text-primary'
          }`}
        >
          <BarChart3 className={mode === 'demand' ? 'text-white' : 'text-primary'} />
          Demand Intelligence
        </button>
        <button 
          onClick={() => setMode('contract')}
          className={`flex items-center gap-3 px-8 py-4 rounded-3xl transition-all duration-300 font-ui text-lg ${
            mode === 'contract' 
              ? 'clay-button bg-primary text-white scale-105' 
              : 'clay-card bg-white text-gray-500 hover:text-primary'
          }`}
        >
          <ShieldAlert className={mode === 'contract' ? 'text-white' : 'text-accent'} />
          Contract Protection
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-fade-in stagger-2">
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="clay-card bg-white p-8 space-y-6">
            <h2 className="text-2xl font-editorial text-gray-800 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              {mode === 'demand' ? 'Strategic Inputs' : 'Risk Parameters'}
            </h2>

            {mode === 'demand' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-ui font-bold text-gray-500 uppercase tracking-wider">Industry / Product</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Semiconductor Manufacturing" 
                    className="w-full clay-input"
                    value={demandInputs.industry}
                    onChange={(e) => setDemandInputs({...demandInputs, industry: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-ui font-bold text-gray-500 uppercase tracking-wider">Market Signals</label>
                  <textarea 
                    placeholder="e.g. Rising raw material costs, new tech cycle, high seasonality..." 
                    className="w-full clay-input min-h-[120px]"
                    value={demandInputs.signals}
                    onChange={(e) => setDemandInputs({...demandInputs, signals: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-ui font-bold text-gray-500 uppercase tracking-wider">Current Inventory</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 45 days of supply" 
                    className="w-full clay-input"
                    value={demandInputs.inventory}
                    onChange={(e) => setDemandInputs({...demandInputs, inventory: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-ui font-bold text-gray-500 uppercase tracking-wider">Contract Type</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Master Supply Agreement" 
                    className="w-full clay-input"
                    value={contractInputs.type}
                    onChange={(e) => setContractInputs({...contractInputs, type: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-ui font-bold text-gray-500 uppercase tracking-wider">Disruption Scenario</label>
                  <textarea 
                    placeholder="e.g. Port closures in SE Asia, 15% inflation spike..." 
                    className="w-full clay-input min-h-[100px]"
                    value={contractInputs.scenario}
                    onChange={(e) => setContractInputs({...contractInputs, scenario: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-ui font-bold text-gray-500 uppercase tracking-wider">Role</label>
                    <select 
                      className="w-full clay-input"
                      value={contractInputs.role}
                      onChange={(e) => setContractInputs({...contractInputs, role: e.target.value})}
                    >
                      <option>Buyer</option>
                      <option>Seller</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-ui font-bold text-gray-500 uppercase tracking-wider">Risk Level</label>
                    <select 
                      className="w-full clay-input"
                      value={contractInputs.risk}
                      onChange={(e) => setContractInputs({...contractInputs, risk: e.target.value})}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-ui font-bold text-gray-500 uppercase tracking-wider">Jurisdiction</label>
                  <input 
                    type="text" 
                    placeholder="e.g. New York, Singapore" 
                    className="w-full clay-input"
                    value={contractInputs.jurisdiction}
                    onChange={(e) => setContractInputs({...contractInputs, jurisdiction: e.target.value})}
                  />
                </div>
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full clay-button py-4 text-xl font-ui flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Generate Intelligence
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7">
          <div className="clay-card bg-white min-h-[500px] flex flex-col p-8 md:p-12">
            {!result && !loading && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  {mode === 'demand' ? <TrendingUp className="w-10 h-10" /> : <Scale className="w-10 h-10" />}
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-editorial">Waiting for Analysis</h3>
                  <p className="font-ui">Enter parameters to generate {mode} intelligence.</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  <RefreshCw className="w-16 h-16 text-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-editorial animate-pulse">Processing Signals</h3>
                  <p className="font-ui text-gray-500">Aligning operational and legal strategy...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 text-accent">
                <AlertCircle className="w-16 h-16" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-editorial">Analysis Failed</h3>
                  <p className="font-ui">{error}</p>
                  <button 
                    onClick={handleGenerate}
                    className="mt-4 px-6 py-2 border-2 border-accent rounded-full font-ui hover:bg-accent hover:text-white transition-colors"
                  >
                    Retry Analysis
                  </button>
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="flex-1 animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <div className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-tighter">
                    Generated Output
                  </div>
                  <button 
                    onClick={() => setResult(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="prose prose-slate max-w-none">
                  {mode === 'demand' ? (
                    <div className="space-y-8">
                      <div className="border-l-4 border-primary pl-6 py-2">
                        <h3 className="text-sm font-ui font-bold text-gray-400 uppercase tracking-widest mb-1">Executive Summary</h3>
                        <div className="text-2xl font-editorial leading-relaxed text-gray-900 whitespace-pre-wrap">
                          {result}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      <div className="flex items-center gap-3 text-gray-400 mb-6">
                        <FileText className="w-5 h-5" />
                        <span className="text-sm font-ui font-bold uppercase tracking-widest">Protective Clauses</span>
                      </div>
                      <div className="font-editorial text-lg leading-relaxed text-gray-800 whitespace-pre-wrap selection:bg-primary/10">
                        {result}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400 font-ui">
                    <Lock className="w-3 h-3" />
                    Proprietary Analysis Engine v2.5
                  </div>
                  <button 
                    className="px-6 py-2 bg-gray-900 text-white rounded-full font-ui hover:bg-black transition-colors shadow-lg"
                    onClick={() => window.print()}
                  >
                    Download PDF Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="mt-24 text-center pb-12 animate-fade-in stagger-3">
        <p className="text-gray-400 font-ui text-sm">
          &copy; {new Date().getFullYear()} SignalContract Intelligence. For professional decision support only.
        </p>
      </footer>
    </main>
  );
}
