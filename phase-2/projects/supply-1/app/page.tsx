'use client';

import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Wind, 
  Snowflake, 
  AlertTriangle, 
  Navigation, 
  Calendar, 
  Truck, 
  ChevronRight,
  ShieldAlert,
  Loader2,
  RefreshCw
} from 'lucide-react';

export default function WeatherShield() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    transportMode: 'Truck',
    departureDate: '',
    weatherConditions: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const assembledPrompt = `
      Origin: ${formData.origin}
      Destination: ${formData.destination}
      Transport Mode: ${formData.transportMode}
      Departure Date: ${formData.departureDate}
      Known Weather Conditions: ${formData.weatherConditions || 'None specified'}
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: assembledPrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="mb-12 border-[4px] border-black bg-white p-6 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CloudRain size={120} />
        </div>
        <div className="relative z-10">
          <div className="accent-box">Operational Intelligence</div>
          <h1 className="mb-4">WeatherShield</h1>
          <p className="text-xl md:text-2xl font-bold uppercase tracking-tight max-w-2xl">
            Input your route and forecast — predict weather-based delay risk
          </p>
        </div>
      </header>

      {/* Marquee */}
      <div className="marquee-container">
        <div className="marquee-content">
          DISRUPTION DETECTED // HIGH WIND ADVISORY // ROUTE OPTIMIZATION ACTIVE // ETA ADJUSTMENT PENDING // 
          DISRUPTION DETECTED // HIGH WIND ADVISORY // ROUTE OPTIMIZATION ACTIVE // ETA ADJUSTMENT PENDING //
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <section className="lg:col-span-5">
          <div className="brutal-card p-6 md:p-8 bg-[#ffff00]">
            <h2 className="mb-8 flex items-center gap-4">
              <Navigation className="shrink-0" size={40} strokeWidth={3} />
              Route Details
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="brutal-label">Origin City/Port</label>
                <input
                  required
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  placeholder="E.G. SHANGHAI"
                  className="brutal-input"
                />
              </div>

              <div>
                <label className="brutal-label">Destination City/Port</label>
                <input
                  required
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="E.G. ROTTERDAM"
                  className="brutal-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="brutal-label">Transport Mode</label>
                  <select
                    name="transportMode"
                    value={formData.transportMode}
                    onChange={handleInputChange}
                    className="brutal-input appearance-none"
                  >
                    <option>Truck</option>
                    <option>Sea Freight</option>
                    <option>Air Freight</option>
                    <option>Rail</option>
                  </select>
                </div>
                <div>
                  <label className="brutal-label">Departure Date</label>
                  <input
                    required
                    type="date"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleInputChange}
                    className="brutal-input"
                  />
                </div>
              </div>

              <div>
                <label className="brutal-label">Known Weather Conditions (Optional)</label>
                <textarea
                  name="weatherConditions"
                  value={formData.weatherConditions}
                  onChange={handleInputChange}
                  placeholder="E.G. UPCOMING TYPHOON IN SOUTH CHINA SEA"
                  className="brutal-input min-h-[100px] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="brutal-button w-full flex items-center justify-center gap-3 text-2xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ShieldAlert />
                    Calculate Risk
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Results Section */}
        <section className="lg:col-span-7">
          {!result && !loading && !error && (
            <div className="brutal-card h-full flex flex-col items-center justify-center p-12 text-center bg-white border-dashed">
              <div className="p-8 border-[4px] border-black mb-6">
                <Truck size={80} strokeWidth={2.5} />
              </div>
              <h3 className="mb-4">Ready for Analysis</h3>
              <p className="font-bold opacity-60">
                Enter your shipment details to generate a weather-based risk assessment and route optimization strategy.
              </p>
            </div>
          )}

          {loading && (
            <div className="brutal-card h-full flex flex-col items-center justify-center p-12 text-center bg-white">
              <div className="p-8 border-[4px] border-black mb-6 animate-bounce">
                <RefreshCw size={80} strokeWidth={2.5} className="animate-spin" />
              </div>
              <h3 className="mb-4">Crunching Transit Data</h3>
              <p className="font-bold">
                Correlating historical weather patterns with current route logistics...
              </p>
            </div>
          )}

          {error && (
            <div className="brutal-card p-8 bg-[#ff4d4d] text-white border-black">
              <div className="flex items-center gap-4 mb-4">
                <AlertTriangle size={48} strokeWidth={3} />
                <h2>System Error</h2>
              </div>
              <p className="text-xl font-black mb-6">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="brutal-button bg-white text-black text-lg"
              >
                Retry Analysis
              </button>
            </div>
          )}

          {result && (
            <div className="brutal-card bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="storm-bg p-6 border-b-[4px] border-black flex justify-between items-center">
                <h3 className="text-white">Analysis Result</h3>
                <div className="bg-primary text-black px-4 py-1 font-black text-sm uppercase border-[2px] border-black">
                  Live Report
                </div>
              </div>
              
              <div className="p-6 md:p-8 prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap font-bold text-lg leading-relaxed text-black">
                  {result.split('\n').map((line, i) => {
                    if (line.startsWith('#') || line.includes(':')) {
                      return <div key={i} className="mb-4 text-2xl font-black uppercase border-b-[2px] border-black pb-1 inline-block">{line.replace(/[#*]/g, '')}</div>
                    }
                    if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                      return (
                        <div key={i} className="flex gap-3 mb-2 items-start">
                          <ChevronRight className="mt-1 shrink-0 text-primary" strokeWidth={4} size={20} />
                          <span>{line.replace(/^[-*]\s*/, '')}</span>
                        </div>
                      )
                    }
                    return <p key={i} className="mb-4">{line}</p>
                  })}
                </div>
              </div>

              <div className="p-6 bg-primary border-t-[4px] border-black flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 font-black uppercase">
                  <ShieldAlert size={24} />
                  Strategy Generated
                </div>
                <button 
                  onClick={() => window.print()}
                  className="bg-white px-6 py-2 border-[4px] border-black font-black uppercase hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  Export PDF
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Footer Info */}
      <footer className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Wind />, title: "Precision", text: "Micro-climate routing logic" },
          { icon: <Snowflake />, title: "Resilience", text: "Preemptive disruption flagging" },
          { icon: <ShieldAlert />, title: "Security", text: "End-to-end transit protection" }
        ].map((item, i) => (
          <div key={i} className="brutal-card p-6 flex items-center gap-4 bg-white">
            <div className="p-3 border-[3px] border-black bg-primary">
              {item.icon}
            </div>
            <div>
              <div className="font-black uppercase text-sm">{item.title}</div>
              <div className="font-bold opacity-70 text-xs">{item.text}</div>
            </div>
          </div>
        ))}
      </footer>
    </main>
  );
}
