'use client';

import React from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';

interface StatsWidgetProps {
  wpm: number;
  rawWpm: number;
  accuracy: string;
  rawAccuracy: number;
  onReset: () => void;
  onClearHistory: () => void;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  wpm,
  rawWpm,
  accuracy,
  rawAccuracy,
  onReset,
  onClearHistory
}) => {
  return (
    <section 
      className="flex items-center justify-between h-[72px] bg-black border border-white/5 hover:border-white/15 rounded-[20px] px-6 py-3 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-300"
      aria-label="Live typing statistics"
    >
      {/* WPM Stat */}
      <div className="flex flex-col">
        <div className="text-2xl font-bold text-slate-50 flex items-baseline leading-none">
          <span>{wpm}</span>
          <span className="text-[12px] text-slate-500 ml-1.5 font-medium uppercase tracking-wider">WPM</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
          raw: <span>{rawWpm}</span>
        </div>
      </div>

      {/* Accuracy Stat */}
      <div className="flex flex-col">
        <div className="text-2xl font-bold text-slate-50 flex items-baseline leading-none">
          <span>{accuracy}</span>
          <span className="text-[16px] text-slate-500 ml-0.5">%</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
          acc: <span>{rawAccuracy}</span>%
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Reset Button */}
        <button
          onClick={onReset}
          className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-[var(--accent-color)] hover:bg-white/5 active:scale-95 transition-all duration-300"
          title="Restart Test (Esc)"
          aria-label="Reset Typing Test"
        >
          <RotateCcw className="w-5 h-5 transition-transform duration-300 hover:rotate-45" />
        </button>

        {/* Clear History Button */}
        <button
          onClick={onClearHistory}
          className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-[var(--accent-color)] hover:bg-white/5 active:scale-95 transition-all duration-300"
          title="Clear History Graph"
          aria-label="Clear stats history"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
