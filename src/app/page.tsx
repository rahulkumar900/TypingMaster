'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { List, Moon, RefreshCw, Volume2, VolumeX, LayoutGrid, AlertTriangle, TrendingUp, Sparkles, Settings, Trophy, Clock, BookOpen, Check, FileText, Keyboard, Info, Sliders } from 'lucide-react';
import { StatsWidget } from '@/components/stats-widget';
import { SettingsPanel } from '@/components/settings-panel';
import { StatsDashboard, TestRecord } from '@/components/stats-dashboard';
import { TypingArena } from '@/components/typing-arena';
import { WpmChart } from '@/components/wpm-chart';
import { QUOTES, COMMON_WORDS, INDIAN_EXAM_PASSAGES } from '@/lib/quotes';
import { TypingAudioSynthesizer } from '@/lib/synth';

export default function Home() {
  // Global customizable settings
  const [accentTheme, setAccentTheme] = useState<string>('blue');
  const [dimMode, setDimMode] = useState<boolean>(false);
  const [cursorStyle, setCursorStyle] = useState<'pipe' | 'block' | 'outline' | 'underline'>('pipe');
  const [fontSize, setFontSize] = useState<number>(24);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [switchProfile, setSwitchProfile] = useState<'blue' | 'brown' | 'red'>('blue');
  
  // Test Options
  const [testMode, setTestMode] = useState<'time' | 'words' | 'quotes' | 'custom' | 'zen' | 'weak-keys' | 'govt-exam'>('quotes');
  const [testTimeLimit, setTestTimeLimit] = useState<number>(60);
  const [wordLimit, setWordLimit] = useState<number>(25);
  const [customText, setCustomText] = useState<string>('Type whatever you want to practice here.');

  // Government Exam Specifics
  const [disableBackspace, setDisableBackspace] = useState<boolean>(false);
  const [govtExamType, setGovtExamType] = useState<'ssc-chsl' | 'ssc-cgl' | 'state-clerk'>('ssc-chsl');
  const [examScore, setExamScore] = useState<any>(null); // Detailed analysis results

  // New Helpful Features
  const [suddenDeath, setSuddenDeath] = useState<boolean>(false);
  const [ghostWpm, setGhostWpm] = useState<number>(0);

  // View state and practice filters
  const [viewState, setViewState] = useState<'home' | 'typing'>('typing');
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [showSpeedometer, setShowSpeedometer] = useState<boolean>(true);
  const [liveWpm, setLiveWpm] = useState<number>(0);

  // Drawers presentation states
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);

  // Text source states
  const [targetText, setTargetText] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  // Game States
  const [gameState, setGameState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [resetCounter, setResetCounter] = useState<number>(0);

  // Live Metrics States
  const [wpm, setWpm] = useState<number>(0);
  const [rawWpm, setRawWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<string>('100.00');
  const [rawAccuracy, setRawAccuracy] = useState<number>(100);

  // Missed Keys tracking state
  const [missedKeys, setMissedKeys] = useState<Record<string, number>>({});

  // Graph History States
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [rawWpmHistory, setRawWpmHistory] = useState<number[]>([]);
  const [timeHistory, setTimeHistory] = useState<number[]>([]);
  const [mobileConfigOpen, setMobileConfigOpen] = useState<boolean>(false);

  // Local Performance History Database
  const [testHistory, setTestHistory] = useState<TestRecord[]>([]);

  // Refs to store values to prevent stale interval states
  const correctCountRef = useRef<number>(0);
  const typedLengthRef = useRef<number>(0);
  const typedTextRef = useRef<string>('');
  const totalKeystrokesRef = useRef<number>(0);
  const incorrectKeystrokesRef = useRef<number>(0);
  const timerStartedAtRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Audio Synthesizer Instance
  const synthRef = useRef<TypingAudioSynthesizer | null>(null);
  if (!synthRef.current) {
    synthRef.current = new TypingAudioSynthesizer();
  }
  const synth = synthRef.current;

  // Load configuration and history (client side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('centerville_settings_react_v2');
      if (saved) {
        try {
          const config = JSON.parse(saved);
          setAccentTheme(config.accentTheme || 'blue');
          setDimMode(config.dimMode || false);
          setCursorStyle(config.cursorStyle || 'pipe');
          setFontSize(config.fontSize || 24);
          setIsSoundOn(config.soundEnabled ?? true);
          setSwitchProfile(config.switchProfile || 'blue');
          setTestMode(config.testMode || 'quotes');
          setTestTimeLimit(config.testTimeLimit || 60);
          setWordLimit(config.wordLimit || 25);
          setCustomText(config.customText || 'Type whatever you want to practice here.');
          setIncludePunctuation(config.includePunctuation ?? false);
          setIncludeNumbers(config.includeNumbers ?? false);
          setShowSpeedometer(config.showSpeedometer ?? true);
          setDisableBackspace(config.disableBackspace ?? false);
          setGovtExamType(config.govtExamType || 'ssc-chsl');
          setSuddenDeath(config.suddenDeath ?? false);
          setGhostWpm(config.ghostWpm || 0);
          
          synth.enabled = config.soundEnabled ?? true;
          synth.switchProfile = config.switchProfile || 'blue';
        } catch (err) {
          console.error("Failed to load local config", err);
        }
      }

      // Load History Table
      const savedHist = localStorage.getItem('centerville_test_history');
      if (savedHist) {
        try {
          setTestHistory(JSON.parse(savedHist));
        } catch (e) {
          console.error("Failed to load run history", e);
        }
      }
    }
  }, [synth]);

  const saveConfig = (updated: Record<string, any>) => {
    const config = {
      accentTheme,
      dimMode,
      cursorStyle,
      fontSize,
      soundEnabled: isSoundOn,
      switchProfile,
      testMode,
      testTimeLimit,
      wordLimit,
      customText,
      includePunctuation,
      includeNumbers,
      showSpeedometer,
      disableBackspace,
      govtExamType,
      suddenDeath,
      ghostWpm,
      ...updated
    };
    localStorage.setItem('centerville_settings_react_v2', JSON.stringify(config));
  };

  // Sync mechanical switch settings to synth instance
  useEffect(() => {
    synth.switchProfile = switchProfile;
  }, [switchProfile, synth]);

  // Sync sound status to synth instance
  useEffect(() => {
    synth.enabled = isSoundOn;
  }, [isSoundOn, synth]);

  // Toggle brightness / dim state
  useEffect(() => {
    if (dimMode) {
      document.body.classList.add('dim-mode');
    } else {
      document.body.classList.remove('dim-mode');
    }
  }, [dimMode]);

  // Toggle accent theme class on body
  useEffect(() => {
    document.body.className = document.body.className.replace(/\btheme-\S+/g, '');
    document.body.classList.add(`theme-${accentTheme}`);
  }, [accentTheme]);

  // Text generator helper
  const generateText = useCallback(() => {
    if (testMode === 'quotes') {
      const randomIndex = Math.floor(Math.random() * QUOTES.length);
      const quote = QUOTES[randomIndex];
      setTargetText(quote.text);
      setAuthor(quote.author);
      setTitle(quote.title);
    } else if (testMode === 'govt-exam') {
      const randomIndex = Math.floor(Math.random() * INDIAN_EXAM_PASSAGES.length);
      const passage = INDIAN_EXAM_PASSAGES[randomIndex];
      setTargetText(passage.text);
      setAuthor(passage.source);
      setTitle(passage.title);
    } else if (testMode === 'custom') {
      setTargetText(customText.trim() || 'Custom text is empty.');
      setAuthor('');
      setTitle('');
    } else {
      const limit = testMode === 'words' ? wordLimit : testMode === 'zen' ? 50 : 150;
      let sourceWords = COMMON_WORDS;
      let weakKeysStr = '';

      if (testMode === 'weak-keys') {
        const counts: Record<string, number> = {};
        testHistory.forEach(record => {
          if (record.missedKeys) {
            Object.entries(record.missedKeys).forEach(([key, val]) => {
              const cleanKey = key.toLowerCase();
              if (/[a-z]/.test(cleanKey)) {
                counts[cleanKey] = (counts[cleanKey] || 0) + val;
              }
            });
          }
        });
        const weakKeys = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .map(x => x[0])
          .slice(0, 3);
        const activeWeakKeys = weakKeys.length > 0 ? weakKeys : ['z', 'x', 'q', 'p', 'v'];
        weakKeysStr = activeWeakKeys.join(', ').toUpperCase();
        
        const filtered = COMMON_WORDS.filter(w => 
          activeWeakKeys.some(k => w.toLowerCase().includes(k))
        );
        sourceWords = filtered.length > 10 ? filtered : COMMON_WORDS;
      }

      const generated = [];
      for (let i = 0; i < limit; i++) {
        if (includeNumbers && Math.random() < 0.15) {
          const types = ['year', 'small', 'decimal', 'large', 'percent', 'range'];
          const chosenType = types[Math.floor(Math.random() * types.length)];
          let numStr = '';
          switch (chosenType) {
            case 'year':
              numStr = (Math.floor(Math.random() * 50) + 1980).toString();
              break;
            case 'small':
              numStr = Math.floor(Math.random() * 10).toString();
              break;
            case 'decimal':
              numStr = (Math.random() * 100).toFixed(Math.floor(Math.random() * 2) + 1);
              break;
            case 'large':
              numStr = Math.floor(Math.random() * 9000 + 1000).toString();
              break;
            case 'percent':
              numStr = `${Math.floor(Math.random() * 100)}%`;
              break;
            case 'range':
              const start = Math.floor(Math.random() * 10) + 1;
              const end = start + Math.floor(Math.random() * 10) + 1;
              numStr = `${start}-${end}`;
              break;
            default:
              numStr = Math.floor(Math.random() * 100).toString();
          }
          generated.push(numStr);
        } else {
          const index = Math.floor(Math.random() * sourceWords.length);
          generated.push(sourceWords[index]);
        }
      }

      if (includePunctuation) {
        const processed = [];
        let i = 0;
        while (i < generated.length) {
          const remaining = generated.length - i;
          const sentenceLen = Math.min(remaining, Math.floor(Math.random() * 6) + 5);
          for (let j = 0; j < sentenceLen; j++) {
            let word = generated[i + j];
            if (j === 0 && /[a-zA-Z]/.test(word)) {
              word = word.charAt(0).toUpperCase() + word.slice(1);
            }
            if (j > 0 && j < sentenceLen - 1 && Math.random() < 0.08) {
              const wrapType = Math.random() < 0.5 ? 'quotes' : 'parentheses';
              if (wrapType === 'quotes') {
                word = `"${word}"`;
              } else {
                word = `(${word})`;
              }
            }
            if (j < sentenceLen - 1 && Math.random() < 0.12 && !/[.,;:!?%]$/.test(word)) {
              const punc = Math.random() < 0.8 ? ',' : ';';
              word = word + punc;
            }
            if (j === sentenceLen - 1 && !/[.,;:!?%]$/.test(word)) {
              const endPunc = Math.random() < 0.85 ? '.' : Math.random() < 0.7 ? '?' : '!';
              word = word + endPunc;
            }
            processed.push(word);
          }
          i += sentenceLen;
        }
        setTargetText(processed.join(' '));
      } else {
        setTargetText(generated.join(' '));
      }
      setAuthor('');
      setTitle(testMode === 'zen' ? 'Zen Indefinite Practice' : testMode === 'weak-keys' ? `Weak Keys Practice (${weakKeysStr})` : '');
    }
  }, [testMode, wordLimit, customText, includePunctuation, includeNumbers, testHistory]);

  // Reset core metrics
  const resetTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    correctCountRef.current = 0;
    typedLengthRef.current = 0;
    typedTextRef.current = '';
    totalKeystrokesRef.current = 0;
    incorrectKeystrokesRef.current = 0;
    timerStartedAtRef.current = null;

    setGameState('idle');
    setTimeLeft(testMode === 'time' ? testTimeLimit : 0);
    setWpm(0);
    setRawWpm(0);
    setLiveWpm(0);
    setAccuracy('100.00');
    setRawAccuracy(100);
    setMissedKeys({});

    setWpmHistory([]);
    setRawWpmHistory([]);
    setTimeHistory([]);

    setResetCounter(prev => prev + 1);
    generateText();
  }, [testTimeLimit, testMode, wordLimit, generateText]);

  // Auto-reset when test configuration changes
  useEffect(() => {
    resetTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testMode, testTimeLimit, wordLimit, includePunctuation, includeNumbers, customText]);

  // Handle resets via ESC shortcuts
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        resetTest();
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [resetTest]);

  // Clear history database table
  const handleClearHistory = () => {
    setTestHistory([]);
    localStorage.removeItem('centerville_test_history');
  };

  // Start countdown/countup timer runs
  const startTest = () => {
    setGameState('running');
    timerStartedAtRef.current = Date.now();
    
    if (testMode === 'time') {
      setTimeLeft(testTimeLimit);
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const nextTime = prev - 1;
          const elapsed = (Date.now() - (timerStartedAtRef.current || Date.now())) / 1000;
          
          // Compute metrics
          const metrics = calculateMetrics(elapsed);
          setWpm(metrics.wpm);
          setRawWpm(metrics.rawWpm);
          setAccuracy(metrics.accuracy);
          setRawAccuracy(metrics.rawAccuracy);
          setLiveWpm(metrics.wpm);

          // Record history
          setWpmHistory(hist => [...hist, metrics.wpm]);
          setRawWpmHistory(hist => [...hist, metrics.rawWpm]);
          setTimeHistory(timeHist => [...timeHist, Math.round(elapsed)]);

          if (nextTime <= 0) {
            completeTest();
            return 0;
          }
          return nextTime;
        });
      }, 1000);
    } else {
      // Countup timer in seconds for Quotes/Words/Custom/Zen/Weak-Keys modes
      setTimeLeft(0);
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const nextTime = prev + 1;
          const elapsed = (Date.now() - (timerStartedAtRef.current || Date.now())) / 1000;
          
          // Compute metrics
          const metrics = calculateMetrics(elapsed);
          setWpm(metrics.wpm);
          setRawWpm(metrics.rawWpm);
          setAccuracy(metrics.accuracy);
          setRawAccuracy(metrics.rawAccuracy);
          setLiveWpm(metrics.wpm);

          // Record history
          setWpmHistory(hist => [...hist, metrics.wpm]);
          setRawWpmHistory(hist => [...hist, metrics.rawWpm]);
          setTimeHistory(timeHist => [...timeHist, Math.round(elapsed)]);

          return nextTime;
        });
      }, 1000);
    }
  };

  // Metrics computing function
  const calculateMetrics = (elapsed: number) => {
    const mins = Math.max(0.001, elapsed / 60);
    const correct = correctCountRef.current;
    const typedLen = typedLengthRef.current;
    const totalKeys = totalKeystrokesRef.current;
    const incorrectKeys = incorrectKeystrokesRef.current;

    if (typedLen === 0) {
      return { wpm: 0, rawWpm: 0, accuracy: '100.00', rawAccuracy: 100 };
    }

    const currentWpm = Math.round((correct / 5) / mins);
    const currentRawWpm = Math.round((typedLen / 5) / mins);
    const currentAcc = ((correct / typedLen) * 100).toFixed(2);
    const currentRawAcc = totalKeys > 0
      ? Math.round(((totalKeys - incorrectKeys) / totalKeys) * 100)
      : 100;

    return {
      wpm: currentWpm,
      rawWpm: currentRawWpm,
      accuracy: currentAcc,
      rawAccuracy: Math.max(0, currentRawAcc)
    };
  };

  // Word-level LCS alignment algorithm for government exams (SSC CGL/CHSL guidelines)
  const alignPassages = (targetStr: string, typedStr: string) => {
    const targetWords = targetStr.trim().split(/\s+/).filter(Boolean);
    const typedWords = typedStr.trim().split(/\s+/).filter(Boolean);
    
    const m = targetWords.length;
    const n = typedWords.length;
    
    // DP table for LCS
    const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (targetWords[i - 1].toLowerCase() === typedWords[j - 1].toLowerCase()) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    
    // Backtrack to find exact mistakes
    let i = m, j = n;
    let fullMistakes = 0;
    let halfMistakes = 0;
    const fullDetails: string[] = [];
    const halfDetails: string[] = [];
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && targetWords[i - 1].toLowerCase() === typedWords[j - 1].toLowerCase()) {
        // Words match case-insensitively
        // Check for capitalization error -> Half Mistake (0.5 Error)
        if (targetWords[i - 1] !== typedWords[j - 1]) {
          halfMistakes += 1; // Count as 1 half mistake
          halfDetails.push(`Capitalization: typed "${typedWords[j - 1]}" instead of "${targetWords[i - 1]}"`);
        }
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        // Added word -> Full Mistake (1.0 Error)
        fullMistakes += 1;
        fullDetails.push(`Addition: extra word "${typedWords[j - 1]}"`);
        j--;
      } else {
        // Omitted word -> Full Mistake (1.0 Error)
        fullMistakes += 1;
        fullDetails.push(`Omission: skipped word "${targetWords[i - 1]}"`);
        i--;
      }
    }
    
    return {
      fullMistakes,
      halfMistakes,
      totalWeightedErrors: fullMistakes + (halfMistakes * 0.5),
      fullDetails: fullDetails.reverse(),
      halfDetails: halfDetails.reverse()
    };
  };

  // Complete current test run
  const completeTest = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setGameState('completed');

    const elapsed = timerStartedAtRef.current
      ? (Date.now() - timerStartedAtRef.current) / 1000
      : 1;

    const mins = Math.max(0.001, elapsed / 60);

    let finalWpm = 0;
    let finalRawWpm = 0;
    let finalAccuracy = '100.00';
    let finalRawAccuracy = 100;
    let scoreCard: any = null;

    if (testMode === 'govt-exam') {
      // Calculate according to strict SSC guidelines
      const typedString = typedTextRef.current;
      const analysis = alignPassages(targetText, typedString);
      
      const grossKeystrokes = totalKeystrokesRef.current;
      const totalErrors = analysis.totalWeightedErrors;
      const grossWords = grossKeystrokes / 5;
      
      const grossWpmVal = Math.round(grossWords / mins);
      const netKeystrokes = Math.max(0, grossKeystrokes - (totalErrors * 5));
      const netWpmVal = Math.round((netKeystrokes / 5) / mins);
      
      const errorPercentageVal = grossWords > 0 ? (totalErrors / grossWords) * 100 : 0;
      const accuracyVal = Math.max(0, 100 - errorPercentageVal).toFixed(2);
      
      // Determine limits based on Exam Type
      let speedTarget = 35;
      let errorThreshold = 7; // %
      if (govtExamType === 'ssc-cgl') {
        speedTarget = 27;
        errorThreshold = 5;
      } else if (govtExamType === 'state-clerk') {
        speedTarget = 30;
        errorThreshold = 5;
      }
      
      const isPassed = netWpmVal >= speedTarget && errorPercentageVal <= errorThreshold;
      
      scoreCard = {
        examType: govtExamType === 'ssc-chsl' ? 'SSC CHSL (English)' : govtExamType === 'ssc-cgl' ? 'SSC CGL (English)' : 'State Clerk Typing Exam',
        grossKeystrokes,
        grossWpm: grossWpmVal,
        netWpm: netWpmVal,
        fullMistakes: analysis.fullMistakes,
        halfMistakes: analysis.halfMistakes,
        totalErrors,
        errorPercentage: errorPercentageVal.toFixed(2),
        accuracy: accuracyVal,
        speedTarget,
        errorThreshold,
        status: isPassed ? 'PASSED' : 'FAILED',
        fullDetails: analysis.fullDetails,
        halfDetails: analysis.halfDetails
      };
      
      setExamScore(scoreCard);
      
      finalWpm = netWpmVal;
      finalRawWpm = grossWpmVal;
      finalAccuracy = accuracyVal;
      finalRawAccuracy = Math.round(parseFloat(accuracyVal));
    } else {
      const metrics = calculateMetrics(elapsed);
      finalWpm = metrics.wpm;
      finalRawWpm = metrics.rawWpm;
      finalAccuracy = metrics.accuracy;
      finalRawAccuracy = metrics.rawAccuracy;
      setExamScore(null);
    }

    setWpm(finalWpm);
    setRawWpm(finalRawWpm);
    setAccuracy(finalAccuracy);
    setRawAccuracy(finalRawAccuracy);

    // Save this run to local database
    const newRecord: TestRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      mode: testMode,
      limitValue: testMode === 'time' ? testTimeLimit : testMode === 'words' ? wordLimit : targetText.split(' ').length,
      wpm: finalWpm,
      accuracy: finalAccuracy,
      rawAccuracy: finalRawAccuracy,
      missedKeys: { ...missedKeys },
      wpmHistory: [...wpmHistory, finalWpm],
      rawWpmHistory: [...rawWpmHistory, finalRawWpm],
      timeHistory: [...timeHistory, Math.round(elapsed)],
      examScore: scoreCard // Save exam scorecard in history
    };

    setTestHistory(prev => {
      const updated = [newRecord, ...prev];
      localStorage.setItem('centerville_test_history', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle live inputs progress
  const handleProgress = (correctCount: number, typedLength: number, typedValue?: string) => {
    correctCountRef.current = correctCount;
    typedLengthRef.current = typedLength;
    if (typedValue !== undefined) {
      typedTextRef.current = typedValue;
    }
    
    if (timerStartedAtRef.current) {
      const elapsed = (Date.now() - timerStartedAtRef.current) / 1000;
      const metrics = calculateMetrics(elapsed);
      setLiveWpm(metrics.wpm);
    }
  };

  // Infinite Zen Mode words feed loader callback
  const loadMoreZenWords = useCallback(() => {
    const generated = [];
    for (let i = 0; i < 50; i++) {
      if (includeNumbers && Math.random() < 0.15) {
        const types = ['year', 'small', 'decimal', 'large', 'percent', 'range'];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        let numStr = '';
        switch (chosenType) {
          case 'year': numStr = (Math.floor(Math.random() * 50) + 1980).toString(); break;
          case 'small': numStr = Math.floor(Math.random() * 10).toString(); break;
          case 'decimal': numStr = (Math.random() * 100).toFixed(Math.floor(Math.random() * 2) + 1); break;
          case 'large': numStr = Math.floor(Math.random() * 9000 + 1000).toString(); break;
          case 'percent': numStr = `${Math.floor(Math.random() * 100)}%`; break;
          case 'range':
            const start = Math.floor(Math.random() * 10) + 1;
            const end = start + Math.floor(Math.random() * 10) + 1;
            numStr = `${start}-${end}`;
            break;
          default: numStr = Math.floor(Math.random() * 100).toString();
        }
        generated.push(numStr);
      } else {
        const index = Math.floor(Math.random() * COMMON_WORDS.length);
        generated.push(COMMON_WORDS[index]);
      }
    }

    let wordsText = generated.join(' ');
    if (includePunctuation) {
      const processed = [];
      let i = 0;
      while (i < generated.length) {
        const remaining = generated.length - i;
        const len = Math.min(remaining, Math.floor(Math.random() * 6) + 5);
        for (let j = 0; j < len; j++) {
          let w = generated[i + j];
          if (j === 0 && /[a-zA-Z]/.test(w)) w = w.charAt(0).toUpperCase() + w.slice(1);
          if (j < len - 1 && Math.random() < 0.12 && !/[.,;:!?%]$/.test(w)) w = w + (Math.random() < 0.8 ? ',' : ';');
          if (j === len - 1 && !/[.,;:!?%]$/.test(w)) w = w + (Math.random() < 0.85 ? '.' : '?');
          processed.push(w);
        }
        i += len;
      }
      wordsText = processed.join(' ');
    }

    setTargetText(prev => prev + ' ' + wordsText);
  }, [includePunctuation, includeNumbers]);

  // Count keystrokes and track missed characters
  const handleKeystroke = (isError: boolean, missedChar?: string) => {
    totalKeystrokesRef.current += 1;
    if (isError) {
      incorrectKeystrokesRef.current += 1;
      if (missedChar) {
        setMissedKeys(prev => ({
          ...prev,
          [missedChar]: (prev[missedChar] || 0) + 1
        }));
      }
      
      if (suddenDeath) {
        completeTest();
      }
    }
  };

  // Handle sound status updates
  const toggleSound = () => {
    const nextState = !isSoundOn;
    setIsSoundOn(nextState);
    synth.enabled = nextState;
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
            <header className="flex items-center justify-between w-full border-b border-white/5 pb-4">
              <div className="flex flex-col text-left">
                <div className="text-[26px] font-bold text-[var(--text-body-main)] leading-none font-sans flex items-center gap-2">
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
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-[var(--accent-color)] bg-black/40 text-slate-300 hover:text-white transition-all duration-300 cursor-pointer active:scale-95 shadow-sm text-[13px] font-semibold"
                  title="Open customizer settings"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => setIsDashboardOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--accent-color)]/30 bg-black/40 hover:bg-black/85 hover:border-[var(--accent-color)] text-[var(--accent-color)] hover:text-white transition-all duration-300 cursor-pointer active:scale-95 shadow-md text-[13px] font-semibold"
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
              <p className="text-[14px] text-slate-400 max-w-[620px] leading-relaxed">
                Train speed, precision, and hand posture with simulated mechanical switch acoustics, live WPM spline graphs, and targeted error coaching reports.
              </p>
            </div>

            {/* Configuration Bar */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Configure Practice:</span>
                
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
                      : 'bg-black/45 border-white/5 text-slate-400 hover:text-white'
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
                      : 'bg-black/45 border-white/5 text-slate-400 hover:text-white'
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
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Duration:</span>
                    <div className="flex bg-black/40 border border-white/5 rounded-lg p-0.5">
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
                              : 'text-slate-400 hover:text-white'
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
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Words:</span>
                    <div className="flex bg-black/40 border border-white/5 rounded-lg p-0.5">
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
                              : 'text-slate-400 hover:text-white'
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
                  <span className="text-[11px] text-slate-500 italic">
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
                    : 'border-white/5 bg-white/[0.01] hover:border-white/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${testMode === 'time' ? 'bg-[var(--accent-color)] text-black' : 'bg-white/5 text-slate-400 group-hover:text-white'} transition-colors`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Timed Mode</h4>
                  <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">Race against the timer. Choose from 15s to 120s intervals.</p>
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
                    : 'border-white/5 bg-white/[0.01] hover:border-white/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${testMode === 'words' ? 'bg-[var(--accent-color)] text-black' : 'bg-white/5 text-slate-400 group-hover:text-white'} transition-colors`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Words Mode</h4>
                  <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">No countdown stress. Type a fixed volume of random words.</p>
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
                    : 'border-white/5 bg-white/[0.01] hover:border-white/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${testMode === 'quotes' ? 'bg-[var(--accent-color)] text-black' : 'bg-white/5 text-slate-400 group-hover:text-white'} transition-colors`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Quote Mode</h4>
                  <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">Practice with real literature sentences and historical records.</p>
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
                    : 'border-white/5 bg-white/[0.01] hover:border-white/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${testMode === 'custom' ? 'bg-[var(--accent-color)] text-black' : 'bg-white/5 text-slate-400 group-hover:text-white'} transition-colors`}>
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Custom Mode</h4>
                  <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">Paste your own paragraphs, code syntax, or word lists.</p>
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
                    : 'border-white/5 bg-white/[0.01] hover:border-white/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${testMode === 'zen' ? 'bg-[var(--accent-color)] text-black' : 'bg-white/5 text-slate-400 group-hover:text-white'} transition-colors`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Zen Mode</h4>
                  <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">Indefinite, stress-free training. Complete the session whenever you want.</p>
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
                    : 'border-white/5 bg-white/[0.01] hover:border-white/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${testMode === 'weak-keys' ? 'bg-[var(--accent-color)] text-black' : 'bg-white/5 text-slate-400 group-hover:text-white'} transition-colors`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-white uppercase tracking-wide">Weak Keys Practice</h4>
                  <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">Targeted muscle memory. Generates paragraphs focusing on your missed keys.</p>
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
                className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 hover:text-white font-semibold text-[13px] tracking-wide transition-all duration-300 cursor-pointer active:scale-95"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Open Performance Profile</span>
              </button>
            </div>

            {/* Feature Spotlight Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 border-t border-white/5 pt-6 text-left">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Acoustic Audio</span>
                <p className="text-[12px] text-slate-400 leading-relaxed">Synthetic Cherry MX switches play actual keycaps clicking, tactile clicks, and error buzzers on the fly.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Live Spline Curves</span>
                <p className="text-[12px] text-slate-400 leading-relaxed">Vector chart curves display raw WPM velocity and accuracy consistency over typing intervals.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Error Coaching</span>
                <p className="text-[12px] text-slate-400 leading-relaxed">We record character mistypes and generate personalized coaching recommendations for your hands.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">100% Privacy Stored</span>
                <p className="text-[12px] text-slate-400 leading-relaxed">No signups, no cloud sync. All statistics, settings, and runs databases are kept local on your machine.</p>
              </div>
            </div>
          </div>
        ) : gameState === 'completed' ? (
          /* ==========================================================================
             RESULTS VIEW AFTER TEST COMPLETION (Detailed analytics layout)
             ========================================================================== */
          <div className="flex flex-col gap-6 animate-fadeIn w-full">
            {/* Results Title Banner */}
            <header className="flex justify-between items-center border-b border-white/5 pb-5">
              <div>
                <h1 className="text-3xl font-bold text-[var(--accent-color)] flex items-center gap-2">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  Test Completed!
                </h1>
                <p className="text-[13px] text-[var(--text-body-muted)] mt-1">Here is your detailed performance breakdown.</p>
              </div>

              {/* Quick Preset Accent Selection */}
              <div className="flex gap-3 items-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-2">Theme</span>
                {(['blue', 'pink', 'green', 'grey', 'white'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => {
                      setAccentTheme(theme);
                      saveConfig({ accentTheme: theme });
                    }}
                    className={`theme-dot dot-${theme} cursor-pointer ${accentTheme === theme ? 'active' : ''}`}
                    title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Accent Theme`}
                    aria-label={`${theme} Theme selection`}
                  />
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
                    <p className="text-xs text-slate-400 mt-1">
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
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-center text-left">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Net Speed</span>
                    <span className="text-3xl font-extrabold text-white mt-1 font-mono">
                      {examScore.netWpm} <span className="text-xs text-slate-500">WPM</span>
                    </span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-center text-left">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Gross Speed</span>
                    <span className="text-3xl font-extrabold text-white mt-1 font-mono">
                      {examScore.grossWpm} <span className="text-xs text-slate-500">WPM</span>
                    </span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-center text-left">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Key Depressions</span>
                    <span className="text-3xl font-extrabold text-white mt-1 font-mono">
                      {examScore.grossKeystrokes} <span className="text-[10px] text-slate-500">keys</span>
                    </span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-center text-left">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Weighted Error Rate</span>
                    <span className="text-3xl font-extrabold mt-1 font-mono" style={{ color: parseFloat(examScore.errorPercentage) <= examScore.errorThreshold ? 'var(--accent-color)' : '#ef4444' }}>
                      {examScore.errorPercentage}%
                    </span>
                  </div>
                </div>

                {/* Detailed Mistakes Log */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {/* Left: Full Mistakes (Omissions/Additions) */}
                  <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 max-h-[220px] overflow-y-auto">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      Full Mistakes ({examScore.fullMistakes} count)
                    </h3>
                    {examScore.fullDetails.length > 0 ? (
                      <ul className="text-xs font-mono space-y-1.5 text-slate-400 list-disc list-inside">
                        {examScore.fullDetails.slice(0, 15).map((detail: string, idx: number) => (
                          <li key={idx} className="hover:text-white transition-colors">{detail}</li>
                        ))}
                        {examScore.fullDetails.length > 15 && (
                          <li className="text-[10px] text-slate-500 italic list-none">...and {examScore.fullDetails.length - 15} more full errors</li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-xs text-emerald-400 font-mono italic">No full omissions or additions logged.</p>
                    )}
                  </div>

                  {/* Right: Half Mistakes (Capitalization/Spacing) */}
                  <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 max-h-[220px] overflow-y-auto">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Half Mistakes ({examScore.halfMistakes} count = {examScore.halfMistakes * 0.5} weighted)
                    </h3>
                    {examScore.halfDetails.length > 0 ? (
                      <ul className="text-xs font-mono space-y-1.5 text-slate-400 list-disc list-inside">
                        {examScore.halfDetails.slice(0, 15).map((detail: string, idx: number) => (
                          <li key={idx} className="hover:text-white transition-colors">{detail}</li>
                        ))}
                        {examScore.halfDetails.length > 15 && (
                          <li className="text-[10px] text-slate-500 italic list-none">...and {examScore.halfDetails.length - 15} more half errors</li>
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
                <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-4">
                  <h3 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[var(--accent-color)]" />
                    Speed & Accuracy
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <div className="text-[11px] text-slate-500 uppercase tracking-wider">Correct Speed</div>
                      <div className="text-4xl font-bold text-white flex items-baseline leading-none mt-1">
                        <span>{wpm}</span>
                        <span className="text-[12px] text-slate-500 ml-1">WPM</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 uppercase tracking-wider">Raw Speed</div>
                      <div className="text-4xl font-bold text-white flex items-baseline leading-none mt-1">
                        <span>{rawWpm}</span>
                        <span className="text-[12px] text-slate-500 ml-1">WPM</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 uppercase tracking-wider">Accuracy</div>
                      <div className="text-4xl font-bold text-white flex items-baseline leading-none mt-1">
                        <span>{accuracy}</span>
                        <span className="text-[16px] text-slate-500 ml-0.5">%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 uppercase tracking-wider">Duration Taken</div>
                      <div className="text-4xl font-bold text-white flex items-baseline leading-none mt-1">
                        <span>{testMode === 'time' ? testTimeLimit : timeLeft}</span>
                        <span className="text-[12px] text-slate-500 ml-1">s</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Error Suggestions / Key Analysis panel */}
                <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-4">
                  <h3 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[var(--accent-color)]" />
                    Key Error Analysis
                  </h3>

                  {/* Missed keys breakdown */}
                  <div className="text-left">
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">Frequently Missed Keys</div>
                    {sortedMisses.length > 0 ? (
                      <div className="flex gap-3 mt-2">
                        {sortedMisses.map(([key, count]) => (
                          <div 
                            key={key} 
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black border border-white/5 font-mono text-[13px] text-white"
                          >
                            <span className="bg-white/10 px-1.5 py-0.5 rounded font-bold text-[var(--accent-color)]">
                              {key === ' ' ? 'Space' : key}
                            </span>
                            <span className="text-slate-400 text-[11px]">x{count}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[13px] text-emerald-400 font-medium mt-2 animate-pulse">Perfect run! No character mistakes logged.</p>
                    )}
                  </div>

                  {/* Suggestions tips text */}
                  <div className="border-t border-white/5 pt-3 text-left">
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">Coaching Recommendation</div>
                    <p className="text-[12.5px] text-slate-300 leading-relaxed mt-1.5 font-sans">
                      {getPracticeTip()}
                    </p>
                  </div>
                </section>

              </div>
            )}

            {/* WPM Spline History Chart in results */}
            <section className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
              <h3 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Speed Progression Curve</h3>
              <div className="relative w-full h-[150px]">
                <WpmChart
                  wpmHistory={wpmHistory}
                  rawWpmHistory={rawWpmHistory}
                  timeHistory={timeHistory}
                  testTimeLimit={testMode === 'time' ? testTimeLimit : timeLeft}
                  accentTheme={accentTheme}
                />
              </div>
            </section>

            {/* Results Bottom Restart Actions */}
            <div className="flex justify-center mt-3">
              <button
                onClick={resetTest}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-white/10 bg-[var(--accent-color)] hover:bg-white text-black font-bold transition-all duration-300 cursor-pointer shadow-lg active:scale-95 text-[14px]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Restart Practice Test</span>
              </button>
            </div>
          </div>
        ) : (
          /* ==========================================================================
             MAIN TYPING TEST LAYOUT VIEW (Focused typing mode)
             ========================================================================= */
          <div className="flex flex-col justify-between items-center flex-1 animate-fadeIn w-full min-h-0">
            
            {/* Header control row (fades out when typing) */}
            <header 
              className={`flex items-center justify-between w-full transition-opacity duration-500 mb-6 md:mb-10 ${
                gameState === 'running' ? 'opacity-0 pointer-events-none' : 'opacity-100'
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
                  <div className="text-xl md:text-2xl font-black text-[var(--text-body-main)] lowercase tracking-tight leading-none">
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
                gameState === 'running' ? 'opacity-0 pointer-events-none' : 'opacity-100'
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
                              disableBackspace ? 'text-rose-400 font-bold' : 'text-slate-400'
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
                    <span className="text-[11px] text-slate-500 font-medium mt-1 font-mono uppercase tracking-wider">
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
                      className="stroke-white/5"
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
                    <span className="text-xl font-extrabold text-white leading-none font-mono">
                      {liveWpm}
                    </span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">
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
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/5 bg-[var(--bg-widget)] hover:bg-white/10 text-[var(--accent-color)] transition-all cursor-pointer active:scale-90"
                  title="Restart Test (Esc)"
                >
                  <RefreshCw className="w-4 h-4 transition-transform duration-500 hover:rotate-180" />
                </button>
                
                <div className="text-[11px] text-[var(--text-body-muted)] font-mono">
                  Press <kbd className="bg-black/35 border border-white/10 rounded px-1.5 py-0.5 text-[var(--accent-color)]">Esc</kbd> to restart
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
          className={`flex items-center justify-center gap-4 mt-8 pt-5 border-t border-white/5 text-[11.5px] text-[var(--text-body-muted)] font-mono select-none w-full transition-opacity duration-500 ${
            gameState === 'running' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div>&copy; 2026 centerville</div>
          <div className="w-1 h-1 rounded-full bg-slate-500 opacity-40"></div>
          <div>v2.2.0</div>
          <div className="w-1 h-1 rounded-full bg-slate-500 opacity-40"></div>
          <div>press <kbd className="bg-black/35 border border-white/10 rounded px-1.5 py-0.5 text-[var(--accent-color)]">esc</kbd> to restart</div>
        </footer>

      </div>

      {/* ================= SEO & INFORMATIONAL FOOTER (Below the Fold) ================= */}
      <section className={`w-full max-w-[1080px] mx-auto mt-16 mb-12 text-left font-sans transition-opacity duration-500 ${
        gameState === 'running' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 rounded-2xl bg-black/20 border border-white/5">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-body-main)] mb-3">About this Typing Test</h2>
            <p className="text-[13px] text-[var(--text-body-muted)] leading-relaxed mb-4">
              Centerville is a premium, minimalist typing speed test designed to help you improve your words per minute (WPM) and accuracy. Whether you are practicing for a government typing exam, learning to touch type, or just warming up your fingers for coding, our tool provides real-time feedback and detailed analytics.
            </p>
            <h3 className="text-[14px] font-semibold text-[var(--text-body-main)] mt-6 mb-2">What is a good WPM?</h3>
            <p className="text-[13px] text-[var(--text-body-muted)] leading-relaxed">
              An average typing speed is around 40 WPM. Speeds above 60 WPM are considered good for most administrative or data entry jobs. If you can type over 90 WPM, you are considered a fast typist, and speeds over 120 WPM are exceptional. Use our Ghost Pacer feature to constantly push your average up!
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--text-body-main)] mb-2">Specialized Practice Modes</h3>
              <ul className="text-[13px] text-[var(--text-body-muted)] leading-relaxed space-y-3">
                <li><strong className="text-[var(--accent-color)]">Government Exam Mode:</strong> A strict split-screen mode with manual submission, simulating traditional data entry and clerk typing exams (like SSC). It calculates gross and net WPM using strict error penalty rules.</li>
                <li><strong className="text-[var(--accent-color)]">Weak Key Drills:</strong> Our engine tracks the exact keys you mistype across your sessions and generates custom paragraphs focusing specifically on your weakest fingers.</li>
                <li><strong className="text-[var(--accent-color)]">Sudden Death:</strong> For accuracy purists. The test instantly terminates if you make a single typo. Highly effective for building 100% precision.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Settings Drawer Panel overlay */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
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
        accentTheme={accentTheme}
        onAccentThemeChange={(theme) => {
          setAccentTheme(theme);
          saveConfig({ accentTheme: theme });
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
