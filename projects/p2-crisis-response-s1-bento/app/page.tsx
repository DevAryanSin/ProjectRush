'use client';

import React, { useState } from 'react';
import { ShieldAlert, Activity, ShieldCheck, Stethoscope, Users, Radio, ArrowRight, Loader2, MapPin, AlertTriangle } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    type: 'Medical Emergency',
    location: '',
    affected: '1',
    severity: '5',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.description) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const prompt = `Crisis Type: ${formData.type}\nLocation: ${formData.location}\nPeople Affected: ${formData.affected}\nSeverity: ${formData.severity}/5\nDescription: ${formData.description}`;
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) throw new Error('Failed to generate response');
      const data = await response.json();
      
      try {
        const text = data.result;
        const jsonMatch = text.match(/```json\n([\s\S]*)\n```/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(text);
        setResult(parsed);
      } catch (e) {
        try {
          setResult(JSON.parse(data.result));
        } catch(e2) {
           setError('Failed to parse the emergency alert structure. Please try again.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during alert generation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff3333] rounded-lg flex items-center justify-center">
            <ShieldAlert className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white m-0 leading-none">AlertBridge</h1>
            <p className="text-sm text-[#888] mt-1 mono">HOSPITALITY EMERGENCY SYSTEM</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#111] border border-[#222] rounded-full text-xs mono text-[#888]">
          <span className="w-2 h-2 rounded-full bg-green-500 loading-pulse"></span>
          SYSTEM ONLINE
        </div>
      </div>

      <div className="bento-grid">
        {/* Main Input Form - Top Left 2x2 */}
        <div className="bento-card card-span-2x2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="text-[#ff3333]" size={20} />
              NEW INCIDENT REPORT
            </h2>
            <span className="text-xs font-mono text-[#888] bg-[#1a1a1a] px-2 py-1 rounded">PRIORITY OVERRIDE</span>
          </div>

          {error && (
            <div className="mb-4 bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm flex items-start gap-2">
              <ShieldAlert size={16} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-[#888] mb-1 font-bold tracking-wider">CRISIS TYPE</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="font-mono text-sm"
                  suppressHydrationWarning
                  disabled={loading}
                >
                  <option>Medical Emergency</option>
                  <option>Fire/Smoke</option>
                  <option>Security Threat/Intruder</option>
                  <option>Structural Collapse</option>
                  <option>Severe Weather</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-[#888] mb-1 font-bold tracking-wider">SEVERITY (1-5)</label>
                <select 
                  value={formData.severity}
                  onChange={e => setFormData({...formData, severity: e.target.value})}
                  className="font-mono text-sm"
                  suppressHydrationWarning
                  disabled={loading}
                >
                  <option value="1">1 - Minor Issue</option>
                  <option value="2">2 - Non-critical</option>
                  <option value="3">3 - Serious</option>
                  <option value="4">4 - Critical</option>
                  <option value="5">5 - Life-Threatening</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] text-[#888] mb-1 font-bold tracking-wider">EXACT LOCATION</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-[#555]" size={16} />
                  <input 
                    type="text" 
                    placeholder="e.g. West Wing Balcony"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="pl-9 font-mono text-sm"
                    suppressHydrationWarning
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-[#888] mb-1 font-bold tracking-wider">AFFECTED</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3.5 text-[#555]" size={16} />
                  <input 
                    type="number" 
                    min="1"
                    value={formData.affected}
                    onChange={e => setFormData({...formData, affected: e.target.value})}
                    className="pl-9 font-mono text-sm"
                    suppressHydrationWarning
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="flex-grow flex flex-col min-h-0 min-h-[100px]">
              <label className="block text-[10px] text-[#888] mb-1 font-bold tracking-wider">SITUATION DESCRIPTION</label>
              <textarea 
                placeholder="Briefly describe the situation..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="flex-grow resize-none font-mono text-sm"
                suppressHydrationWarning
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="mt-2 w-full bg-[#ff3333] hover:bg-[#e62e2e] text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              suppressHydrationWarning
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  PROCESSING REPORT
                </>
              ) : (
                <>
                  BROADCAST ALERT
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Status Card */}
        <div className="bento-card bg-gradient-to-br from-[#111] to-[#1a1111]">
          <h3 className="text-[#888] text-xs font-bold tracking-wider mb-2">SYSTEM STATUS</h3>
          <div className="flex-grow flex flex-col justify-center items-center">
            <Activity className={`text-[#ff3333] mb-4 ${loading ? 'loading-pulse' : ''}`} size={48} />
            <div className="text-2xl lg:text-3xl font-bold text-white mono mb-1">
              {loading ? 'ANALYZING' : (result ? 'ACTIVE' : 'STANDBY')}
            </div>
            <div className="text-[#ff3333] text-xs lg:text-sm mono text-center">
              {result ? `ID: INT-${Math.floor(Math.random() * 9000) + 1000}` : 'Awaiting Input'}
            </div>
          </div>
        </div>

        {/* Action Priority Card */}
        <div className="bento-card border-[#ff3333]/30">
          <h3 className="text-[#888] text-xs font-bold tracking-wider mb-2">SEVERITY LEVEL</h3>
          <div className="flex-grow flex flex-col justify-center items-center">
             <div className="text-7xl font-black text-white mono leading-none tracking-tighter">
                {result ? result.level : formData.severity}
             </div>
             <p className="mt-4 font-mono text-[10px] lg:text-xs text-[#888] border border-[#333] px-3 py-1 rounded-full uppercase tracking-widest text-center">
               {result ? result.severityDescription : "Current Selection"}
             </p>
          </div>
        </div>

        {/* The generated response blocks */}
        {result ? (
          <>
            <div className="bento-card card-span-2x1 border-l-4 border-l-[#ff3333]">
              <div className="flex items-center gap-2 mb-3 text-[#ff3333]">
                <ShieldCheck size={20} />
                <h3 className="font-bold tracking-wider text-sm">SECURITY TEAM RESPONSE</h3>
              </div>
              <p className="text-[#e2e2e2] text-sm leading-relaxed">{result.security}</p>
            </div>
            
            <div className="bento-card card-span-2x1 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-2 mb-3 text-blue-500">
                <Stethoscope size={20} />
                <h3 className="font-bold tracking-wider text-sm">MEDICAL PROTOCOL</h3>
              </div>
              <p className="text-[#e2e2e2] text-sm leading-relaxed">{result.medical}</p>
            </div>

            <div className="bento-card card-span-2x1 border-l-4 border-l-yellow-500">
              <div className="flex items-center gap-2 mb-3 text-yellow-500">
                <Users size={20} />
                <h3 className="font-bold tracking-wider text-sm">MANAGEMENT ACTION</h3>
              </div>
              <p className="text-[#e2e2e2] text-sm leading-relaxed">{result.management}</p>
            </div>

            <div className="bento-card card-span-2x1 border-l-4 border-l-green-500">
              <div className="flex items-center gap-2 mb-3 text-green-500">
                <Radio size={20} />
                <h3 className="font-bold tracking-wider text-sm">GUEST COMMUNICATIONS</h3>
              </div>
              <p className="text-[#e2e2e2] text-sm leading-relaxed">{result.guestComms}</p>
            </div>
          </>
        ) : (
          /* Placeholder cards while waiting */
          <>
             <div className="bento-card card-span-2x1 opacity-30">
               <div className="h-4 w-1/3 bg-[#333] rounded mb-4" />
               <div className="space-y-2">
                 <div className="h-2 w-full bg-[#222] rounded" />
                 <div className="h-2 w-5/6 bg-[#222] rounded" />
                 <div className="h-2 w-4/6 bg-[#222] rounded" />
               </div>
             </div>
             <div className="bento-card card-span-2x1 opacity-30 hidden lg:flex">
               <div className="h-4 w-1/3 bg-[#333] rounded mb-4" />
               <div className="space-y-2">
                 <div className="h-2 w-full bg-[#222] rounded" />
                 <div className="h-2 w-5/6 bg-[#222] rounded" />
                 <div className="h-2 w-4/6 bg-[#222] rounded" />
               </div>
             </div>
          </>
        )}
      </div>
    </main>
  );
}
