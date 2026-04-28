"use client";

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  FileText, 
  Sparkles, 
  Send, 
  ArrowRight, 
  Users, 
  Zap, 
  Target, 
  Clock,
  Briefcase,
  Quote
} from 'lucide-react';

export default function ImpactForge() {
  const [mode, setMode] = useState<'grant' | 'story'>('grant');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Form states
  const [grantData, setGrantData] = useState({
    orgName: '',
    programDesc: '',
    targetPop: '',
    impactGoal: '',
    fundingAmount: '',
    grantType: 'Project Support'
  });

  const [storyData, setStoryData] = useState({
    volunteerName: '',
    skills: '',
    hours: '',
    tasks: '',
    communities: '',
    motivation: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          data: mode === 'grant' ? grantData : storyData
        })
      });

      const result = await response.json();
      if (result.text) {
        setOutput(result.text);
      } else {
        alert(result.error || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 border-b-4 border-black pb-8">
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-forest-green mb-2">
            ImpactForge
          </h1>
          <p className="font-ui text-xl md:text-2xl text-gray-700 italic">
            Write for funding. Tell stories that matter.
          </p>
        </div>
        
        <div className="flex gap-2 p-2 neo-card rounded-full">
          <button 
            onClick={() => { setMode('grant'); setOutput(null); }}
            className={`px-6 py-3 rounded-full font-ui font-bold transition-all ${
              mode === 'grant' ? 'mode-switch-active' : 'mode-switch-inactive'
            }`}
          >
            Grant Builder
          </button>
          <button 
            onClick={() => { setMode('story'); setOutput(null); }}
            className={`px-6 py-3 rounded-full font-ui font-bold transition-all ${
              mode === 'story' ? 'mode-switch-active' : 'mode-switch-inactive'
            }`}
          >
            Volunteer Story
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Input Section */}
        <section className="neo-card p-8 border-2 border-black/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-bold-orange rounded-xl border-2 border-black shadow-[3px_3px_0px_black]">
              {mode === 'grant' ? <FileText className="text-white" /> : <Users className="text-white" />}
            </div>
            <h2 className="text-3xl font-bold italic">
              {mode === 'grant' ? 'Craft Your Proposal' : 'Shape the Narrative'}
            </h2>
          </div>

          <form onSubmit={handleGenerate} className="flex flex-col gap-6">
            {mode === 'grant' ? (
              <>
                <div className="flex flex-col gap-2">
                  <label className="font-ui font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <Briefcase size={16} /> Organization Name
                  </label>
                  <input 
                    className="input-field"
                    placeholder="e.g. Green Earth Foundation"
                    value={grantData.orgName}
                    onChange={e => setGrantData({...grantData, orgName: e.target.value})}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-ui font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={16} /> Program Description
                  </label>
                  <textarea 
                    className="input-field min-h-[100px] resize-none"
                    placeholder="Describe your project's core mission..."
                    value={grantData.programDesc}
                    onChange={e => setGrantData({...grantData, programDesc: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-ui font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                      <Target size={16} /> Target Population
                    </label>
                    <input 
                      className="input-field"
                      placeholder="e.g. Rural youth"
                      value={grantData.targetPop}
                      onChange={e => setGrantData({...grantData, targetPop: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-ui font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                      <Zap size={16} /> Impact Goal
                    </label>
                    <input 
                      className="input-field"
                      placeholder="e.g. 50% literacy rate"
                      value={grantData.impactGoal}
                      onChange={e => setGrantData({...grantData, impactGoal: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-ui font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                      $ Funding Amount
                    </label>
                    <input 
                      className="input-field"
                      placeholder="e.g. $50,000"
                      value={grantData.fundingAmount}
                      onChange={e => setGrantData({...grantData, fundingAmount: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-ui font-bold text-sm uppercase tracking-wider">Grant Type</label>
                    <select 
                      className="input-field cursor-pointer"
                      value={grantData.grantType}
                      onChange={e => setGrantData({...grantData, grantType: e.target.value})}
                    >
                      <option>Project Support</option>
                      <option>Operational Grant</option>
                      <option>Capacity Building</option>
                      <option>Emergency Relief</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label className="font-ui font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <Users size={16} /> Volunteer Name
                  </label>
                  <input 
                    className="input-field"
                    placeholder="e.g. Sarah Jenkins"
                    value={storyData.volunteerName}
                    onChange={e => setStoryData({...storyData, volunteerName: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-ui font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                      <Zap size={16} /> Skills Used
                    </label>
                    <input 
                      className="input-field"
                      placeholder="e.g. Teaching, Mentorship"
                      value={storyData.skills}
                      onChange={e => setStoryData({...storyData, skills: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-ui font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                      <Clock size={16} /> Hours Contributed
                    </label>
                    <input 
                      className="input-field"
                      placeholder="e.g. 120 hours"
                      value={storyData.hours}
                      onChange={e => setStoryData({...storyData, hours: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-ui font-bold text-sm uppercase tracking-wider">Major Tasks Completed</label>
                  <input 
                    className="input-field"
                    placeholder="e.g. Organized weekend food drive"
                    value={storyData.tasks}
                    onChange={e => setStoryData({...storyData, tasks: e.target.value})}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-ui font-bold text-sm uppercase tracking-wider">Communities Served</label>
                  <input 
                    className="input-field"
                    placeholder="e.g. Eastside Community Center"
                    value={storyData.communities}
                    onChange={e => setStoryData({...storyData, communities: e.target.value})}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-ui font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <Heart size={16} /> Personal Motivation
                  </label>
                  <textarea 
                    className="input-field min-h-[100px] resize-none"
                    placeholder="Why do they volunteer?"
                    value={storyData.motivation}
                    onChange={e => setStoryData({...storyData, motivation: e.target.value})}
                    required
                  />
                </div>
              </>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="mt-4 brutal-button bg-bold-orange text-white py-4 rounded-2xl font-ui font-black text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Forging Impact...</span>
                </div>
              ) : (
                <>
                  <span>Generate Narrative</span>
                  <Send size={20} />
                </>
              )}
            </button>
          </form>
        </section>

        {/* Output Section */}
        <section className="flex flex-col gap-6">
          <div className="brutal-block p-1 bg-forest-green">
            <div className="bg-[#f3efe7] p-6 border-2 border-black flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <ArrowRight className="text-forest-green" /> Resulting Story
              </h3>
              {output && (
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(output);
                    alert('Copied to clipboard!');
                  }}
                  className="font-ui text-sm font-bold underline hover:text-forest-green"
                >
                  Copy Text
                </button>
              )}
            </div>
          </div>

          <div className="output-container neo-inset rounded-3xl p-8 flex flex-col justify-center items-center text-center">
            {!output && !loading && (
              <div className="flex flex-col items-center gap-4 text-gray-400">
                <Sparkles size={64} strokeWidth={1} />
                <p className="text-xl italic max-w-xs">
                  Provide context on the left to forge your impact narrative.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 border-8 border-forest-green/20 border-t-forest-green rounded-full animate-spin"></div>
                  <Sparkles className="absolute inset-0 m-auto text-forest-green animate-pulse" />
                </div>
                <p className="font-ui font-bold animate-pulse text-forest-green">Synthesizing human impact...</p>
              </div>
            )}

            {output && (
              <div className="animate-fade-in text-left w-full">
                {mode === 'grant' ? (
                  <div className="space-y-6">
                    <div className="flex items-start gap-2">
                      <div className="h-1 w-12 bg-forest-green mt-4 shrink-0" />
                      <p className="text-xl md:text-2xl leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-forest-green">
                        {output}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative p-8 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
                    <Quote className="absolute -top-4 -left-4 text-bold-orange fill-bold-orange w-12 h-12" />
                    <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-gray-800">
                      {output}
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                      <div className="h-0.5 flex-1 bg-black/10" />
                      <span className="font-ui font-black uppercase tracking-widest text-sm">Impact Bio</span>
                      <div className="h-0.5 flex-1 bg-black/10" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="flex gap-4">
            <div className="flex-1 brutal-block p-4 bg-white/50 border-black/10 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-forest-green" />
              <p className="font-ui text-xs font-bold uppercase text-gray-500">Verified Clarity</p>
            </div>
            <div className="flex-1 brutal-block p-4 bg-white/50 border-black/10 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-bold-orange" />
              <p className="font-ui text-xs font-bold uppercase text-gray-500">Human Centered</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t-2 border-black/5 text-center flex flex-col md:flex-row justify-between items-center gap-4 opacity-60">
        <p className="font-ui font-bold">© 2026 ImpactForge | NGO Storytelling Intelligence</p>
        <div className="flex gap-6 font-ui text-sm font-bold uppercase tracking-widest">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </footer>
    </main>
  );
}
