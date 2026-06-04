'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, Trophy, Search, Swords, Play, RefreshCw, Zap, Award, BarChart2 } from 'lucide-react';
import { TypingArena } from '@/components/typing-arena';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { LANGUAGES } from '@/lib/languages';
import { io, Socket } from 'socket.io-client';

interface Lobby1v1ViewProps {
  user: { username: string; avatarUrl: string };
  config: any;
}

const MATCH_PASSAGE = "The storm clouds rolled in over the horizon, flashing brilliant arches of lightning that lit up the typing arena. Speed and precision are the only shields in this thunderous duel. Keep your hands relaxed, find your keycap rhythm, and strike like a bolt from the blue.";

export function Lobby1v1View({ user, config }: Lobby1v1ViewProps) {
  const [stage, setStage] = useState<'lobby' | 'searching' | 'found' | 'countdown' | 'racing' | 'results'>('lobby');
  const [searchTimer, setSearchTimer] = useState(0);
  const [opponent, setOpponent] = useState<{ username: string; avatarUrl: string } | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [targetText, setTargetText] = useState(MATCH_PASSAGE);
  
  const socketRef = useRef<Socket | null>(null);
  
  // Typing progress trackers
  const [userProgress, setUserProgress] = useState(0); // 0 to 100
  const [oppProgress, setOppProgress] = useState(0);   // 0 to 100
  const [userWpm, setUserWpm] = useState(0);
  const [oppWpm, setOppWpm] = useState(0);
  const [userAccuracy, setUserAccuracy] = useState('100.00');
  const [oppAccuracy, setOppAccuracy] = useState('100.00');
  const [raceWinner, setRaceWinner] = useState<'user' | 'opponent' | null>(null);

  // Time tracker for race
  const [raceElapsed, setRaceElapsed] = useState(0);
  const raceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const correctCountRef = useRef(0);
  const typedLengthRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  const stageRef = useRef(stage);
  useEffect(() => {
    stageRef.current = stage;
  });

  const isActive = stage !== 'lobby';

  // WebSockets setup
  useEffect(() => {
    if (!isActive) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('typing_thunder_token') : null;
    const socket = io('http://localhost:4000', {
      auth: { token }
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to multiplayer server');
      if (stageRef.current === 'searching') {
        socket.emit('join_queue', { avatarUrl: user.avatarUrl });
      }
    });

    socket.on('match_found', ({ roomId, opponent, targetText }) => {
      setRoomId(roomId);
      setOpponent(opponent);
      if (targetText) {
        setTargetText(targetText);
      }
      setStage('found');
    });

    socket.on('countdown_tick', (tick) => {
      setStage('countdown');
      setCountdown(tick);
    });

    socket.on('race_start', () => {
      setStage('racing');
      startRace();
    });

    socket.on('player_progress', ({ progress, wpm, accuracy }) => {
      setUserProgress(progress);
      setUserWpm(wpm);
      setUserAccuracy(accuracy.toFixed(2));
    });

    socket.on('opponent_progress', ({ progress, wpm, accuracy }) => {
      setOppProgress(progress);
      setOppWpm(wpm);
      if (accuracy !== undefined) {
        setOppAccuracy(accuracy.toFixed(2));
      }
    });

    socket.on('race_complete', ({ winner, wpm, accuracy, opponentStats }) => {
      if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
      
      setRaceWinner(winner === user.username ? 'user' : 'opponent');
      
      if (winner === user.username) {
        setUserProgress(100);
        setUserWpm(wpm);
        setUserAccuracy(accuracy.toFixed(2));
        
        setOppProgress(opponentStats.progress);
        setOppWpm(opponentStats.wpm);
        setOppAccuracy(opponentStats.accuracy.toFixed(2));
      } else {
        setUserProgress(opponentStats.progress);
        setUserWpm(opponentStats.wpm);
        setUserAccuracy(opponentStats.accuracy.toFixed(2));
        
        setOppProgress(100);
        setOppWpm(wpm);
        setOppAccuracy(accuracy.toFixed(2));
      }

      setTimeout(() => {
        setStage('results');
      }, 1500);
    });

    socket.on('opponent_left', ({ reason }) => {
      alert(reason || 'Opponent left the match.');
      setStage('lobby');
      if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isActive, user.avatarUrl, user.username]);

  // Queue timer setup
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stage === 'searching') {
      timer = setInterval(() => {
        setSearchTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [stage]);

  // Join queue if socket is already connected when entering searching stage
  useEffect(() => {
    if (stage === 'searching' && socketRef.current && socketRef.current.connected) {
      console.log('Socket already connected, joining queue');
      socketRef.current.emit('join_queue', { avatarUrl: user.avatarUrl });
    }
  }, [stage, user.avatarUrl]);

  const startRace = () => {
    setUserProgress(0);
    setOppProgress(0);
    setUserWpm(0);
    setOppWpm(0);
    setRaceElapsed(0);
    setRaceWinner(null);
    setResetKey(prev => prev + 1);

    correctCountRef.current = 0;
    typedLengthRef.current = 0;
    startTimeRef.current = Date.now();

    // Track race duration
    raceIntervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsedSecs = (Date.now() - startTimeRef.current) / 1000;
      setRaceElapsed(Math.floor(elapsedSecs));
    }, 1000);
  };

  // Handle user inputs in standard TypingArena
  const handleUserProgress = (correctCount: number, typedLength: number, typedValue?: string) => {
    correctCountRef.current = correctCount;
    typedLengthRef.current = typedLength;

    // Emit typed text live to server for authoritative calculation
    if (socketRef.current && roomId && typedValue !== undefined) {
      socketRef.current.emit('keystroke', { roomId, typedText: typedValue });
    }
  };

  const handleUserComplete = () => {
    console.log('User typing finished locally, awaiting server race_complete validation...');
  };

  useEffect(() => {
    return () => {
      if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
    };
  }, []);

  const handleCancelSearch = () => {
    if (socketRef.current) {
      socketRef.current.emit('cancel_queue');
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setStage('lobby');
    setSearchTimer(0);
  };

  const handleFindMatch = () => {
    setStage('searching');
    setSearchTimer(0);
  };

  const handleLeaveMatch = () => {
    if (confirm('Are you sure you want to leave the match? This will count as a defeat.')) {
      if (socketRef.current) {
        socketRef.current.emit('cancel_queue');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setStage('lobby');
      if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
    }
  };


  return (
    <div className="w-full text-zinc-300">
      {/* ── STAGE: LOBBY ── */}
      {stage === 'lobby' && (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 mb-6 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <Swords className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">1v1 Thunder Speed Race</h2>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            Test your keystroke velocity against random typists globally in a direct head-to-head race. Live indicators display typing speeds in real-time.
          </p>

          <button
            onClick={handleFindMatch}
            className="mt-8 flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-extrabold tracking-wider uppercase text-sm shadow-[0_4px_30px_rgba(245,158,11,0.25)] hover:shadow-[0_4px_35px_rgba(245,158,11,0.4)] transition-all duration-300 cursor-pointer active:scale-95"
          >
            <Search className="w-4 h-4 text-black" />
            <span>Find Player</span>
          </button>
        </div>
      )}

      {/* ── STAGE: SEARCHING ── */}
      {stage === 'searching' && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
          {/* Sonar Pulsing Circle */}
          <div className="relative w-36 h-36 flex items-center justify-center mb-8">
            <div className="absolute inset-0 rounded-full border border-yellow-500/30 animate-ping opacity-75" />
            <div className="absolute inset-4 rounded-full border border-yellow-500/20 animate-ping opacity-50 delay-75" />
            <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <Search className="w-8 h-8 animate-spin" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white font-mono">Looking for Opponents...</h3>
          <p className="text-xs text-zinc-400 mt-2 font-mono">Queue Time: {searchTimer}s</p>

          <button
            onClick={handleCancelSearch}
            className="mt-8 px-6 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer"
          >
            Cancel Matchmaking
          </button>
        </div>
      )}

      {/* ── STAGE: FOUND ── */}
      {stage === 'found' && opponent && (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-12 md:gap-16 w-full mb-8">
            {/* Player 1 */}
            <div className="flex flex-col items-center w-28 md:w-36">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-yellow-500 bg-zinc-900 overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <img src={user.avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-bold text-white truncate mt-3 w-full text-center font-mono">{user.username}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mt-1">You</span>
            </div>

            {/* VS */}
            <div className="text-2xl font-black text-yellow-500 font-mono italic animate-bounce shadow-glow">VS</div>

            {/* Player 2 */}
            <div className="flex flex-col items-center w-28 md:w-36">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-zinc-700 bg-zinc-900 overflow-hidden flex items-center justify-center">
                <img src={opponent.avatarUrl} alt="Opponent Avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-bold text-white truncate mt-3 w-full text-center font-mono">{opponent.username}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mt-1">Opponent</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-emerald-400 font-mono flex items-center gap-2">
            <Zap className="w-5 h-5 animate-pulse" /> Match Established!
          </h3>
          <p className="text-xs text-zinc-400 mt-1 font-mono">Pre-match loading...</p>
        </div>
      )}

      {/* ── STAGE: COUNTDOWN ── */}
      {stage === 'countdown' && (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeIn">
          <div className="w-32 h-32 rounded-full border border-yellow-500/10 flex items-center justify-center bg-yellow-500/5 shadow-[0_0_40px_rgba(245,158,11,0.05)] mb-6">
            <span className="text-7xl font-black text-yellow-500 font-mono animate-ping">{countdown}</span>
          </div>
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest font-mono">Prepare to Type</h3>
        </div>
      )}

      {/* ── STAGE: RACING ── */}
      {stage === 'racing' && opponent && (
        <div className="flex flex-col gap-6 animate-fadeIn w-full">
          {/* Race Tracks HUD Layout */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center text-xs font-mono text-zinc-500 border-b border-zinc-900 pb-3">
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-500" /> Duel in Progress</span>
              <div className="flex items-center gap-4">
                <span>Duration: <strong className="text-white">{raceElapsed}s</strong></span>
                <button
                  onClick={handleLeaveMatch}
                  className="px-3 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/40 hover:border-rose-500/30 text-rose-400 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Leave Match
                </button>
              </div>
            </div>

            {/* Multi-lane tracking grid */}
            <div className="flex flex-col gap-5 text-left">
              {/* Lane 1: User */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <img src={user.avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full bg-zinc-900" />
                    {user.username} <span className="text-[10px] text-zinc-500">(You)</span>
                  </span>
                  <span className="text-yellow-500 font-bold">{Math.round(userProgress)}% • {userWpm} WPM</span>
                </div>
                <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden relative">
                  {/* Glowing progress line */}
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full transition-all duration-300 relative shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                    style={{ width: `${userProgress}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Lane 2: Opponent */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <img src={opponent.avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full bg-zinc-900" />
                    {opponent.username}
                  </span>
                  <span className="text-zinc-400 font-bold">{Math.round(oppProgress)}% • {oppWpm} WPM</span>
                </div>
                <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-zinc-700 to-zinc-500 rounded-full transition-all duration-300 relative"
                    style={{ width: `${oppProgress}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-zinc-300 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Typing Arena widget */}
          <div className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl">
            <TypingArena
              key={resetKey}
              targetText={targetText}
              fontSize={config.fontSize}
              fontFamily={LANGUAGES.find(l => l.id === 'english')?.fonts.find(f => f.id === config.fontId)?.fontFamily || 'monospace'}
              cursorStyle={config.cursorStyle}
              synth={config.synth}
              gameState={stage === 'racing' ? 'running' : 'completed'}
              onStart={() => {}}
              onComplete={handleUserComplete}
              onKeystroke={(isMistake) => {
                if (isMistake && socketRef.current && roomId) {
                  socketRef.current.emit('keystroke', { roomId, isMistake: true });
                }
              }}
              onProgress={handleUserProgress}
              resetCounter={resetKey}
              testMode="quotes"
              timeLeft={raceElapsed}
              liveWpm={userWpm}
              language="english"
            />
          </div>
        </div>
      )}

      {/* ── STAGE: RESULTS ── */}
      {stage === 'results' && opponent && (
        <div className="flex flex-col gap-6 animate-fadeIn w-full max-w-3xl mx-auto">
          {/* Winner Title Card */}
          <div 
            className={`w-full p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-4 text-left ${
              raceWinner === 'user'
                ? 'border-yellow-500/30 bg-yellow-500/[0.03] text-yellow-500 shadow-[0_0_30px_rgba(245,158,11,0.05)]'
                : 'border-zinc-800 bg-zinc-950 text-zinc-400'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                {raceWinner === 'user' ? <Award className="w-8 h-8 animate-bounce" /> : <Trophy className="w-8 h-8 text-zinc-500" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white uppercase font-mono tracking-tight">
                  {raceWinner === 'user' ? '🏆 Victory is Yours!' : `Match won by ${opponent.username}`}
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  1v1 Race completed in {raceElapsed} seconds over 228 keystrokes.
                </p>
              </div>
            </div>
            <div className="font-mono text-sm tracking-widest font-black bg-zinc-900 border border-zinc-800 px-6 py-2.5 rounded-full text-white uppercase">
              {raceWinner === 'user' ? 'Victory' : 'Defeat'}
            </div>
          </div>

          {/* Versus Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User card metrics */}
            <div className={`bg-zinc-950 border rounded-2xl p-6 flex flex-col gap-4 text-left ${raceWinner === 'user' ? 'border-yellow-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]' : 'border-zinc-900'}`}>
              <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
                <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full bg-zinc-900" />
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">{user.username}</h4>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">You</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Correct Speed</span>
                  <span className="text-2xl font-black text-white mt-1 font-mono">{userWpm} <span className="text-xs text-zinc-500">WPM</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Accuracy</span>
                  <span className="text-2xl font-black text-white mt-1 font-mono">{userAccuracy}%</span>
                </div>
              </div>
            </div>

            {/* Opponent card metrics */}
            <div className={`bg-zinc-950 border rounded-2xl p-6 flex flex-col gap-4 text-left ${raceWinner === 'opponent' ? 'border-yellow-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]' : 'border-zinc-900'}`}>
              <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
                <img src={opponent.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full bg-zinc-900" />
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">{opponent.username}</h4>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Opponent</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Correct Speed</span>
                  <span className="text-2xl font-black text-white mt-1 font-mono">{oppWpm} <span className="text-xs text-zinc-500">WPM</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Accuracy</span>
                  <span className="text-2xl font-black text-white mt-1 font-mono">{oppAccuracy}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action trigger row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <button
              onClick={handleFindMatch}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Find New Match</span>
            </button>
            <button
              onClick={() => setStage('lobby')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wide transition-all duration-300 cursor-pointer active:scale-95"
            >
              <span>Back to Lobby</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
