'use client';

import React, { useState } from 'react';
import { Award, Zap, Trophy, Shield, Calendar, Clock, Globe } from 'lucide-react';

interface LeaderboardViewProps {
  user?: { username: string; avatarUrl: string };
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatarUrl: string;
  avgWpm: number;
  accuracy: string;
  matchesPlayed: number;
}

const MOCK_LEADERBOARDS: Record<string, LeaderboardEntry[]> = {
  daily: [
    { rank: 1, username: 'FingersOfFire', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=FingersOfFire', avgWpm: 124, accuracy: '99.50', matchesPlayed: 14 },
    { rank: 2, username: 'CtrlAltDefeat', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=CtrlAltDefeat', avgWpm: 118, accuracy: '98.80', matchesPlayed: 25 },
    { rank: 3, username: 'KeyStorm_⚡', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=KeyStorm', avgWpm: 112, accuracy: '99.10', matchesPlayed: 32 },
    { rank: 4, username: 'TypingTitan', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TypingTitan', avgWpm: 104, accuracy: '97.60', matchesPlayed: 8 },
    { rank: 5, username: 'ShiftHappens', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ShiftHappens', avgWpm: 98, accuracy: '98.20', matchesPlayed: 19 },
    { rank: 6, username: 'ClackAddict', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ClackAddict', avgWpm: 95, accuracy: '98.90', matchesPlayed: 44 },
    { rank: 7, username: 'ASDF_Warrior', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ASDF_Warrior', avgWpm: 92, accuracy: '96.50', matchesPlayed: 12 },
    { rank: 8, username: 'SpacebarDrifter', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=SpacebarDrifter', avgWpm: 88, accuracy: '97.20', matchesPlayed: 20 },
    { rank: 9, username: 'BackspaceUser', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=BackspaceUser', avgWpm: 85, accuracy: '95.90', matchesPlayed: 30 }
  ],
  weekly: [
    { rank: 1, username: 'KeystrokeKing', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=KeystrokeKing', avgWpm: 132, accuracy: '99.80', matchesPlayed: 84 },
    { rank: 2, username: 'FingersOfFire', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=FingersOfFire', avgWpm: 121, accuracy: '99.20', matchesPlayed: 65 },
    { rank: 3, username: 'SonicScribe', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=SonicScribe', avgWpm: 115, accuracy: '98.50', matchesPlayed: 50 },
    { rank: 4, username: 'CtrlAltDefeat', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=CtrlAltDefeat', avgWpm: 110, accuracy: '98.40', matchesPlayed: 102 },
    { rank: 5, username: 'KeyStorm_⚡', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=KeyStorm', avgWpm: 108, accuracy: '98.90', matchesPlayed: 140 },
    { rank: 6, username: 'TypingTitan', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TypingTitan', avgWpm: 102, accuracy: '97.40', matchesPlayed: 45 },
    { rank: 7, username: 'ClackAddict', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ClackAddict', avgWpm: 94, accuracy: '98.80', matchesPlayed: 180 },
    { rank: 8, username: 'HomeRowHero', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=HomeRowHero', avgWpm: 91, accuracy: '97.90', matchesPlayed: 60 }
  ],
  alltime: [
    { rank: 1, username: 'MacroMaster', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=MacroMaster', avgWpm: 148, accuracy: '99.90', matchesPlayed: 842 },
    { rank: 2, username: 'KeystrokeKing', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=KeystrokeKing', avgWpm: 128, accuracy: '99.50', matchesPlayed: 1250 },
    { rank: 3, username: 'FingersOfFire', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=FingersOfFire', avgWpm: 120, accuracy: '99.10', matchesPlayed: 420 },
    { rank: 4, username: 'SonicScribe', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=SonicScribe', avgWpm: 114, accuracy: '98.30', matchesPlayed: 320 },
    { rank: 5, username: 'CtrlAltDefeat', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=CtrlAltDefeat', avgWpm: 112, accuracy: '98.60', matchesPlayed: 560 },
    { rank: 6, username: 'KeyStorm_⚡', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=KeyStorm', avgWpm: 109, accuracy: '98.80', matchesPlayed: 790 },
    { rank: 7, username: 'CapsLocked', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=CapsLocked', avgWpm: 101, accuracy: '96.20', matchesPlayed: 215 },
    { rank: 8, username: 'SpacebarDrifter', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=SpacebarDrifter', avgWpm: 89, accuracy: '96.80', matchesPlayed: 410 }
  ]
};

export function LeaderboardView({ user }: LeaderboardViewProps) {
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'alltime'>('weekly');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://typingmaster-bibp.onrender.com';
    fetch(`${apiUrl}/api/leaderboard`)
      .then(res => {
        if (!res.ok) {
          console.warn('Failed to fetch ratings data. Status:', res.status);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (!data) {
          setLeaderboardData(MOCK_LEADERBOARDS[filter]);
          setIsLoading(false);
          return;
        }
        const realEntries: LeaderboardEntry[] = data.map((item: any, idx: number) => ({
          rank: idx + 1,
          username: item.username,
          avatarUrl: item.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.username}`,
          avgWpm: Math.round(parseFloat(item.averageWpm || item.highestWpm || '0')),
          accuracy: parseFloat(item.averageAccuracy || '100').toFixed(2),
          matchesPlayed: item.racesPlayed || 0
        }));

        if (realEntries.length < 10) {
          const mocks = MOCK_LEADERBOARDS[filter] || MOCK_LEADERBOARDS.weekly;
          const padded = [...realEntries];
          const seenUsernames = new Set(realEntries.map(e => e.username.toLowerCase()));
          
          let rankCounter = realEntries.length + 1;
          mocks.forEach(mock => {
            if (!seenUsernames.has(mock.username.toLowerCase()) && padded.length < 10) {
              padded.push({
                ...mock,
                rank: rankCounter++
              });
            }
          });
          setLeaderboardData(padded);
        } else {
          setLeaderboardData(realEntries);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.warn('Error fetching real ratings, falling back to mock data:', err);
        setLeaderboardData(MOCK_LEADERBOARDS[filter]);
        setIsLoading(false);
      });
  }, [filter]);

  // Separate podium players (1st, 2nd, 3rd) from table list
  const podium1st = leaderboardData.find(p => p.rank === 1);
  const podium2nd = leaderboardData.find(p => p.rank === 2);
  const podium3rd = leaderboardData.find(p => p.rank === 3);
  
  const listPlayers = leaderboardData.filter(p => p.rank > 3);

  return (
    <div className="w-full text-zinc-300 animate-fadeIn text-left">
      
      {/* Filters HUD bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b border-zinc-900 pb-5 mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Thunder Ratings
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-1">Ranking the fastest keyboard warriors on the planet.</p>
        </div>

        {/* Tab filters */}
        <div className="flex bg-zinc-950 border border-zinc-900 rounded-xl p-1 text-[11px] font-mono font-bold">
          <button
            onClick={() => setFilter('daily')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              filter === 'daily'
                ? 'bg-yellow-500 text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Daily</span>
          </button>
          <button
            onClick={() => setFilter('weekly')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              filter === 'weekly'
                ? 'bg-yellow-500 text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly</span>
          </button>
          <button
            onClick={() => setFilter('alltime')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              filter === 'alltime'
                ? 'bg-yellow-500 text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>All-Time</span>
          </button>
        </div>
      </div>

      {/* 🏆 PODIUM LAYOUT 🏆 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end justify-center mb-12 max-w-4xl mx-auto text-center">
        
        {/* 2ND PLACE PODIUM CARD (Left) */}
        {podium2nd && (
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 relative flex flex-col items-center justify-end h-[280px] order-2 md:order-1 transition-all hover:border-zinc-800 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            <div className="absolute top-4 right-4 text-xs font-black font-mono text-zinc-500">#2</div>
            <div className="w-16 h-16 rounded-full border-2 border-zinc-400 bg-zinc-900 overflow-hidden flex items-center justify-center mb-4">
              <img src={podium2nd.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <h4 className="font-bold text-white text-sm font-mono truncate max-w-[150px]">{podium2nd.username}</h4>
            <div className="mt-2.5 space-y-1">
              <div className="text-xl font-black text-white font-mono">{podium2nd.avgWpm} <span className="text-[10px] text-zinc-500">WPM</span></div>
              <div className="text-[10px] text-zinc-500 font-mono">Accuracy: {podium2nd.accuracy}%</div>
            </div>
            <div className="w-full h-3 bg-zinc-900 rounded-full mt-5 overflow-hidden">
              <div className="w-2/3 h-full bg-zinc-400" />
            </div>
          </div>
        )}

        {/* 1ST PLACE PODIUM CARD (Center, Raised) */}
        {podium1st && (
          <div className="bg-zinc-950 border border-yellow-500/30 rounded-3xl p-6 relative flex flex-col items-center justify-end h-[340px] order-1 md:order-2 transition-all hover:border-yellow-500/50 shadow-[0_0_40px_rgba(245,158,11,0.08)]">
            {/* Crown Icon */}
            <div className="absolute -top-6 bg-zinc-950 p-2.5 rounded-full border border-yellow-500/30 text-yellow-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Award className="w-7 h-7 animate-bounce" />
            </div>
            <div className="absolute top-4 right-4 text-xs font-black font-mono text-yellow-500">#1</div>
            
            <div className="w-20 h-20 rounded-full border-2 border-yellow-500 bg-zinc-900 overflow-hidden flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <img src={podium1st.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <h4 className="font-bold text-white text-base font-mono truncate max-w-[170px]">{podium1st.username}</h4>
            <div className="mt-3 space-y-1">
              <div className="text-2xl font-black text-yellow-500 font-mono">{podium1st.avgWpm} <span className="text-xs text-zinc-400">WPM</span></div>
              <div className="text-[10px] text-zinc-500 font-mono">Accuracy: {podium1st.accuracy}%</div>
            </div>
            <div className="w-full h-4 bg-zinc-900 rounded-full mt-6 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse" />
            </div>
          </div>
        )}

        {/* 3RD PLACE PODIUM CARD (Right) */}
        {podium3rd && (
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 relative flex flex-col items-center justify-end h-[240px] order-3 transition-all hover:border-zinc-800 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            <div className="absolute top-4 right-4 text-xs font-black font-mono text-amber-800">#3</div>
            <div className="w-14 h-14 rounded-full border-2 border-amber-800 bg-zinc-900 overflow-hidden flex items-center justify-center mb-4">
              <img src={podium3rd.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <h4 className="font-bold text-white text-sm font-mono truncate max-w-[150px]">{podium3rd.username}</h4>
            <div className="mt-2 space-y-1">
              <div className="text-lg font-black text-white font-mono">{podium3rd.avgWpm} <span className="text-[10px] text-zinc-500">WPM</span></div>
              <div className="text-[10px] text-zinc-500 font-mono">Accuracy: {podium3rd.accuracy}%</div>
            </div>
            <div className="w-full h-2.5 bg-zinc-900 rounded-full mt-4 overflow-hidden">
              <div className="w-1/2 h-full bg-amber-800" />
            </div>
          </div>
        )}
      </div>

      {/* 📋 LIST RANKINGS TABLE 📋 */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 md:p-6 overflow-hidden">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono border-b border-zinc-900 pb-3.5 mb-4">Rankings List</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="text-zinc-500 border-b border-zinc-900">
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Rank</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">User</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Avg Speed</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Accuracy</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Runs Played</th>
              </tr>
            </thead>
            <tbody>
              {listPlayers.map((player) => (
                <tr 
                  key={player.username}
                  className={`border-b border-zinc-900/60 hover:bg-zinc-900/10 transition-colors ${
                    user && player.username === user.username ? 'bg-yellow-500/5' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-black text-zinc-400">#{player.rank}</td>
                  <td className="py-3.5 px-4 flex items-center gap-2.5">
                    <img src={player.avatarUrl} alt="Avatar" className="w-6.5 h-6.5 rounded-full bg-zinc-900 border border-zinc-800" />
                    <span className="font-bold text-white hover:text-yellow-500 cursor-pointer truncate max-w-[160px]">{player.username}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-white">{player.avgWpm} WPM</td>
                  <td className="py-3.5 px-4 text-right text-zinc-400">{player.accuracy}%</td>
                  <td className="py-3.5 px-4 text-right text-zinc-500">{player.matchesPlayed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
