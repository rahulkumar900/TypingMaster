'use client';

import React, { useState, useEffect } from 'react';
import { User, Trophy, BarChart2, Shield, Calendar, Edit2, Check, Clock, BookOpen, AlertTriangle } from 'lucide-react';

interface ProfileViewProps {
  user: { username: string; avatarUrl: string };
  onUpdateAvatar: (url: string) => void;
  history: any[];
  onLogout?: () => void;
}

const AVATAR_SEEDS = ['thunder', 'lightning', 'spark', 'bolt', 'keyboard', 'clack', 'speedy', 'cyber', 'matrix'];

const INITIAL_MOCK_HISTORY = [
  { id: '1', date: 'Jun 3, 2026', mode: '1v1 Match VS KeyStorm_⚡', wpm: 72, accuracy: '98.50', result: 'Win' },
  { id: '2', date: 'Jun 2, 2026', mode: 'Sphere Room AB49F2', wpm: 65, accuracy: '97.20', result: '2nd Place' },
  { id: '3', date: 'May 30, 2026', mode: 'Solo speed test (60s)', wpm: 68, accuracy: '99.00', result: 'Solo' },
  { id: '4', date: 'May 28, 2026', mode: '1v1 Match VS ClackAddict', wpm: 61, accuracy: '95.50', result: 'Loss' },
  { id: '5', date: 'May 25, 2026', mode: 'Zen Practice', wpm: 75, accuracy: '98.10', result: 'Solo' }
];

export function ProfileView({ user, onUpdateAvatar, history, onLogout }: ProfileViewProps) {
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [matchHistory, setMatchHistory] = useState(INITIAL_MOCK_HISTORY);

  // Combine real user history and mock multiplayer runs
  useEffect(() => {
    if (history && history.length > 0) {
      const realRuns = history.map((record, index) => {
        const formattedDate = record.date ? record.date.split(',')[0] : 'Today';
        let modeLabel = 'Solo speed test';
        if (record.mode === 'govt-exam') modeLabel = `Govt Exam (${record.examScore?.examType || 'SSC'})`;
        else if (record.mode === 'weak-keys') modeLabel = 'Weak Keys Practice';
        else if (record.mode === 'zen') modeLabel = 'Zen Practice';
        else if (record.mode === 'custom') modeLabel = 'Custom text practice';
        else if (record.mode === 'time') modeLabel = `Timed test (${record.limitValue}s)`;
        else if (record.mode === 'words') modeLabel = `Words test (${record.limitValue} wds)`;
        
        return {
          id: `real-${record.id || index}`,
          date: formattedDate,
          mode: modeLabel,
          wpm: record.wpm,
          accuracy: record.accuracy,
          result: record.examScore ? (record.examScore.status === 'PASSED' ? 'Qualified' : 'Disqualified') : 'Solo'
        };
      });
      
      setMatchHistory([...realRuns, ...INITIAL_MOCK_HISTORY]);
    }
  }, [history]);

  // Aggregate stats
  const totalMatches = matchHistory.length;
  const soloRuns = matchHistory.filter(m => m.result === 'Solo' || m.result === 'Qualified' || m.result === 'Disqualified');
  const multiplayerRuns = matchHistory.filter(m => m.result === 'Win' || m.result === 'Loss' || m.result === '2nd Place');
  
  const wins = matchHistory.filter(m => m.result === 'Win').length;
  const losses = matchHistory.filter(m => m.result === 'Loss').length;
  const winRate = multiplayerRuns.length > 0 ? ((wins / multiplayerRuns.length) * 100).toFixed(1) : '0.0';

  const averageWpm = Math.round(
    matchHistory.reduce((acc, curr) => acc + curr.wpm, 0) / (totalMatches || 1)
  );

  const topWpm = matchHistory.reduce((acc, curr) => Math.max(acc, curr.wpm), 0);

  const averageAccuracy = (
    matchHistory.reduce((acc, curr) => acc + parseFloat(curr.accuracy), 0) / (totalMatches || 1)
  ).toFixed(2);

  // Avatar change handler
  const handleSelectAvatar = (seed: string) => {
    const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
    onUpdateAvatar(url);
    setEditingAvatar(false);
  };

  // Determine user typing title
  const getTypingTitle = () => {
    if (topWpm >= 110) return { title: 'Lightning Legend ⚡', color: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/5' };
    if (topWpm >= 85) return { title: 'Sonic Speedster 🏎️', color: 'text-purple-400 border-purple-500/30 bg-purple-500/5' };
    if (topWpm >= 65) return { title: 'Silver Key-Hitter 🎹', color: 'text-blue-400 border-blue-500/30 bg-blue-500/5' };
    return { title: 'Home Row Trainee 🎯', color: 'text-zinc-400 border-zinc-800 bg-zinc-900/50' };
  };

  const titleBadge = getTypingTitle();

  return (
    <div className="w-full text-zinc-300 animate-fadeIn text-left space-y-8">
      
      {/* ── PROFILE HEADER SECTION ── */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 relative flex flex-col md:flex-row items-center md:items-start gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        {/* Avatar Display with Hover edit */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full border-2 border-yellow-500 bg-zinc-900 overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => setEditingAvatar(!editingAvatar)}
            className="absolute bottom-0 right-0 p-1.5 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black shadow-md cursor-pointer transition-colors"
            title="Change Avatar"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Titles details */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl font-black text-white font-mono tracking-tight">{user.username}</h2>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
            <span className={`px-4 py-1.5 rounded-full border text-xs font-mono font-bold ${titleBadge.color}`}>
              {titleBadge.title}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest bg-zinc-900 border border-zinc-900 px-3 py-1.5 rounded-full">
              Connected Since: Today
            </span>
            {onLogout && (
              <button 
                onClick={onLogout}
                className="text-[10px] text-red-400 hover:text-red-300 font-mono uppercase tracking-widest bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-1.5 rounded-full transition-colors cursor-pointer active:scale-95 shadow-sm"
              >
                Logout
              </button>
            )}
          </div>

          {/* Edit Avatar seeds dropdown */}
          {editingAvatar && (
            <div className="mt-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 w-full max-w-sm animate-fadeIn">
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono mb-2.5">Select Avatar Bot Seed</h4>
              <div className="flex flex-wrap gap-2">
                {AVATAR_SEEDS.map((seed) => (
                  <button
                    key={seed}
                    onClick={() => handleSelectAvatar(seed)}
                    className="px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-yellow-500 bg-zinc-950 text-[11px] font-mono hover:text-white cursor-pointer transition-colors"
                  >
                    {seed}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── METRICS GRID SECTION ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* WPM Average */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-center text-left">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1"><BarChart2 className="w-3.5 h-3.5" /> Average WPM</span>
          <span className="text-3xl font-black text-white mt-1.5 font-mono">
            {averageWpm} <span className="text-xs text-zinc-500 font-normal">WPM</span>
          </span>
        </div>

        {/* Top WPM */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-center text-left">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-yellow-500" /> Personal Best</span>
          <span className="text-3xl font-black text-yellow-500 mt-1.5 font-mono">
            {topWpm} <span className="text-xs text-zinc-500 font-normal">WPM</span>
          </span>
        </div>

        {/* Avg Accuracy */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-center text-left">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Avg Accuracy</span>
          <span className="text-3xl font-black text-white mt-1.5 font-mono">
            {averageAccuracy}%
          </span>
        </div>

        {/* Wins/Loss Ratio */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-center text-left col-span-2 md:col-span-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> 1v1 Win Rate</span>
          <span className="text-3xl font-black text-white mt-1.5 font-mono">
            {winRate}%
            <span className="text-[10px] text-zinc-500 font-normal block mt-1 font-mono">
              {wins} Wins / {losses} Losses
            </span>
          </span>
        </div>
      </div>

      {/* ── RECENT MATCH HISTORY LOGS ── */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 md:p-6 overflow-hidden">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono border-b border-zinc-900 pb-3.5 mb-4">Match History</h3>
        
        {matchHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="text-zinc-500 border-b border-zinc-900">
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Date</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Match Description</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Avg Speed</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Accuracy</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-center">Result</th>
                </tr>
              </thead>
              <tbody>
                {matchHistory.map((match) => (
                  <tr 
                    key={match.id}
                    className="border-b border-zinc-900/40 hover:bg-zinc-900/5 transition-colors"
                  >
                    <td className="py-3.5 px-3 text-zinc-500">{match.date}</td>
                    <td className="py-3.5 px-3 text-white font-bold">{match.mode}</td>
                    <td className="py-3.5 px-3 text-right text-white font-bold">{match.wpm} WPM</td>
                    <td className="py-3.5 px-3 text-right text-zinc-400">{match.accuracy}%</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                        match.result === 'Win' || match.result === 'Qualified'
                          ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400'
                          : match.result === 'Loss' || match.result === 'Disqualified'
                            ? 'border-rose-500/30 bg-rose-950/20 text-rose-400'
                            : match.result === '2nd Place'
                              ? 'border-yellow-500/20 bg-yellow-950/20 text-yellow-500'
                              : 'border-zinc-800 bg-zinc-900/40 text-zinc-400'
                      }`}>
                        {match.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-zinc-500 italic text-center py-6">No matches logged yet.</p>
        )}
      </div>

    </div>
  );
}
