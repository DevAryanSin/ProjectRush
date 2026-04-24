'use client';

import { useState } from 'react';
import { Loader2, Send, Award, Clock, MapPin, Heart, BookOpen, User } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    hours: '',
    tasks: '',
    communities: '',
    motivation: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult('');

    const promptText = `
Name: ${formData.name}
Skills: ${formData.skills}
Hours Contributed: ${formData.hours}
Tasks Completed: ${formData.tasks}
Communities Served: ${formData.communities}
Personal Motivation: ${formData.motivation}
    `.trim();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center selection:bg-[var(--accent)] selection:text-white">
      <div className="w-full max-w-4xl space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 neo-box mb-4">
            <Heart size={48} className="text-[var(--accent)]" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-[var(--text-main)]">VolunteerBio</h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto">
            Volunteer fills in their details — get a compelling impact bio generated
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div className="neo-box p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-[var(--shadow-dark)] pb-4 opacity-70">
              <BookOpen size={24} className="text-[var(--accent)]" />
              <h2 className="text-2xl font-semibold">Your Details</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="flex items-center gap-2 font-medium text-sm ml-1">
                  <User size={16} /> Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="neo-input"
                  placeholder="e.g. Jane Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="skills" className="flex items-center gap-2 font-medium text-sm ml-1">
                  <Award size={16} /> Key Skills
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  required
                  className="neo-input"
                  placeholder="e.g. Graphic Design, Public Speaking"
                  value={formData.skills}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="hours" className="flex items-center gap-2 font-medium text-sm ml-1">
                    <Clock size={16} /> Hours Contributed
                  </label>
                  <input
                    type="number"
                    id="hours"
                    name="hours"
                    required
                    className="neo-input"
                    placeholder="e.g. 50"
                    value={formData.hours}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="communities" className="flex items-center gap-2 font-medium text-sm ml-1">
                    <MapPin size={16} /> Communities Served
                  </label>
                  <input
                    type="text"
                    id="communities"
                    name="communities"
                    required
                    className="neo-input"
                    placeholder="e.g. Downtown Shelter"
                    value={formData.communities}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="tasks" className="flex items-center gap-2 font-medium text-sm ml-1">
                  <BookOpen size={16} /> Tasks Completed
                </label>
                <textarea
                  id="tasks"
                  name="tasks"
                  required
                  rows={3}
                  className="neo-input resize-none"
                  placeholder="e.g. Organized food drives, managed social media..."
                  value={formData.tasks}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="motivation" className="flex items-center gap-2 font-medium text-sm ml-1">
                  <Heart size={16} /> Personal Motivation
                </label>
                <textarea
                  id="motivation"
                  name="motivation"
                  required
                  rows={3}
                  className="neo-input resize-none"
                  placeholder="Why do you volunteer?"
                  value={formData.motivation}
                  onChange={handleInputChange}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="neo-button accent w-full py-4 text-lg mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Crafting Bio...
                  </>
                ) : (
                  <>
                    <Send size={24} />
                    Generate Impact Bio
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="neo-box p-8 flex flex-col h-full">
            <div className="flex items-center gap-3 border-b border-[var(--shadow-dark)] pb-4 opacity-70 mb-6">
              <Award size={24} className="text-[var(--accent)]" />
              <h2 className="text-2xl font-semibold">Your Impact Story</h2>
            </div>

            <div className="flex-grow flex flex-col justify-center">
              {!result && !error && !isLoading && (
                <div className="text-center text-[var(--text-muted)] space-y-4 py-12">
                  <div className="inline-block p-6 neo-inset rounded-full mb-2">
                    <User size={48} className="opacity-50" />
                  </div>
                  <p className="text-lg">Fill out your details to generate your bio.</p>
                </div>
              )}

              {isLoading && (
                <div className="text-center space-y-6 py-12">
                  <Loader2 size={64} className="animate-spin text-[var(--accent)] mx-auto opacity-80" />
                  <p className="text-lg text-[var(--text-muted)] animate-pulse">
                    Weaving your story of impact...
                  </p>
                </div>
              )}

              {error && (
                <div className="neo-inset p-6 text-red-700 bg-red-100/50 border border-red-200 rounded-2xl">
                  <p className="font-semibold flex items-center gap-2 mb-2">
                    <span className="text-xl">⚠️</span> Error
                  </p>
                  <p>{error}</p>
                </div>
              )}

              {result && !isLoading && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                  <div className="neo-inset p-8 relative overflow-hidden">
                    {/* Decorative quote marks */}
                    <span className="text-8xl absolute top-4 left-4 text-[var(--shadow-light)] opacity-50 font-serif leading-none select-none">
                      "
                    </span>
                    
                    <div className="relative z-10 text-lg leading-relaxed text-[var(--text-main)] space-y-4 whitespace-pre-wrap font-medium">
                      {result}
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={() => navigator.clipboard.writeText(result)}
                      className="neo-button px-6 py-3 text-sm"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
