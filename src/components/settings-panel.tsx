'use client';

import React from 'react';
import { X, Settings, Keyboard, MousePointer, Type, Sliders, FileText, Sparkles, Globe } from 'lucide-react';
import { LANGUAGES } from '@/lib/languages';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cursorStyle: 'pipe' | 'block' | 'outline' | 'underline';
  onCursorChange: (style: 'pipe' | 'block' | 'outline' | 'underline') => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  switchProfile: 'blue' | 'brown' | 'red';
  onSwitchChange: (profile: 'blue' | 'brown' | 'red') => void;
  includePunctuation: boolean;
  onPunctuationChange: (val: boolean) => void;
  includeNumbers: boolean;
  onNumbersChange: (val: boolean) => void;
  showSpeedometer: boolean;
  onShowSpeedometerChange: (val: boolean) => void;
  suddenDeath: boolean;
  onSuddenDeathChange: (val: boolean) => void;
  ghostWpm: number;
  onGhostWpmChange: (wpm: number) => void;
  languageId: string;
  fontId: string;
  onFontIdChange: (fontId: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  cursorStyle,
  onCursorChange,
  fontSize,
  onFontSizeChange,
  switchProfile,
  onSwitchChange,
  includePunctuation,
  onPunctuationChange,
  includeNumbers,
  onNumbersChange,
  showSpeedometer,
  onShowSpeedometerChange,
  suddenDeath,
  onSuddenDeathChange,
  ghostWpm,
  onGhostWpmChange,
  languageId,
  fontId,
  onFontIdChange
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
      onClick={onClose}
    >
      {/* Settings Panel Sliding Drawer Container */}
      <aside 
        className="w-full max-w-[400px] h-full bg-[var(--bg-panel)] border-l border-[var(--border-active)] p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto animate-slideIn"
        onClick={(e) => e.stopPropagation()}
        aria-label="Typing settings"
      >
        {/* Title Header */}
        <div className="flex flex-col gap-6">
          <header className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[var(--accent-color)]" />
              <h2 className="text-xl font-bold text-[var(--text-main)] font-sans">Settings</h2>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-panel)] border border-[var(--border-subtle)] text-[var(--text-muted-alt)] hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          {/* Practice Modifiers (Punctuation / Numbers) */}
          <div className="flex flex-col gap-3 animate-fadeIn">
            <h3 className="text-[12px] font-semibold text-[var(--text-muted-alt)] uppercase tracking-wider flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" />
              Practice Modifiers
            </h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] cursor-pointer hover:bg-[var(--bg-panel)] transition-colors">
                <span className="text-[13px] font-semibold text-[var(--text-main)]">Punctuation</span>
                <input
                  type="checkbox"
                  checked={includePunctuation}
                  onChange={(e) => onPunctuationChange(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border-active)] bg-black text-[var(--accent-color)] focus:ring-0 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] cursor-pointer hover:bg-[var(--bg-panel)] transition-colors">
                <span className="text-[13px] font-semibold text-[var(--text-main)]">Numbers</span>
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => onNumbersChange(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border-active)] bg-black text-[var(--accent-color)] focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Sound Switch Profiles selector */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[12px] font-semibold text-[var(--text-muted-alt)] uppercase tracking-wider flex items-center gap-1">
              <Keyboard className="w-3.5 h-3.5" />
              Keyboard Switch Sounds
            </h3>
            <div className="grid grid-cols-3 gap-1 bg-[var(--bg-panel)] p-1 rounded-xl border border-[var(--border-subtle)] w-full">
              {(['blue', 'brown', 'red'] as const).map((profile) => (
                <button
                  key={profile}
                  onClick={() => onSwitchChange(profile)}
                  className={`py-2 rounded-lg text-[12px] font-semibold transition-all cursor-pointer uppercase ${
                    switchProfile === profile
                      ? 'bg-[var(--accent-color)] text-black font-bold'
                      : 'text-[var(--text-muted-alt)] hover:text-slate-50'
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
            <h3 className="text-[12px] font-semibold text-[var(--text-muted-alt)] uppercase tracking-wider flex items-center gap-1">
              <MousePointer className="w-3.5 h-3.5" />
              Cursor representation
            </h3>
            <div className="flex bg-[var(--bg-panel)] p-1 rounded-xl border border-[var(--border-subtle)] w-full">
              {(['pipe', 'block', 'outline', 'underline'] as const).map((cursor) => (
                <button
                  key={cursor}
                  onClick={() => onCursorChange(cursor)}
                  className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all cursor-pointer font-mono ${
                    cursorStyle === cursor
                      ? 'bg-[var(--accent-color)] text-black shadow-[0_4px_12px_rgba(var(--accent-rgb),0.2)]'
                      : 'text-[var(--text-muted-alt)] hover:text-slate-50'
                  }`}
                  title={`${cursor.charAt(0).toUpperCase() + cursor.slice(1)} Cursor`}
                >
                  {cursor === 'pipe' ? '|' : cursor === 'block' ? '■' : cursor === 'outline' ? 'o' : '_'}
                </button>
              ))}
            </div>
          </div>

          {/* Language & Exam Font Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[12px] font-semibold text-[var(--text-muted-alt)] uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              Exam Font & Layout
            </h3>

            {/* Font / Layout Selection based on active language */}
            <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl p-3 flex flex-col gap-2">
              <span className="text-[11px] text-[var(--text-muted-alt)] font-semibold uppercase tracking-wider">Specific Exam Layout (Font)</span>
              <div className="flex flex-col gap-2">
                {LANGUAGES.find(l => l.id === languageId)?.fonts.map(font => (
                  <button
                    key={font.id}
                    onClick={() => onFontIdChange(font.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer text-left ${
                      fontId === font.id
                        ? 'border-[var(--accent-color)] bg-[var(--bg-panel)]'
                        : 'border-[var(--border-subtle)] hover:border-[var(--border-active)] bg-[var(--bg-panel)]'
                    }`}
                  >
                    <span className={`text-[13px] font-semibold ${fontId === font.id ? 'text-[var(--accent-color)]' : 'text-[var(--text-main)]'}`}>
                      {font.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${font.type === 'legacy' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {font.type.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>


          {/* Interface Toggles */}
          <div className="flex flex-col gap-3 animate-fadeIn">
            <h3 className="text-[12px] font-semibold text-[var(--text-muted-alt)] uppercase tracking-wider flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" />
              Interface Settings
            </h3>
            <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] cursor-pointer hover:bg-[var(--bg-panel)] transition-colors">
              <span className="text-[13px] font-semibold text-[var(--text-main)]">Live Speedometer</span>
              <input
                type="checkbox"
                checked={showSpeedometer}
                onChange={(e) => onShowSpeedometerChange(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border-active)] bg-black text-[var(--accent-color)] focus:ring-0 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-panel)] border border-red-500/10 cursor-pointer hover:bg-[var(--bg-panel)] hover:border-red-500/30 transition-colors group">
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-red-400 group-hover:text-red-300 transition-colors">Sudden Death Mode</span>
                <span className="text-[10px] text-[var(--text-muted-alt)]">Test fails instantly on first typo</span>
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
              <h3 className="text-[12px] font-semibold text-[var(--text-muted-alt)] uppercase tracking-wider">Font size</h3>
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
              <h3 className="text-[12px] font-semibold text-[var(--text-muted-alt)] uppercase tracking-wider flex items-center gap-1">
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
            {ghostWpm > 0 && <span className="text-[10px] text-[var(--text-muted-alt)]">Ghost caret will travel at {ghostWpm} WPM</span>}
          </div>
        </div>

        {/* Close Button Footer */}
        <footer className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex justify-end">
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-full border border-[var(--border-active)] bg-[var(--bg-panel)] hover:bg-white hover:text-black font-semibold text-[13.5px] transition-all cursor-pointer active:scale-95 text-center"
          >
            Apply Config
          </button>
        </footer>
      </aside>
    </div>
  );
};
