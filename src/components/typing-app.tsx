'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { List, Moon, RefreshCw, Volume2, VolumeX, LayoutGrid, AlertTriangle, TrendingUp, Sparkles, Settings, Trophy, Clock, BookOpen, Check, FileText, Keyboard, Info, Sliders, Palette, Globe, Mail, Lock, DollarSign, MessageSquare, Shield, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { StatsWidget } from '@/components/stats-widget';
import { SettingsPanel } from '@/components/settings-panel';
import { StatsDashboard, TestRecord } from '@/components/stats-dashboard';
import { TypingArena } from '@/components/typing-arena';
import { WpmChart } from '@/components/wpm-chart';
import { LANGUAGES } from '@/lib/languages';
import { TypingAudioSynthesizer } from '@/lib/synth';
import { useTypingConfig } from '@/hooks/use-typing-config';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

import { AuthModal } from '@/components/views/auth-modal';
import { Lobby1v1View } from '@/components/views/lobby-1v1-view';
import { SphereView } from '@/components/views/sphere-view';
import { LeaderboardView } from '@/components/views/leaderboard-view';
import { ProfileView } from '@/components/views/profile-view';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
  </svg>
);

const renderAvatar = (url: string, sizeClass = "w-6 h-6") => {
  if (url && !url.includes('seed=Lakshayyyy') && !url.includes('seed=default')) {
    return (
      <div className={`${sizeClass} rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 overflow-hidden bg-zinc-900`}>
        <img src={url} alt="Avatar" className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`${sizeClass} rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 overflow-hidden bg-zinc-800`}>
      <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
      </svg>
    </div>
  );
};

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
    resetTest, startTest, completeTest, handleProgress, loadMoreZenWords, handleKeystroke, handleClearHistory,
    getCharacterStats
  } = engine;

  const router = useRouter();
  const { user: currentUser, logout, updateUser } = useAuth();

  // Routing and Auth states
  const [activeTab, setActiveTab] = useState<'test' | '1v1' | 'practice' | 'sphere' | 'ratings' | 'profile'>('test');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState<'test' | '1v1' | 'practice' | 'sphere' | 'ratings' | 'profile' | null>(null);
  const [typedLength, setTypedLength] = useState(0);
  const [showDetailed, setShowDetailed] = useState(false);

  // Auto-reset detailed results view on any test restart or status change
  useEffect(() => {
    setShowDetailed(false);
  }, [resetCounter, gameState]);

  // Sync typed length reset with engine resets
  useEffect(() => {
    setTypedLength(0);
  }, [resetCounter]);

  const customHandleProgress = (correctCount: number, typedLen: number, typedValue?: string) => {
    setTypedLength(typedLen);
    handleProgress(correctCount, typedLen, typedValue);
  };

  const handleTabClick = (tabId: 'test' | '1v1' | 'practice' | 'sphere' | 'ratings' | 'profile') => {
    const isLockedTab = ['1v1', 'sphere', 'ratings', 'profile'].includes(tabId);
    if (isLockedTab && !currentUser) {
      router.push('/login');
      return;
    }

    setActiveTab(tabId);
    if (tabId === 'test') {
      resetTest();
    }
  };

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

  const isFullScreenView = activeTab === 'test' && gameState !== 'completed';

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center p-2 md:p-5 overflow-x-hidden font-sans select-none">
      <h1 className="sr-only">Typing Test - Check Your WPM Typing Speed Online</h1>
      
      {/* Mobile Keyboard Warning */}
      <div className="md:hidden w-full max-w-[1380px] mb-2 p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] font-mono rounded-lg text-center leading-tight">
        For the best experience and most accurate WPM, please use a physical keyboard.
      </div>


      {/* ================= UNIFIED APP WINDOW CONTAINER ================= */}
      <div className={`app-card-container w-full max-w-[1380px] bg-transparent border-none rounded-none p-6 md:p-8 shadow-none z-10 flex flex-col justify-between relative transition-all duration-300 ${
        isFullScreenView ? 'h-[calc(100vh-40px)]' : 'min-h-[580px]'
      }`}>
        
        {/* Global Header (Fades out when racing in standard test, hidden in exam test) */}
        <header 
          className={`flex flex-col sm:flex-row items-center justify-between w-full transition-all duration-500 mb-6 md:mb-10 gap-4 border-b border-zinc-900 pb-5 ${
            activeTab === 'test' && (gameState === 'running' || (gameState === 'completed' && testMode !== 'govt-exam' && !showDetailed))
              ? 'opacity-0 pointer-events-none mb-0 h-0 overflow-hidden py-0 border-none' 
              : 'opacity-100'
          }`} 
          id="focused-header"
        >
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={() => handleTabClick('test')}
          >
            <svg className="w-5 h-5 text-white animate-pulse" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-6l2-7H5L3 15h6l-2 7 12-13z" />
            </svg>
            <div className="text-lg font-bold text-white tracking-tight leading-none font-sans">
              TypingThunder
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-zinc-500">
            {([
              { id: 'test', label: 'Speed Test' },
              { id: '1v1', label: 'Play 1 v 1' },
              { id: 'practice', label: 'Practice' },
              { id: 'sphere', label: 'Sphere' },
              { id: 'ratings', label: 'Ratings' }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`hover:text-white cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? 'text-white font-semibold'
                    : 'text-zinc-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Utilities & Profile */}
          <div className="flex items-center gap-5">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleTabClick('profile')}
                  className="flex items-center gap-2.5 text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <span className="text-sm font-medium text-zinc-300 tracking-tight">{currentUser.username}</span>
                  {renderAvatar(currentUser.avatarUrl, "w-7 h-7")}
                </button>
                <span className="text-zinc-800 text-xs select-none">|</span>
                <button
                  onClick={() => logout()}
                  className="text-zinc-500 hover:text-red-400 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => router.push('/signup')}
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold transition-all hover:bg-zinc-200 cursor-pointer shadow-[0_4px_14px_rgba(255,255,255,0.05)]"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer px-1 py-1"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </header>

        {/* Tab content Router */}
        <div className="flex-1 flex flex-col justify-between items-center w-full min-h-0">

          {activeTab === 'test' && (
            <div className="w-full flex-1 flex flex-col min-h-0">
              {gameState === 'completed' ? (
                /* ================= RESULTS SCORECARD ================= */
                <article className="flex flex-col items-center justify-center animate-fadeIn w-full py-8 text-center select-none font-sans">
                  {!showDetailed ? (
                    /* Simple Results view (mockup page 4) */
                    <div className="flex flex-col items-center justify-center w-full max-w-[800px] gap-12">
                      {/* Floating instruction pill */}
                      <div className="flex items-center gap-1 bg-[#1a1a1c] border border-zinc-800 rounded px-2.5 py-1.5 text-[11px] text-zinc-500 font-mono">
                        <span className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-400 mr-1">Shift</span>
                        <span>+</span>
                        <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 mx-1">R</span>
                        <span className="ml-1">: Restart Test</span>
                      </div>

                      {/* Floating progress line at 100% */}
                      <div className="w-full relative select-none mt-2">
                        <div className="absolute -top-12 right-0 flex flex-col items-center">
                          {renderAvatar(currentUser?.avatarUrl || '', "w-7 h-7")}
                          <span className="text-[10.5px] text-zinc-400 mt-1.5 font-medium tracking-tight">
                            {currentUser?.username || 'Lakshayyyy'}
                          </span>
                        </div>
                        <div className="relative pt-6">
                          <div className="w-full h-[2px] bg-white rounded-full" />
                          {/* Start Dot */}
                          <div className="absolute left-0 top-[21px] flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                            <span className="text-[10px] text-zinc-500 mt-2">Start</span>
                          </div>
                          {/* End Dot */}
                          <div className="absolute right-0 top-[21px] flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                            <span className="text-[10px] text-zinc-500 mt-2">End</span>
                          </div>
                        </div>
                      </div>

                      {/* Mockup Quote display with styled mistakes */}
                      <div className="text-[24px] text-zinc-600 font-mono text-left leading-relaxed max-w-[800px] mt-4 select-none break-words">
                        {targetText.split(' ').slice(0, 30).map((word, wordIdx) => {
                          const isBasedWord = word.toLowerCase().includes('based');
                          const isOnWord = word.toLowerCase() === 'on';
                          const isBasicWord = word.toLowerCase().includes('basic');
                          const isTextFieldsWord = word.toLowerCase().includes('text');
                          const isHandleWord = word.toLowerCase().includes('handle');
                          const isJustWord = word.toLowerCase().includes('just');
                          const isAWord = word.toLowerCase() === 'a';
                          const isAreWord = word.toLowerCase() === 'are';
                          const isEWord = word.toLowerCase() === 'here';

                          const highlightError = isBasedWord || isOnWord || isBasicWord || isTextFieldsWord || isHandleWord || isJustWord || isAWord || isAreWord || isEWord;

                          return (
                            <span key={wordIdx} className="inline-block mr-[0.3em]">
                              {word.split('').map((char, charIdx) => {
                                let colorClass = "text-zinc-600";
                                if (highlightError && Math.random() < 0.4) {
                                  colorClass = "text-[#ca4754]";
                                } else {
                                  colorClass = "text-[#d1d0c5]";
                                }
                                return (
                                  <span key={charIdx} className={colorClass}>
                                    {char}
                                  </span>
                                );
                              })}
                            </span>
                          );
                        })}
                        <span className="text-zinc-600 font-bold">.</span>
                      </div>

                      {/* Big three stats row */}
                      <div className="flex flex-row justify-center items-baseline gap-[60px] md:gap-[90px] font-sans mt-4">
                        <div className="flex flex-col items-start">
                          <span className="text-[14px] text-zinc-500 uppercase tracking-widest">WPM</span>
                          <span className="text-[64px] font-extrabold text-[#d1d0c5] leading-none mt-1 font-sans">{wpm}</span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-[14px] text-zinc-500 uppercase tracking-widest">Accuracy</span>
                          <span className="text-[64px] font-extrabold text-[#d1d0c5] leading-none mt-1 font-sans">
                            {Math.round(parseFloat(accuracy))}%
                          </span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-[14px] text-zinc-500 uppercase tracking-widest">Seconds</span>
                          <span className="text-[64px] font-extrabold text-[#d1d0c5] leading-none mt-1 font-sans">
                            {testMode === 'time' ? testTimeLimit : timeLeft}
                          </span>
                        </div>
                      </div>

                      {/* Simple Controls row */}
                      <div className="flex items-center justify-center gap-12 mt-6">
                        <button 
                          onClick={() => setShowDetailed(true)}
                          className="w-[108px] h-[56px] rounded-[30px] border-2 border-[#333333] hover:border-white bg-black shadow-[0_4px_8px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-300 text-zinc-400 hover:text-white cursor-pointer active:scale-95"
                          title="Show Detailed Results"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={resetTest}
                          className="w-[108px] h-[56px] rounded-[30px] border-2 border-[#333333] hover:border-white bg-black shadow-[0_4px_8px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-300 text-zinc-400 hover:text-white cursor-pointer active:scale-95"
                          title="Restart Test"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </button>
                        <button 
                          className="w-[108px] h-[56px] rounded-[30px] border-2 border-[#333333] hover:border-white bg-black shadow-[0_4px_8px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-300 text-zinc-400 hover:text-white cursor-pointer active:scale-95"
                          title="Share Results"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Toggle Link */}
                      <button 
                        onClick={() => setShowDetailed(true)}
                        className="text-[13px] text-zinc-500 hover:text-white cursor-pointer underline underline-offset-4 mt-2 transition-colors font-mono"
                      >
                        Show detailed results
                      </button>
                    </div>
                  ) : (
                    /* Detailed Scorecard View (mockup page 5) */
                    <div className="flex flex-col items-center justify-center w-full max-w-[960px] gap-10">
                      {/* Big three + raw metrics row */}
                      <div className="flex flex-wrap justify-center items-baseline gap-[60px] md:gap-[90px] font-sans">
                        <div className="flex flex-col items-start">
                          <span className="text-[14px] text-zinc-500 uppercase tracking-widest">WPM</span>
                          <span className="text-[64px] font-extrabold text-[#d1d0c5] leading-none mt-1 font-sans">{wpm}</span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-[14px] text-zinc-500 uppercase tracking-widest">Accuracy</span>
                          <span className="text-[64px] font-extrabold text-[#d1d0c5] leading-none mt-1 font-sans">
                            {Math.round(parseFloat(accuracy))}%
                          </span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-[14px] text-zinc-500 uppercase tracking-widest">Seconds</span>
                          <span className="text-[64px] font-extrabold text-[#d1d0c5] leading-none mt-1 font-sans">
                            {testMode === 'time' ? testTimeLimit : timeLeft}
                          </span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-[14px] text-zinc-500 uppercase tracking-widest">Raw</span>
                          <span className="text-[64px] font-extrabold text-[#d1d0c5] leading-none mt-1 font-sans">{rawWpm}</span>
                        </div>
                      </div>

                      {/* Character Breakdown Section */}
                      <div className="w-full flex flex-col items-start max-w-[800px] mt-6">
                        <h4 className="text-[16px] text-zinc-400 font-bold uppercase tracking-wider mb-4 font-sans">Characters</h4>
                        <div className="flex flex-row justify-between items-baseline w-full gap-[60px] md:gap-[90px] font-sans">
                          <div className="flex flex-col items-start">
                            <span className="text-[14px] text-zinc-500 uppercase tracking-widest">Correct</span>
                            <span className="text-[64px] font-extrabold text-[#d1d0c5] leading-none mt-1 font-sans">
                              {getCharacterStats().correct}
                            </span>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-[14px] text-zinc-500 uppercase tracking-widest">Incorrect</span>
                            <span className="text-[64px] font-extrabold text-[#d1d0c5] leading-none mt-1 font-sans">
                              {getCharacterStats().incorrect}
                            </span>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-[14px] text-zinc-500 uppercase tracking-widest">Extra</span>
                            <span className="text-[64px] font-extrabold text-[#d1d0c5] leading-none mt-1 font-sans">
                              {getCharacterStats().extra}
                            </span>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-[14px] text-zinc-500 uppercase tracking-widest">Missed</span>
                            <span className="text-[64px] font-extrabold text-[#d1d0c5] leading-none mt-1 font-sans">
                              {getCharacterStats().missed}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Simple Controls row */}
                      <div className="flex items-center justify-center gap-12 mt-6">
                        <button 
                          onClick={() => setShowDetailed(false)}
                          className="w-[108px] h-[56px] rounded-[30px] border-2 border-[#333333] hover:border-white bg-black shadow-[0_4px_8px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-300 text-zinc-400 hover:text-white cursor-pointer active:scale-95"
                          title="Back to Simple Results"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={resetTest}
                          className="w-[108px] h-[56px] rounded-[30px] border-2 border-[#333333] hover:border-white bg-black shadow-[0_4px_8px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-300 text-zinc-400 hover:text-white cursor-pointer active:scale-95"
                          title="Restart Test"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </button>
                        <button 
                          className="w-[108px] h-[56px] rounded-[30px] border-2 border-[#333333] hover:border-white bg-black shadow-[0_4px_8px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-300 text-zinc-400 hover:text-white cursor-pointer active:scale-95"
                          title="Share Results"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Coaching Coax link */}
                      <button 
                        onClick={resetTest}
                        className="text-[13px] text-zinc-500 hover:text-white cursor-pointer underline underline-offset-4 mt-2 transition-colors font-mono"
                      >
                        Login to save your result
                      </button>
                    </div>
                  )}
                </article>
              ) : (
                /* ================= TYPING RUN SCREEN ================= */
                <div className="flex flex-col justify-between items-center flex-1 animate-fadeIn w-full min-h-0 py-4">
                  
                  {/* Progress Track (Lakshayyyy floating avatar) */}
                  <div className="w-full max-w-[800px] mx-auto mt-4 mb-12 select-none relative">
                    {/* The floating user card */}
                    <div 
                      className="absolute -top-12 flex flex-col items-center transition-all duration-150 ease-out"
                      style={{ 
                        left: `${targetText.length > 0 ? Math.min(100, Math.max(0, (typedLength / targetText.length) * 100)) : 0}%`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      {renderAvatar(currentUser?.avatarUrl || '', "w-7 h-7")}
                      <span className="text-[10.5px] text-zinc-400 mt-1.5 font-sans font-medium tracking-tight">
                        {currentUser?.username || 'Lakshayyyy'}
                      </span>
                    </div>

                    {/* Track Line and Dots */}
                    <div className="relative pt-6">
                      <div className="w-full h-[2px] bg-zinc-800 rounded-full" />
                      
                      {/* Start Dot */}
                      <div className="absolute left-0 top-[21px] flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-zinc-600 border border-zinc-900" />
                        <span className="text-[10px] text-zinc-500 mt-2 font-sans">Start</span>
                      </div>

                      {/* End Dot */}
                      <div className="absolute right-0 top-[21px] flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-zinc-600 border border-zinc-900" />
                        <span className="text-[10px] text-zinc-500 mt-2 font-sans">End</span>
                      </div>
                    </div>
                  </div>

                  {/* Centered Typing Arena */}
                  <div className="w-full flex-1 flex flex-col justify-center mb-4 min-h-0 relative">
                    {/* Timer will be shown below TypingArena */}

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
                      onProgress={customHandleProgress}
                      resetCounter={resetCounter}
                      testMode={testMode}
                      onLoadMoreWords={loadMoreZenWords}
                      disableBackspace={disableBackspace}
                      timeLeft={timeLeft}
                      liveWpm={liveWpm}
                      ghostWpm={ghostWpm}
                      language={languageId}
                    />

                    {/* Active Timer Display Below Arena */}
                    {gameState === 'running' && testMode === 'time' && (
                      <div className="text-center mt-10 text-[18px] font-medium font-sans text-white tracking-wide">
                        Time Left: {timeLeft}
                      </div>
                    )}
                    {gameState === 'running' && testMode === 'words' && (
                      <div className="text-center mt-10 text-[18px] font-medium font-sans text-white tracking-wide">
                        Words Left: {Math.max(0, wordLimit - Math.floor(typedLength / 5))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Controls Pills (faded out when typing is active) */}
                  <div 
                    className={`flex flex-col items-center justify-center gap-4 transition-all duration-500 w-full mt-6 ${
                      gameState === 'running' 
                        ? 'opacity-0 pointer-events-none' 
                        : 'opacity-100'
                    }`}
                    id="monkeytype-config-bar"
                  >
                    <div className="flex flex-wrap items-center justify-center gap-5 font-mono text-[13px] text-zinc-500 select-none" id="speed-test-pills">
                      {/* Pill 1: Punctuation and Numbers */}
                      <div className="flex items-center h-[40px] p-[3px] rounded-full border border-[#1f1f22] bg-black select-none gap-[6px]">
                        <button 
                          onClick={() => {
                            const next = !includePunctuation;
                            setIncludePunctuation(next);
                            saveConfig({ includePunctuation: next });
                          }}
                          className={`relative z-10 w-[34px] h-[34px] rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer text-sm ${
                            includePunctuation 
                              ? 'bg-[#2c2c2f] text-white font-bold' 
                              : 'text-zinc-500 hover:text-white'
                          }`}
                          title="Toggle Punctuation"
                        >
                          @
                        </button>
                        <button 
                          onClick={() => {
                            const next = !includeNumbers;
                            setIncludeNumbers(next);
                            saveConfig({ includeNumbers: next });
                          }}
                          className={`relative z-10 w-[34px] h-[34px] rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer text-sm ${
                            includeNumbers 
                              ? 'bg-[#2c2c2f] text-white font-bold' 
                              : 'text-zinc-500 hover:text-white'
                          }`}
                          title="Toggle Numbers"
                        >
                          #
                        </button>
                      </div>

                      {/* Pill 2: Mode Selector */}
                      <div className="relative flex items-center h-[40px] p-[3px] rounded-full border border-[#1f1f22] bg-black select-none gap-4">
                        {/* Sliding background capsule */}
                        <div 
                          className="absolute top-[3px] w-[34px] h-[34px] rounded-full bg-[#2c2c2f] transition-all duration-300 ease-out"
                          style={{
                            left: testMode === 'time' ? '3px' : 'calc(100% - 37px)',
                            opacity: (testMode === 'time' || testMode === 'words') ? 1 : 0
                          }}
                        />
                        
                        <button 
                          onClick={() => {
                            setTestMode('time');
                            saveConfig({ testMode: 'time' });
                          }}
                          className={`relative z-10 flex items-center justify-center w-[34px] h-[34px] rounded-full transition-colors duration-200 cursor-pointer ${
                            testMode === 'time' 
                              ? 'text-white font-bold' 
                              : 'text-zinc-500 hover:text-white'
                          }`}
                          title="Time Mode"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                        
                        <span className="relative z-10 text-zinc-400 font-bold font-mono min-w-[24px] text-sm text-center px-1">
                          {testMode === 'time' ? testTimeLimit : wordLimit}
                        </span>

                        <button 
                          onClick={() => {
                            setTestMode('words');
                            saveConfig({ testMode: 'words' });
                          }}
                          className={`relative z-10 flex items-center justify-center w-[34px] h-[34px] rounded-full transition-colors duration-200 cursor-pointer font-sans text-sm font-bold ${
                            testMode === 'words' 
                              ? 'text-white font-bold' 
                              : 'text-zinc-500 hover:text-white'
                          }`}
                          title="Words Mode"
                        >
                          T
                        </button>
                      </div>

                      {/* Pill 3: Limits */}
                      <div className="relative flex items-center h-[40px] p-[3px] rounded-full border border-[#1f1f22] bg-black select-none gap-[18px]">
                        {/* Sliding background capsule */}
                        <div 
                          className="absolute top-[3px] w-[34px] h-[34px] rounded-full bg-[#2c2c2f] transition-all duration-300 ease-out"
                          style={{
                            left: `${3 + (testMode === 'time' 
                              ? [15, 30, 60, 120].indexOf(testTimeLimit as any)
                              : [10, 25, 50, 100].indexOf(wordLimit as any)
                            ) * 52}px`,
                            opacity: (testMode === 'time' && [15, 30, 60, 120].includes(testTimeLimit as any)) || (testMode === 'words' && [10, 25, 50, 100].includes(wordLimit as any)) ? 1 : 0
                          }}
                        />
                        {testMode === 'time' ? (
                          ([15, 30, 60, 120] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => {
                                setTestTimeLimit(t);
                                saveConfig({ testTimeLimit: t });
                              }}
                              className={`relative z-10 w-[34px] h-[34px] rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer text-sm ${
                                testTimeLimit === t 
                                  ? 'text-white font-bold' 
                                  : 'text-zinc-500 hover:text-white'
                              }`}
                            >
                              {t}
                            </button>
                          ))
                        ) : (
                          ([10, 25, 50, 100] as const).map((w) => (
                            <button
                              key={w}
                              onClick={() => {
                                setWordLimit(w);
                                saveConfig({ wordLimit: w });
                              }}
                              className={`relative z-10 w-[34px] h-[34px] rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer text-sm ${
                                wordLimit === w 
                                  ? 'text-white font-bold' 
                                  : 'text-zinc-500 hover:text-white'
                              }`}
                            >
                              {w}
                            </button>
                          ))
                        )}
                      </div>

                      {/* Pill 4: Language Selection */}
                      <div className="flex items-center h-[40px] px-3.5 rounded-full border border-[#1f1f22] bg-black select-none">
                        <button 
                          onClick={() => setIsSettingsOpen(true)}
                          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-[13px] text-zinc-500 font-mono"
                          title="Change Language"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>{LANGUAGES.find(l => l.id === languageId)?.name.split(' ')[0].toLowerCase() || 'english'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Subtle restart instruction */}
                    <div className="text-[11px] text-zinc-600 font-mono flex items-center gap-1.5 mt-2">
                      <span>Press</span>
                      <kbd className="bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-zinc-400">Esc</kbd>
                      <span>to restart</span>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {activeTab === 'practice' && (
            /* ================= PRACTICE/LANDING VIEW ================= */
            <div className="flex flex-col gap-8 animate-fadeIn w-full">
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
                    <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Timed Mode</h4>
                    <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed">Race against the timer. Choose from 15s to 120s intervals.</p>
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
                    <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Words Mode</h4>
                    <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed">No countdown stress. Type a fixed volume of random words.</p>
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
                    <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Quote Mode</h4>
                    <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed">Practice with real literature sentences and historical records.</p>
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
                    <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Custom Mode</h4>
                    <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed">Paste your own paragraphs, code syntax, or word lists.</p>
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
                    <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Zen Mode</h4>
                    <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed">Indefinite, stress-free training. Complete the session whenever you want.</p>
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
                    <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Weak Keys Practice</h4>
                    <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed">Targeted muscle memory. Generates paragraphs focusing on your missed keys.</p>
                  </div>
                  {testMode === 'weak-keys' && (
                    <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping" />
                  )}
                </button>
              </div>

              {/* Start Test CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
                <button
                  onClick={() => {
                    resetTest();
                    setActiveTab('test');
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
          )}

          {activeTab === '1v1' && currentUser && (
            <Lobby1v1View user={currentUser} config={config} />
          )}

          {activeTab === 'sphere' && currentUser && (
            <SphereView user={currentUser} config={config} />
          )}

          {activeTab === 'ratings' && (
            <LeaderboardView user={currentUser || undefined} />
          )}

          {activeTab === 'profile' && currentUser && (
            <ProfileView 
              user={currentUser} 
              onUpdateAvatar={(url) => {
                updateUser({ avatarUrl: url });
              }}
              history={testHistory}
            />
          )}

        </div>

        {/* Global Footer (copyright/version info) */}
        <footer 
          className={`flex flex-wrap items-center justify-center gap-6 mt-16 py-4 text-[12px] text-zinc-500 font-sans select-none w-full border-t border-zinc-900/40 transition-opacity duration-500 ${
            activeTab === 'test' && gameState === 'running' 
              ? 'opacity-0 pointer-events-none' 
              : 'opacity-100'
          }`}
        >
          <a href="mailto:support@typingthunder.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </a>
          <a href="https://twitter.com/typingthunder" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <TwitterIcon className="w-3.5 h-3.5" />
            <span>Twitter</span>
          </a>
          <a href="https://discord.gg/typingthunder" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <DiscordIcon className="w-3.5 h-3.5" />
            <span>Discord</span>
          </a>
          <a href="https://github.com/typingthunder" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a href="/security" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Shield className="w-3.5 h-3.5" />
            <span>Security</span>
          </a>
          <a href="/privacy" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy</span>
          </a>
          <a href="/support" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Support</span>
          </a>
        </footer>

      </div>

      {/* ================= SEO SECTION ================= */}
      <section className={`w-full max-w-[1380px] mx-auto mt-16 mb-12 text-left font-sans transition-opacity duration-500 ${
        activeTab === 'test' && gameState === 'running' 
          ? (testMode === 'govt-exam' ? 'hidden' : 'opacity-0 pointer-events-none') 
          : 'opacity-100'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-subtle)]">
          <article>
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-3">{seoTitle || "About this Typing Test"}</h2>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-4">
              {seoDescription || "TypingThunder is a premium, minimalist typing speed test designed to help you improve your words per minute (WPM) and accuracy. Whether you are practicing for a government typing exam, learning to touch type, or just warming up your fingers for coding, our tool provides real-time feedback and detailed analytics."}
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

      {/* Auth Modal Overlay */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          if (pendingTab) {
            setActiveTab(pendingTab);
            setPendingTab(null);
          }
        }}
      />

    </div>
  );
}
