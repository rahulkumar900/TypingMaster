'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { TypingAudioSynthesizer } from '@/lib/synth';

interface ConfigContextType {
  currentTheme: string;
  languageId: string;
  setLanguageId: React.Dispatch<React.SetStateAction<string>>;
  fontId: string;
  setFontId: React.Dispatch<React.SetStateAction<string>>;
  dimMode: boolean;
  setDimMode: React.Dispatch<React.SetStateAction<boolean>>;
  cursorStyle: 'pipe' | 'block' | 'outline' | 'underline';
  setCursorStyle: React.Dispatch<React.SetStateAction<'pipe' | 'block' | 'outline' | 'underline'>>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  isSoundOn: boolean;
  setIsSoundOn: React.Dispatch<React.SetStateAction<boolean>>;
  switchProfile: 'blue' | 'brown' | 'red';
  setSwitchProfile: React.Dispatch<React.SetStateAction<'blue' | 'brown' | 'red'>>;
  testMode: 'time' | 'words' | 'quotes' | 'custom' | 'zen' | 'weak-keys' | 'govt-exam';
  setTestMode: React.Dispatch<React.SetStateAction<'time' | 'words' | 'quotes' | 'custom' | 'zen' | 'weak-keys' | 'govt-exam'>>;
  testTimeLimit: number;
  setTestTimeLimit: React.Dispatch<React.SetStateAction<number>>;
  wordLimit: number;
  setWordLimit: React.Dispatch<React.SetStateAction<number>>;
  customText: string;
  setCustomText: React.Dispatch<React.SetStateAction<string>>;
  disableBackspace: boolean;
  setDisableBackspace: React.Dispatch<React.SetStateAction<boolean>>;
  govtExamType: 'ssc-chsl' | 'ssc-cgl' | 'state-clerk';
  setGovtExamType: React.Dispatch<React.SetStateAction<'ssc-chsl' | 'ssc-cgl' | 'state-clerk'>>;
  suddenDeath: boolean;
  setSuddenDeath: React.Dispatch<React.SetStateAction<boolean>>;
  ghostWpm: number;
  setGhostWpm: React.Dispatch<React.SetStateAction<number>>;
  includePunctuation: boolean;
  setIncludePunctuation: React.Dispatch<React.SetStateAction<boolean>>;
  includeNumbers: boolean;
  setIncludeNumbers: React.Dispatch<React.SetStateAction<boolean>>;
  showSpeedometer: boolean;
  setShowSpeedometer: React.Dispatch<React.SetStateAction<boolean>>;
  synth: TypingAudioSynthesizer | null;
  saveConfig: (updated: Record<string, any>) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const currentTheme = 'carbon';
  const [languageId, setLanguageId] = useState<string>('english');
  const [fontId, setFontId] = useState<string>('standard');
  const [dimMode, setDimMode] = useState<boolean>(false);
  const [cursorStyle, setCursorStyle] = useState<'pipe' | 'block' | 'outline' | 'underline'>('pipe');
  const [fontSize, setFontSize] = useState<number>(24);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [switchProfile, setSwitchProfile] = useState<'blue' | 'brown' | 'red'>('blue');
  
  const [testMode, setTestMode] = useState<'time' | 'words' | 'quotes' | 'custom' | 'zen' | 'weak-keys' | 'govt-exam'>('quotes');
  const [testTimeLimit, setTestTimeLimit] = useState<number>(60);
  const [wordLimit, setWordLimit] = useState<number>(25);
  const [customText, setCustomText] = useState<string>('Type whatever you want to practice here.');

  const [disableBackspace, setDisableBackspace] = useState<boolean>(false);
  const [govtExamType, setGovtExamType] = useState<'ssc-chsl' | 'ssc-cgl' | 'state-clerk'>('ssc-chsl');

  const [suddenDeath, setSuddenDeath] = useState<boolean>(false);
  const [ghostWpm, setGhostWpm] = useState<number>(0);

  const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [showSpeedometer, setShowSpeedometer] = useState<boolean>(true);

  const synthRef = useRef<TypingAudioSynthesizer | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined' && !synthRef.current) {
      synthRef.current = new TypingAudioSynthesizer();
    }
  }, []);
  const synth = synthRef.current;

  // Hydrate configurations on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('centerville_settings_react_v2');
      if (saved) {
        try {
          const config = JSON.parse(saved);
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

          if (synthRef.current) {
            synthRef.current.enabled = config.soundEnabled ?? true;
            synthRef.current.switchProfile = config.switchProfile || 'blue';
          }
        } catch (err) {
          console.error("Failed to load local config", err);
        }
      }
    }
  }, []);

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
    
    const configObj = {
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
      localStorage.setItem('centerville_settings_react_v2', JSON.stringify(configObj));
    }
  };

  // Sync mechanical switch settings
  useEffect(() => {
    if (synthRef.current) synthRef.current.switchProfile = switchProfile;
  }, [switchProfile]);

  // Sync sound status
  useEffect(() => {
    if (synthRef.current) synthRef.current.enabled = isSoundOn;
  }, [isSoundOn]);

  // Sync dim mode class on body
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (dimMode) {
        document.body.classList.add('dim-mode');
      } else {
        document.body.classList.remove('dim-mode');
      }
    }
  }, [dimMode]);

  return (
    <ConfigContext.Provider value={{
      currentTheme,
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
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
