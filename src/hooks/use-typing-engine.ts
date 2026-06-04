import { useState, useRef, useCallback, useEffect } from 'react';
import { LANGUAGES } from '@/lib/languages';
import { TestRecord } from '@/components/stats-dashboard';
import { useAuth } from '@/context/auth-context';

export function useTypingEngine(config: any) {
  // Try to use auth if available safely
  let auth: any = null;
  try {
    auth = useAuth();
  } catch (e) {
    // Auth context not initialized yet (e.g. static shell render)
  }
  const token = auth?.token;

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
  const [liveWpm, setLiveWpm] = useState<number>(0);

  // Missed Keys tracking state
  const [missedKeys, setMissedKeys] = useState<Record<string, number>>({});

  // Graph History States
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [rawWpmHistory, setRawWpmHistory] = useState<number[]>([]);
  const [timeHistory, setTimeHistory] = useState<number[]>([]);

  // Local Performance History Database
  const [testHistory, setTestHistory] = useState<TestRecord[]>([]);
  
  // Government Exam score
  const [examScore, setExamScore] = useState<any>(null);

  // Refs to store values to prevent stale interval states
  const correctCountRef = useRef<number>(0);
  const typedLengthRef = useRef<number>(0);
  const typedTextRef = useRef<string>('');
  const totalKeystrokesRef = useRef<number>(0);
  const incorrectKeystrokesRef = useRef<number>(0);
  const timerStartedAtRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load History Table
  useEffect(() => {
    if (token) {
      fetch('http://localhost:4000/api/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats from DB');
        return res.json();
      })
      .then(data => {
        const mappedHistory: TestRecord[] = data.map((item: any) => ({
          id: item.id.toString(),
          date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          mode: item.mode,
          limitValue: 0,
          wpm: item.wpm,
          accuracy: parseFloat(item.accuracy).toFixed(2),
          rawAccuracy: Math.round(parseFloat(item.accuracy)),
          missedKeys: {},
          wpmHistory: [],
          rawWpmHistory: [],
          timeHistory: []
        }));
        setTestHistory(mappedHistory);
      })
      .catch(err => {
        console.error('Failed to sync history with database API:', err);
      });
    } else {
      if (typeof window !== 'undefined') {
        const savedHist = localStorage.getItem('centerville_test_history');
        if (savedHist) {
          try {
            setTestHistory(JSON.parse(savedHist));
          } catch (e) {
            console.error("Failed to load run history", e);
          }
        }
      }
    }
  }, [token]);

  const generateText = useCallback(() => {
    const activeLang = LANGUAGES.find(l => l.id === config.languageId) || LANGUAGES[0];

    if (config.testMode === 'quotes') {
      const activeQuotes = activeLang.quotes && activeLang.quotes.length > 0 ? activeLang.quotes : LANGUAGES[0].quotes;
      const randomIndex = Math.floor(Math.random() * activeQuotes.length);
      const quote = activeQuotes[randomIndex];
      setTargetText(quote.text);
      setAuthor(quote.author);
      setTitle(quote.title);
    } else if (config.testMode === 'govt-exam') {
      const activePassages = activeLang.examPassages && activeLang.examPassages.length > 0 ? activeLang.examPassages : LANGUAGES[0].examPassages;
      const randomIndex = Math.floor(Math.random() * activePassages.length);
      const passage = activePassages[randomIndex];
      setTargetText(passage.text);
      setAuthor(passage.source);
      setTitle(passage.title);
    } else if (config.testMode === 'custom') {
      setTargetText(config.customText.trim() || 'Custom text is empty.');
      setAuthor('');
      setTitle('');
    } else {
      const limit = config.testMode === 'words' ? config.wordLimit : config.testMode === 'zen' ? 50 : 150;
      const baseWords = activeLang.words && activeLang.words.length > 0 ? activeLang.words : LANGUAGES[0].words;
      let sourceWords = baseWords;
      let weakKeysStr = '';

      if (config.testMode === 'weak-keys') {
        const counts: Record<string, number> = {};
        testHistory.forEach(record => {
          if (record.missedKeys) {
            Object.entries(record.missedKeys).forEach(([key, val]) => {
              const cleanKey = key.toLowerCase();
              if (/[a-z\u0900-\u097F]/.test(cleanKey)) {
                counts[cleanKey] = (counts[cleanKey] || 0) + val;
              }
            });
          }
        });
        const weakKeys = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .map(x => x[0])
          .slice(0, 3);
        const fallbackKeys = config.languageId === 'english' ? ['z', 'x', 'q', 'p', 'v'] : baseWords.slice(0,5).map(w => w[0] || 'a');
        const activeWeakKeys = weakKeys.length > 0 ? weakKeys : fallbackKeys;
        weakKeysStr = activeWeakKeys.join(', ').toUpperCase();
        
        const filtered = baseWords.filter(w => 
          activeWeakKeys.some(k => w.toLowerCase().includes(k))
        );
        sourceWords = filtered.length > 10 ? filtered : baseWords;
      }

      const generated: string[] = [];
      for (let i = 0; i < limit; i++) {
        if (config.includeNumbers && Math.random() < 0.15) {
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
          const index = Math.floor(Math.random() * sourceWords.length);
          generated.push(sourceWords[index]);
        }
      }

      if (config.includePunctuation) {
        const processed = [];
        let i = 0;
        while (i < generated.length) {
          const remaining = generated.length - i;
          const sentenceLen = Math.min(remaining, Math.floor(Math.random() * 6) + 5);
          for (let j = 0; j < sentenceLen; j++) {
            let word = generated[i + j];
            if (j === 0 && /[a-zA-Z]/.test(word)) word = word.charAt(0).toUpperCase() + word.slice(1);
            if (j > 0 && j < sentenceLen - 1 && Math.random() < 0.08) {
              const wrapType = Math.random() < 0.5 ? 'quotes' : 'parentheses';
              if (wrapType === 'quotes') word = `"${word}"`;
              else word = `(${word})`;
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
      setTitle(config.testMode === 'zen' ? 'Zen Indefinite Practice' : config.testMode === 'weak-keys' ? `Weak Keys Practice (${weakKeysStr})` : '');
    }
  }, [config.testMode, config.wordLimit, config.customText, config.includePunctuation, config.includeNumbers, testHistory, config.languageId]);

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
    setTimeLeft(config.testMode === 'time' ? config.testTimeLimit : 0);
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
  }, [config.testTimeLimit, config.testMode, config.wordLimit, generateText]);

  useEffect(() => {
    resetTest();
  }, [config.testMode, config.testTimeLimit, config.wordLimit, config.includePunctuation, config.includeNumbers, config.customText, config.languageId]);

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

  const handleClearHistory = () => {
    setTestHistory([]);
    localStorage.removeItem('centerville_test_history');
  };

  const calculateMetrics = (elapsed: number) => {
    const mins = Math.max(0.001, elapsed / 60);
    const correct = correctCountRef.current;
    const typedLen = typedLengthRef.current;
    const totalKeys = totalKeystrokesRef.current;
    const incorrectKeys = incorrectKeystrokesRef.current;

    if (typedLen === 0) return { wpm: 0, rawWpm: 0, accuracy: '100.00', rawAccuracy: 100 };

    const currentWpm = Math.round((correct / 5) / mins);
    const currentRawWpm = Math.round((typedLen / 5) / mins);
    const currentAcc = ((correct / typedLen) * 100).toFixed(2);
    const currentRawAcc = totalKeys > 0 ? Math.round(((totalKeys - incorrectKeys) / totalKeys) * 100) : 100;

    return { wpm: currentWpm, rawWpm: currentRawWpm, accuracy: currentAcc, rawAccuracy: Math.max(0, currentRawAcc) };
  };

  const alignPassages = (targetStr: string, typedStr: string) => {
    const targetWords = targetStr.trim().split(/\s+/).filter(Boolean);
    const typedWords = typedStr.trim().split(/\s+/).filter(Boolean);
    const m = targetWords.length;
    const n = typedWords.length;
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
    
    let i = m, j = n;
    let fullMistakes = 0;
    let halfMistakes = 0;
    const fullDetails: string[] = [];
    const halfDetails: string[] = [];
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && targetWords[i - 1].toLowerCase() === typedWords[j - 1].toLowerCase()) {
        if (targetWords[i - 1] !== typedWords[j - 1]) {
          halfMistakes += 1;
          halfDetails.push(`Capitalization: typed "${typedWords[j - 1]}" instead of "${targetWords[i - 1]}"`);
        }
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        fullMistakes += 1;
        fullDetails.push(`Addition: extra word "${typedWords[j - 1]}"`);
        j--;
      } else {
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

  const completeTest = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setGameState('completed');

    const elapsed = timerStartedAtRef.current ? (Date.now() - timerStartedAtRef.current) / 1000 : 1;
    const mins = Math.max(0.001, elapsed / 60);

    let finalWpm = 0, finalRawWpm = 0, finalAccuracy = '100.00', finalRawAccuracy = 100;
    let scoreCard: any = null;

    if (config.testMode === 'govt-exam') {
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
      
      let speedTarget = 35;
      let errorThreshold = 7;
      if (config.govtExamType === 'ssc-cgl') { speedTarget = 27; errorThreshold = 5; }
      else if (config.govtExamType === 'state-clerk') { speedTarget = 30; errorThreshold = 5; }
      
      const isPassed = netWpmVal >= speedTarget && errorPercentageVal <= errorThreshold;
      scoreCard = {
        examType: config.govtExamType === 'ssc-chsl' ? 'SSC CHSL (English)' : config.govtExamType === 'ssc-cgl' ? 'SSC CGL (English)' : 'State Clerk Typing Exam',
        grossKeystrokes, grossWpm: grossWpmVal, netWpm: netWpmVal,
        fullMistakes: analysis.fullMistakes, halfMistakes: analysis.halfMistakes,
        totalErrors, errorPercentage: errorPercentageVal.toFixed(2),
        accuracy: accuracyVal, speedTarget, errorThreshold,
        status: isPassed ? 'PASSED' : 'FAILED',
        fullDetails: analysis.fullDetails, halfDetails: analysis.halfDetails
      };
      setExamScore(scoreCard);
      finalWpm = netWpmVal; finalRawWpm = grossWpmVal;
      finalAccuracy = accuracyVal; finalRawAccuracy = Math.round(parseFloat(accuracyVal));
    } else {
      const metrics = calculateMetrics(elapsed);
      finalWpm = metrics.wpm; finalRawWpm = metrics.rawWpm;
      finalAccuracy = metrics.accuracy; finalRawAccuracy = metrics.rawAccuracy;
      setExamScore(null);
    }

    setWpm(finalWpm); setRawWpm(finalRawWpm); setAccuracy(finalAccuracy); setRawAccuracy(finalRawAccuracy);

    const newRecord: TestRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      mode: config.testMode,
      limitValue: config.testMode === 'time' ? config.testTimeLimit : config.testMode === 'words' ? config.wordLimit : targetText.split(' ').length,
      wpm: finalWpm, accuracy: finalAccuracy, rawAccuracy: finalRawAccuracy,
      missedKeys: { ...missedKeys },
      wpmHistory: [...wpmHistory, finalWpm],
      rawWpmHistory: [...rawWpmHistory, finalRawWpm],
      timeHistory: [...timeHistory, Math.round(elapsed)],
      examScore: scoreCard
    };

    if (token) {
      fetch('http://localhost:4000/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          wpm: finalWpm,
          accuracy: parseFloat(finalAccuracy),
          test_type: config.testMode
        })
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save stats to server');
        return res.json();
      })
      .then(savedItem => {
        console.log('Saved stats to server:', savedItem);
      })
      .catch(err => {
        console.error('Failed to save stats to server:', err);
      });
    }

    setTestHistory(prev => {
      const updated = [newRecord, ...prev];
      localStorage.setItem('centerville_test_history', JSON.stringify(updated));
      return updated;
    });
  };

  const startTest = () => {
    setGameState('running');
    timerStartedAtRef.current = Date.now();
    
    if (config.testMode === 'time') {
      setTimeLeft(config.testTimeLimit);
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const nextTime = prev - 1;
          const elapsed = (Date.now() - (timerStartedAtRef.current || Date.now())) / 1000;
          const metrics = calculateMetrics(elapsed);
          setWpm(metrics.wpm); setRawWpm(metrics.rawWpm); setAccuracy(metrics.accuracy); setRawAccuracy(metrics.rawAccuracy); setLiveWpm(metrics.wpm);
          setWpmHistory(hist => [...hist, metrics.wpm]); setRawWpmHistory(hist => [...hist, metrics.rawWpm]); setTimeHistory(timeHist => [...timeHist, Math.round(elapsed)]);
          if (nextTime <= 0) { completeTest(); return 0; }
          return nextTime;
        });
      }, 1000);
    } else {
      setTimeLeft(0);
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const nextTime = prev + 1;
          const elapsed = (Date.now() - (timerStartedAtRef.current || Date.now())) / 1000;
          const metrics = calculateMetrics(elapsed);
          setWpm(metrics.wpm); setRawWpm(metrics.rawWpm); setAccuracy(metrics.accuracy); setRawAccuracy(metrics.rawAccuracy); setLiveWpm(metrics.wpm);
          setWpmHistory(hist => [...hist, metrics.wpm]); setRawWpmHistory(hist => [...hist, metrics.rawWpm]); setTimeHistory(timeHist => [...timeHist, Math.round(elapsed)]);
          return nextTime;
        });
      }, 1000);
    }
  };

  const handleProgress = (correctCount: number, typedLength: number, typedValue?: string) => {
    correctCountRef.current = correctCount;
    typedLengthRef.current = typedLength;
    if (typedValue !== undefined) typedTextRef.current = typedValue;
    if (timerStartedAtRef.current) {
      const elapsed = (Date.now() - timerStartedAtRef.current) / 1000;
      setLiveWpm(calculateMetrics(elapsed).wpm);
    }
  };

  const loadMoreZenWords = useCallback(() => {
    const generated: string[] = [];
    const activeLang = LANGUAGES.find(l => l.id === config.languageId) || LANGUAGES[0];
    const baseWords = activeLang.words && activeLang.words.length > 0 ? activeLang.words : LANGUAGES[0].words;
    for (let i = 0; i < 50; i++) {
      if (config.includeNumbers && Math.random() < 0.15) {
        generated.push(Math.floor(Math.random() * 100).toString());
      } else if (config.includePunctuation && Math.random() < 0.1) {
          const punctuation = config.languageId === 'hindi' || config.languageId === 'marathi' ? [',', '।', '?', '!', ' -', '...'] : [',', '.', '?', '!', ';', ':', ' -', '...'];
          generated.push(baseWords[Math.floor(Math.random() * baseWords.length)] + punctuation[Math.floor(Math.random() * punctuation.length)]);
      } else {
        generated.push(baseWords[Math.floor(Math.random() * baseWords.length)]);
      }
    }
    setTargetText(prev => prev + ' ' + generated.join(' '));
  }, [config.includePunctuation, config.includeNumbers, config.languageId]);

  const handleKeystroke = (isError: boolean, missedChar?: string) => {
    totalKeystrokesRef.current += 1;
    if (isError) {
      incorrectKeystrokesRef.current += 1;
      if (missedChar) {
        setMissedKeys(prev => ({ ...prev, [missedChar]: (prev[missedChar] || 0) + 1 }));
      }
      
      if (config.suddenDeath) {
        completeTest();
      }
    }
  };

  const getCharacterStats = useCallback(() => {
    const target = targetText;
    const typed = typedTextRef.current;
    let correct = 0;
    let incorrect = 0;
    let extra = 0;
    
    const minLen = Math.min(target.length, typed.length);
    for (let i = 0; i < minLen; i++) {
      if (typed[i] === target[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }
    if (typed.length > target.length) {
      extra = typed.length - target.length;
    }
    const missed = Math.max(0, target.length - typed.length);
    
    return { correct, incorrect, extra, missed };
  }, [targetText]);

  return {
    targetText, author, title,
    gameState, timeLeft, resetCounter,
    wpm, rawWpm, accuracy, rawAccuracy, liveWpm,
    missedKeys, wpmHistory, rawWpmHistory, timeHistory,
    testHistory, setTestHistory, examScore,
    resetTest, startTest, completeTest, handleProgress, loadMoreZenWords, handleKeystroke, handleClearHistory,
    getCharacterStats
  };
}

