'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Search, 
  AlertTriangle, 
  Layers, 
  CheckCircle2, 
  TrendingDown, 
  Building2, 
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';

export default function SupplierPulse() {
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierType: '',
    supplyItems: '',
    duration: '',
    recentIssues: '',
    alternatives: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const fullPrompt = `
      Supplier: ${formData.supplierName} (${formData.supplierType})
      Supplies: ${formData.supplyItems}
      Relationship Duration: ${formData.duration}
      Recent Issues: ${formData.recentIssues}
      Current Alternative Suppliers known: ${formData.alternatives}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseResult = (text: string) => {
    // Simple parser for visual hierarchy
    const sections = text.split('\n\n');
    return sections.map((section, idx) => {
      if (section.toLowerCase().includes('score')) {
        return (
          <div key={idx} className="bg-slate-50 p-4 rounded-md border border-slate-200 mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              Risk Analysis
            </h3>
            <div className="text-2xl font-bold text-slate-900">{section.replace(/[*#]/g, '')}</div>
          </div>
        );
      }
      if (section.toLowerCase().includes('vulnerability') || section.toLowerCase().includes('factors')) {
        return (
          <div key={idx} className="mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Vulnerability Factors
            </h3>
            <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">{section.replace(/[*#]/g, '')}</div>
          </div>
        );
      }
      if (section.toLowerCase().includes('rating')) {
        return (
          <div key={idx} className="mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Concentration Risk
            </h3>
            <div className="inline-block px-3 py-1 bg-rose-50 text-rose-700 rounded font-bold border border-rose-100">
              {section.replace(/[*#]/g, '')}
            </div>
          </div>
        );
      }
      return (
        <div key={idx} className="mb-4 text-slate-700 whitespace-pre-wrap leading-relaxed">
          {section.replace(/[*#]/g, '')}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">SupplierPulse</h1>
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-widest mt-1">Industrial Intelligence</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-teal-600 transition-colors">Risk Assessment</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Strategic Planning</a>
            <button className="bg-slate-900 text-white px-4 py-2 rounded text-xs">Access Documentation</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Column */}
          <div className="lg:col-span-5">
            <div className="pro-card p-6 bg-white">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">Analyze Supplier Risk</h2>
                <p className="text-slate-500 text-sm">Assess how risky it is to depend on this supplier.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                      Supplier Name
                    </label>
                    <input
                      required
                      name="supplierName"
                      value={formData.supplierName}
                      onChange={handleInputChange}
                      placeholder="e.g. Acme Microchips"
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                      Type
                    </label>
                    <input
                      name="supplierType"
                      value={formData.supplierType}
                      onChange={handleInputChange}
                      placeholder="e.g. Critical Tier 1"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                    Core Supplies
                  </label>
                  <input
                    required
                    name="supplyItems"
                    value={formData.supplyItems}
                    onChange={handleInputChange}
                    placeholder="What specific components or services do they provide?"
                    className="input-field"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                    Relationship Duration
                  </label>
                  <select 
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select duration...</option>
                    <option value="Under 1 year">Under 1 year</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-7 years">3-7 years</option>
                    <option value="Over 10 years">Over 10 years</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                    Recent Performance Issues
                  </label>
                  <textarea
                    name="recentIssues"
                    rows={3}
                    value={formData.recentIssues}
                    onChange={handleInputChange}
                    placeholder="Delays, quality failures, or financial rumors..."
                    className="input-field py-2"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                    Known Alternatives
                  </label>
                  <input
                    name="alternatives"
                    value={formData.alternatives}
                    onChange={handleInputChange}
                    placeholder="List any backup suppliers currently available"
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  suppressHydrationWarning
                  className="btn-primary w-full mt-4 h-11"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Risk Profile...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Generate Assessment
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 p-4 rounded-md border border-teal-100 bg-teal-50 flex gap-3">
              <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-teal-900">Expert Mode Active</p>
                <p className="text-xs text-teal-700 mt-0.5">Gemini 2.5 is evaluating relationship concentration and reliability signals.</p>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7">
            {isLoading && (
              <div className="pro-card p-8 bg-white min-h-[500px] flex flex-col gap-6">
                <div className="h-8 w-1/3 loading-skeleton rounded"></div>
                <div className="space-y-4">
                  <div className="h-24 w-full loading-skeleton rounded"></div>
                  <div className="h-32 w-full loading-skeleton rounded"></div>
                  <div className="h-40 w-full loading-skeleton rounded"></div>
                </div>
              </div>
            )}

            {!isLoading && !result && !error && (
              <div className="pro-card p-8 bg-white min-h-[500px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No Assessment Active</h3>
                <p className="text-slate-500 max-w-sm mt-1">Complete the supplier profile to generate a real-time risk assessment and diversification plan.</p>
              </div>
            )}

            {error && (
              <div className="pro-card p-8 bg-white min-h-[500px] border-rose-200 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-lg font-bold text-rose-800">Analysis Failed</h3>
                <p className="text-rose-600 max-w-sm mt-1">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-6 text-sm font-semibold text-slate-600 hover:text-slate-900 underline"
                >
                  Try Again
                </button>
              </div>
            )}

            {result && (
              <div className="pro-card p-8 bg-white animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      Assessment Report
                      <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded uppercase tracking-widest font-black">Final</span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Strategic intelligence for {formData.supplierName}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-slate-200" />
                </div>

                <div className="space-y-2">
                  {parseResult(result)}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Diversification</p>
                      <p className="text-sm font-semibold">Priority 1 Action</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Resilience</p>
                      <p className="text-sm font-semibold">Risk Mitigated</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto py-12 px-6 border-t border-slate-200 mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 opacity-60 grayscale">
          <Layers className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wider">SupplierPulse System</span>
        </div>
        <div className="flex gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Privacy Protocol</span>
          <span>Terms of Analysis</span>
          <span>v2.5.0-Flash</span>
        </div>
      </footer>
    </div>
  );
}
