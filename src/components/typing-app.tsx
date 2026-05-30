'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { List, Moon, RefreshCw, Volume2, VolumeX, LayoutGrid, AlertTriangle, TrendingUp, Sparkles, Settings, Trophy, Clock, BookOpen, Check, FileText, Keyboard, Info, Sliders, Palette, Globe } from 'lucide-react';
import { StatsWidget } from '@/components/stats-widget';
import { SettingsPanel } from '@/components/settings-panel';
import { StatsDashboard, TestRecord } from '@/components/stats-dashboard';
import { TypingArena } from '@/components/typing-arena';
import { WpmChart } from '@/components/wpm-chart';
import { LANGUAGES } from '@/lib/languages';
import { TypingAudioSynthesizer } from '@/lib/synth';
import { useTypingConfig } from '@/hooks/use-typing-config';
import { useTypingEngine } from '@/hooks/use-typing-engine';

interface TypingAppProps {
  seoTitle?: string;
  seoDescription?: string;
}

export function TypingApp({ seoTitle, seoDescription }: TypingAppProps) {
  const config = useTypingConfig();
  const {
    currentTheme, setCurrentTheme,
    languageId, setLanguageId,
    fontId, setFontId,
    dimMode, setDimMode,
    cursorStyle, setCursorStyle,
    fontSize, setFontSize,
    isSoundOn, setIsSoundOn,
    switchProfile, setSwitchProfile,
    testMode, setTestMode,
    testTimeLimit, setTestTimeLimit,
    wordLimit, setWordLimit,
    customText, setCustomText,
    disableBackspace, setDisableBackspace,
    govtExamType, setGovtExamType,
    suddenDeath, setSuddenDeath,
    ghostWpm, setGhostWpm,
    includePunctuation, setIncludePunctuation,
    includeNumbers, setIncludeNumbers,
    showSpeedometer, setShowSpeedometer,
    synth,
    saveConfig
  } = config;

  const engine = useTypingEngine(config);
  const {
    targetText, author, title,
    gameState, timeLeft, resetCounter,
    wpm, rawWpm, accuracy, rawAccuracy, liveWpm,
    missedKeys, wpmHistory, rawWpmHistory, timeHistory,
    testHistory, examScore,
    resetTest, startTest, completeTest, handleProgress, loadMoreZenWords, handleKeystroke, handleClearHistory
  } = engine;

  // View state and practice filters
  const [viewState, setViewState] = useState<'home' | 'typing'>('typing');

  // Drawers presentation states
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [mobileConfigOpen, setMobileConfigOpen] = useState<boolean>(false);

  // Handle sound status updates
  const toggleSound = () => {
    const nextState = !isSoundOn;
    setIsSoundOn(nextState);
    if (synth) synth.enabled = nextState;
    saveConfig({ soundEnabled: nextState });
  };

  // Handle dimmer theme switch updates
  const toggleDimMode = () => {
    const nextState = !dimMode;
    setDimMode(nextState);
    saveConfig({ dimMode: nextState });
  };

  // Get Top Missed Keys array sorted by frequency
  const getSortedMissedKeys = () => {
    return Object.entries(missedKeys)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  // Calculate customized practice recommendations based on metrics
  const getPracticeTip = () => {
    const accNum = parseFloat(accuracy);
    const sorted = getSortedMissedKeys();
    
    if (accNum < 90) {
      return "Accuracy is low (below 90%). Slow down your pace by 10-15 WPM and concentrate on fluid key strokes. Accuracy will organically translate into velocity.";
    }
    
    if (sorted.length > 0) {
      const topKeys = sorted.map(k => `"${k[0] === ' ' ? 'Spacebar' : k[0]}"`).join(', ');
      return `Targeted Fatigue: You had frequent misses on ${topKeys}. Make sure your hands are centered in the home-row position and extend your fingers steadily without rushing.`;
    }
    
    if (accNum >= 96 && wpm > 40) {
      return "Flawless accuracy! Your muscle memory is highly optimized. In your next run, focus on pushing your speed boundaries and testing your raw WPM limit.";
    }
    
    return "Great effort! Focus on typing words as complete units rather than letter-by-letter to develop rhythmic keystrokes.";
  };

  const sortedMisses = getSortedMissedKeys();

  const isFullScreenView = viewState === 'typing' && gameState !== 'completed';

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center p-2 md:p-5 overflow-x-hidden font-sans select-none">
      <h1 className="sr-only">Typing Test - Check Your WPM Typing Speed Online</h1>
      
      {/* Mobile Keyboard Warning */}
      <div className="md:hidden w-full max-w-[1080px] mb-2 p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] font-mono rounded-lg text-center leading-tight">
        For the best experience and most accurate WPM, please use a physical keyboard.
      </div>


      {/* ================= UNIFIED APP WINDOW CONTAINER (Image 2 style) ================= */}
      <div className={`app-card-container w-full max-w-[1080px] bg-transparent border-none rounded-none p-6 md:p-8 shadow-none z-10 flex flex-col justify-between relative transition-all duration-300 ${
        isFullScreenView ? 'h-[calc(100vh-40px)]' : 'min-h-[580px]'
      }`}>
        
        {viewState === 'home' ? (
          /* ==========================================================================
             LANDING HOME VIEW
             ========================================================================== */
          <div className="flex flex-col gap-8 animate-fadeIn w-full">
            {/* Header control row */}
            <header className="flex items-center justify-between w-full border-b border-[var(--border-subtle)] pb-4">
              <div className="flex flex-col text-left">
                <div className="text-[26px] font-bold text-[var(--text-main)] leading-none font-sans flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[var(--accent-color)]" />
                  Centerville
                </div>
                <span className="text-[10px] font-bold text-[var(--accent-color)] uppercase tracking-[0.25em] mt-1.5">Typing Master Hub</span>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleSound}
                  className={`nav-btn cursor-pointer ${isSoundOn ? 'sound-active' : ''}`} 
                  title="Toggle mechanical key clicks"
                >
                  {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  <span className="sound-status-dot"></span>
                </button>
                
                <button 
                  onClick={toggleDimMode}
                  className="nav-btn cursor-pointer" 
                  title="Toggle Dim Background"
                >
                  <Moon className="w-5 h-5" />
                </button>

                <div className="w-[1px] h-6 bg-white/10 mx-1"></div>

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border-active)] hover:border-[var(--accent-color)] bg-[var(--bg-panel)] text-[var(--text-main)] hover:text-white transition-all duration-300 cursor-pointer active:scale-95 shadow-sm text-[13px] font-semibold"
                  title="Open customizer settings"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => setIsDashboardOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--accent-color)]/30 bg-[var(--bg-panel)] hover:bg-black/85 hover:border-[var(--accent-color)] text-[var(--accent-color)] hover:text-white transition-all duration-300 cursor-pointer active:scale-95 shadow-md text-[13px] font-semibold"
                  title="Open profile performance history"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
              </div>
            </header>

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

            {/* Configuration Bar */}
            <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-[12px] font-bold text-[var(--text-muted-alt)] uppercase tracking-wider">Configure Practice:</span>
                
                <button
                  onClick={() => {
                    const next = !includePunctuation;
                    setIncludePunctuation(next);
                    saveConfig({ includePunctuation: next });
                    resetTest();
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
                    resetTest();
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
                            resetTest();
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
                            resetTest();
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

            {/* Practice Modes Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Timed Card */}
              <button
                onClick={() => {
                  setTestMode('time');
                  saveConfig({ testMode: 'time' });
                  setTimeout(resetTest, 50);
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
                  <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Timed Mode</h4>
                  <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed">Race against the timer. Choose from 15s to 120s intervals.</p>
                </div>
                {testMode === 'time' && (
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping" />
                )}
              </button>

              {/* Words Card */}
              <button
                onClick={() => {
                  setTestMode('words');
                  saveConfig({ testMode: 'words' });
                  setTimeout(resetTest, 50);
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
                  <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Words Mode</h4>
                  <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed">No countdown stress. Type a fixed volume of random words.</p>
                </div>
                {testMode === 'words' && (
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping" />
                )}
              </button>

              {/* Quotes Card */}
              <button
                onClick={() => {
                  setTestMode('quotes');
                  saveConfig({ testMode: 'quotes' });
                  setTimeout(resetTest, 50);
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
                  <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Quote Mode</h4>
                  <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed">Practice with real literature sentences and historical records.</p>
                </div>
                {testMode === 'quotes' && (
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping" />
                )}
              </button>

              {/* Custom Card */}
              <button
                onClick={() => {
                  setTestMode('custom');
                  saveConfig({ testMode: 'custom' });
                  setTimeout(resetTest, 50);
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
                  <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Custom Mode</h4>
                  <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed">Paste your own paragraphs, code syntax, or word lists.</p>
                </div>
                {testMode === 'custom' && (
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping" />
                )}
              </button>

              {/* Zen Practice Card */}
              <button
                onClick={() => {
                  setTestMode('zen');
                  saveConfig({ testMode: 'zen' });
                  setTimeout(resetTest, 50);
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
                  <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Zen Mode</h4>
                  <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed">Indefinite, stress-free training. Complete the session whenever you want.</p>
                </div>
                {testMode === 'zen' && (
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping" />
                )}
              </button>

              {/* Weak Keys Card */}
              <button
                onClick={() => {
                  setTestMode('weak-keys');
                  saveConfig({ testMode: 'weak-keys' });
                  setTimeout(resetTest, 50);
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
                  <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Weak Keys Practice</h4>
                  <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed">Targeted muscle memory. Generates paragraphs focusing on your missed keys.</p>
                </div>
                {testMode === 'weak-keys' && (
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping" />
                )}
              </button>
            </div>

            {/* Actions CTA Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
              <button
                onClick={() => {
                  resetTest();
                  setViewState('typing');
                }}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--accent-color)] hover:bg-white text-black font-extrabold text-[14px] tracking-wide transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)] active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Practice Test</span>
              </button>
              
              <button
                onClick={() => setIsDashboardOpen(true)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--border-active)] hover:border-[var(--border-active)] bg-[var(--bg-panel)] text-[var(--text-main)] hover:text-white font-semibold text-[13px] tracking-wide transition-all duration-300 cursor-pointer active:scale-95"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Open Performance Profile</span>
              </button>
            </div>

            {/* Feature Spotlight Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 border-t border-[var(--border-subtle)] pt-6 text-left">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11.5px] font-bold text-[var(--text-muted-alt)] uppercase tracking-wider">Acoustic Audio</span>
                <p className="text-[12px] text-[var(--text-muted-alt)] leading-relaxed">Synthetic Cherry MX switches play actual keycaps clicking, tactile clicks, and error buzzers on the fly.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11.5px] font-bold text-[var(--text-muted-alt)] uppercase tracking-wider">Live Spline Curves</span>
                <p className="text-[12px] text-[var(--text-muted-alt)] leading-relaxed">Vector chart curves display raw WPM velocity and accuracy consistency over typing intervals.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11.5px] font-bold text-[var(--text-muted-alt)] uppercase tracking-wider">Error Coaching</span>
                <p className="text-[12px] text-[var(--text-muted-alt)] leading-relaxed">We record character mistypes and generate personalized coaching recommendations for your hands.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11.5px] font-bold text-[var(--text-muted-alt)] uppercase tracking-wider">100% Privacy Stored</span>
                <p className="text-[12px] text-[var(--text-muted-alt)] leading-relaxed">No signups, no cloud sync. All statistics, settings, and runs databases are kept local on your machine.</p>
              </div>
            </div>
          </div>
        ) : gameState === 'completed' ? (
          /* ==========================================================================
             RESULTS VIEW AFTER TEST COMPLETION (Detailed analytics layout)
             ========================================================================== */
          <article className="flex flex-col gap-6 animate-fadeIn w-full">
            {/* Results Title Banner */}
            <header className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-5">
              <div>
                <h2 className="text-3xl font-bold text-[var(--accent-color)] flex items-center gap-2">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  Test Completed!
                </h2>
                <p className="text-[13px] text-[var(--text-muted)] mt-1">Here is your detailed performance breakdown.</p>
              </div>

              {/* Quick Preset Theme Selection */}
              <div className="flex gap-2 items-center">
                <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mr-2 hidden sm:inline">Theme</span>
                {[
                  { id: 'carbon', bg: '#282a2d', accent: '#e2b714' },
                  { id: 'midnight', bg: '#0b0f19', accent: '#6366f1' },
                  { id: 'dracula', bg: '#282a36', accent: '#ff79c6' },
                  { id: 'matrix', bg: '#000000', accent: '#00ff00' },
                  { id: '8008', bg: '#333a45', accent: '#f44c7f' },
                  { id: 'cyberpunk', bg: '#120917', accent: '#ec4899' },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setCurrentTheme(theme.id);
                      saveConfig({ currentTheme: theme.id });
                    }}
                    className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${
                      currentTheme === theme.id ? 'border-[var(--accent-color)] scale-110 shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]' : 'border-transparent hover:border-[var(--border-active)]'
                    }`}
                    style={{ backgroundColor: theme.bg }}
                    title={`${theme.id.charAt(0).toUpperCase() + theme.id.slice(1)} Theme`}
                    aria-label={`${theme.id} Theme selection`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full m-auto" style={{ backgroundColor: theme.accent }} />
                  </button>
                ))}
              </div>
            </header>

            {/* Metrics & Analytics Grid */}
            {testMode === 'govt-exam' && examScore ? (
              /* ==========================================================================
                 GOVERNMENT EXAM DETAILED SCORECARD
                 ========================================================================== */
              <div className="flex flex-col gap-6 w-full animate-fadeIn">
                {/* Highlight Pass/Fail Header Banner */}
                <div 
                  className={`w-full p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${
                    examScore.status === 'PASSED' 
                      ? 'border-emerald-500/30 bg-emerald-500/[0.03] text-emerald-400' 
                      : 'border-rose-500/30 bg-rose-500/[0.03] text-rose-400'
                  }`}
                >
                  <div className="text-left">
                    <h2 className="text-xl font-bold font-mono tracking-tight uppercase flex items-center gap-2">
                      {examScore.status === 'PASSED' ? '✓ examination qualified' : '✗ examination disqualified'}
                    </h2>
                    <p className="text-xs text-[var(--text-muted-alt)] mt-1">
                      Evaluated on {examScore.examType} parameters: speed target of {examScore.speedTarget} Net WPM and error ceiling of {examScore.errorThreshold}%.
                    </p>
                  </div>
                  <div 
                    className={`px-6 py-2 rounded-full font-black text-sm tracking-widest border font-mono ${
                      examScore.status === 'PASSED' 
                        ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-400 animate-pulse' 
                        : 'border-rose-500/50 bg-rose-950/40 text-rose-400'
                    }`}
                  >
                    {examScore.status}
                  </div>
                </div>

                {/* Scorecard grid numbers */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl p-4 flex flex-col justify-center text-left">
                    <span className="text-[10px] text-[var(--text-muted-alt)] uppercase tracking-widest font-mono">Net Speed</span>
                    <span className="text-3xl font-extrabold text-white mt-1 font-mono">
                      {examScore.netWpm} <span className="text-xs text-[var(--text-muted-alt)]">WPM</span>
                    </span>
                  </div>
                  <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl p-4 flex flex-col justify-center text-left">
                    <span className="text-[10px] text-[var(--text-muted-alt)] uppercase tracking-widest font-mono">Gross Speed</span>
                    <span className="text-3xl font-extrabold text-white mt-1 font-mono">
                      {examScore.grossWpm} <span className="text-xs text-[var(--text-muted-alt)]">WPM</span>
                    </span>
                  </div>
                  <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl p-4 flex flex-col justify-center text-left">
                    <span className="text-[10px] text-[var(--text-muted-alt)] uppercase tracking-widest font-mono">Key Depressions</span>
                    <span className="text-3xl font-extrabold text-white mt-1 font-mono">
                      {examScore.grossKeystrokes} <span className="text-[10px] text-[var(--text-muted-alt)]">keys</span>
                    </span>
                  </div>
                  <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl p-4 flex flex-col justify-center text-left">
                    <span className="text-[10px] text-[var(--text-muted-alt)] uppercase tracking-widest font-mono">Weighted Error Rate</span>
                    <span className="text-3xl font-extrabold mt-1 font-mono" style={{ color: parseFloat(examScore.errorPercentage) <= examScore.errorThreshold ? 'var(--accent-color)' : '#ef4444' }}>
                      {examScore.errorPercentage}%
                    </span>
                  </div>
                </div>

                {/* Detailed Mistakes Log */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {/* Left: Full Mistakes (Omissions/Additions) */}
                  <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-5 flex flex-col gap-3 max-h-[220px] overflow-y-auto">
                    <h3 className="text-xs font-bold text-[var(--text-muted-alt)] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      Full Mistakes ({examScore.fullMistakes} count)
                    </h3>
                    {examScore.fullDetails.length > 0 ? (
                      <ul className="text-xs font-mono space-y-1.5 text-[var(--text-muted-alt)] list-disc list-inside">
                        {examScore.fullDetails.slice(0, 15).map((detail: string, idx: number) => (
                          <li key={idx} className="hover:text-white transition-colors">{detail}</li>
                        ))}
                        {examScore.fullDetails.length > 15 && (
                          <li className="text-[10px] text-[var(--text-muted-alt)] italic list-none">...and {examScore.fullDetails.length - 15} more full errors</li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-xs text-emerald-400 font-mono italic">No full omissions or additions logged.</p>
                    )}
                  </div>

                  {/* Right: Half Mistakes (Capitalization/Spacing) */}
                  <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-5 flex flex-col gap-3 max-h-[220px] overflow-y-auto">
                    <h3 className="text-xs font-bold text-[var(--text-muted-alt)] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Half Mistakes ({examScore.halfMistakes} count = {examScore.halfMistakes * 0.5} weighted)
                    </h3>
                    {examScore.halfDetails.length > 0 ? (
                      <ul className="text-xs font-mono space-y-1.5 text-[var(--text-muted-alt)] list-disc list-inside">
                        {examScore.halfDetails.slice(0, 15).map((detail: string, idx: number) => (
                          <li key={idx} className="hover:text-white transition-colors">{detail}</li>
                        ))}
                        {examScore.halfDetails.length > 15 && (
                          <li className="text-[10px] text-[var(--text-muted-alt)] italic list-none">...and {examScore.halfDetails.length - 15} more half errors</li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-xs text-emerald-400 font-mono italic">No casing or formatting errors logged.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* ==========================================================================
                 STANDARD RESULTS PANEL
                 ========================================================================== */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* Stats Breakdown Card */}
                <section className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-5 flex flex-col justify-between gap-4">
                  <h3 className="text-[13px] font-semibold text-[var(--text-muted-alt)] uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[var(--accent-color)]" />
                    Speed & Accuracy
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <div className="text-[11px] text-[var(--text-muted-alt)] uppercase tracking-wider">Correct Speed</div>
                      <div className="text-4xl font-bold text-white flex items-baseline leading-none mt-1">
                        <span>{wpm}</span>
                        <span className="text-[12px] text-[var(--text-muted-alt)] ml-1">WPM</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[var(--text-muted-alt)] uppercase tracking-wider">Raw Speed</div>
                      <div className="text-4xl font-bold text-white flex items-baseline leading-none mt-1">
                        <span>{rawWpm}</span>
                        <span className="text-[12px] text-[var(--text-muted-alt)] ml-1">WPM</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[var(--text-muted-alt)] uppercase tracking-wider">Accuracy</div>
                      <div className="text-4xl font-bold text-white flex items-baseline leading-none mt-1">
                        <span>{accuracy}</span>
                        <span className="text-[16px] text-[var(--text-muted-alt)] ml-0.5">%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[var(--text-muted-alt)] uppercase tracking-wider">Duration Taken</div>
                      <div className="text-4xl font-bold text-white flex items-baseline leading-none mt-1">
                        <span>{testMode === 'time' ? testTimeLimit : timeLeft}</span>
                        <span className="text-[12px] text-[var(--text-muted-alt)] ml-1">s</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Error Suggestions / Key Analysis panel */}
                <section className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-5 flex flex-col justify-between gap-4">
                  <h3 className="text-[13px] font-semibold text-[var(--text-muted-alt)] uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[var(--accent-color)]" />
                    Key Error Analysis
                  </h3>

                  {/* Missed keys breakdown */}
                  <div className="text-left">
                    <div className="text-[11px] text-[var(--text-muted-alt)] uppercase tracking-wider">Frequently Missed Keys</div>
                    {sortedMisses.length > 0 ? (
                      <div className="flex gap-3 mt-2">
                        {sortedMisses.map(([key, count]) => (
                          <div 
                            key={key} 
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black border border-[var(--border-subtle)] font-mono text-[13px] text-white"
                          >
                            <span className="bg-white/10 px-1.5 py-0.5 rounded font-bold text-[var(--accent-color)]">
                              {key === ' ' ? 'Space' : key}
                            </span>
                            <span className="text-[var(--text-muted-alt)] text-[11px]">x{count}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[13px] text-emerald-400 font-medium mt-2 animate-pulse">Perfect run! No character mistakes logged.</p>
                    )}
                  </div>

                  {/* Suggestions tips text */}
                  <div className="border-t border-[var(--border-subtle)] pt-3 text-left">
                    <div className="text-[11px] text-[var(--text-muted-alt)] uppercase tracking-wider">Coaching Recommendation</div>
                    <p className="text-[12.5px] text-[var(--text-main)] leading-relaxed mt-1.5 font-sans">
                      {getPracticeTip()}
                    </p>
                  </div>
                </section>

              </div>
            )}

            {/* WPM Spline History Chart in results */}
            <section className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-5 flex flex-col gap-3">
              <h3 className="text-[13px] font-semibold text-[var(--text-muted-alt)] uppercase tracking-wider">Speed Progression Curve</h3>
              <div className="relative w-full h-[150px]">
                <WpmChart
                  wpmHistory={wpmHistory}
                  rawWpmHistory={rawWpmHistory}
                  timeHistory={timeHistory}
                  testTimeLimit={testMode === 'time' ? testTimeLimit : timeLeft}
                  currentTheme={currentTheme}
                />
              </div>
            </section>

            {/* Results Bottom Restart Actions */}
            <div className="flex justify-center mt-3">
              <button
                onClick={resetTest}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-[var(--border-active)] bg-[var(--accent-color)] hover:bg-white text-black font-bold transition-all duration-300 cursor-pointer shadow-lg active:scale-95 text-[14px]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Restart Practice Test</span>
              </button>
            </div>
          </article>
        ) : (
          /* ==========================================================================
             MAIN TYPING TEST LAYOUT VIEW (Focused typing mode)
             ========================================================================= */
          <div className="flex flex-col justify-between items-center flex-1 animate-fadeIn w-full min-h-0">
            
            {/* Header control row (fades out when typing) */}
            <header 
              className={`flex items-center justify-between w-full transition-opacity duration-500 mb-6 md:mb-10 ${
                gameState === 'running' 
                  ? (testMode === 'govt-exam' ? 'hidden' : 'opacity-0 pointer-events-none') 
                  : 'opacity-100'
              }`} 
              id="focused-header"
            >
              {/* Left: Brand name logo & navigation menu */}
              <div className="flex items-center gap-3 md:gap-6">
                <div 
                  className="flex items-center gap-1.5 md:gap-2.5 cursor-pointer select-none group"
                  onClick={resetTest}
                >
                  <Keyboard className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent-color)] transition-transform duration-300 group-hover:scale-110" />
                  <div className="text-xl md:text-2xl font-black text-[var(--text-main)] lowercase tracking-tight leading-none">
                    centerville
                  </div>
                </div>

                {/* Flat text / icon navigation menu (Monkeytype style) */}
                <nav className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-semibold text-[var(--text-muted)] font-mono">
                  <button 
                    onClick={resetTest}
                    className="flex items-center gap-1 hover:text-[var(--text-main)] transition-colors cursor-pointer"
                    title="Start Typing Practice"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">start</span>
                  </button>

                  <button 
                    onClick={() => setIsDashboardOpen(true)}
                    className="flex items-center gap-1 hover:text-[var(--text-main)] transition-colors cursor-pointer"
                    title="Open Dashboard"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">dashboard</span>
                  </button>

                  <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center gap-1 hover:text-[var(--text-main)] transition-colors cursor-pointer"
                    title="Open Settings"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">settings</span>
                  </button>
                </nav>
              </div>

              {/* Right: Customization buttons & Status */}
              <div className="flex items-center gap-1 md:gap-3">
                {/* Quick Theme Toggle */}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                  title="Change Theme"
                  aria-label="Change Theme"
                >
                  <Palette className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                {/* Language Toggle Placeholder / Replacement */}
                <div className="flex items-center gap-1"></div>

                {/* Mobile Config Toggle */}
                <button 
                  onClick={() => setMobileConfigOpen(!mobileConfigOpen)}
                  className={`md:hidden cursor-pointer transition-colors p-1.5 ${mobileConfigOpen ? 'text-[var(--accent-color)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                  title="Toggle Test Configuration"
                >
                  <Sliders className="w-5 h-5" />
                </button>

                {/* Sound Toggle */}
                <button 
                  onClick={toggleSound}
                  className="cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors relative flex items-center justify-center p-1.5" 
                  title="Toggle mechanical key clicks"
                >
                  {isSoundOn ? <Volume2 className="w-5 h-5 text-[var(--accent-color)]" /> : <VolumeX className="w-5 h-5" />}
                </button>
                
                {/* Dim Mode Toggle */}
                <button 
                  onClick={toggleDimMode}
                  className="cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1.5" 
                  title="Toggle Dim Background"
                >
                  <Moon className={`w-5 h-5 ${dimMode ? 'text-[var(--accent-color)]' : ''}`} />
                </button>
              </div>
            </header>

            {/* Horizontal Monkeytype-style Config Bar centered above the typing box */}
            <div 
              className={`flex flex-col items-center justify-center w-full transition-opacity duration-500 mb-6 md:mb-8 ${
                gameState === 'running' 
                  ? (testMode === 'govt-exam' ? 'hidden' : 'opacity-0 pointer-events-none') 
                  : 'opacity-100'
              }`} 
              id="monkeytype-config-bar"
            >
              <div className={`flex-col md:flex-row items-center gap-3 md:gap-4 bg-[var(--bg-widget)] border border-[var(--border-widget)] shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md p-3 md:px-5 md:py-2 rounded-xl text-[11px] md:text-[12px] font-mono text-[var(--text-muted)] select-none w-full md:w-auto transition-all duration-300 origin-top ${mobileConfigOpen ? 'flex animate-in fade-in slide-in-from-top-2' : 'hidden md:flex'}`}>
                {/* Modifiers (Punctuation, Numbers) */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const next = !includePunctuation;
                      setIncludePunctuation(next);
                      saveConfig({ includePunctuation: next });
                    }}
                    className={`hover:text-[var(--text-main)] transition-colors cursor-pointer ${
                      includePunctuation ? 'text-[var(--accent-color)] font-bold' : ''
                    }`}
                  >
                    <span>punctuation</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      const next = !includeNumbers;
                      setIncludeNumbers(next);
                      saveConfig({ includeNumbers: next });
                    }}
                    className={`hover:text-[var(--text-main)] transition-colors cursor-pointer ${
                      includeNumbers ? 'text-[var(--accent-color)] font-bold' : ''
                    }`}
                  >
                    <span>numbers</span>
                  </button>
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-[1px] h-4 bg-white/10" />

                {/* Test Modes */}
                <div className="flex flex-wrap justify-center items-center gap-3 md:gap-3">
                  {(['time', 'words', 'quotes', 'zen', 'weak-keys', 'govt-exam', 'custom'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setTestMode(mode);
                        saveConfig({ testMode: mode });
                      }}
                      className={`hover:text-[var(--text-main)] transition-colors cursor-pointer lowercase ${
                        testMode === mode ? 'text-[var(--accent-color)] font-bold' : ''
                      }`}
                    >
                      {mode === 'weak-keys' ? 'weak keys' : mode === 'govt-exam' ? 'govt exam' : mode}
                    </button>
                  ))}
                </div>

                {/* Suboptions Divider & Display */}
                {((testMode === 'time' || testMode === 'words' || testMode === 'govt-exam') && (
                  <>
                    <div className="hidden md:block w-[1px] h-4 bg-white/10" />
                    <div className="flex flex-wrap justify-center items-center gap-2">
                      {testMode === 'time' &&
                        ([15, 30, 60, 120] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => {
                              setTestTimeLimit(t);
                              saveConfig({ testTimeLimit: t });
                            }}
                            className={`hover:text-[var(--text-main)] transition-colors cursor-pointer ${
                              testTimeLimit === t ? 'text-[var(--accent-color)] font-bold' : ''
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      
                      {testMode === 'words' &&
                        ([10, 25, 50, 100] as const).map((w) => (
                          <button
                            key={w}
                            onClick={() => {
                              setWordLimit(w);
                              saveConfig({ wordLimit: w });
                            }}
                            className={`hover:text-[var(--text-main)] transition-colors cursor-pointer ${
                              wordLimit === w ? 'text-[var(--accent-color)] font-bold' : ''
                            }`}
                          >
                            {w}
                          </button>
                        ))}

                      {testMode === 'govt-exam' && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {(['ssc-chsl', 'ssc-cgl', 'state-clerk'] as const).map((type) => (
                              <button
                                key={type}
                                onClick={() => {
                                  setGovtExamType(type);
                                  saveConfig({ govtExamType: type });
                                }}
                                className={`hover:text-[var(--text-main)] transition-colors cursor-pointer uppercase ${
                                  govtExamType === type ? 'text-[var(--accent-color)] font-bold' : ''
                                }`}
                              >
                                {type === 'ssc-chsl' ? 'chsl' : type === 'ssc-cgl' ? 'cgl' : 'clerk'}
                              </button>
                            ))}
                          </div>
                          <div className="w-[1px] h-3 bg-white/10" />
                          <button
                            onClick={() => {
                              const next = !disableBackspace;
                              setDisableBackspace(next);
                              saveConfig({ disableBackspace: next });
                            }}
                            className={`hover:text-[var(--text-main)] transition-colors cursor-pointer font-sans text-[11px] ${
                              disableBackspace ? 'text-rose-400 font-bold' : 'text-[var(--text-muted-alt)]'
                            }`}
                            title={disableBackspace ? "Backspace is Disabled (Exam Rules)" : "Backspace is Enabled"}
                          >
                            <span>backspace: {disableBackspace ? 'blocked' : 'allowed'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ))}

                {testMode === 'custom' && (
                  <>
                    <div className="w-[1px] h-4 bg-white/10" />
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="hover:text-[var(--text-main)] text-[var(--accent-color)] font-bold transition-colors cursor-pointer lowercase"
                    >
                      edit custom
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Giant Centered Timer / Word Counter & Speedometer */}
            <div className={`flex items-center justify-center gap-16 mb-6 min-h-[110px] ${testMode === 'govt-exam' ? 'hidden' : ''}`} id="focused-timer-row">
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center animate-fadeIn">
                  <div className="text-[64px] font-bold text-[var(--text-timer)] font-mono tracking-tighter leading-none">
                    {testMode === 'time'
                      ? (timeLeft < 10 ? `0${timeLeft}` : timeLeft)
                      : testMode === 'zen'
                        ? '∞'
                        : `${timeLeft}s`
                    }
                  </div>
                  {/* Optional Words Mode indicator */}
                  {testMode === 'words' && (
                    <span className="text-[11px] text-[var(--text-muted-alt)] font-medium mt-1 font-mono uppercase tracking-wider">
                      Target: {wordLimit} words
                    </span>
                  )}
                </div>
              </div>

              {/* Speedometer circular gauge */}
              {showSpeedometer && gameState === 'running' && (
                <div className="relative flex items-center justify-center animate-fadeIn">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      className="stroke-[var(--border-active)]"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      className="transition-all duration-300 ease-out"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 36}
                      strokeDashoffset={2 * Math.PI * 36 * (1 - Math.min(1, liveWpm / 120))}
                      strokeLinecap="round"
                      style={{
                        filter: liveWpm >= 80 ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))' : liveWpm >= 40 ? 'drop-shadow(0 0 6px rgba(var(--accent-rgb), 0.5))' : 'none',
                        stroke: liveWpm >= 80 ? '#f59e0b' : 'var(--accent-color)'
                      }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold text-[var(--text-main)] leading-none font-mono">
                      {liveWpm}
                    </span>
                    <span className="text-[8px] font-bold text-[var(--text-muted-alt)] uppercase tracking-widest mt-1">
                      WPM
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Centered Typing Arena */}
            <div className="w-full flex-1 flex flex-col justify-center mb-6 min-h-0">
              <TypingArena
                targetText={targetText}
                author={author}
                title={title}
                fontSize={fontSize}
                fontFamily={LANGUAGES.find(l => l.id === languageId)?.fonts.find(f => f.id === fontId)?.fontFamily || 'monospace'}
                cursorStyle={cursorStyle}
                synth={synth}
                gameState={gameState}
                onStart={startTest}
                onComplete={completeTest}
                onKeystroke={handleKeystroke}
                onProgress={handleProgress}
                resetCounter={resetCounter}
                testMode={testMode}
                onLoadMoreWords={loadMoreZenWords}
                disableBackspace={disableBackspace}
                timeLeft={timeLeft}
                liveWpm={liveWpm}
                ghostWpm={ghostWpm}
                language={languageId}
              />
            </div>

            {/* Centered Restart / Finish Actions */}
            <div 
              className={`flex flex-col items-center justify-center gap-2 ${
                gameState === 'running' && testMode !== 'zen' && testMode !== 'govt-exam' ? 'hidden' : 'mt-6'
              }`}
            >
              {/* Restart actions - hidden when running */}
              <div className={`flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                gameState === 'running' ? 'hidden' : 'flex opacity-100'
              }`}>
                <button
                  onClick={resetTest}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-widget)] hover:bg-white/10 text-[var(--accent-color)] transition-all cursor-pointer active:scale-90"
                  title="Restart Test (Esc)"
                >
                  <RefreshCw className="w-4 h-4 transition-transform duration-500 hover:rotate-180" />
                </button>
                
                <div className="text-[11px] text-[var(--text-muted)] font-mono">
                  Press <kbd className="bg-black/35 border border-[var(--border-active)] rounded px-1.5 py-0.5 text-[var(--accent-color)]">Esc</kbd> to restart
                </div>
              </div>

              {/* Finish/Submit actions - visible when running */}
              {(testMode === 'zen' || testMode === 'govt-exam') && gameState === 'running' && (
                <button
                  onClick={completeTest}
                  className="flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-[var(--accent-color)]/30 bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)] text-[var(--accent-color)] hover:text-black font-extrabold transition-all duration-300 cursor-pointer shadow-lg active:scale-95 text-[13.5px] mt-4 animate-fadeIn"
                  title={testMode === 'govt-exam' ? "Submit Exam (Ctrl + Enter)" : "Finish Zen Practice (Ctrl + Enter)"}
                >
                  <Check className="w-4 h-4" />
                  <span>{testMode === 'govt-exam' ? "Submit and Evaluate Exam" : "Finish Practice Session"}</span>
                </button>
              )}
            </div>

          </div>
        )}

        {/* Footer matching Monkeytype style */}
        <footer 
          className={`flex items-center justify-between mt-8 pt-5 text-[11.5px] text-[var(--text-muted)] font-mono select-none w-full transition-opacity duration-500 ${
            gameState === 'running' 
              ? (testMode === 'govt-exam' ? 'hidden' : 'opacity-0 pointer-events-none') 
              : 'opacity-100'
          }`}
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 hover:text-[var(--text-main)] transition-colors cursor-pointer"
              title="Change Theme"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{currentTheme}</span>
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 hover:text-[var(--text-main)] transition-colors cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{LANGUAGES.find(l => l.id === languageId)?.name.split(' ')[0].toLowerCase() || 'english'}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4 hidden sm:flex">
            <div>&copy; 2026 centerville</div>
            <div className="w-1 h-1 rounded-full bg-slate-500 opacity-40"></div>
            <div>v2.2.0</div>
          </div>
        </footer>

      </div>

      {/* ================= SEO & INFORMATIONAL FOOTER (Below the Fold) ================= */}
      <section className={`w-full max-w-[1080px] mx-auto mt-16 mb-12 text-left font-sans transition-opacity duration-500 ${
        gameState === 'running' 
          ? (testMode === 'govt-exam' ? 'hidden' : 'opacity-0 pointer-events-none') 
          : 'opacity-100'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-subtle)]">
          <article>
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-3">{seoTitle || "About this Typing Test"}</h2>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-4">
              {seoDescription || "Centerville is a premium, minimalist typing speed test designed to help you improve your words per minute (WPM) and accuracy. Whether you are practicing for a government typing exam, learning to touch type, or just warming up your fingers for coding, our tool provides real-time feedback and detailed analytics."}
            </p>
            <h3 className="text-[14px] font-semibold text-[var(--text-main)] mt-6 mb-2">What is a good WPM?</h3>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
              An average typing speed is around 40 WPM. Speeds above 60 WPM are considered good for most administrative or data entry jobs. If you can type over 90 WPM, you are considered a fast typist, and speeds over 120 WPM are exceptional. Use our Ghost Pacer feature to constantly push your average up!
            </p>
          </article>
          <aside className="flex flex-col gap-6">
            <section>
              <h3 className="text-[14px] font-semibold text-[var(--text-main)] mb-2">Specialized Practice Modes</h3>
              <ul className="text-[13px] text-[var(--text-muted)] leading-relaxed space-y-3">
                <li><strong className="text-[var(--accent-color)]">Government Exam Mode:</strong> A strict split-screen mode with manual submission, simulating traditional data entry and clerk typing exams (like SSC). It calculates gross and net WPM using strict error penalty rules.</li>
                <li><strong className="text-[var(--accent-color)]">Weak Key Drills:</strong> Our engine tracks the exact keys you mistype across your sessions and generates custom paragraphs focusing specifically on your weakest fingers.</li>
                <li><strong className="text-[var(--accent-color)]">Sudden Death:</strong> For accuracy purists. The test instantly terminates if you make a single typo. Highly effective for building 100% precision.</li>
              </ul>
            </section>
          </aside>
        </div>
      </section>

      {/* Settings Drawer Panel overlay */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        languageId={languageId}
        onLanguageChange={(langId) => {
          setLanguageId(langId);
          saveConfig({ languageId: langId });
        }}
        fontId={fontId}
        onFontIdChange={(fId) => {
          setFontId(fId);
          saveConfig({ fontId: fId });
        }}
        // Theme
        currentTheme={currentTheme}
        onThemeChange={(theme) => {
          setCurrentTheme(theme);
          saveConfig({ currentTheme: theme });
        }}
        cursorStyle={cursorStyle}
        onCursorChange={(style) => {
          setCursorStyle(style);
          saveConfig({ cursorStyle: style });
        }}
        testTimeLimit={testTimeLimit}
        onTimeChange={(time) => {
          setTestTimeLimit(time);
          saveConfig({ testTimeLimit: time });
        }}
        wordLimit={wordLimit}
        onWordLimitChange={(limit) => {
          setWordLimit(limit);
          saveConfig({ wordLimit: limit });
        }}
        fontSize={fontSize}
        onFontSizeChange={(size) => {
          setFontSize(size);
          saveConfig({ fontSize: size });
        }}
        testMode={testMode}
        onModeChange={(mode) => {
          setTestMode(mode);
          saveConfig({ testMode: mode });
        }}
        switchProfile={switchProfile}
        onSwitchChange={(profile) => {
          setSwitchProfile(profile);
          saveConfig({ switchProfile: profile });
        }}
        customText={customText}
        onCustomTextChange={(text) => {
          setCustomText(text);
          saveConfig({ customText: text });
        }}
        includePunctuation={includePunctuation}
        onPunctuationChange={(val) => {
          setIncludePunctuation(val);
          saveConfig({ includePunctuation: val });
        }}
        includeNumbers={includeNumbers}
        onNumbersChange={(val) => {
          setIncludeNumbers(val);
          saveConfig({ includeNumbers: val });
        }}
        showSpeedometer={showSpeedometer}
        onShowSpeedometerChange={(val) => {
          setShowSpeedometer(val);
          saveConfig({ showSpeedometer: val });
        }}
        suddenDeath={suddenDeath}
        onSuddenDeathChange={(val) => {
          setSuddenDeath(val);
          saveConfig({ suddenDeath: val });
        }}
        ghostWpm={ghostWpm}
        onGhostWpmChange={(wpm) => {
          setGhostWpm(wpm);
          saveConfig({ ghostWpm: wpm });
        }}
      />

      {/* Stats Dashboard Drawer overlay */}
      <StatsDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        history={testHistory}
        onClearHistory={handleClearHistory}
      />

    </div>
  );
}
