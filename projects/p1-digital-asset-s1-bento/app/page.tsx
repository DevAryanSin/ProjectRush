'use client';

import { useState } from 'react';
import {
  Shield,
  ScanSearch,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Globe,
  Lock,
  TrendingUp,
  Flag,
  ChevronRight,
  Loader2,
  FileSearch,
  Eye,
  BarChart3,
} from 'lucide-react';

interface AnalysisResult {
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  redFlags: string[];
  recommendedAction: string;
  rawText: string;
}

function parseGeminiResponse(text: string): AnalysisResult {
  const riskMatch = text.match(/\b(HIGH|MEDIUM|LOW)\b/i);
  const riskLevel = (riskMatch?.[1]?.toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW') || 'LOW';

  const confMatch = text.match(/(\d{1,3})\s*%/);
  const confidence = confMatch ? Math.min(100, parseInt(confMatch[1])) : 50;

  const redFlags: string[] = [];
  const flagPatterns = [
    /(?:red flag[s]?|flag[s]?|indicator[s]?|issue[s]?|concern[s]?)[:\s]*([^\n.]+(?:\n[^\n.]+)?)/gi,
    /\d+\.\s+([^\n]+)/gi,
    /[-•*]\s+([^\n]+)/gi,
  ];

  for (const pattern of flagPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null && redFlags.length < 3) {
      const flag = match[1].trim().replace(/^[-•*\d.]\s*/, '');
      if (flag.length > 10 && !redFlags.includes(flag)) {
        redFlags.push(flag.substring(0, 120));
      }
    }
    if (redFlags.length >= 3) break;
  }

  if (redFlags.length === 0) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    sentences.slice(0, 3).forEach(s => redFlags.push(s.trim().substring(0, 120)));
  }

  const actionMatch = text.match(/(?:recommend(?:ed)?|action|suggest)[:\s]*([^\n]+(?:\n[^\n]+)?)/i);
  const recommendedAction = actionMatch
    ? actionMatch[1].trim().substring(0, 200)
    : 'Review content ownership documentation and consult legal counsel.';

  return { riskLevel, confidence, redFlags: redFlags.slice(0, 3), recommendedAction, rawText: text };
}

const riskConfig = {
  HIGH: {
    color: 'var(--risk-high)',
    bg: 'var(--risk-high-bg)',
    border: 'var(--risk-high-border)',
    glow: 'var(--risk-high-glow)',
    icon: XCircle,
    label: 'HIGH RISK',
    pulse: true,
  },
  MEDIUM: {
    color: 'var(--risk-medium)',
    bg: 'var(--risk-medium-bg)',
    border: 'var(--risk-medium-border)',
    glow: 'var(--risk-medium-glow)',
    icon: AlertTriangle,
    label: 'MEDIUM RISK',
    pulse: false,
  },
  LOW: {
    color: 'var(--risk-low)',
    bg: 'var(--risk-low-bg)',
    border: 'var(--risk-low-border)',
    glow: 'var(--risk-low-glow)',
    icon: CheckCircle,
    label: 'LOW RISK',
    pulse: false,
  },
};

export default function ScanGuardPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setResult(parseGeminiResponse(data.result));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const risk = result ? riskConfig[result.riskLevel] : null;
  const RiskIcon = risk?.icon ?? Shield;

  return (
    <div className="scanGuard-root">
      {/* Background grid texture */}
      <div className="bg-grid" />

      {/* ── Header strip ── */}
      <header className="sg-header">
        <div className="sg-logo">
          <Shield size={22} className="sg-logo-icon" />
          <span className="sg-logo-text">ScanGuard</span>
        </div>
        <div className="sg-header-right">
          <span className="sg-badge">
            <Zap size={11} />
            AI-Powered
          </span>
          <span className="sg-badge sg-badge-alt">
            <Lock size={11} />
            IP Protection
          </span>
        </div>
      </header>

      {/* ── Bento Grid ── */}
      <main className="sg-bento-grid">

        {/* ── CARD 1: Hero title (2×1 wide) ── */}
        <div className="sg-card sg-card-hero">
          <div className="sg-card-hero-inner">
            <div className="hero-eyebrow">
              <Globe size={13} />
              Digital Sports Media Intelligence
            </div>
            <h1 className="hero-title">
              Detect Stolen<br />
              <span className="hero-title-accent">Sports Content</span>
            </h1>
            <p className="hero-sub">
              Paste a URL or describe content — ScanGuard uses AI to detect
              unauthorized use, misappropriation, and IP violations instantly.
            </p>
          </div>
          <div className="hero-shield-bg">
            <Shield size={160} strokeWidth={0.5} />
          </div>
        </div>

        {/* ── CARD 2: Stat — scans today ── */}
        <div className="sg-card sg-card-stat sg-card-stat-gold">
          <span className="stat-label">
            <Eye size={13} /> Scans Today
          </span>
          <span className="stat-number">12.4K</span>
          <span className="stat-sub">+38% vs yesterday</span>
        </div>

        {/* ── CARD 3: Stat — threats caught ── */}
        <div className="sg-card sg-card-stat sg-card-stat-navy">
          <span className="stat-label">
            <Flag size={13} /> Threats Flagged
          </span>
          <span className="stat-number">847</span>
          <span className="stat-sub">This week</span>
        </div>

        {/* ── CARD 4: Input form (2×2 main) ── */}
        <div className="sg-card sg-card-input">
          <div className="input-card-header">
            <ScanSearch size={18} className="input-card-icon" />
            <span className="input-card-title">Content Scanner</span>
          </div>

          <label className="input-label">URL or Content Snippet</label>
          <textarea
            id="content-input"
            className="sg-textarea"
            placeholder="Paste a URL (e.g. https://example.com/video-clip) or describe the content — e.g. 'NBA finals highlight reel posted on an unofficial Telegram channel without branding'..."
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={6}
          />

          <button
            id="analyze-btn"
            className={`sg-btn ${loading ? 'sg-btn-loading' : ''}`}
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            suppressHydrationWarning
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spin" />
                Analyzing Content...
              </>
            ) : (
              <>
                <ScanSearch size={16} />
                Run IP Scan
                <ChevronRight size={16} />
              </>
            )}
          </button>

          {error && (
            <div className="sg-error">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}
        </div>

        {/* ── CARD 5: How it works ── */}
        <div className="sg-card sg-card-howto">
          <div className="howto-header">
            <FileSearch size={15} />
            How It Works
          </div>
          <ul className="howto-list">
            <li><span className="howto-num">01</span>Paste a URL or content description</li>
            <li><span className="howto-num">02</span>AI analyzes redistribution patterns</li>
            <li><span className="howto-num">03</span>Receive risk verdict + red flags</li>
            <li><span className="howto-num">04</span>Take recommended action</li>
          </ul>
        </div>

        {/* ── CARD 6: Coverage stat ── */}
        <div className="sg-card sg-card-stat sg-card-stat-accent">
          <span className="stat-label">
            <TrendingUp size={13} /> Accuracy Rate
          </span>
          <span className="stat-number">94<span className="stat-percent">%</span></span>
          <span className="stat-sub">AI detection precision</span>
        </div>

        {/* ── RESULTS SECTION ── */}
        {loading && (
          <>
            <div className="sg-card sg-card-loading sg-card-wide">
              <div className="loading-inner">
                <div className="loading-ring" />
                <span className="loading-text">ScanGuard is analyzing content…</span>
                <span className="loading-sub">Examining redistribution patterns, attribution signals, and platform anomalies</span>
              </div>
            </div>
          </>
        )}

        {result && risk && (
          <>
            {/* Risk verdict card — wide */}
            <div
              className="sg-card sg-card-verdict sg-card-wide"
              style={{
                background: risk.bg,
                borderColor: risk.border,
                boxShadow: `0 0 40px ${risk.glow}, 0 0 0 1px ${risk.border}`,
              }}
            >
              <div className="verdict-top">
                <RiskIcon size={32} style={{ color: risk.color }} className={risk.pulse ? 'verdict-pulse' : ''} />
                <div>
                  <div className="verdict-label" style={{ color: risk.color }}>Theft Risk Verdict</div>
                  <div className="verdict-level" style={{ color: risk.color }}>{risk.label}</div>
                </div>
              </div>
              <p className="verdict-action">{result.recommendedAction}</p>
            </div>

            {/* Confidence score card */}
            <div className="sg-card sg-card-confidence">
              <span className="conf-label">
                <BarChart3 size={13} /> Confidence
              </span>
              <span className="conf-number">{result.confidence}<span className="conf-pct">%</span></span>
              <div className="conf-bar-track">
                <div
                  className="conf-bar-fill"
                  style={{
                    width: `${result.confidence}%`,
                    background: risk.color,
                    boxShadow: `0 0 8px ${risk.glow}`,
                  }}
                />
              </div>
              <span className="conf-sub">AI certainty score</span>
            </div>

            {/* Red flags card */}
            <div className="sg-card sg-card-flags">
              <div className="flags-header">
                <Flag size={15} style={{ color: 'var(--gold)' }} />
                <span>Top Red Flags Detected</span>
              </div>
              <ul className="flags-list">
                {result.redFlags.map((flag, i) => (
                  <li key={i} className="flags-item">
                    <span className="flags-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flags-text">{flag}</span>
                  </li>
                ))}
                {result.redFlags.length === 0 && (
                  <li className="flags-item">
                    <span className="flags-text">No specific red flags identified — content appears clean.</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Raw response card */}
            <div className="sg-card sg-card-raw">
              <div className="raw-header">
                <Eye size={13} />
                Full AI Analysis
              </div>
              <p className="raw-text">{result.rawText}</p>
            </div>
          </>
        )}
      </main>

      <footer className="sg-footer">
        <Shield size={13} /> ScanGuard — Digital Sports Media IP Protection Engine · Powered by Gemini AI
      </footer>
    </div>
  );
}
