import { useState, useCallback } from 'react';
import { LANGUAGES } from '@/lib/languages';

export function useTextGenerator(config: any, testHistory: any[]) {
  const [targetText, setTargetText] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [title, setTitle] = useState<string>('');

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
                counts[cleanKey] = (counts[cleanKey] || 0) + (val as number);
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

  return { targetText, author, title, generateText, loadMoreZenWords };
}
