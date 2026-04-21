@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #080a0f;
  --foreground: #f0f2f5;
  --glass: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --accent-green: #34d399;
  --accent-orange: #fb923c;
  --accent-blue: #60a5fa;
  --glow-green: rgba(52, 211, 153, 0.4);
  --glow-orange: rgba(251, 146, 60, 0.4);
}

body {
  background-color: var(--background);
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(52, 211, 153, 0.05) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(251, 146, 60, 0.05) 0%, transparent 40%);
  color: var(--foreground);
  font-family: 'Outfit', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

@layer components {
  .glass-panel {
    @apply bg-[var(--glass)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  }

  .glass-input {
    @apply bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none transition-all duration-300;
    @apply focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)] focus:shadow-[0_0_15px_rgba(52,211,153,0.2)];
  }

  .glass-button-primary {
    @apply relative overflow-hidden bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-blue)] text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed;
    box-shadow: 0 4px 20px rgba(52, 211, 153, 0.4);
  }

  .glass-button-secondary {
    @apply border border-white/20 hover:bg-white/10 px-6 py-3 rounded-xl transition-all duration-300;
  }

  .glow-text {
    text-shadow: 0 0 10px currentColor;
  }
}

.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; filter: brightness(100%); }
  50% { opacity: 0.8; filter: brightness(150%); }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background);
}

::-webkit-scrollbar-thumb {
  background: var(--glass-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-green);
}
