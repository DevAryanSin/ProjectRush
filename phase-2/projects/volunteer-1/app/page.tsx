'use client';

import React, { useState, useEffect } from 'react';
import { Send, Loader2, Award, Users, Target, DollarSign, Info, ClipboardCopy, CheckCircle2 } from 'lucide-react';

export default function GrantWriter() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    orgName: '',
    programDesc: '',
    targetPop: '',
    impactGoal: '',
    fundingAmount: '',
    grantType: 'Community Grant'
  });
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const assembledPrompt = `
      Organization Name: ${formData.orgName}
      Program Description: ${formData.programDesc}
      Target Population: ${formData.targetPop}
      Impact Goal: ${formData.impactGoal}
      Funding Amount Needed: ${formData.fundingAmount}
      Grant Type: ${formData.grantType}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: assembledPrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate grant');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen p-4 md:p-12 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-12 relative z-50">
        <div className="brutal-card !bg-black text-white mb-4">
          <h1 className="text-6xl md:text-8xl font-black mb-2">GRANTWRITER</h1>
          <p className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white">
            Describe your NGO need — auto-draft a compelling grant application paragraph
          </p>
        </div>
        <div className="absolute -top-4 -left-4 w-full h-full brutal-border bg-black -z-10 translate-x-2 translate-y-2"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Form Section */}
        <section className="space-y-8">
          <form onSubmit={handleSubmit} className="brutal-card bg-white space-y-6">
            <div className="space-y-2">
              <label className="text-lg font-black uppercase flex items-center gap-2 text-black">
                <Users size={16} /> Organization Name
              </label>
              <input
                required
                name="orgName"
                value={formData.orgName}
                onChange={handleInputChange}
                placeholder="E.G. GREEN VALLEY INITIATIVE"
                className="brutal-input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-lg font-black uppercase flex items-center gap-2 text-black">
                  <DollarSign size={16} /> Funding Amount
                </label>
                <input
                  required
                  name="fundingAmount"
                  value={formData.fundingAmount}
                  onChange={handleInputChange}
                  placeholder="$25,000"
                  className="brutal-input"
                />
              </div>
              <div className="space-y-2">
                <label className="text-lg font-black uppercase flex items-center gap-2 text-black">
                  <Award size={16} /> Grant Type
                </label>
                <select
                  name="grantType"
                  value={formData.grantType}
                  onChange={handleInputChange}
                  className="brutal-input appearance-none"
                >
                  <option>Community Grant</option>
                  <option>Educational Fund</option>
                  <option>Emergency Relief</option>
                  <option>Environmental Policy</option>
                  <option>Social Justice Fund</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-black uppercase flex items-center gap-2 text-black">
                <Target size={16} /> Target Population
              </label>
              <input
                required
                name="targetPop"
                value={formData.targetPop}
                onChange={handleInputChange}
                placeholder="E.G. UNDER-SERVED YOUTH IN DISTRICT 9"
                className="brutal-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-black uppercase flex items-center gap-2 text-black">
                <Info size={16} /> Program Description
              </label>
              <textarea
                required
                name="programDesc"
                rows={3}
                value={formData.programDesc}
                onChange={handleInputChange}
                placeholder="DESCRIBE THE CORE PROBLEM AND YOUR SOLUTION..."
                className="brutal-input resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-black uppercase flex items-center gap-2 text-black">
                <CheckCircle2 size={16} /> Impact Goal
              </label>
              <textarea
                required
                name="impactGoal"
                rows={2}
                value={formData.impactGoal}
                onChange={handleInputChange}
                placeholder="WHAT SPECIFIC CHANGE WILL OCCUR?"
                className="brutal-input resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="brutal-button w-full flex items-center justify-center gap-3 text-2xl py-6 bg-black text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> GENERATING...
                </>
              ) : (
                <>
                  <Send /> DRAFT GRANT PARAGRAPH
                </>
              )}
            </button>
          </form>
        </section>

        {/* Results Section */}
        <section className="sticky top-12">
          {!result && !error && !isLoading && (
            <div className="brutal-card bg-white border-dashed min-h-[400px] flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 brutal-border bg-white flex items-center justify-center mb-6">
                <ClipboardCopy size={48} className="text-black" />
              </div>
              <h3 className="text-3xl font-black mb-2">READY TO WRITE</h3>
              <p className="font-bold opacity-60">FILL OUT THE FORM TO GENERATE YOUR COMPELLING GRANT STATEMENT</p>
            </div>
          )}

          {isLoading && (
            <div className="brutal-card bg-white min-h-[400px] flex flex-col items-center justify-center text-center p-12 overflow-hidden">
              <div className="text-6xl font-black mb-8 animate-glitch">WRITING...</div>
              <div className="w-full bg-black h-8 brutal-border relative">
                <div className="absolute top-0 left-0 h-full bg-black w-1/2 animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="brutal-card bg-red-500 text-white p-8">
              <h3 className="text-4xl font-black mb-4">SYSTEM ERROR</h3>
              <p className="text-xl font-bold uppercase">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-6 brutal-border bg-white text-black px-4 py-2 font-black uppercase"
              >
                DISMISS
              </button>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="brutal-card bg-white">
                <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-4">
                  <h3 className="text-4xl font-black">GRANT DRAFT</h3>
                  <button
                    onClick={copyToClipboard}
                    className="brutal-border bg-yellow-400 p-2 hover:bg-yellow-300 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <CheckCircle2 size={24} /> : <ClipboardCopy size={24} />}
                  </button>
                </div>
                
                <div className="prose prose-lg max-w-none font-bold text-black leading-relaxed">
                  {result.split('\n').map((para, i) => para ? (
                    <p key={i} className="mb-4">{para}</p>
                  ) : <br key={i} />)}
                </div>

                <div className="mt-8 pt-8 border-t-4 border-black grid grid-cols-2 gap-4">
                  <div className="brutal-border bg-white p-4">
                    <span className="block text-xs font-black uppercase mb-1">Status</span>
                    <span className="text-xl font-black uppercase">READY</span>
                  </div>
                  <div className="brutal-border bg-white p-4">
                    <span className="block text-xs font-black uppercase mb-1">Impact Score</span>
                    <span className="text-xl font-black uppercase">HIGH</span>
                  </div>
                </div>
              </div>
              
              <div className="brutal-card bg-black text-white p-4">
                <p className="text-xs font-bold uppercase tracking-widest">
                  NOTE: THIS IS AN AI-GENERATED DRAFT. PLEASE REVIEW AND VERIFY ALL DATA BEFORE SUBMISSION.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      <footer className="mt-24 border-t-8 border-black pt-12 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h4 className="text-4xl font-black">GRANTWRITER.</h4>
          <p className="font-bold uppercase text-sm">EMPOWERING LOCAL IMPACT THROUGH BOLD ADVOCACY AND DATA-DRIVEN NARRATIVES.</p>
        </div>
        <div></div>
        <div className="flex flex-col md:items-end gap-4">
          <div className="brutal-border bg-black text-white px-4 py-2 font-black uppercase inline-block">NGO-OPS-01</div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes shimmer {
          0% { left: -100% }
          100% { left: 100% }
        }
      `}</style>
    </main>
  );
}
