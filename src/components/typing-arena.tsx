'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Keyboard } from 'lucide-react';
import { TypingAudioSynthesizer } from '@/lib/synth';
import { HindiTransliterator, needsTransliteration } from '@/lib/transliterate';

interface TypingArenaProps {
  targetText: string;
  author?: string;
  title?: string;
  fontSize: number;
  fontFamily?: string;
  cursorStyle: 'pipe' | 'block' | 'outline' | 'underline';
  synth: TypingAudioSynthesizer | null;
  gameState: 'idle' | 'running' | 'completed';
  onStart: () => void;
  onComplete: () => void;
  onKeystroke: (isError: boolean, missedChar?: string) => void;
  onProgress: (correctCount: number, typedLength: number, typedValue?: string) => void;
  resetCounter: number; // Increment triggers a reset of typing state
  testMode?: string;
  onLoadMoreWords?: () => void;
  disableBackspace?: boolean;
  timeLeft?: number;
  liveWpm?: number;
  ghostWpm?: number;
  language?: string;  // e.g. 'hindi', 'english'
  strictMode?: boolean; // If true, completely blocks incorrect keystrokes. Default false.
}

export const TypingArena: React.FC<TypingArenaProps> = ({
  targetText,
  author,
  title,
  fontSize,
  fontFamily,
  cursorStyle,
  synth,
  gameState,
  onStart,
  onComplete,
  onKeystroke,
  onProgress,
  resetCounter,
  testMode,
  onLoadMoreWords,
  disableBackspace = false,
  timeLeft,
  liveWpm,
  ghostWpm = 0,
  language = 'english',
  strictMode = false,
}) => {
  // typedVal is used for caret positioning (derived from actual textarea DOM value)
  const [typedVal, setTypedVal] = useState('');
  const typedValRef = useRef(''); // always up-to-date without stale closure issues
  const [isFocused, setIsFocused] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordsDisplayRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const caretRef = useRef<HTMLDivElement | null>(null);
  const ghostCaretRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isComposingRef = useRef(false); // tracks IME composition state
  // Phonetic transliteration engine (used when OS IME is not available)
  const transliteratorRef = useRef<HindiTransliterator>(new HindiTransliterator());
  const usePhonetic = needsTransliteration(language);

  // Focus textarea
  const focusInput = () => {
    if (gameState !== 'completed' && textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Reset typing state when resetCounter changes
  useEffect(() => {
    typedValRef.current = '';
    setTypedVal('');
    startTimeRef.current = gameState === 'running' ? Date.now() : null;
    transliteratorRef.current.reset(); // reset phonetic transliteration state
    if (textareaRef.current) {
      textareaRef.current.value = '';
    }
    if (wordsDisplayRef.current) {
      wordsDisplayRef.current.scrollTop = 0;
      // Manually clear correct/incorrect classes without destroying DOM nodes
      const spans = wordsDisplayRef.current.querySelectorAll('.char');
      spans.forEach(span => {
        span.classList.remove('correct', 'incorrect');
      });
      const allWords = wordsDisplayRef.current.querySelectorAll('.word');
      allWords.forEach(w => w.classList.remove('active-word'));
    }
    // Re-focus
    setTimeout(focusInput, 50);
  }, [resetCounter]);

  // Position caret whenever typed value or font size changes
  useEffect(() => {
    const wordsDisplay = wordsDisplayRef.current;
    const caret = caretRef.current;
    if (!wordsDisplay || !caret) return;

    const allSpans = wordsDisplay.querySelectorAll('.char');
    if (allSpans.length === 0) return;

    if (gameState === 'completed' || !isFocused) {
      caret.style.display = 'none';
      if (ghostCaretRef.current) ghostCaretRef.current.style.display = 'none';
      return;
    }

    if (gameState === 'idle') {
      if (ghostCaretRef.current) ghostCaretRef.current.style.display = 'none';
      // Do not return here, we want the actual caret to be displayed and positioned!
    }

    caret.style.display = 'block';
    const typedLen = typedVal.length;

    let targetSpan = null;
    let isAtEnd = false;

    if (typedLen < allSpans.length) {
      targetSpan = allSpans[typedLen] as HTMLElement;
    } else {
      targetSpan = allSpans[allSpans.length - 1] as HTMLElement;
      isAtEnd = true;
    }

    if (targetSpan) {
      const offsetLeft = targetSpan.offsetLeft;
      const offsetTop = targetSpan.offsetTop;
      const offsetWidth = targetSpan.offsetWidth;
      const offsetHeight = targetSpan.offsetHeight;

      caret.style.height = `${offsetHeight}px`;

      if (cursorStyle === 'pipe') {
        caret.style.left = `${isAtEnd ? offsetLeft + offsetWidth : offsetLeft}px`;
        caret.style.width = '2px';
      } else {
        caret.style.left = `${isAtEnd ? offsetLeft + offsetWidth : offsetLeft}px`;
        caret.style.width = `${isAtEnd ? 10 : offsetWidth}px`;
      }
      caret.style.top = `${offsetTop}px`;

      // Auto scroll container to center the active character line vertically
      const containerHeight = wordsDisplay.clientHeight;
      const targetScroll = offsetTop - (containerHeight / 2) + (offsetHeight / 2);

      wordsDisplay.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth'
      });

      // Highlight active word
      const allWords = wordsDisplay.querySelectorAll('.word');
      const activeWord = targetSpan.closest('.word');
      allWords.forEach(w => w.classList.remove('active-word'));
      if (activeWord) {
        activeWord.classList.add('active-word');
      }
    }
  }, [typedVal, fontSize, cursorStyle, gameState, resetCounter, isFocused]);

  // Ghost Caret positioning loop
  useEffect(() => {
    if (ghostWpm <= 0 || gameState !== 'running' || testMode === 'govt-exam') return;
    
    let animationFrameId: number;
    
    const updateGhost = () => {
      if (gameState !== 'running') return;
      const wordsDisplay = wordsDisplayRef.current;
      const ghost = ghostCaretRef.current;
      if (!wordsDisplay || !ghost || !startTimeRef.current) return;
      
      const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
      const charsPerSecond = (ghostWpm * 5) / 60;
      const expectedCharIndex = Math.floor(elapsedSeconds * charsPerSecond);
      
      const allSpans = wordsDisplay.querySelectorAll('.char');
      if (allSpans.length === 0) return;
      
      let targetSpan: HTMLElement | null = null;
      let isAtEnd = false;
      
      if (expectedCharIndex < allSpans.length) {
        targetSpan = allSpans[expectedCharIndex] as HTMLElement;
      } else {
        targetSpan = allSpans[allSpans.length - 1] as HTMLElement;
        isAtEnd = true;
      }
      
      if (targetSpan) {
        const offsetLeft = targetSpan.offsetLeft;
        const offsetTop = targetSpan.offsetTop;
        const offsetWidth = targetSpan.offsetWidth;
        const offsetHeight = targetSpan.offsetHeight;
        
        ghost.style.display = 'block';
        ghost.style.height = `${offsetHeight}px`;
        if (cursorStyle === 'pipe') {
          ghost.style.left = `${isAtEnd ? offsetLeft + offsetWidth : offsetLeft}px`;
          ghost.style.width = '2px';
        } else {
          ghost.style.left = `${isAtEnd ? offsetLeft + offsetWidth : offsetLeft}px`;
          ghost.style.width = `${isAtEnd ? 10 : offsetWidth}px`;
        }
        ghost.style.top = `${offsetTop}px`;
      }
      
      animationFrameId = requestAnimationFrame(updateGhost);
    };
    
    animationFrameId = requestAnimationFrame(updateGhost);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, ghostWpm, cursorStyle, testMode]);

  // Key Down audio & count trigger
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (gameState === 'completed') return;
    if (isComposingRef.current) return; // ignore keypresses during IME composition

    if (e.key === 'Enter' && e.ctrlKey && (testMode === 'zen' || testMode === 'govt-exam')) {
      e.preventDefault();
      onComplete();
      return;
    }

    // Start the test on first printable keystroke (similar to Monkeytype)
    if (gameState === 'idle') {
      const isModifier = e.ctrlKey || e.metaKey || e.altKey;
      const isPrintable = e.key.length === 1 || e.key === ' ';
      if (isPrintable && !isModifier && e.key !== 'Escape' && e.key !== 'Tab') {
        startTimeRef.current = Date.now();
        onStart();
      }
    }

    // ── Phonetic transliteration mode ──────────────────────────────────────
    // When the selected language needs transliteration (Hindi, Marathi, etc.)
    // we intercept every keypress, feed it to the transliterator engine, and
    // write the resulting Devanagari string back into the textarea ourselves.
    if (usePhonetic) {
      const key = e.key;

      // Let browser handle these normally
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return;

      e.preventDefault(); // stop the raw Latin char from appearing

      if (key === 'Backspace') {
        if (disableBackspace) { synth?.playClick('error'); return; }
        synth?.playClick('backspace');
        const newOutput = transliteratorRef.current.processKey('Backspace');
        if (textareaRef.current) textareaRef.current.value = newOutput;
        processInput(newOutput);
        return;
      }

      if (key === ' ') {
        synth?.playClick('space');
        const newOutput = transliteratorRef.current.processKey(' ');
        if (textareaRef.current) textareaRef.current.value = newOutput;
        processInput(newOutput);
        onKeystroke(false);
        return;
      }

      if (key.length === 1) {
        synth?.playClick('char');
        const newOutput = transliteratorRef.current.processKey(key);
        if (textareaRef.current) textareaRef.current.value = newOutput;
        processInput(newOutput);
        onKeystroke(false);
        return;
      }

      return;
    }
    // ── Normal (non-phonetic) mode ──────────────────────────────────────────
    const currentLength = Array.from(typedValRef.current).length;
    const targetChars = Array.from(targetText);

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const expectedChar = targetChars[currentLength];
      if (expectedChar && e.key !== expectedChar) {
        if (strictMode) {
          e.preventDefault();
          synth?.playClick('error');
          onKeystroke(true, expectedChar);
        }
        return; // Don't play success sounds for errors. Let processInput handle error sounds if not in strictMode.
      }
    }

    if (e.key === ' ') {
      synth?.playClick('space');
      onKeystroke(false); // Make sure space counts as a keystroke
    } else if (e.key === 'Backspace') {
      if (disableBackspace) {
        e.preventDefault();
        synth?.playClick('error');
        return;
      }
      synth?.playClick('backspace');
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      onKeystroke(false);
      synth?.playClick('char');
    }
  };

  // IME composition handlers — per W3C IME API spec (https://www.w3.org/TR/ime-api/)
  // During composition, element.value already contains the intermediate composed text.
  // We must NOT block onChange during this time, and should also handle compositionupdate
  // to catch live updates as the user selects candidates.
  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  // compositionupdate fires for every intermediate candidate change (per W3C spec)
  // Read value directly from the DOM textarea (not React synthetic event) to get the latest text
  const handleCompositionUpdate = () => {
    if (gameState === 'completed' || !textareaRef.current) return;
    const value = textareaRef.current.value;
    if (gameState === 'idle' && value.length > 0) {
      startTimeRef.current = Date.now();
      onStart();
    }
    // Process the live intermediate value for visual feedback
    processInput(value);
  };

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
    // After composition ends, read the final committed value from the DOM
    if (gameState === 'completed' || !textareaRef.current) return;
    const value = textareaRef.current.value;
    processInput(value);
    // Count one keystroke for the entire composed word/character
    onKeystroke(false);
    synth?.playClick('char');
  };  // Core input processor — called from onChange, compositionupdate, and compositionend
  // Accepts the raw string value directly from the textarea DOM node
  const processInput = (value: string) => {
    if (gameState === 'completed') return;

    // Use Array.from for proper Unicode grapheme segmentation (handles Hindi, etc.)
    const valueChars = Array.from(value);
    const targetChars = Array.from(targetText);
    
    // Only accept up to targetText length for modes other than govt-exam
    if (testMode !== 'govt-exam' && valueChars.length > targetChars.length) {
      // Trim the textarea back to max allowed length
      if (textareaRef.current) {
        const trimmed = Array.from(textareaRef.current.value).slice(0, targetChars.length).join('');
        textareaRef.current.value = trimmed;
      }
      return;
    }

    if (gameState === 'idle' && value.length > 0) {
      startTimeRef.current = Date.now();
      onStart();
    }

    // Update ref immediately (sync), state asynchronously (for caret render)
    typedValRef.current = value;
    setTypedVal(value);

    // If Zen mode, and value.length is near the end, load more words
    if (testMode === 'zen' && onLoadMoreWords && targetChars.length - valueChars.length < 50) {
      onLoadMoreWords();
    }

    if (testMode === 'govt-exam') {
      // Government exam mode live progress calculations
      let correctCount = 0;
      let newTypingError = false;
      const len = Math.min(valueChars.length, targetChars.length);

      for (let i = 0; i < len; i++) {
        if (valueChars[i] === targetChars[i]) {
          correctCount++;
        } else {
          if (i === valueChars.length - 1 && valueChars.length > Array.from(typedValRef.current).length) {
            newTypingError = true;
          }
        }
      }

      if (valueChars.length > targetChars.length && valueChars.length > Array.from(typedValRef.current).length) {
        newTypingError = true;
      }

      if (newTypingError) {
        synth?.playClick('error');
        const lastCharIndex = valueChars.length - 1;
        let missedChar: string | undefined = undefined;
        if (lastCharIndex >= 0 && lastCharIndex < targetChars.length) {
          missedChar = targetChars[lastCharIndex];
        }
        onKeystroke(true, missedChar);
      }

      onProgress(correctCount, valueChars.length, value);
      return;
    }

    // Calculate correctness progress using proper Unicode segmentation
    const wordsDisplay = wordsDisplayRef.current;
    if (!wordsDisplay) return;

    const allSpans = wordsDisplay.querySelectorAll('.char');
    let correctCount = 0;
    let newTypingError = false;

    // Check correct inputs
    for (let i = 0; i < allSpans.length; i++) {
      const span = allSpans[i] as HTMLElement;
      
      if (i < valueChars.length) {
        const spanText = span.textContent === '\u00a0' ? ' ' : span.textContent;
        const typedChar = valueChars[i];
        
        if (typedChar === spanText) {
          if (!span.classList.contains('correct')) {
            span.classList.remove('incorrect');
            span.classList.add('correct');
          }
          correctCount++;
        } else {
          if (!span.classList.contains('incorrect')) {
            span.classList.remove('correct');
            span.classList.add('incorrect');
            newTypingError = true;
          }
        }
      } else {
        span.classList.remove('correct', 'incorrect');
      }
    }

    // Trigger error sound and report typo stats
    if (newTypingError) {
      synth?.playClick('error');
      const lastCharIndex = valueChars.length - 1;
      let missedChar: string | undefined = undefined;
      if (valueChars.length > Array.from(typedValRef.current).length && lastCharIndex >= 0) {
        const typedChar = valueChars[lastCharIndex];
        const span = allSpans[lastCharIndex] as HTMLElement;
        const targetChar = span?.classList.contains('space-char') ? ' ' : span?.textContent || '';
        if (typedChar !== targetChar) {
          missedChar = targetChar;
        }
      }
      onKeystroke(true, missedChar);
    }

    onProgress(correctCount, valueChars.length, value);

    if (valueChars.length >= Array.from(targetText).length) {
      onComplete();
    }
  };

  // onChange handler — React synthetic event (fires for normal keystrokes and after IME commit)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isComposingRef.current) return; // during IME, compositionupdate handles it
    processInput(e.target.value);
  };

  // Split targetText into words
  const words = targetText.split(' ');

  if (testMode === 'govt-exam') {
    const typedWordCount = typedVal.trim().split(/\s+/).filter(Boolean).length;
    const targetWordCount = targetText.trim().split(/\s+/).filter(Boolean).length;

    return (
      <section 
        ref={containerRef}
        onClick={focusInput}
        className={`widget flex-1 flex flex-col gap-6 p-2 min-h-[320px] h-full relative bg-transparent border-none shadow-none transition-all duration-300 w-full ${isFocused ? 'cursor-text' : 'cursor-pointer'}`}
        id="widget-typing-arena-govt"
      >
        {/* Reference Passage Block */}
        <div className="flex flex-col gap-2 w-full text-left flex-1 min-h-0">
          <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest font-mono">
            Reference Passage (Read and Type Below)
          </div>
          <div 
            className="w-full select-text overflow-y-auto flex-1 bg-black/35 border border-[var(--border-subtle)] rounded-xl p-5 text-[var(--text-main)] font-mono leading-relaxed transition-all duration-300 shadow-inner scrollbar-thin"
            style={{ fontSize: `${fontSize - 2}px`, fontFamily: fontFamily || 'inherit' }}
          >
            {targetText}
          </div>
        </div>

        {/* Candidate Typing Box */}
        <div className="flex flex-col gap-2 w-full text-left flex-1 min-h-0">
          <div className="flex justify-between items-center text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest font-mono">
            <span>Candidate Typing Area</span>
            <span className="text-[10px] text-[var(--text-muted)] font-semibold normal-case flex items-center gap-3">
              {(timeLeft !== undefined && liveWpm !== undefined) && (
                <>
                  <span>Time: <span className="text-white">{timeLeft}s</span></span>
                  <span>WPM: <span className="text-white">{liveWpm}</span></span>
                  <span className="text-white/20">|</span>
                </>
              )}
              <span>Keystrokes: <span className="text-[var(--accent-color)]">{typedVal.length}</span> / {targetText.length}</span>
              <span>Words: <span className="text-[var(--accent-color)]">{typedWordCount}</span> / {targetWordCount}</span>
            </span>
          </div>
          <textarea
            ref={textareaRef}
            defaultValue=""
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionUpdate={handleCompositionUpdate}
            onCompositionEnd={handleCompositionEnd}
            className="w-full flex-1 p-4 rounded-xl border border-[var(--border-active)] bg-[var(--bg-panel)] text-slate-100 font-mono resize-none focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)]/30 transition-all duration-200"
            style={{ fontSize: `min(${fontSize - 2}px, 5.5vw)`, fontFamily: fontFamily || 'inherit' }}
            placeholder="Start typing the passage here..."
            spellCheck="false"
            autoComplete="off"
            autoCapitalize="off"
            disabled={gameState === 'completed'}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label="Type the government exam text here"
          />
          {!isFocused && gameState !== 'completed' && (
            <div className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-[2px] rounded-xl transition-all pointer-events-none">
              <span className="flex items-center gap-2 bg-[var(--text-main)] text-[var(--bg-panel)] px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                <Keyboard className="w-4 h-4" /> Click to focus and start typing
              </span>
            </div>
          )}
        </div>

        {/* Passage Info Footer */}
        {author && title && (
          <footer 
            className="flex items-center text-[12px] text-[var(--text-muted)] font-sans mt-1"
            id="typing-meta-container"
          >
            <span className="font-semibold text-[var(--text-muted)]">{title}</span>
            <span className="mx-2 opacity-50">&bull;</span>
            <span className="italic opacity-80">{author}</span>
          </footer>
        )}
      </section>
    );
  }

  return (
    <section 
      ref={containerRef}
      onClick={focusInput}
      className={`widget flex flex-col justify-between py-2 sm:py-4 px-2 sm:px-4 md:px-8 relative bg-transparent border-none shadow-none transition-all duration-300 w-full ${isFocused ? 'cursor-text' : 'cursor-pointer'}`}
      id="widget-typing-arena"
    >
      <div className="relative w-full overflow-hidden flex-1">
        {/* Focusable textarea */}
        <textarea
          ref={textareaRef}
          defaultValue=""
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionUpdate={handleCompositionUpdate}
          onCompositionEnd={handleCompositionEnd}
          className="sr-only"
          style={{ position: 'fixed', top: '-200px', left: '0', opacity: 0, width: '1px', height: '1px' }}
          spellCheck="false"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          disabled={gameState === 'completed'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Type the text here"
        />

        {!isFocused && gameState !== 'completed' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-[2px] rounded-xl transition-all pointer-events-none">
            <span className="flex items-center gap-2 bg-[var(--text-main)] text-[var(--bg-panel)] px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              <Keyboard className="w-4 h-4" /> Click to focus and start typing
            </span>
          </div>
        )}

        {/* Display Container */}
        <div 
          ref={wordsDisplayRef}
          className="words-container relative flex flex-wrap align-start text-[var(--text-muted)] font-mono select-none overflow-hidden leading-[1.8] tracking-[0.02em]"
          style={{ fontSize: `min(${fontSize}px, 6vw)`, height: '6.3em' }}
        >
          <div 
            ref={caretRef}
            className={`caret absolute bg-white pointer-events-none z-10 transition-all duration-100 ease-out ${
              !isFocused ? 'hidden' : (cursorStyle === 'pipe' ? 'pipe-cursor' : cursorStyle === 'block' ? 'block-cursor' : cursorStyle === 'outline' ? 'outline-cursor' : 'underline-cursor')
            }`}
            id="typing-caret"
          />

          {/* Ghost Caret */}
          {ghostWpm > 0 && testMode !== 'govt-exam' && (
            <div 
              ref={ghostCaretRef}
              className={`caret absolute bg-slate-400 opacity-30 pointer-events-none z-5 transition-[left,top] duration-200 ease-linear ${
                !isFocused ? 'hidden' : (cursorStyle === 'pipe' ? 'pipe-cursor' : cursorStyle === 'block' ? 'block-cursor' : cursorStyle === 'outline' ? 'outline-cursor' : 'underline-cursor')
              }`}
              id="ghost-typing-caret"
            />
          )}

          {words.map((wordText, wordIdx) => (
            <span key={wordIdx} className="word inline-block mb-2" id={`word-${wordIdx}`}>
              {Array.from(wordText).map((char, charIdx) => (
                <span key={charIdx} className="char transition-colors duration-100">
                  {char}
                </span>
              ))}
              {/* Space span at end of word */}
              {wordIdx < words.length - 1 && (
                <span className="char space-char">&nbsp;</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Quote Metadata Footer */}
      {author && title && (
        <footer 
          className="flex items-center mt-6 text-[13px] text-[var(--text-muted)] font-sans"
          id="typing-meta-container"
        >
          <span className="font-medium">{author}</span>
          <span className="mx-2 opacity-50">&bull;</span>
          <span className="italic opacity-80">{title}</span>
        </footer>
      )}
    </section>
  );
};
