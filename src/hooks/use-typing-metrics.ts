import { useState, useRef, useCallback, useEffect } from 'react';
import { TestRecord } from '@/components/stats-dashboard';

export function useTypingMetrics(config: any, token: string | undefined | null) {
  const [wpm, setWpm] = useState<number>(0);
  const [rawWpm, setRawWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<string>('100.00');
  const [rawAccuracy, setRawAccuracy] = useState<number>(100);
  const [liveWpm, setLiveWpm] = useState<number>(0);
  const [typedLength, setTypedLength] = useState<number>(0);
  const [missedKeys, setMissedKeys] = useState<Record<string, number>>({});
  
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [rawWpmHistory, setRawWpmHistory] = useState<number[]>([]);
  const [timeHistory, setTimeHistory] = useState<number[]>([]);
  const [testHistory, setTestHistory] = useState<TestRecord[]>([]);
  const [examScore, setExamScore] = useState<any>(null);

  const correctCountRef = useRef<number>(0);
  const typedLengthRef = useRef<number>(0);
  const typedTextRef = useRef<string>('');
  const totalKeystrokesRef = useRef<number>(0);
  const incorrectKeystrokesRef = useRef<number>(0);

  // Load History Table
  useEffect(() => {
    const loadLocalHistory = () => {
      if (typeof window !== 'undefined') {
        const savedHist = localStorage.getItem('typingthunder_test_history');
        if (savedHist) {
          try {
            setTestHistory(JSON.parse(savedHist));
          } catch (e) {
            console.error("Failed to load run history", e);
          }
        }
      }
    };

    if (token) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://typingmaster-bibp.onrender.com';
      fetch(`${apiUrl}/api/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          console.warn('Failed to fetch stats from DB. Status:', res.status);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (!data || !Array.isArray(data)) {
          loadLocalHistory();
          return;
        }
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
        console.warn('Failed to sync history with database API, falling back to local history:', err);
        loadLocalHistory();
      });
    } else {
      loadLocalHistory();
    }
  }, [token]);

  const resetMetrics = useCallback(() => {
    correctCountRef.current = 0;
    typedLengthRef.current = 0;
    typedTextRef.current = '';
    totalKeystrokesRef.current = 0;
    incorrectKeystrokesRef.current = 0;

    setTypedLength(0);
    setWpm(0);
    setRawWpm(0);
    setLiveWpm(0);
    setAccuracy('100.00');
    setRawAccuracy(100);
    setMissedKeys({});
    setWpmHistory([]);
    setRawWpmHistory([]);
    setTimeHistory([]);
    setExamScore(null);
  }, []);

  const calculateMetrics = useCallback((elapsed: number) => {
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
  }, []);

  const handleKeystroke = useCallback((isError: boolean, missedChar?: string) => {
    totalKeystrokesRef.current += 1;
    if (isError) {
      incorrectKeystrokesRef.current += 1;
      if (missedChar) {
        setMissedKeys(prev => ({ ...prev, [missedChar]: (prev[missedChar] || 0) + 1 }));
      }
    }
  }, []);

  const handleProgress = useCallback((correctCount: number, currentTypedLength: number, typedValue?: string) => {
    correctCountRef.current = correctCount;
    typedLengthRef.current = currentTypedLength;
    setTypedLength(currentTypedLength);
    if (typedValue !== undefined) typedTextRef.current = typedValue;
  }, []);

  const handleClearHistory = useCallback(() => {
    setTestHistory([]);
    localStorage.removeItem('typingthunder_test_history');
  }, []);

  return {
    wpm, setWpm,
    rawWpm, setRawWpm,
    accuracy, setAccuracy,
    rawAccuracy, setRawAccuracy,
    liveWpm, setLiveWpm,
    typedLength, setTypedLength,
    missedKeys, setMissedKeys,
    wpmHistory, setWpmHistory,
    rawWpmHistory, setRawWpmHistory,
    timeHistory, setTimeHistory,
    testHistory, setTestHistory,
    examScore, setExamScore,
    correctCountRef, typedLengthRef, typedTextRef, totalKeystrokesRef, incorrectKeystrokesRef,
    resetMetrics, calculateMetrics, handleKeystroke, handleProgress, handleClearHistory
  };
}
