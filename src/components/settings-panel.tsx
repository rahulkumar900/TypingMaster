'use client';

import React from 'react';
import { X, Settings, Keyboard, MousePointer, Type, Sliders, FileText, Sparkles } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cursorStyle: 'pipe' | 'block' | 'outline' | 'underline';
  onCursorChange: (style: 'pipe' | 'block' | 'outline' | 'underline') => void;
  testTimeLimit: number;
  onTimeChange: (time: number) => void;
  wordLimit: number;
  onWordLimitChange: (limit: number) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  testMode: 'time' | 'words' | 'quotes' | 'custom' | 'zen' | 'weak-keys' | 'govt-exam';
  onModeChange: (mode: 'time' | 'words' | 'quotes' | 'custom' | 'zen' | 'weak-keys' | 'govt-exam') => void;
  switchProfile: 'blue' | 'brown' | 'red';
  onSwitchChange: (profile: 'blue' | 'brown' | 'red') => void;
  customText: string;
  onCustomTextChange: (text: string) => void;
  includePunctuation: boolean;
  onPunctuationChange: (val: boolean) => void;
  includeNumbers: boolean;
  onNumbersChange: (val: boolean) => void;
  showSpeedometer: boolean;
  onShowSpeedometerChange: (val: boolean) => void;
  accentTheme: string;
  onAccentThemeChange: (theme: string) => void;
  suddenDeath: boolean;
  onSuddenDeathChange: (val: boolean) => void;
  ghostWpm: number;
  onGhostWpmChange: (wpm: number) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  cursorStyle,
  onCursorChange,
  testTimeLimit,
  onTimeChange,
  wordLimit,
  onWordLimitChange,
  fontSize,
  onFontSizeChange,
  testMode,
  onModeChange,
  switchProfile,
  onSwitchChange,
  customText,
  onCustomTextChange,
  includePunctuation,
  onPunctuationChange,
  includeNumbers,
  onNumbersChange,
  showSpeedometer,
  onShowSpeedometerChange,
  accentTheme,
  onAccentThemeChange,
  suddenDeath,
  onSuddenDeathChange,
  ghostWpm,
  onGhostWpmChange
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
      onClick={onClose}
    >
      {/* Settings Panel Sliding Drawer Container */}
      <aside 
        className="w-full max-w-[400px] h-full bg-[#0c0d12] border-l border-white/10 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto animate-slideIn"
        onClick={(e) => e.stopPropagation()}
        aria-label="Typing settings"
      >
        {/* Title Header */}
        <div className="flex flex-col gap-6">
          <header className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[var(--accent-color)]" />
              <h2 className="text-xl font-bold text-white font-sans">Settings</h2>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          {/* Test Modes Selectors */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Type className="w-3.5 h-3.5" />
              Test Mode
            </h3>
            <div className="grid grid-cols-2 gap-2 bg-white/[0.02] p-1 rounded-xl border border-white/5 w-full">
              {(['time', 'words', 'quotes', 'custom', 'zen', 'weak-keys', 'govt-exam'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onModeChange(mode)}
                  className={`py-2 px-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer uppercase ${
                    testMode === mode
                      ? 'bg-[var(--accent-color)] text-black font-bold shadow-[0_4px_12px_rgba(var(--accent-rgb),0.2)]'
                      : 'text-slate-500 hover:text-slate-50'
                  }`}
                >
                  {mode === 'weak-keys' ? 'weak keys' : mode === 'govt-exam' ? 'govt exam' : mode}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic mode suboptions */}
          {testMode === 'time' && (
            <div className="flex flex-col gap-3 animate-fadeIn">
              <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                Duration <span className="text-[10px] lowercase opacity-70 ml-0.5">(seconds)</span>
              </h3>
              <div className="flex bg-white/[0.02] p-1 rounded-xl border border-white/5 w-full">
                {([15, 30, 60, 120] as const).map((time) => (
                  <button
                    key={time}
                    onClick={() => onTimeChange(time)}
                    className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                      testTimeLimit === time
                        ? 'bg-[var(--accent-color)] text-black font-bold'
                        : 'text-slate-500 hover:text-slate-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {testMode === 'words' && (
            <div className="flex flex-col gap-3 animate-fadeIn">
              <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                Word Count
              </h3>
              <div className="flex bg-white/[0.02] p-1 rounded-xl border border-white/5 w-full">
                {([10, 25, 50, 100] as const).map((limit) => (
                  <button
                    key={limit}
                    onClick={() => onWordLimitChange(limit)}
                    className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                      wordLimit === limit
                        ? 'bg-[var(--accent-color)] text-black font-bold'
                        : 'text-slate-500 hover:text-slate-50'
                    }`}
                  >
                    {limit}
                  </button>
                ))}
              </div>
            </div>
          )}

          {testMode === 'custom' && (
            <div className="flex flex-col gap-3 animate-fadeIn">
              <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Custom Text
              </h3>
              <textarea
                value={customText}
                onChange={(e) => onCustomTextChange(e.target.value)}
                placeholder="Paste your custom text here to practice typing..."
                className="w-full h-32 bg-black border border-white/5 rounded-xl p-3 text-[13px] font-mono text-white placeholder-slate-600 resize-none focus:border-[var(--accent-color)] transition-colors focus:outline-none"
              />
            </div>
          )}
          {/* Practice Modifiers (Punctuation / Numbers) */}
          {(testMode === 'time' || testMode === 'words') && (
            <div className="flex flex-col gap-3 animate-fadeIn">
              <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                Practice Modifiers
              </h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors">
                  <span className="text-[13px] font-semibold text-slate-300">Punctuation</span>
                  <input
                    type="checkbox"
                    checked={includePunctuation}
                    onChange={(e) => onPunctuationChange(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-black text-[var(--accent-color)] focus:ring-0 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors">
                  <span className="text-[13px] font-semibold text-slate-300">Numbers</span>
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => onNumbersChange(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-black text-[var(--accent-color)] focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Sound Switch Profiles selector */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Keyboard className="w-3.5 h-3.5" />
              Keyboard Switch Sounds
            </h3>
            <div className="grid grid-cols-3 gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/5 w-full">
              {(['blue', 'brown', 'red'] as const).map((profile) => (
                <button
                  key={profile}
                  onClick={() => onSwitchChange(profile)}
                  className={`py-2 rounded-lg text-[12px] font-semibold transition-all cursor-pointer uppercase ${
                    switchProfile === profile
                      ? 'bg-[var(--accent-color)] text-black font-bold'
                      : 'text-slate-500 hover:text-slate-50'
                  }`}
                  title={`${profile.toUpperCase()} Mechanical Switch profile`}
                >
                  {profile === 'blue' ? 'Blue' : profile === 'brown' ? 'Brown' : 'Red'}
                </button>
              ))}
            </div>
          </div>

          {/* Cursor Style selectors */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <MousePointer className="w-3.5 h-3.5" />
              Cursor representation
            </h3>
            <div className="flex bg-white/[0.02] p-1 rounded-xl border border-white/5 w-full">
              {(['pipe', 'block', 'outline', 'underline'] as const).map((cursor) => (
                <button
                  key={cursor}
                  onClick={() => onCursorChange(cursor)}
                  className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all cursor-pointer font-mono ${
                    cursorStyle === cursor
                      ? 'bg-[var(--accent-color)] text-black shadow-[0_4px_12px_rgba(var(--accent-rgb),0.2)]'
                      : 'text-slate-500 hover:text-slate-50'
                  }`}
                  title={`${cursor.charAt(0).toUpperCase() + cursor.slice(1)} Cursor`}
                >
                  {cursor === 'pipe' ? '|' : cursor === 'block' ? '■' : cursor === 'outline' ? 'o' : '_'}
                </button>
              ))}
            </div>
          </div>

          {/* Theme selectors */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Accent Theme
            </h3>
            <div className="grid grid-cols-5 gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/5 w-full">
              {(['blue', 'pink', 'green', 'grey', 'white'] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => onAccentThemeChange(theme)}
                  className={`py-2 flex items-center justify-center rounded-lg text-[10px] font-bold transition-all cursor-pointer uppercase ${
                    accentTheme === theme
                      ? 'bg-[var(--accent-color)] text-black shadow-[0_4px_12px_rgba(var(--accent-rgb),0.2)]'
                      : 'text-slate-500 hover:text-slate-50'
                  }`}
                  title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`}
                >
                  {theme === 'blue' ? 'Neo' : theme === 'pink' ? 'Cyber' : theme === 'green' ? 'Matcha' : theme === 'grey' ? 'Carbon' : 'Arctic'}
                </button>
              ))}
            </div>
          </div>

          {/* Interface Toggles */}
          <div className="flex flex-col gap-3 animate-fadeIn">
            <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" />
              Interface Settings
            </h3>
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors">
              <span className="text-[13px] font-semibold text-slate-300">Live Speedometer</span>
              <input
                type="checkbox"
                checked={showSpeedometer}
                onChange={(e) => onShowSpeedometerChange(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-black text-[var(--accent-color)] focus:ring-0 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-red-500/10 cursor-pointer hover:bg-white/[0.04] hover:border-red-500/30 transition-colors group">
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-red-400 group-hover:text-red-300 transition-colors">Sudden Death Mode</span>
                <span className="text-[10px] text-slate-500">Test fails instantly on first typo</span>
              </div>
              <input
                type="checkbox"
                checked={suddenDeath}
                onChange={(e) => onSuddenDeathChange(e.target.checked)}
                className="w-4 h-4 rounded border-red-500/20 bg-black text-red-500 focus:ring-0 cursor-pointer"
              />
            </label>
          </div>

          {/* Font size selectors */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-baseline">
              <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Font size</h3>
              <span className="text-[12px] font-bold text-[var(--accent-color)] font-mono">{fontSize}px</span>
            </div>
            <div className="w-full">
              <input
                type="range"
                min="16"
                max="36"
                step="2"
                value={fontSize}
                onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[var(--accent-color)] outline-none"
                aria-label="Adjust font size"
              />
            </div>
          </div>

          {/* Ghost Pacer WPM slider */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-baseline">
              <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                Ghost Pacer
              </h3>
              <span className="text-[12px] font-bold text-[var(--accent-color)] font-mono">
                {ghostWpm === 0 ? 'Off' : `${ghostWpm} WPM`}
              </span>
            </div>
            <div className="w-full">
              <input
                type="range"
                min="0"
                max="120"
                step="5"
                value={ghostWpm}
                onChange={(e) => onGhostWpmChange(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[var(--accent-color)] outline-none"
                aria-label="Adjust Ghost Pacer WPM"
              />
            </div>
            {ghostWpm > 0 && <span className="text-[10px] text-slate-500">Ghost caret will travel at {ghostWpm} WPM</span>}
          </div>
        </div>

        {/* Close Button Footer */}
        <footer className="mt-8 pt-4 border-t border-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white hover:text-black font-semibold text-[13.5px] transition-all cursor-pointer active:scale-95 text-center"
          >
            Apply Config
          </button>
        </footer>
      </aside>
    </div>
  );
};
