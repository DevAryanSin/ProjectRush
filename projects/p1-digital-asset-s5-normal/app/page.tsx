'use client';

import React, { useState } from 'react';
import { Search, FileSearch, AlertTriangle, ShieldCheck, FileVideo, Activity, Info, BarChart2 } from 'lucide-react';

export default function TamperLens() {
  const [formData, setFormData] = useState({
    fileType: '',
    resolution: '',
    fileSize: '',
    encoding: '',
    watermarks: '',
    platformSource: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const promptText = `
      File Type: ${formData.fileType}
      Resolution: ${formData.resolution}
      File Size: ${formData.fileSize}
      Encoding Details: ${formData.encoding}
      Visible Watermarks/Artifacts: ${formData.watermarks}
      Platform Source: ${formData.platformSource}
    `;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate analysis');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatResult = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.includes('HIGH') && line.includes('severity')) {
         return <div key={index} className="flex items-start gap-2 mb-2 p-3 bg-red-50 border border-red-100 rounded text-red-900 border-l-4 border-l-red-500">
             <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
             <p dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
         </div>;
      }
      if (line.includes('MEDIUM') && line.includes('severity')) {
         return <div key={index} className="flex items-start gap-2 mb-2 p-3 bg-amber-50 border border-amber-100 rounded text-amber-900 border-l-4 border-l-amber-500">
             <Activity className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
             <p dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
         </div>;
      }
      if (line.includes('LOW') && line.includes('severity')) {
         return <div key={index} className="flex items-start gap-2 mb-2 p-3 bg-emerald-50 border border-emerald-100 rounded text-emerald-900 border-l-4 border-l-emerald-500">
             <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
             <p dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
         </div>;
      }

      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      if (line.startsWith('###')) {
        return <h4 key={index} className="text-lg font-semibold text-[--color-primary] mt-4 mb-2">{line.replace('###', '').trim()}</h4>;
      } else if (line.startsWith('##')) {
        return <h3 key={index} className="text-xl font-semibold text-[--color-primary] mt-6 mb-3 border-b border-gray-100 pb-2">{line.replace('##', '').trim()}</h3>;
      } else if (line.startsWith('#')) {
        return <h2 key={index} className="text-2xl font-bold text-[--color-primary] mt-6 mb-4">{line.replace('#', '').trim()}</h2>;
      } else if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 mb-1 text-gray-700 list-disc" dangerouslySetInnerHTML={{ __html: formattedLine.replace('- ', '') }}></li>;
      } else if (line.startsWith('* ')) {
        return <li key={index} className="ml-6 mb-1 text-gray-700 list-disc" dangerouslySetInnerHTML={{ __html: formattedLine.replace('* ', '') }}></li>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="mb-2 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }}></p>;
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[--color-primary] p-2 rounded text-[--color-accent]">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[--color-primary] tracking-tight">TamperLens</h1>
              <p className="text-xs text-gray-500 font-medium">Digital Asset Integrity Protocol</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-sm font-medium text-[--color-primary] border-b-2 border-[--color-accent] pb-1">Analysis</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">History</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Reports</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Settings</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar / Info */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
              <div className="bg-blue-50 p-2 rounded-full text-[--color-primary]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-[--color-primary]">Media Verification</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Upload the technical properties of a digital asset to verify its integrity. TamperLens analyzes file metadata, encoding discrepancies, and visual artifacts to detect signs of manipulation, cloning, or unauthorized redistribution.
            </p>
            <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[--color-accent]" />
                Analysis Capabilities
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[--color-primary] mt-1.5 shrink-0"></div> Resolution mismatches</li>
                <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[--color-primary] mt-1.5 shrink-0"></div> Encoding inconsistencies</li>
                <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[--color-primary] mt-1.5 shrink-0"></div> Watermark removal artifacts</li>
                <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-[--color-primary] mt-1.5 shrink-0"></div> File size anomalies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form and Results */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-[--color-primary] mb-6 flex items-center gap-2">
              <FileVideo className="w-5 h-5 text-[--color-accent]" />
              Input Asset Properties
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="fileType" className="label">File Type / Extension</label>
                  <input
                    type="text"
                    id="fileType"
                    name="fileType"
                    required
                    placeholder="e.g., MP4, JPEG, WEBM"
                    className="input-field"
                    value={formData.fileType}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="resolution" className="label">Resolution / Dimensions</label>
                  <input
                    type="text"
                    id="resolution"
                    name="resolution"
                    required
                    placeholder="e.g., 1920x1080"
                    className="input-field"
                    value={formData.resolution}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="fileSize" className="label">File Size</label>
                  <input
                    type="text"
                    id="fileSize"
                    name="fileSize"
                    required
                    placeholder="e.g., 14.2 MB"
                    className="input-field"
                    value={formData.fileSize}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="platformSource" className="label">Platform Source</label>
                  <input
                    type="text"
                    id="platformSource"
                    name="platformSource"
                    required
                    placeholder="e.g., X (Twitter), unofficial site"
                    className="input-field"
                    value={formData.platformSource}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="encoding" className="label">Encoding Details / Codec info</label>
                <input
                  type="text"
                  id="encoding"
                  name="encoding"
                  required
                  placeholder="e.g., H.264, AAC, 30fps, 5Mbps bitrate"
                  className="input-field"
                  value={formData.encoding}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="watermarks" className="label">Visible Watermarks or Artifacts</label>
                <textarea
                  id="watermarks"
                  name="watermarks"
                  rows={3}
                  required
                  placeholder="e.g., Faint blurring in top right corner, original logo seems cropped out..."
                  className="input-field resize-none"
                  value={formData.watermarks}
                  onChange={handleInputChange}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="btn-primary w-full md:w-auto min-w-[200px]"
                  disabled={loading}
                  suppressHydrationWarning
                >
                  {loading ? (
                    <>
                      <Search className="w-4 h-4 spinner" />
                      Analyzing Metadata...
                    </>
                  ) : (
                    <>
                      <FileSearch className="w-4 h-4" />
                      Run Tamper Analysis
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          {error && (
            <div className="card p-6 bg-red-50 border-red-200 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Analysis Error</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="card p-0 overflow-hidden shadow-sm">
              <div className="bg-[--color-primary] px-6 py-4 flex items-center justify-between">
                <h2 className="text-white font-semibold flex items-center gap-2 m-0 text-base">
                  <Activity className="w-5 h-5 text-[--color-accent]" />
                  Forensic Analysis Report
                </h2>
                <div className="text-[10px] uppercase font-bold text-[#b0c4de] bg-[#112240] px-2 py-1 rounded border border-[#1e3a5f]">
                  AI-Generated intelligence
                </div>
              </div>
              <div className="p-6 md:p-8 bg-white results-content text-sm">
                {formatResult(result)}
              </div>
              <div className="bg-gray-50 border-t border-gray-100 p-4 px-6 flex justify-between items-center text-xs text-gray-500 font-medium">
                <span>TamperLens Security Engine</span>
                <span>Report generated successfully</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 grayscale opacity-60">
            <Search className="w-4 h-4" />
            <span className="font-semibold tracking-tight text-sm">TamperLens</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} Digital Asset Protection Systems. Professional Media Forensics.
          </p>
        </div>
      </footer>
    </div>
  );
}
