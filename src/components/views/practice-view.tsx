'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useConfig } from '@/context/config-context';
import { useAuth } from '@/context/auth-context';
import { 
  Sparkles, 
  Clock, 
  FileText, 
  BookOpen, 
  Settings, 
  AlertTriangle, 
  Check, 
  Trophy 
} from 'lucide-react';

export function PracticeView() {
  const router = useRouter();
  const config = useConfig();
  const { user: currentUser } = useAuth();

  const {
    testMode,
    setTestMode,
    testTimeLimit,
    setTestTimeLimit,
    wordLimit,
    setWordLimit,
    includePunctuation,
    setIncludePunctuation,
    includeNumbers,
    setIncludeNumbers,
    saveConfig
  } = config;

  const handleStartPractice = () => {
    // Navigate to typing speed test
    router.push('/typing-test');
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn w-full max-w-[1000px] mx-auto py-8">
      {/* Hero Banner */}
      <div className="text-center py-4 flex flex-col items-center gap-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--accent-color)]/20 bg-[var(--accent-color)]/5 text-[11px] font-bold text-[var(--accent-color)] uppercase tracking-wider">
          <Sparkles className="w-3 h-3 animate-pulse" />
          Elevate your key rhythm
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
          Master your <span className="bg-gradient-to-r from-[var(--accent-color)] to-purple-400 bg-clip-text text-transparent">typing flow.</span>
        </h2>
        <p className="text-[14px] text-[var(--text-muted-alt)] max-w-[620px] leading-relaxed">
          Train speed, precision, and hand posture with simulated mechanical switch acoustics, live WPM spline graphs, and targeted error coaching reports.
        </p>
      </div>

      {/* Configure Panel */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-[12px] font-bold text-[var(--text-muted-alt)] uppercase tracking-wider">Configure Practice:</span>
          
          <button
            onClick={() => {
              const next = !includePunctuation;
              setIncludePunctuation(next);
              saveConfig({ includePunctuation: next });
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer text-[12px] font-semibold ${
              includePunctuation
                ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] text-[var(--accent-color)] font-bold'
                : 'bg-[var(--bg-panel)] border-[var(--border-subtle)] text-[var(--text-muted-alt)] hover:text-white'
            }`}
          >
            <span>Punctuations</span>
            {includePunctuation ? <Check className="w-3.5 h-3.5" /> : null}
          </button>

          <button
            onClick={() => {
              const next = !includeNumbers;
              setIncludeNumbers(next);
              saveConfig({ includeNumbers: next });
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer text-[12px] font-semibold ${
              includeNumbers
                ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] text-[var(--accent-color)] font-bold'
                : 'bg-[var(--bg-panel)] border-[var(--border-subtle)] text-[var(--text-muted-alt)] hover:text-white'
            }`}
          >
            <span>Numbers</span>
            {includeNumbers ? <Check className="w-3.5 h-3.5" /> : null}
          </button>
          
          {includePunctuation && includeNumbers && (
            <span className="text-[10px] font-bold bg-white/10 text-white px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
              Mixed Layout Active ⚡
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {testMode === 'time' && (
            <div className="flex items-center gap-2 animate-fadeIn">
              <span className="text-[11px] font-semibold text-[var(--text-muted-alt)] uppercase tracking-wider">Duration:</span>
              <div className="flex bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-lg p-0.5">
                {([15, 30, 60, 120] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTestTimeLimit(t);
                      saveConfig({ testTimeLimit: t });
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                      testTimeLimit === t
                        ? 'bg-[var(--accent-color)] text-black'
                        : 'text-[var(--text-muted-alt)] hover:text-white'
                    }`}
                  >
                    {t}s
                  </button>
                ))}
              </div>
            </div>
          )}

          {testMode === 'words' && (
            <div className="flex items-center gap-2 animate-fadeIn">
              <span className="text-[11px] font-semibold text-[var(--text-muted-alt)] uppercase tracking-wider">Words:</span>
              <div className="flex bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-lg p-0.5">
                {([10, 25, 50, 100] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      setWordLimit(w);
                      saveConfig({ wordLimit: w });
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                      wordLimit === w
                        ? 'bg-[var(--accent-color)] text-black'
                        : 'text-[var(--text-muted-alt)] hover:text-white'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {testMode === 'custom' && (
            <span className="text-[11px] text-[var(--accent-color)] font-mono font-bold">
              Configure custom text in Settings panel
            </span>
          )}
          
          {testMode === 'quotes' && (
            <span className="text-[11px] text-[var(--text-muted-alt)] italic">
              Natural capitalization & punctuation used
            </span>
          )}
        </div>
      </div>

      {/* Modes Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => {
            setTestMode('time');
            saveConfig({ testMode: 'time' });
          }}
          className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 relative overflow-hidden group cursor-pointer ${
            testMode === 'time'
              ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/[0.02] shadow-[0_10px_30px_rgba(var(--accent-rgb),0.05)]'
              : 'border-[var(--border-subtle)] bg-[var(--bg-panel)] hover:border-[var(--border-active)]'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${testMode === 'time' ? 'bg-[var(--accent-color)] text-black' : 'bg-[var(--bg-widget)] text-[var(--text-muted)] group-hover:text-[var(--text-main)]'} transition-colors`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-white uppercase tracking-wide font-sans">Timed Mode</h4>
            <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed font-sans">Race against the timer. Choose from 15s to 120s intervals.</p>
          </div>
          {testMode === 'time' && (
            <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping" />
          )}
        </button>

        <button
          onClick={() => {
            setTestMode('words');
            saveConfig({ testMode: 'words' });
          }}
          className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 relative overflow-hidden group cursor-pointer ${
            testMode === 'words'
              ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/[0.02] shadow-[0_10px_30px_rgba(var(--accent-rgb),0.05)]'
              : 'border-[var(--border-subtle)] bg-[var(--bg-panel)] hover:border-[var(--border-active)]'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${testMode === 'words' ? 'bg-[var(--accent-color)] text-black' : 'bg-[var(--bg-widget)] text-[var(--text-muted)] group-hover:text-[var(--text-main)]'} transition-colors`}>
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-white uppercase tracking-wide font-sans">Words Mode</h4>
            <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed font-sans">No countdown stress. Type a fixed volume of random words.</p>
          </div>
          {testMode === 'words' && (
            <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping" />
          )}
        </button>

        <button
          onClick={() => {
            setTestMode('quotes');
            saveConfig({ testMode: 'quotes' });
          }}
          className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 relative overflow-hidden group cursor-pointer ${
            testMode === 'quotes'
              ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/[0.02] shadow-[0_10px_30px_rgba(var(--accent-rgb),0.05)]'
              : 'border-[var(--border-subtle)] bg-[var(--bg-panel)] hover:border-[var(--border-active)]'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${testMode === 'quotes' ? 'bg-[var(--accent-color)] text-black' : 'bg-[var(--bg-widget)] text-[var(--text-muted)] group-hover:text-[var(--text-main)]'} transition-colors`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-white uppercase tracking-wide font-sans">Quote Mode</h4>
            <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed font-sans">Practice with real literature sentences and historical records.</p>
          </div>
          {testMode === 'quotes' && (
            <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping" />
          )}
        </button>

        <button
          onClick={() => {
            setTestMode('custom');
            saveConfig({ testMode: 'custom' });
          }}
          className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 relative overflow-hidden group cursor-pointer ${
            testMode === 'custom'
              ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/[0.02] shadow-[0_10px_30px_rgba(var(--accent-rgb),0.05)]'
              : 'border-[var(--border-subtle)] bg-[var(--bg-panel)] hover:border-[var(--border-active)]'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${testMode === 'custom' ? 'bg-[var(--accent-color)] text-black' : 'bg-[var(--bg-widget)] text-[var(--text-muted)] group-hover:text-[var(--text-main)]'} transition-colors`}>
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-white uppercase tracking-wide font-sans">Custom Mode</h4>
            <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed font-sans">Paste your own paragraphs, code syntax, or word lists.</p>
          </div>
          {testMode === 'custom' && (
            <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping" />
          )}
        </button>

        <button
          onClick={() => {
            setTestMode('zen');
            saveConfig({ testMode: 'zen' });
          }}
          className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 relative overflow-hidden group cursor-pointer ${
            testMode === 'zen'
              ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/[0.02] shadow-[0_10px_30px_rgba(var(--accent-rgb),0.05)]'
              : 'border-[var(--border-subtle)] bg-[var(--bg-panel)] hover:border-[var(--border-active)]'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${testMode === 'zen' ? 'bg-[var(--accent-color)] text-black' : 'bg-[var(--bg-widget)] text-[var(--text-muted)] group-hover:text-[var(--text-main)]'} transition-colors`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-white uppercase tracking-wide font-sans">Zen Mode</h4>
            <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed font-sans">Indefinite, stress-free training. Complete the session whenever you want.</p>
          </div>
          {testMode === 'zen' && (
            <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping" />
          )}
        </button>

        <button
          onClick={() => {
            setTestMode('weak-keys');
            saveConfig({ testMode: 'weak-keys' });
          }}
          className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 relative overflow-hidden group cursor-pointer ${
            testMode === 'weak-keys'
              ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/[0.02] shadow-[0_10px_30px_rgba(var(--accent-rgb),0.05)]'
              : 'border-[var(--border-subtle)] bg-[var(--bg-panel)] hover:border-[var(--border-active)]'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${testMode === 'weak-keys' ? 'bg-[var(--accent-color)] text-black' : 'bg-[var(--bg-widget)] text-[var(--text-muted)] group-hover:text-[var(--text-main)]'} transition-colors`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-white uppercase tracking-wide font-sans">Weak Keys Practice</h4>
            <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed font-sans">Targeted muscle memory. Generates paragraphs focusing on your missed keys.</p>
          </div>
          {testMode === 'weak-keys' && (
            <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping" />
          )}
        </button>
      </div>

      {/* Start Test CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
        <button
          onClick={handleStartPractice}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--accent-color)] hover:bg-white text-black font-extrabold text-[14px] tracking-wide transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)] active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start Practice Test</span>
        </button>
        
        <button
          onClick={() => router.push('/profile')}
          className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--border-active)] hover:border-[var(--border-active)] bg-[var(--bg-panel)] text-[var(--text-main)] hover:text-white font-semibold text-[13px] tracking-wide transition-all duration-300 cursor-pointer active:scale-95"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Open Performance Profile</span>
        </button>
      </div>

      {/* Features spotlights info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 border-t border-[var(--border-subtle)] pt-6 text-left">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11.5px] font-bold text-[var(--text-muted-alt)] uppercase tracking-wider font-mono">Acoustic Audio</span>
          <p className="text-[12px] text-[var(--text-muted-alt)] leading-relaxed">Synthetic Cherry MX switches play actual keycaps clicking, tactile clicks, and error buzzers on the fly.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11.5px] font-bold text-[var(--text-muted-alt)] uppercase tracking-wider font-mono">Live Spline Curves</span>
          <p className="text-[12px] text-[var(--text-muted-alt)] leading-relaxed">Vector chart curves display raw WPM velocity and accuracy consistency over typing intervals.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11.5px] font-bold text-[var(--text-muted-alt)] uppercase tracking-wider font-mono">Error Coaching</span>
          <p className="text-[12px] text-[var(--text-muted-alt)] leading-relaxed">We record character mistypes and generate personalized coaching recommendations for your hands.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11.5px] font-bold text-[var(--text-muted-alt)] uppercase tracking-wider font-mono">100% Privacy Stored</span>
          <p className="text-[12px] text-[var(--text-muted-alt)] leading-relaxed">No signups, no cloud sync. All statistics, settings, and runs databases are kept local on your machine.</p>
        </div>
      </div>
    </div>
  );
}
