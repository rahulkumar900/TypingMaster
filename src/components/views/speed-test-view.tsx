'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useConfig } from '@/context/config-context';
import { useAuth } from '@/context/auth-context';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { LANGUAGES } from '@/lib/languages';
import { TypingArena } from '@/components/typing-arena';
import { ChevronLeft, ChevronRight, Share2, RefreshCw, Clock, FileText, BookOpen, Sparkles, Settings, AlertTriangle, Keyboard, Globe, X, Check, Ghost, Sliders, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const renderAvatar = (url: string, sizeClass = "w-6 h-6") => {
  if (url && !url.includes('seed=Lakshayyyy') && !url.includes('seed=default')) {
    return (
      <div className={`${sizeClass} rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 overflow-hidden bg-zinc-900 relative`}>
        <Image src={url} alt="Avatar" fill sizes="48px" className="object-cover" />
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

export function SpeedTestView() {
  const config = useConfig();
  const { user: currentUser } = useAuth();
  
  // Local config states for modals
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [languageSearchQuery, setLanguageSearchQuery] = useState('');
  
  const [isCustomTimeOpen, setIsCustomTimeOpen] = useState(false);
  const [customTimeInput, setCustomTimeInput] = useState('60');
  
  const [isCustomWordLimitOpen, setIsCustomWordLimitOpen] = useState(false);
  const [customWordInput, setCustomWordInput] = useState('25');
  
  const [isCustomTextOpen, setIsCustomTextOpen] = useState(false);
  const [customTextInput, setCustomTextInput] = useState('');
  const [showDetailed, setShowDetailed] = useState(false);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);

  // Extract config values
  const {
    languageId, setLanguageId,
    layoutId, setLayoutId,
    fontId, setFontId,
    cursorStyle,
    fontSize,
    switchProfile,
    testMode, setTestMode,
    testTimeLimit, setTestTimeLimit,
    wordLimit, setWordLimit,
    customText, setCustomText,
    disableBackspace, setDisableBackspace,
    strictMode, setStrictMode,
    showKeyboard, setShowKeyboard,
    govtExamType, setGovtExamType,
    suddenDeath,
    ghostWpm,
    includePunctuation, setIncludePunctuation,
    includeNumbers, setIncludeNumbers,
    showSpeedometer,
    synth,
    saveConfig
  } = config;

  // Initialize isolated typing engine
  const engine = useTypingEngine(config);
  
  const {
    targetText, author, title,
    gameState, timeLeft, resetCounter,
    wpm, rawWpm, accuracy,
    typedLength,
    wpmHistory, rawWpmHistory, timeHistory,
    resetTest, startTest, completeTest, handleProgress, handleKeystroke, loadMoreZenWords,
    getCharacterStats
  } = engine;

  // Sync custom inputs with config values when opened
  useEffect(() => {
    if (isCustomTimeOpen) setCustomTimeInput(testTimeLimit.toString());
  }, [isCustomTimeOpen, testTimeLimit]);

  useEffect(() => {
    if (isCustomWordLimitOpen) setCustomWordInput(wordLimit.toString());
  }, [isCustomWordLimitOpen, wordLimit]);

  useEffect(() => {
    if (isCustomTextOpen) setCustomTextInput(customText);
  }, [isCustomTextOpen, customText]);

  // Reset detailed view when test goes back to idle or restarts
  useEffect(() => {
    if (gameState === 'idle') {
      setShowDetailed(false);
    }
  }, [gameState]);


  // Generate Chart Data
  const chartData = useMemo(() => {
    return timeHistory.map((time, idx) => ({
      time: time,
      wpm: wpmHistory[idx] || 0,
      raw: rawWpmHistory[idx] || 0,
    }));
  }, [timeHistory, wpmHistory, rawWpmHistory]);

  const calculateConsistency = useCallback(() => {
    if (wpmHistory.length < 2) return 100;
    const mean = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length;
    if (mean === 0) return 0;
    const variance = wpmHistory.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpmHistory.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / mean;
    return Math.max(0, Math.round((1 - cv) * 100));
  }, [wpmHistory]);

  // Calculate ghost pacer progress
  let elapsedTime = 0;
  if (gameState === 'running') {
    if (testMode === 'time') {
      elapsedTime = testTimeLimit - timeLeft;
    } else {
      elapsedTime = timeLeft;
    }
  }
  const ghostChars = (elapsedTime * (ghostWpm * 5)) / 60;
  const ghostPercent = targetText.length > 0 ? Math.min(100, (ghostChars / targetText.length) * 100) : 0;

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      {gameState === 'completed' ? (
        /* ================= RESULTS SCORECARD ================= */
        <article className="flex flex-col items-center justify-center animate-fadeIn w-full py-8 text-center select-none font-sans">
          {!showDetailed ? (
            /* Simple Results view */
            <div className="flex flex-col items-center justify-center w-full max-w-[800px] gap-12">
              {/* Floating instruction pill */}
              <div className="flex items-center gap-1 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded px-2.5 py-1.5 text-[11px] text-[var(--text-muted)] font-mono">
                <span className="bg-[var(--bg-widget)] border border-[var(--border-subtle)] px-1 py-0.5 rounded text-[var(--text-main)] mr-1">Shift</span>
                <span>+</span>
                <span className="bg-[var(--bg-widget)] border border-[var(--border-subtle)] px-1.5 py-0.5 rounded text-[var(--text-main)] mx-1">R</span>
                <span className="ml-1">: Restart Test</span>
              </div>

              {/* Floating progress line at 100% */}
              <div className="w-full relative select-none mt-2 px-4 sm:px-0">
                <div className="absolute -top-12 right-4 sm:right-0 sm:translate-x-1/2 flex flex-col items-center w-16">
                  {renderAvatar(currentUser?.avatarUrl || '', "w-7 h-7")}
                  <span className="text-[10.5px] text-zinc-400 mt-1.5 font-medium tracking-tight truncate w-full text-center">
                    {currentUser?.username || 'Guest'}
                  </span>
                </div>
                <div className="relative pt-6">
                  <div className="w-full h-[2px] bg-white rounded-full" />
                  {/* Start Dot */}
                  <div className="absolute left-4 sm:left-0 top-[21px] sm:-translate-x-1/2 flex flex-col items-center w-12">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <span className="text-[10px] text-zinc-500 mt-2">Start</span>
                  </div>
                  {/* End Dot */}
                  <div className="absolute right-4 sm:right-0 top-[21px] sm:translate-x-1/2 flex flex-col items-center w-12">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <span className="text-[10px] text-zinc-500 mt-2">End</span>
                  </div>
                </div>
              </div>

              {/* Mockup Quote display with styled mistakes */}
              <div className="text-[18px] sm:text-[24px] px-4 sm:px-0 text-zinc-600 font-mono text-left leading-relaxed max-w-[800px] mt-4 select-none break-words">
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
              <div className="flex flex-wrap justify-center items-baseline gap-6 sm:gap-[60px] md:gap-[90px] font-sans mt-4 px-4">
                <div className="flex flex-col items-start">
                  <span className="text-[12px] sm:text-[14px] text-zinc-500 uppercase tracking-widest">WPM</span>
                  <span className="text-[48px] sm:text-[64px] font-extrabold text-[#d1d0c5] leading-none mt-1 font-sans">{wpm}</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[12px] sm:text-[14px] text-zinc-500 uppercase tracking-widest">Accuracy</span>
                  <span className="text-[48px] sm:text-[64px] font-extrabold text-[#d1d0c5] leading-none mt-1 font-sans">
                    {Math.round(parseFloat(accuracy))}%
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[12px] sm:text-[14px] text-zinc-500 uppercase tracking-widest">Seconds</span>
                  <span className="text-[48px] sm:text-[64px] font-extrabold text-[#d1d0c5] leading-none mt-1 font-sans">
                    {testMode === 'time' ? testTimeLimit : timeLeft}
                  </span>
                </div>
              </div>

              {/* Simple Controls row */}
              <div className="flex items-center justify-center gap-6 sm:gap-12 mt-6">
                <button 
                  onClick={() => setShowDetailed(true)}
                  className="w-[80px] h-[48px] sm:w-[108px] sm:h-[56px] rounded-[30px] border border-[var(--border-active)] hover:border-[var(--accent-color)] bg-[var(--bg-widget)]/60 hover:bg-[var(--accent-color)]/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 text-[var(--text-muted)] hover:text-[var(--accent-color)] cursor-pointer active:scale-95"
                  title="Show Detailed Results"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={resetTest}
                  className="w-[80px] h-[48px] sm:w-[108px] sm:h-[56px] rounded-[30px] border border-[var(--border-active)] hover:border-[var(--accent-color)] bg-[var(--bg-widget)]/60 hover:bg-[var(--accent-color)]/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 text-[var(--text-muted)] hover:text-[var(--accent-color)] cursor-pointer active:scale-95"
                  title="Restart Test"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button 
                  className="w-[80px] h-[48px] sm:w-[108px] sm:h-[56px] rounded-[30px] border border-[var(--border-active)] hover:border-[var(--accent-color)] bg-[var(--bg-widget)]/60 hover:bg-[var(--accent-color)]/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 text-[var(--text-muted)] hover:text-[var(--accent-color)] cursor-pointer active:scale-95"
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
            /* Monkeytype-Style Detailed Scorecard View */
            <div className="flex flex-col items-center justify-center w-full max-w-[1000px] gap-8 animate-fadeIn">
              
              {/* Top Section: Chart & Big Stats */}
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-stretch w-full px-4">
                
                {/* Left Column: WPM & Acc */}
                <div className="flex flex-row md:flex-col gap-8 md:gap-4 justify-center items-end md:items-start min-w-[140px]">
                  <div className="flex flex-col items-start">
                    <span className="text-[28px] md:text-[32px] text-zinc-500 tracking-tight leading-none mb-1">wpm</span>
                    <span className="text-[54px] md:text-[64px] font-bold text-[var(--accent-color)] leading-none">{wpm}</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[28px] md:text-[32px] text-zinc-500 tracking-tight leading-none mb-1">acc</span>
                    <span className="text-[54px] md:text-[64px] font-bold text-[var(--accent-color)] leading-none">{Math.round(parseFloat(accuracy))}%</span>
                  </div>
                </div>
                
                {/* Right Column: Chart */}
                <div className="flex-1 h-[220px] w-full min-w-0 bg-zinc-950/20 rounded-xl p-4 border border-zinc-800/50">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis 
                        dataKey="time" 
                        stroke="#52525b" 
                        tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'monospace' }} 
                        tickMargin={10} 
                        minTickGap={20}
                        tickFormatter={(val) => val.toString()}
                      />
                      <YAxis 
                        stroke="#52525b" 
                        tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'monospace' }} 
                        width={40}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', color: '#e4e4e7', fontFamily: 'monospace' }}
                        itemStyle={{ color: '#e4e4e7' }}
                        labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="wpm" 
                        name="WPM"
                        stroke="var(--accent-color)" 
                        strokeWidth={3} 
                        dot={{ r: 3, fill: 'var(--accent-color)', strokeWidth: 0 }} 
                        activeDot={{ r: 5, fill: 'var(--accent-color)', stroke: '#fff', strokeWidth: 2 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="raw" 
                        name="Raw"
                        stroke="#52525b" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 4, fill: '#52525b', stroke: '#fff', strokeWidth: 1 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom Section: Secondary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 w-full px-4 mt-2">
                <div className="flex flex-col items-start">
                  <span className="text-[13px] text-zinc-500 mb-1">test type</span>
                  <span className="text-[20px] text-zinc-300 leading-tight">
                    {testMode} {testMode === 'time' ? testTimeLimit : wordLimit}
                    <br/>
                    <span className="text-[12px] text-zinc-500">{config.languageId}</span>
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[13px] text-zinc-500 mb-1">raw</span>
                  <span className="text-[32px] text-zinc-300 leading-none">{rawWpm}</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[13px] text-zinc-500 mb-1">characters</span>
                  <span className="text-[24px] md:text-[28px] text-zinc-300 leading-none tracking-tight">
                    {getCharacterStats().correct}<span className="text-zinc-600">/</span>
                    {getCharacterStats().incorrect}<span className="text-zinc-600">/</span>
                    {getCharacterStats().extra}<span className="text-zinc-600">/</span>
                    {getCharacterStats().missed}
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[13px] text-zinc-500 mb-1">consistency</span>
                  <span className="text-[32px] text-zinc-300 leading-none">{calculateConsistency()}%</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[13px] text-zinc-500 mb-1">time</span>
                  <span className="text-[32px] text-zinc-300 leading-none">{testMode === 'time' ? testTimeLimit : (elapsedTime || 0)}s</span>
                </div>
              </div>

              {/* Simple Controls row */}
              <div className="flex items-center justify-center gap-6 sm:gap-12 mt-8">
                <button 
                  onClick={() => setShowDetailed(false)}
                  className="w-[80px] h-[48px] sm:w-[108px] sm:h-[56px] rounded-[30px] border border-[var(--border-active)] hover:border-[var(--accent-color)] bg-[var(--bg-widget)]/60 hover:bg-[var(--accent-color)]/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 text-[var(--text-muted)] hover:text-[var(--accent-color)] cursor-pointer active:scale-95"
                  title="Back to Simple Results"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={resetTest}
                  className="w-[80px] h-[48px] sm:w-[108px] sm:h-[56px] rounded-[30px] border border-[var(--border-active)] hover:border-[var(--accent-color)] bg-[var(--bg-widget)]/60 hover:bg-[var(--accent-color)]/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 text-[var(--text-muted)] hover:text-[var(--accent-color)] cursor-pointer active:scale-95"
                  title="Restart Test"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button 
                  className="w-[80px] h-[48px] sm:w-[108px] sm:h-[56px] rounded-[30px] border border-[var(--border-active)] hover:border-[var(--accent-color)] bg-[var(--bg-widget)]/60 hover:bg-[var(--accent-color)]/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 text-[var(--text-muted)] hover:text-[var(--accent-color)] cursor-pointer active:scale-95"
                  title="Share Results"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Coaching Coax link */}
              {!currentUser && (
                <button 
                  onClick={resetTest}
                  className="text-[13px] text-zinc-500 hover:text-white cursor-pointer underline underline-offset-4 mt-2 transition-colors font-mono"
                >
                  Login to save your result
                </button>
              )}
            </div>
          )}
        </article>
      ) : (
        /* ================= TYPING RUN SCREEN ================= */
        <div className="flex flex-col items-center flex-1 animate-fadeIn w-full min-h-0 py-8">
          
          {/* Progress Track */}
          {!showKeyboard && (
            <div className="w-full max-w-[800px] mx-auto mb-auto select-none shrink-0 px-6 sm:px-0">
              <div className="relative w-full">
            {/* The floating user card */}
            <div 
              className="absolute -top-8 flex flex-col items-center transition-all duration-150 ease-out z-10 w-16"
              style={{ 
                left: `${targetText.length > 0 ? Math.min(100, Math.max(0, (typedLength / targetText.length) * 100)) : 0}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {renderAvatar(currentUser?.avatarUrl || '', "w-6 h-6 sm:w-7 sm:h-7")}
              <span className="text-[10.5px] text-zinc-400 mt-1.5 font-sans font-medium tracking-tight truncate w-full text-center">
                {currentUser?.username || 'Guest'}
              </span>
            </div>

            {/* The ghost pacer floating card */}
            {ghostWpm > 0 && testMode !== 'govt-exam' && (
              <div 
                className={`absolute -top-8 flex flex-col items-center z-5 ${
                  gameState === 'running' ? 'transition-all duration-1000 ease-linear' : 'transition-all duration-150 ease-out'
                }`}
                style={{ 
                  left: `${ghostPercent}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
                  <Ghost className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--accent-color)] animate-pulse" />
                </div>
                <span className="text-[10px] text-zinc-500 mt-1.5 font-sans font-medium tracking-tight">
                  Ghost Pacer ({ghostWpm} WPM)
                </span>
              </div>
            )}

            {/* Track Line and Dots */}
            <div className="relative pt-6">
              <div className="w-full h-[2px] bg-zinc-800 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-[var(--accent-color)] transition-all duration-150 ease-out shadow-[0_0_8px_rgba(var(--accent-rgb),0.4)]"
                  style={{ width: `${targetText.length > 0 ? Math.min(100, Math.max(0, (typedLength / targetText.length) * 100)) : 0}%` }}
                />
              </div>
              
              {/* Start Dot */}
              <div className="absolute left-0 top-[21px] -translate-x-1/2 flex flex-col items-center w-12">
                <div className="w-2 h-2 rounded-full bg-zinc-600 border border-zinc-900" />
                <span className="text-[10px] text-zinc-500 mt-2 font-sans">Start</span>
              </div>

              {/* End Dot */}
              <div className="absolute right-0 top-[21px] translate-x-1/2 flex flex-col items-center w-12">
                <div className="w-2 h-2 rounded-full bg-zinc-600 border border-zinc-900" />
                <span className="text-[10px] text-zinc-500 mt-2 font-sans">End</span>
              </div>
            </div>
            </div>
          </div>
          )}

          {/* Centered Typing Arena */}
          <div className="w-full shrink-0 flex flex-col justify-center my-8 md:my-10 min-h-[160px] relative">
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
              strictMode={strictMode}
              showKeyboard={showKeyboard}
              timeLeft={timeLeft}
              liveWpm={wpm}
              ghostWpm={ghostWpm}
              layoutId={config.layoutId as any}
              strictMode={config.suddenDeath}
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

          {/* Bottom Controls Pills */}
          <div 
            className={`flex flex-col items-center justify-center gap-4 transition-all duration-500 w-full shrink-0 mt-auto ${
              gameState === 'running' 
                ? 'opacity-0 pointer-events-none' 
                : 'opacity-100'
            }`}
            id="monkeytype-config-bar"
          >
            <div className="flex flex-wrap items-center justify-center gap-5 font-mono text-[13px] text-zinc-500 select-none" id="speed-test-pills">
              {/* Pill 1: Punctuation and Numbers */}
              <div className="flex items-center h-[46px] p-[2px] rounded-full border border-zinc-800 bg-zinc-950/30 backdrop-blur-sm select-none gap-[6px] transition-all duration-300">
                <button 
                  onClick={() => {
                    const next = !includePunctuation;
                    setIncludePunctuation(next);
                    saveConfig({ includePunctuation: next });
                    resetTest();
                  }}
                  className={`relative z-10 w-[38px] h-[38px] rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer text-base ${
                    includePunctuation 
                      ? 'bg-zinc-800 text-white font-bold' 
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
                    resetTest();
                  }}
                  className={`relative z-10 w-[38px] h-[38px] rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer text-base ${
                    includeNumbers 
                      ? 'bg-zinc-800 text-white font-bold' 
                      : 'text-zinc-500 hover:text-white'
                  }`}
                  title="Toggle Numbers"
                >
                  #
                </button>
              </div>

              {/* Pill 2: Mode Selector */}
              <div className="flex items-center h-[46px] p-[2px] rounded-full border border-zinc-800 bg-zinc-950/30 backdrop-blur-sm select-none gap-[6px] transition-all duration-300">
                {(['time', 'words', 'quotes', 'zen', 'custom', 'weak-keys', 'govt-exam'] as const).map((mode) => {
                  let Icon = Clock;
                  let titleLabel = "Time Mode";
                  if (mode === 'time') { Icon = Clock; titleLabel = "Time Mode"; }
                  else if (mode === 'words') { Icon = FileText; titleLabel = "Words Mode"; }
                  else if (mode === 'quotes') { Icon = BookOpen; titleLabel = "Quotes Mode"; }
                  else if (mode === 'zen') { Icon = Sparkles; titleLabel = "Zen Mode"; }
                  else if (mode === 'custom') { Icon = Settings; titleLabel = "Custom Mode"; }
                  else if (mode === 'weak-keys') { Icon = AlertTriangle; titleLabel = "Weak Keys Drills"; }
                  else if (mode === 'govt-exam') { Icon = Keyboard; titleLabel = "Government Exam Mode"; }

                  return (
                    <button
                      key={mode}
                      onClick={() => {
                        setTestMode(mode);
                        saveConfig({ testMode: mode });
                        resetTest();
                      }}
                      className={`w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        testMode === mode
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-500 hover:text-white'
                      }`}
                      title={titleLabel}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                    </button>
                  );
                })}
              </div>

              {/* Pill 3: Limits / Suboptions */}
              {(testMode === 'time' || testMode === 'words' || testMode === 'custom' || testMode === 'govt-exam') && (
                <div className="flex items-center h-[46px] p-[2px] rounded-full border border-zinc-800 bg-zinc-950/30 backdrop-blur-sm select-none gap-[6px] transition-all duration-300">
                  {testMode === 'time' && (
                    <>
                      {([15, 30, 60, 120] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTestTimeLimit(t);
                            saveConfig({ testTimeLimit: t });
                            resetTest();
                          }}
                          className={`w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all cursor-pointer text-sm font-bold font-mono ${
                            testTimeLimit === t
                              ? 'bg-zinc-800 text-white font-bold'
                              : 'text-zinc-500 hover:text-white'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setCustomTimeInput(testTimeLimit.toString());
                          setIsCustomTimeOpen(true);
                        }}
                        className={`w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all cursor-pointer text-[11px] font-bold font-mono ${
                          ![15, 30, 60, 120].includes(testTimeLimit)
                            ? 'bg-zinc-800 text-white font-bold'
                            : 'text-zinc-500 hover:text-white'
                        }`}
                        title="Custom Time"
                      >
                        {![15, 30, 60, 120].includes(testTimeLimit) ? (
                          <span>{testTimeLimit}s</span>
                        ) : (
                          <Sliders className="w-[18px] h-[18px]" />
                        )}
                      </button>
                    </>
                  )}

                  {testMode === 'words' && (
                    <>
                      {([10, 25, 50, 100] as const).map((w) => (
                        <button
                          key={w}
                          onClick={() => {
                            setWordLimit(w);
                            saveConfig({ wordLimit: w });
                            resetTest();
                          }}
                          className={`w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all cursor-pointer text-sm font-bold font-mono ${
                            wordLimit === w
                              ? 'bg-zinc-800 text-white font-bold'
                              : 'text-zinc-500 hover:text-white'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setCustomWordInput(wordLimit.toString());
                          setIsCustomWordLimitOpen(true);
                        }}
                        className={`w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all cursor-pointer text-[10px] font-bold font-mono ${
                          ![10, 25, 50, 100].includes(wordLimit)
                            ? 'bg-zinc-800 text-white font-bold'
                            : 'text-zinc-500 hover:text-white'
                        }`}
                        title="Custom Words"
                      >
                        {![10, 25, 50, 100].includes(wordLimit) ? (
                          <span>{wordLimit}w</span>
                        ) : (
                          <Sliders className="w-[18px] h-[18px]" />
                        )}
                      </button>
                    </>
                  )}

                  {testMode === 'custom' && (
                    <button
                      onClick={() => {
                        setCustomTextInput(customText);
                        setIsCustomTextOpen(true);
                      }}
                      className="h-[38px] px-4 rounded-full flex items-center justify-center transition-all cursor-pointer text-xs font-bold text-zinc-400 hover:text-white gap-2 hover:bg-zinc-900"
                      title="Edit Custom Text"
                    >
                      <FileText className="w-[18px] h-[18px] text-zinc-400" />
                      <span>Edit Custom Text</span>
                    </button>
                  )}

                  {testMode === 'govt-exam' && (
                    <div className="flex items-center gap-[6px]">
                      {(['ssc-chsl', 'ssc-cgl', 'state-clerk'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setGovtExamType(type);
                            saveConfig({ govtExamType: type });
                            resetTest();
                          }}
                          className={`h-[38px] px-3.5 rounded-full flex items-center justify-center transition-all cursor-pointer text-[11px] font-bold uppercase ${
                            govtExamType === type
                              ? 'bg-zinc-800 text-white font-bold'
                              : 'text-zinc-500 hover:text-white'
                          }`}
                        >
                          {type === 'ssc-chsl' ? 'CHSL' : type === 'ssc-cgl' ? 'CGL' : 'Clerk'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pill 4: Language Selection */}
              <div className="flex items-center h-[46px] px-5 rounded-full border border-zinc-800 bg-zinc-950/30 backdrop-blur-sm select-none transition-all duration-300">
                <button 
                  onClick={() => {
                    setLanguageSearchQuery('');
                    setIsLanguageModalOpen(true);
                  }}
                  className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-xs text-[var(--text-main)] font-mono uppercase font-bold"
                  title="Change Language"
                >
                  <Globe className="w-[18px] h-[18px] text-zinc-400" />
                  <span>{LANGUAGES.find(l => l.id === languageId)?.name.split(' ')[0] || 'English'}</span>
                </button>
              </div>

              {/* Pill 5: Layout Selection (only if language has multiple layouts) */}
              {(() => {
                const currentLang = LANGUAGES.find(l => l.id === languageId);
                if (currentLang && currentLang.layouts && currentLang.layouts.length > 1) {
                  return (
                    <div className="flex items-center h-[46px] p-[2px] rounded-full border border-zinc-800 bg-zinc-950/30 backdrop-blur-sm select-none gap-[6px] transition-all duration-300 hidden md:flex">
                      {currentLang.layouts.map(layout => {
                        // Shorten names for the pill UI
                        let shortName = layout.name;
                        if (shortName === 'Mangal Remington GAIL') shortName = 'GAIL';
                        if (shortName === 'Mangal InScript') shortName = 'InScript';
                        if (shortName === 'Krutidev 010') shortName = 'Krutidev';
                        
                        return (
                          <button
                            key={layout.id}
                            onClick={() => {
                              setLayoutId(layout.id);
                              saveConfig({ layoutId: layout.id });
                              resetTest();
                            }}
                            className={`h-[38px] px-3.5 rounded-full flex items-center justify-center transition-all cursor-pointer text-[11px] font-bold uppercase ${
                              config.layoutId === layout.id
                                ? 'bg-zinc-800 text-white font-bold'
                                : 'text-zinc-500 hover:text-white'
                            }`}
                            title={layout.name}
                          >
                            {shortName}
                          </button>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              })()}

              {/* Pill 6: Customization Modal Trigger */}
              <div className="flex items-center h-[46px] p-[2px] rounded-full border border-zinc-800 bg-zinc-950/30 backdrop-blur-sm select-none gap-[6px] transition-all duration-300">
                <button
                  onClick={() => setIsCustomizationModalOpen(true)}
                  className="w-[38px] h-[38px] rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer text-zinc-500 hover:text-white"
                  title="Advanced Customization"
                >
                  <Settings className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>

            {/* Subtle restart instruction */}
            <div className="text-[11px] text-[var(--text-muted)] opacity-60 font-mono flex items-center gap-1.5 mt-2">
              <span>Press</span>
              <kbd className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded px-1.5 py-0.5 text-[var(--text-main)]">Esc</kbd>
              <span>to restart</span>
            </div>
          </div>

        </div>
      )}

      {/* Language Selector Modal */}
      {isLanguageModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsLanguageModalOpen(false)}
        >
          <div 
            className="w-full max-w-[500px] max-h-[85vh] bg-[#0c0d12] border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative animate-scaleIn overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex justify-between items-center border-b border-zinc-900/60 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[var(--accent-color)]" />
                <h3 className="text-lg font-bold text-white">Select Language</h3>
              </div>
              <button 
                onClick={() => setIsLanguageModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-panel)] border border-zinc-900 text-zinc-500 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <div className="mb-4">
              <input
                type="text"
                value={languageSearchQuery}
                onChange={(e) => setLanguageSearchQuery(e.target.value)}
                placeholder="Search languages..."
                className="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-[var(--accent-color)] transition-colors focus:outline-none font-sans"
                autoFocus
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-1 max-h-[45vh] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {LANGUAGES.filter(lang => 
                lang.name.toLowerCase().includes(languageSearchQuery.toLowerCase()) ||
                lang.id.toLowerCase().includes(languageSearchQuery.toLowerCase())
              ).map(lang => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setLanguageId(lang.id);
                    setFontId(lang.fonts[0].id);
                    const newLayoutId = lang.layouts[0].id;
                    setLayoutId(newLayoutId);
                    saveConfig({ 
                      languageId: lang.id, 
                      fontId: lang.fonts[0].id,
                      layoutId: newLayoutId 
                    });
                    resetTest();
                    setIsLanguageModalOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer text-left ${
                    languageId === lang.id
                      ? 'bg-[var(--accent-color)] text-black font-bold'
                      : 'hover:bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="text-[13.5px] font-semibold">{lang.name}</span>
                  {languageId === lang.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Time Modal */}
      {isCustomTimeOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsCustomTimeOpen(false)}
        >
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const parsed = parseInt(customTimeInput);
              if (!isNaN(parsed) && parsed >= 5 && parsed <= 3600) {
                setTestTimeLimit(parsed);
                saveConfig({ testTimeLimit: parsed });
                resetTest();
                setIsCustomTimeOpen(false);
              }
            }}
            className="w-full max-w-[400px] bg-[#0c0d12] border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--accent-color)]" />
                <h3 className="text-lg font-bold text-white">Custom Duration</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsCustomTimeOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-panel)] border border-zinc-900 text-zinc-500 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">Duration in seconds (5 - 3600)</label>
              <input
                type="number"
                min="5"
                max="3600"
                value={customTimeInput}
                onChange={(e) => setCustomTimeInput(e.target.value)}
                placeholder="e.g. 30"
                className="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-[var(--accent-color)] transition-colors focus:outline-none font-mono"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCustomTimeOpen(false)}
                className="px-5 py-2.5 rounded-full border border-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[var(--accent-color)] hover:bg-white text-black text-xs font-bold transition-all cursor-pointer"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Custom Word Limit Modal */}
      {isCustomWordLimitOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsCustomWordLimitOpen(false)}
        >
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const parsed = parseInt(customWordInput);
              if (!isNaN(parsed) && parsed >= 5 && parsed <= 1000) {
                setWordLimit(parsed);
                saveConfig({ wordLimit: parsed });
                resetTest();
                setIsCustomWordLimitOpen(false);
              }
            }}
            className="w-full max-w-[400px] bg-[#0c0d12] border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--accent-color)]" />
                <h3 className="text-lg font-bold text-white">Custom Word Count</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsCustomWordLimitOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-panel)] border border-zinc-900 text-zinc-500 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">Number of words (5 - 1000)</label>
              <input
                type="number"
                min="5"
                max="1000"
                value={customWordInput}
                onChange={(e) => setCustomWordInput(e.target.value)}
                placeholder="e.g. 50"
                className="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-[var(--accent-color)] transition-colors focus:outline-none font-mono"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCustomWordLimitOpen(false)}
                className="px-5 py-2.5 rounded-full border border-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[var(--accent-color)] hover:bg-white text-black text-xs font-bold transition-all cursor-pointer"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Custom Text Modal */}
      {isCustomTextOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsCustomTextOpen(false)}
        >
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setCustomText(customTextInput);
              saveConfig({ customText: customTextInput });
              resetTest();
              setIsCustomTextOpen(false);
            }}
            className="w-full max-w-[600px] bg-[#0c0d12] border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--accent-color)]" />
                <h3 className="text-lg font-bold text-white">Custom Practice Text</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsCustomTextOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-panel)] border border-zinc-900 text-zinc-500 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">Paste practice text below</label>
              <textarea
                value={customTextInput}
                onChange={(e) => setCustomTextInput(e.target.value)}
                placeholder="Type or paste custom text here..."
                rows={6}
                className="w-full bg-black border border-zinc-900 rounded-xl p-4 text-sm text-white placeholder-zinc-600 focus:border-[var(--accent-color)] transition-colors focus:outline-none font-mono resize-none"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCustomTextOpen(false)}
                className="px-5 py-2.5 rounded-full border border-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[var(--accent-color)] hover:bg-white text-black text-xs font-bold transition-all cursor-pointer"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customization Modal */}
      {isCustomizationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1a1a1a] border border-zinc-800 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800/50 bg-[#1e1e1e]">
              <h3 className="font-bold text-white font-sans flex items-center gap-2">
                <Settings className="w-4 h-4 text-zinc-400" />
                Customization
              </h3>
              <button 
                onClick={() => setIsCustomizationModalOpen(false)}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 flex flex-col gap-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Show Virtual Keyboard</span>
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${showKeyboard ? 'bg-[var(--accent-color)]' : 'bg-zinc-700'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showKeyboard ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={showKeyboard} 
                  onChange={(e) => {
                    const val = e.target.checked;
                    setShowKeyboard(val);
                    saveConfig({ showKeyboard: val });
                  }} 
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Allow Backspace</span>
                  <span className="text-xs text-zinc-500">Allow correcting mistakes</span>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${!disableBackspace ? 'bg-[var(--accent-color)]' : 'bg-zinc-700'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${!disableBackspace ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={!disableBackspace} 
                  onChange={(e) => {
                    const val = !e.target.checked;
                    setDisableBackspace(val);
                    saveConfig({ disableBackspace: val });
                  }} 
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Strict Mode</span>
                  <span className="text-xs text-zinc-500">Block incorrect keystrokes</span>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${strictMode ? 'bg-[var(--accent-color)]' : 'bg-zinc-700'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${strictMode ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={strictMode} 
                  onChange={(e) => {
                    const val = e.target.checked;
                    setStrictMode(val);
                    saveConfig({ strictMode: val });
                  }} 
                />
              </label>
            </div>
            
            <div className="p-4 border-t border-zinc-800/50 bg-[#1e1e1e] flex justify-end">
              <button 
                onClick={() => {
                  setIsCustomizationModalOpen(false);
                  resetTest();
                }}
                className="px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-white font-bold rounded-lg transition-colors cursor-pointer text-sm shadow-lg shadow-[var(--accent-color)]/20"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
