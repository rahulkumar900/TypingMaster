'use client';

import React from 'react';
import { X, Trophy, Activity, Calendar, FileText, CheckCircle, Keyboard, RefreshCw } from 'lucide-react';
import { WpmChart } from './wpm-chart';

export interface TestRecord {
  id: string;
  date: string;
  mode: 'quotes' | 'words' | 'time' | 'custom' | 'zen' | 'weak-keys' | 'govt-exam';
  limitValue: number; // seconds or words limit
  wpm: number;
  accuracy: string;
  rawAccuracy: number;
  missedKeys: Record<string, number>;
  wpmHistory: number[];
  rawWpmHistory: number[];
  timeHistory: number[];
  examScore?: any; // Government Exam evaluation details
}

interface StatsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  history: TestRecord[];
  onClearHistory: () => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory
}) => {
  if (!isOpen) return null;

  // Calculate lifetime stats
  const totalTests = history.length;
  
  const topWpm = totalTests > 0 
    ? Math.max(...history.map(r => r.wpm))
    : 0;
    
  const avgWpm = totalTests > 0
    ? Math.round(history.reduce((sum, r) => sum + r.wpm, 0) / totalTests)
    : 0;
    
  const avgAccuracy = totalTests > 0
    ? (history.reduce((sum, r) => sum + parseFloat(r.accuracy), 0) / totalTests).toFixed(2)
    : '100.00';

  // Aggregate missed keys across all runs
  const aggregatedMisses: Record<string, number> = {};
  history.forEach(run => {
    Object.entries(run.missedKeys || {}).forEach(([key, count]) => {
      aggregatedMisses[key] = (aggregatedMisses[key] || 0) + count;
    });
  });

  const sortedAggregatedMisses = Object.entries(aggregatedMisses)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Most recent run for drawing the chart
  const recentRun = history[0];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-center items-center p-4 md:p-6 animate-fadeIn">
      {/* Dashboard Card Container */}
      <div 
        className="relative w-full max-w-[960px] h-[90vh] max-h-[780px] bg-[#0c0d12] border border-[var(--border-active)] rounded-[28px] p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[var(--accent-color)]" />
            <h2 className="text-2xl font-bold text-white font-sans">Performance Dashboard</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--bg-panel)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] text-[var(--text-muted-alt)] hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6 scrollbar-hide">
          
          {/* Lifetime statistics grid */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-4 flex flex-col">
              <span className="text-[11px] font-medium text-[var(--text-muted-alt)] uppercase tracking-wider">Top Speed</span>
              <span className="text-3xl font-bold text-white mt-1">{topWpm} <span className="text-[12px] text-[var(--text-muted-alt)] font-medium">WPM</span></span>
            </div>
            <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-4 flex flex-col">
              <span className="text-[11px] font-medium text-[var(--text-muted-alt)] uppercase tracking-wider">Average Speed</span>
              <span className="text-3xl font-bold text-white mt-1">{avgWpm} <span className="text-[12px] text-[var(--text-muted-alt)] font-medium">WPM</span></span>
            </div>
            <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-4 flex flex-col">
              <span className="text-[11px] font-medium text-[var(--text-muted-alt)] uppercase tracking-wider">Avg Accuracy</span>
              <span className="text-3xl font-bold text-white mt-1">{avgAccuracy}<span className="text-[16px] text-[var(--text-muted-alt)]">%</span></span>
            </div>
            <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-4 flex flex-col">
              <span className="text-[11px] font-medium text-[var(--text-muted-alt)] uppercase tracking-wider">Tests Run</span>
              <span className="text-3xl font-bold text-white mt-1">{totalTests} <span className="text-[12px] text-[var(--text-muted-alt)] font-medium">runs</span></span>
            </div>
          </section>

          {/* Aggregated errors and recent chart */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
            
            {/* Recent progression curve */}
            <section className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-5 flex flex-col gap-4">
              <h3 className="text-[13px] font-semibold text-[var(--text-muted-alt)] uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[var(--accent-color)]" />
                {recentRun ? 'Most Recent Speed curve' : 'Speed progression curve'}
              </h3>
              
              <div className="relative w-full h-[160px] flex-1">
                {recentRun ? (
                  <WpmChart
                    wpmHistory={recentRun.wpmHistory}
                    rawWpmHistory={recentRun.rawWpmHistory}
                    timeHistory={recentRun.timeHistory}
                    testTimeLimit={recentRun.limitValue}
                    currentTheme="carbon" // defaults to styling color
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[var(--text-muted-alt)] text-[12.5px] font-mono">
                    No run history available yet.
                  </div>
                )}
              </div>
            </section>

            {/* Lifetime key errors breakdown */}
            <section className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-5 flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-[13px] font-semibold text-[var(--text-muted-alt)] uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Keyboard className="w-4 h-4 text-[var(--accent-color)]" />
                  Key Error Heat
                </h3>
                
                {sortedAggregatedMisses.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {sortedAggregatedMisses.map(([key, count]) => (
                      <div 
                        key={key} 
                        className="flex justify-between items-center px-3 py-2 rounded-lg bg-black border border-[var(--border-subtle)] text-[13px]"
                      >
                        <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">
                          {key === ' ' ? 'Spacebar' : key}
                        </span>
                        <span className="text-[var(--text-muted-alt)] font-mono text-[12px]">{count} errors</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--text-muted-alt)] text-[12.5px] font-mono">No logged errors in history.</p>
                )}
              </div>
              
              <div className="border-t border-[var(--border-subtle)] pt-3">
                <span className="text-[11px] text-[var(--text-muted-alt)] uppercase tracking-wider block">Coaching Tip</span>
                <p className="text-[12px] text-[var(--text-muted-alt)] mt-1 leading-relaxed">
                  Focus on keys with high error heat. Try tapping those keys in slow repetitions to strengthen finger-to-key neurological pathways.
                </p>
              </div>
            </section>

          </div>

          {/* Test History list */}
          <section className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
              <h3 className="text-[13px] font-semibold text-[var(--text-muted-alt)] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[var(--accent-color)]" />
                Run History
              </h3>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  Clear History
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-[13px] font-mono border-collapse">
                  <thead>
                    <tr className="text-[var(--text-muted-alt)] border-b border-[var(--border-subtle)]">
                      <th className="py-2.5 font-sans font-semibold">Date</th>
                      <th className="py-2.5 font-sans font-semibold">Mode</th>
                      <th className="py-2.5 font-sans font-semibold">Target</th>
                      <th className="py-2.5 font-sans font-semibold">WPM</th>
                      <th className="py-2.5 font-sans font-semibold">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => (
                      <tr key={record.id} className="border-b border-white/[0.02] hover:bg-[var(--bg-panel)] text-[var(--text-main)]">
                        <td className="py-2.5">{record.date}</td>
                        <td className="py-2.5 capitalize">
                          {record.mode === 'weak-keys' ? 'weak keys' : record.mode === 'govt-exam' ? 'govt exam' : record.mode}
                        </td>
                        <td className="py-2.5">
                          {record.mode === 'time'
                            ? `${record.limitValue}s`
                            : record.mode === 'words'
                              ? `${record.limitValue} words`
                              : record.mode === 'zen'
                                ? 'Zen (∞)'
                                : record.mode === 'weak-keys'
                                  ? `${record.limitValue} words`
                                  : record.mode === 'govt-exam'
                                    ? record.examScore?.examType || 'Exam Preset'
                                    : 'Quote/Custom'
                          }
                        </td>
                        <td className="py-2.5 font-bold text-white">{record.wpm}</td>
                        <td className="py-2.5">{record.accuracy}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-[var(--text-muted-alt)] text-[12.5px] font-mono">
                No past runs logged yet. Complete a test to see your history!
              </div>
            )}
          </section>

        </div>

        {/* Footer */}
        <footer className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-[var(--border-active)] bg-[var(--bg-panel)] hover:bg-white hover:text-black font-semibold text-[13.5px] transition-all cursor-pointer active:scale-95"
          >
            Close Dashboard
          </button>
        </footer>

      </div>
    </div>
  );
};
