import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { TestRecord } from '@/components/stats-dashboard';
import { useTextGenerator } from './use-text-generator';
import { useTypingTimer } from './use-typing-timer';
import { useTypingMetrics } from './use-typing-metrics';

export function useTypingEngine(config: any) {
  let auth: any = null;
  try {
    auth = useAuth();
  } catch (e) { }
  const token = auth?.token;

  const [gameState, setGameState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [resetCounter, setResetCounter] = useState<number>(0);

  const metrics = useTypingMetrics(config, token);
  const generator = useTextGenerator(config, metrics.testHistory);

  const onTick = useCallback((elapsed: number) => {
    const calc = metrics.calculateMetrics(elapsed);
    metrics.setWpm(calc.wpm);
    metrics.setRawWpm(calc.rawWpm);
    metrics.setAccuracy(calc.accuracy);
    metrics.setRawAccuracy(calc.rawAccuracy);
    metrics.setLiveWpm(calc.wpm);
    metrics.setWpmHistory(hist => [...hist, calc.wpm]);
    metrics.setRawWpmHistory(hist => [...hist, calc.rawWpm]);
    metrics.setTimeHistory(timeHist => [...timeHist, Math.round(elapsed)]);
  }, [metrics]);

  const alignPassages = useCallback((targetStr: string, typedStr: string) => {
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
  }, []);

  const onCompleteRef = useRef<() => void>(() => { });

  const timer = useTypingTimer(config, onTick, () => onCompleteRef.current());

  const completeTestImpl = useCallback(() => {
    if (timer.timerIntervalRef.current) {
      clearInterval(timer.timerIntervalRef.current);
      timer.timerIntervalRef.current = null;
    }
    setGameState('completed');

    const elapsed = timer.getElapsed();
    const mins = Math.max(0.001, elapsed / 60);

    let finalWpm = 0, finalRawWpm = 0, finalAccuracy = '100.00', finalRawAccuracy = 100;
    let scoreCard: any = null;

    if (config.testMode === 'govt-exam') {
      const typedString = metrics.typedTextRef.current;
      const analysis = alignPassages(generator.targetText, typedString);
      const grossKeystrokes = metrics.totalKeystrokesRef.current;
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
      metrics.setExamScore(scoreCard);
      finalWpm = netWpmVal; finalRawWpm = grossWpmVal;
      finalAccuracy = accuracyVal; finalRawAccuracy = Math.round(parseFloat(accuracyVal));
    } else {
      const calc = metrics.calculateMetrics(elapsed);
      finalWpm = calc.wpm; finalRawWpm = calc.rawWpm;
      finalAccuracy = calc.accuracy; finalRawAccuracy = calc.rawAccuracy;
      metrics.setExamScore(null);
    }

    metrics.setWpm(finalWpm); metrics.setRawWpm(finalRawWpm); metrics.setAccuracy(finalAccuracy); metrics.setRawAccuracy(finalRawAccuracy);

    const newRecord: TestRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      mode: config.testMode,
      limitValue: config.testMode === 'time' ? config.testTimeLimit : config.testMode === 'words' ? config.wordLimit : generator.targetText.split(' ').length,
      wpm: finalWpm, accuracy: finalAccuracy, rawAccuracy: finalRawAccuracy,
      missedKeys: { ...metrics.missedKeys },
      wpmHistory: [...metrics.wpmHistory, finalWpm],
      rawWpmHistory: [...metrics.rawWpmHistory, finalRawWpm],
      timeHistory: [...metrics.timeHistory, Math.round(elapsed)],
      examScore: scoreCard
    };

    if (token) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://typingmaster-bibp.onrender.com';
      fetch(`${apiUrl}/api/stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ wpm: finalWpm, accuracy: parseFloat(finalAccuracy), test_type: config.testMode })
      }).catch(err => console.warn('Failed to save stats:', err));
    }

    metrics.setTestHistory(prev => {
      const updated = [newRecord, ...prev];
      localStorage.setItem('typingthunder_test_history', JSON.stringify(updated));
      return updated;
    });
  }, [timer, metrics, config, generator.targetText, token, alignPassages]);

  useEffect(() => {
    onCompleteRef.current = completeTestImpl;
  }, [completeTestImpl]);


  const resetTest = useCallback(() => {
    timer.resetTimer();
    metrics.resetMetrics();
    setGameState('idle');
    setResetCounter(prev => prev + 1);
    generator.generateText();
  }, [timer, metrics, generator]);

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

  const startTest = useCallback(() => {
    setGameState('running');
    timer.startTimer();
  }, [timer]);

  const handleProgress = useCallback((correctCount: number, currentTypedLength: number, typedValue?: string) => {
    metrics.handleProgress(correctCount, currentTypedLength, typedValue);
    if (timer.getElapsed() > 0 && gameState === 'running') {
      const elapsed = timer.getElapsed();
      metrics.setLiveWpm(metrics.calculateMetrics(elapsed).wpm);
    }
  }, [metrics, timer, gameState]);

  const handleKeystroke = useCallback((isError: boolean, missedChar?: string) => {
    metrics.handleKeystroke(isError, missedChar);
    if (isError && config.suddenDeath) {
      completeTestImpl();
    }
  }, [metrics, config.suddenDeath, completeTestImpl]);

  const getCharacterStats = useCallback(() => {
    const target = generator.targetText;
    const typed = metrics.typedTextRef.current;
    let correct = 0; let incorrect = 0; let extra = 0;
    const minLen = Math.min(target.length, typed.length);
    for (let i = 0; i < minLen; i++) {
      if (typed[i] === target[i]) correct++;
      else incorrect++;
    }
    if (typed.length > target.length) extra = typed.length - target.length;
    const missed = Math.max(0, target.length - typed.length);
    return { correct, incorrect, extra, missed };
  }, [generator.targetText, metrics.typedTextRef]);

  return {
    targetText: generator.targetText, author: generator.author, title: generator.title,
    gameState, timeLeft: timer.timeLeft, resetCounter,
    wpm: metrics.wpm, rawWpm: metrics.rawWpm, accuracy: metrics.accuracy, rawAccuracy: metrics.rawAccuracy, liveWpm: metrics.liveWpm,
    typedLength: metrics.typedLength,
    missedKeys: metrics.missedKeys, wpmHistory: metrics.wpmHistory, rawWpmHistory: metrics.rawWpmHistory, timeHistory: metrics.timeHistory,
    testHistory: metrics.testHistory, setTestHistory: metrics.setTestHistory, examScore: metrics.examScore,
    resetTest, startTest, completeTest: completeTestImpl, handleProgress, loadMoreZenWords: generator.loadMoreZenWords, handleKeystroke, handleClearHistory: metrics.handleClearHistory,
    getCharacterStats
  };
}
