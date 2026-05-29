import { useState, useEffect, useRef } from 'react';
import { TypingAudioSynthesizer } from '@/lib/synth';

export function useTypingConfig() {
  // Global customizable settings
  const [currentTheme, setCurrentTheme] = useState<string>('carbon');
  const [languageId, setLanguageId] = useState<string>('english');
  const [fontId, setFontId] = useState<string>('standard');
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

  // New Helpful Features
  const [suddenDeath, setSuddenDeath] = useState<boolean>(false);
  const [ghostWpm, setGhostWpm] = useState<number>(0);

  // View state and practice filters
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [showSpeedometer, setShowSpeedometer] = useState<boolean>(true);

  // Audio Synthesizer Instance
  const synthRef = useRef<TypingAudioSynthesizer | null>(null);
  if (typeof window !== 'undefined' && !synthRef.current) {
    synthRef.current = new TypingAudioSynthesizer();
  }
  const synth = synthRef.current;

  // Load configuration (client side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('centerville_settings_react_v2');
      if (saved) {
        try {
          const config = JSON.parse(saved);
          setCurrentTheme(config.currentTheme || 'carbon');
          setDimMode(config.dimMode || false);
          setCursorStyle(config.cursorStyle || 'pipe');
          setLanguageId(config.languageId || config.language || 'english');
          setFontId(config.fontId || 'standard');
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
          
          if (synth) {
            synth.enabled = config.soundEnabled ?? true;
            synth.switchProfile = config.switchProfile || 'blue';
          }
        } catch (err) {
          console.error("Failed to load local config", err);
        }
      }
    }
  }, [synth]);

  const saveConfig = (updated: Record<string, any>) => {
    let currentConfig = {};
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('centerville_settings_react_v2');
      if (saved) {
        try {
          currentConfig = JSON.parse(saved);
        } catch (e) {}
      }
    }
    
    const config = {
      currentTheme,
      dimMode,
      languageId,
      fontId,
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
      ...currentConfig,
      ...updated
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('centerville_settings_react_v2', JSON.stringify(config));
    }
  };

  // Sync mechanical switch settings to synth instance
  useEffect(() => {
    if (synth) synth.switchProfile = switchProfile;
  }, [switchProfile, synth]);

  // Sync sound status to synth instance
  useEffect(() => {
    if (synth) synth.enabled = isSoundOn;
  }, [isSoundOn, synth]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Apply unified theme class
      document.body.className = document.body.className.replace(/theme-\w+/g, '');
      document.body.classList.add(`theme-${currentTheme}`);

      if (dimMode) {
        document.body.classList.add('dim-mode');
      } else {
        document.body.classList.remove('dim-mode');
      }
    }
  }, [currentTheme, dimMode]);

  return {
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
  };
}
