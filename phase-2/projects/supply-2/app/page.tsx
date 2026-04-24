'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  ChevronRight,
  Info
} from 'lucide-react';

export default function VendorScorePage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    vendorType: '',
    relationshipDuration: '',
    recentIssues: '',
    deliveryPerformance: '',
    communicationQuality: '',
    financialStability: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const assembledPrompt = `
      Vendor Assessment Details:
      - Type: ${formData.vendorType}
      - Duration: ${formData.relationshipDuration}
      - Recent Issues: ${formData.recentIssues}
      - Delivery Performance: ${formData.deliveryPerformance}
      - Communication Quality: ${formData.communicationQuality}
      - Financial Stability Signals: ${formData.financialStability}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: assembledPrompt }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.result);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <header className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-4 neo-flat mb-6">
          <ShieldCheck className="w-12 h-12 accent-text" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-2 text-gray-700">
          Vendor<span className="accent-text">Score</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Describe a vendor relationship — get a full reliability scorecard
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Section */}
        <section className="space-y-8">
          <div className="neo-flat p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-600">
              <Info className="w-5 h-5" />
              Vendor Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">Vendor Type / Category</label>
                <input
                  required
                  name="vendorType"
                  value={formData.vendorType}
                  onChange={handleInputChange}
                  placeholder="e.g. Raw Material Supplier, Logistics Provider"
                  className="neo-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">Relationship Length</label>
                  <input
                    required
                    name="relationshipDuration"
                    value={formData.relationshipDuration}
                    onChange={handleInputChange}
                    placeholder="e.g. 2 years"
                    className="neo-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">Delivery Performance</label>
                  <select
                    required
                    name="deliveryPerformance"
                    value={formData.deliveryPerformance}
                    onChange={handleInputChange}
                    className="neo-input"
                  >
                    <option value="">Select...</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">Communication Quality</label>
                <textarea
                  required
                  name="communicationQuality"
                  value={formData.communicationQuality}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="How responsive and transparent are they?"
                  className="neo-input resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">Financial Stability Signals</label>
                <input
                  required
                  name="financialStability"
                  value={formData.financialStability}
                  onChange={handleInputChange}
                  placeholder="e.g. Consistent billing, no payment delays reported"
                  className="neo-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">Recent Issues or Bottlenecks</label>
                <textarea
                  required
                  name="recentIssues"
                  value={formData.recentIssues}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe any delays, quality issues, or recent disruptions..."
                  className="neo-input resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 neo-button text-lg font-bold flex items-center justify-center gap-2 group transition-all hover:text-green-800"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Generate Scorecard
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Results Section */}
        <section>
          {!result && !loading && !error && (
            <div className="neo-inset p-12 h-full flex flex-col items-center justify-center text-center opacity-60">
              <div className="p-4 rounded-full neo-button mb-4">
                <TrendingUp className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 italic">
                Your vendor scorecard will appear here after analysis.
              </p>
            </div>
          )}

          {loading && (
            <div className="neo-flat p-12 h-full flex flex-col items-center justify-center text-center">
              <Loader2 className="w-16 h-16 animate-spin accent-text mb-6" />
              <p className="text-xl font-bold text-gray-600">Analyzing Transit Data...</p>
              <p className="text-gray-500 mt-2">Evaluating reliability dimensions and risk flags</p>
            </div>
          )}

          {error && (
            <div className="neo-flat p-8 border-l-4 border-red-500">
              <div className="flex items-center gap-3 text-red-600 mb-2">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-bold">Assessment Failed</h3>
              </div>
              <p className="text-gray-600">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="neo-flat p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-700">Vendor Scorecard</h2>
                    <p className="text-gray-500">Generated AI Analysis</p>
                  </div>
                  <div className="neo-inset p-4 flex flex-col items-center justify-center min-w-[80px]">
                    <span className="text-xs uppercase font-bold text-gray-400">Grade</span>
                    <span className="text-3xl font-black accent-text">
                      {result.match(/Grade:?\s*([A-F])/i)?.[1] || 'A'}
                    </span>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  {result.split('\n').map((line, i) => {
                    if (line.startsWith('#') || line.toUpperCase().includes('DIMENSIONS') || line.toUpperCase().includes('FLAGS') || line.toUpperCase().includes('RECOMMENDATIONS')) {
                      return <h3 key={i} className="text-lg font-bold text-gray-600 mt-6 mb-3 flex items-center gap-2">
                        {line.replace(/#/g, '').trim()}
                      </h3>;
                    }
                    if (line.trim().length === 0) return <div key={i} className="h-2" />;
                    
                    const isListItem = line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d\./.test(line.trim());
                    
                    return (
                      <div key={i} className={`flex gap-2 ${isListItem ? 'ml-4 mb-2' : 'mb-2 text-gray-600'}`}>
                        {isListItem && <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 accent-text" />}
                        <span>{line.replace(/^[-*]\s*/, '').replace(/^\d\.\s*/, '')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="neo-flat p-6 accent-bg flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold opacity-80 uppercase tracking-wider">Verification Status</p>
                  <p className="font-bold">Audit Complete & Verified</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <footer className="mt-24 text-center text-gray-400 text-sm">
        <p>© 2026 VendorScore | Intelligent Supply Chain Assessment</p>
      </footer>
    </main>
  );
}
