'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, Trophy, Search, Swords, Play, RefreshCw, Zap, Award, BarChart2, X, ChevronLeft, Share2 } from 'lucide-react';
import { TypingArena } from '@/components/typing-arena';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { LANGUAGES } from '@/lib/languages';
import { io, Socket } from 'socket.io-client';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const RedditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.23-1.72l1.05-4.79 3.39.75c.01.66.55 1.19 1.21 1.19.67 0 1.22-.54 1.22-1.21S17.47 3 16.8 3c-.52 0-.96.33-1.13.79l-3.62-.8c-.13-.03-.27.02-.34.13L10.6 7.97C8.16 8.02 5.9 8.65 4.22 9.68c-.55-.74-1.44-1.2-2.39-1.2-1.65 0-3 1.35-3 3 0 1.12.6 2.1 1.51 2.62-.05.3-.08.6-.08.9 0 3.73 4.23 6.75 9.4 6.75s9.4-3.02 9.4-6.75c0-.3-.03-.6-.08-.9.91-.52 1.51-1.5 1.51-2.62zM5.38 12.5c0-.76.62-1.38 1.38-1.38.76 0 1.38.62 1.38 1.38s-.62 1.38-1.38 1.38c-.76 0-1.38-.62-1.38-1.38zm8.28 2.85c-.94.94-2.73.94-3.67 0-.13-.13-.13-.35 0-.48.13-.13.35-.13.48 0 .68.68 1.95.68 2.63 0 .07-.07.16-.1.24-.1.08 0 .17.03.24.1.13.13.13.35 0 .48zm-1.04-1.47c0-.76.62-1.38 1.38-1.38s1.38.62 1.38 1.38-.62 1.38-1.38 1.38-1.38-.62-1.38-1.38z" />
  </svg>
);

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const renderAvatar = (url: string, sizeClass = "w-6 h-6") => {
  if (url && !url.includes('seed=Lakshayyyy') && !url.includes('seed=default')) {
    return (
      <div className={`${sizeClass} rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 overflow-hidden bg-zinc-900`}>
        <img src={url} alt="Avatar" className="w-full h-full object-cover animate-fadeIn" />
      </div>
    );
  }
  return (
    <div className={`${sizeClass} rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 overflow-hidden bg-zinc-800`}>
      <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
      </svg>
    </div>
  );
};

interface Lobby1v1ViewProps {
  user: { username: string; avatarUrl: string };
  config: any;
}

const MATCH_PASSAGE = "The storm clouds rolled in over the horizon, flashing brilliant arches of lightning that lit up the typing arena. Speed and precision are the only shields in this thunderous duel. Keep your hands relaxed, find your keycap rhythm, and strike like a bolt from the blue.";

export function Lobby1v1View({ user, config }: Lobby1v1ViewProps) {
  const params = useParams();
  const initialRoomId = params?.roomId as string | undefined;

  const [stage, setStage] = useState<'lobby' | 'searching' | 'found' | 'countdown' | 'racing' | 'results'>(
    initialRoomId ? 'searching' : 'lobby'
  );
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

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const correctCountRef = useRef(0);
  const typedLengthRef = useRef(0);
  const errorCountRef = useRef(0);
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://typingmaster-bibp.onrender.com';
    const socket = io(apiUrl, {
      auth: { token }
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to multiplayer server');
      if (initialRoomId) {
        socket.emit('reconnect_room', { roomId: initialRoomId });
      } else if (stageRef.current === 'searching') {
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
      window.history.pushState(null, '', `/play-1vs1/${roomId}`);
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

    socket.on('opponent_disconnected', () => {
      toast.warning('Opponent disconnected. Waiting for reconnection...');
    });

    socket.on('opponent_reconnected', () => {
      toast.success('Opponent reconnected!');
    });

    socket.on('opponent_left', ({ reason }) => {
      if (['racing', 'results', 'countdown', 'found'].includes(stageRef.current)) {
        toast.info(reason || 'Opponent left the match. You win by forfeit!');
        setRaceWinner('user');
        setStage('results');
      } else {
        toast.info(reason || 'Opponent left the match.');
        setStage('lobby');
        window.history.pushState(null, '', '/play-1vs1');
      }
      if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
    });

    socket.on('reconnect_success', ({ 
      roomId: reconnectedRoomId, targetText, opponent: oppData, 
      userProgress, oppProgress, userWpm: uWpmVal, oppWpm: oWpmVal, userAccuracy: uAccVal, oppAccuracy: oAccVal,
      stage: serverStage 
    }) => {
      setRoomId(reconnectedRoomId);
      setOpponent(oppData);
      setTargetText(targetText);
      setUserProgress(userProgress);
      setOppProgress(oppProgress);
      setUserWpm(uWpmVal);
      setOppWpm(oWpmVal);
      if (uAccVal) setUserAccuracy(uAccVal);
      if (oAccVal) setOppAccuracy(oAccVal);
      setStage(serverStage);
      toast.success('Successfully reconnected to the match!');
      if (serverStage === 'racing') {
        startRace();
      }
    });

    socket.on('reconnect_failed', () => {
      toast.error('Failed to reconnect to room. Returning to lobby.');
      setStage('lobby');
      window.history.pushState(null, '', '/play-1vs1');
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
    errorCountRef.current = 0;
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
    if (initialRoomId) {
      window.history.pushState(null, '', '/play-1vs1');
    }
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
      window.history.pushState(null, '', '/play-1vs1');
    }
  };


  return (
    <div className="w-full text-zinc-300">
      {/* ── UNIFIED MATCHMAKING SCREEN (LOBBY / SEARCHING / FOUND / COUNTDOWN) ── */}
      {(stage === 'lobby' || stage === 'searching' || stage === 'found' || stage === 'countdown') && (
        <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn w-full max-w-4xl mx-auto select-none">
          {/* Title */}
          <h2 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight font-sans uppercase mb-1">Play 1 v 1</h2>
          
          {/* Match Cards Row */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 w-full mt-6 mb-8 relative">
            {/* Player 1 (You) Card */}
            <div className="w-[280px] h-[180px] rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-subtle)]/80 backdrop-blur-md flex flex-col items-center justify-center gap-3.5 shadow-xl relative transition-all duration-300">
              {renderAvatar(user.avatarUrl, "w-20 h-20 border-2 border-[var(--accent-color)]/50 shadow-[0_0_15px_rgba(var(--accent-rgb),0.15)]")}
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-sm font-bold text-[var(--text-main)] truncate max-w-[200px] font-mono">{user.username}</span>
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">You</span>
              </div>
            </div>

            {/* VS Indicator & Countdown Overlay */}
            <div className="flex flex-col items-center justify-center relative min-w-[80px]">
              <span className="text-6xl md:text-7xl font-black text-[var(--text-muted)]/20 italic tracking-wider font-sans select-none">VS</span>
              {stage === 'countdown' && (
                <div className="absolute top-[80%] whitespace-nowrap bg-[var(--accent-color)] text-[var(--bg-body)] text-xs font-bold font-mono px-3.5 py-1.5 rounded-full shadow-lg animate-pulse">
                  Starting in: {countdown}
                </div>
              )}
            </div>

            {/* Player 2 (Opponent) Card */}
            <div className="w-[280px] h-[180px] rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-subtle)]/80 backdrop-blur-md flex flex-col items-center justify-center gap-3.5 shadow-xl relative transition-all duration-300">
              {stage === 'lobby' ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-6xl font-black text-[var(--text-muted)]/20 select-none">?</span>
                </div>
              ) : stage === 'searching' ? (
                <div className="flex flex-col items-center justify-center gap-4">
                  {/* Pulsing sonar effect */}
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-[var(--accent-color)]/30 animate-ping opacity-75" />
                    <div className="w-12 h-12 rounded-full bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)]">
                      <Search className="w-5 h-5 animate-spin" />
                    </div>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted-alt)] font-semibold uppercase tracking-wider font-mono animate-pulse">
                    {initialRoomId ? 'Reconnecting...' : 'Searching...'}
                  </span>
                </div>
              ) : opponent ? (
                <>
                  {renderAvatar(opponent.avatarUrl, "w-20 h-20 border-2 border-[var(--text-muted-alt)]/50")}
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-sm font-bold text-[var(--text-main)] truncate max-w-[200px] font-mono">{opponent.username}</span>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">Opponent</span>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-[var(--text-muted)] max-w-lg leading-relaxed font-sans px-4">
            Dive into the thrill of instant competition with our '1v1' mode! Challenge a random opponent to a head-to-head typing battle and put your skills to the test.
          </p>

          {/* Action Buttons & Status */}
          <div className="mt-8 flex flex-col items-center justify-center min-h-[60px]">
            {stage === 'lobby' && (
              <button
                onClick={handleFindMatch}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[var(--accent-color)] text-[var(--bg-body)] font-bold text-sm uppercase tracking-wider transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-[var(--accent-color)]/10 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Find Player</span>
              </button>
            )}

            {stage === 'searching' && (
              <div className="flex flex-col items-center gap-3">
                {!initialRoomId && (
                  <span className="text-xs text-[var(--text-muted-alt)] font-semibold font-mono bg-[var(--bg-widget)] border border-[var(--border-subtle)] px-3 py-1 rounded-full">
                    Queue Time: {searchTimer}s
                  </span>
                )}
                <button
                  onClick={handleCancelSearch}
                  className="px-6 py-2 bg-[var(--bg-panel)] hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-[var(--text-main)] text-[11px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  {initialRoomId ? 'Return to Lobby' : 'Cancel Matchmaking'}
                </button>
              </div>
            )}

            {stage === 'found' && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 rounded-full text-emerald-400 font-bold font-mono text-xs uppercase tracking-wider shadow-sm animate-pulse">
                <Zap className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>Match Established!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STAGE: RACING ── */}
      {stage === 'racing' && opponent && (
        <div className="flex flex-col gap-6 animate-fadeIn w-full">
          {/* Race Track HUD */}
          <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-2xl p-6 flex flex-col gap-6 relative shadow-lg">
            <div className="flex justify-between items-center text-xs font-mono text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-3">
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[var(--accent-color)] animate-pulse" /> Duel in Progress</span>
              <div className="flex items-center gap-4">
                <span>Duration: <strong className="text-[var(--text-main)] font-bold">{raceElapsed}s</strong></span>
                <button
                  onClick={handleLeaveMatch}
                  className="px-3 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Leave Match
                </button>
              </div>
            </div>

            {/* Single horizontal progress line containing both racing avatars */}
            <div className="w-full max-w-[800px] mx-auto px-6 sm:px-10 select-none">
            <div className="relative pt-8 pb-4 w-full">
              {/* Main track line */}
              <div className="w-full h-[4px] bg-zinc-800 rounded-full relative overflow-hidden">
                {/* Visual fill line up to the leader's position */}
                <div 
                  className="h-full bg-[var(--accent-color)] rounded-full transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(var(--accent-rgb),0.3)]"
                  style={{ width: `${Math.max(userProgress, oppProgress)}%` }}
                />
              </div>

              {/* Start Dot */}
              <div className="absolute left-0 top-[22px] flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 border border-zinc-950" />
                <span className="text-[9px] text-[var(--text-muted)] mt-2 font-mono uppercase font-semibold">Start</span>
              </div>

              {/* End Dot */}
              <div className="absolute right-0 top-[22px] flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 border border-zinc-950" />
                <span className="text-[9px] text-[var(--text-muted)] mt-2 font-mono uppercase font-semibold">End</span>
              </div>

              {/* User Avatar float (racing) */}
              <div 
                className="absolute -top-7 flex flex-col items-center transition-all duration-1000 ease-linear z-10"
                style={{ 
                  left: `${userProgress}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="relative">
                  {renderAvatar(user.avatarUrl, "w-8 h-8 border border-[var(--accent-color)] shadow-md")}
                  <div className="absolute -bottom-1 -right-1 bg-[var(--accent-color)] text-[var(--bg-body)] rounded-full w-4 h-4 flex items-center justify-center text-[8.5px] font-black border border-zinc-950">U</div>
                </div>
                <span className="text-[9.5px] text-[var(--text-main)] font-semibold mt-1 font-mono bg-[var(--bg-panel)]/90 border border-[var(--border-subtle)] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                  You ({userWpm} WPM)
                </span>
              </div>

              {/* Opponent Avatar float (racing) */}
              <div 
                className="absolute -top-7 flex flex-col items-center transition-all duration-1000 ease-linear z-10"
                style={{ 
                  left: `${oppProgress}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="relative">
                  {renderAvatar(opponent.avatarUrl, "w-8 h-8 border border-zinc-600 shadow-md")}
                  <div className="absolute -bottom-1 -right-1 bg-zinc-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8.5px] font-black border border-zinc-950">O</div>
                </div>
                <span className="text-[9.5px] text-[var(--text-muted-alt)] font-medium mt-1 font-mono bg-[var(--bg-panel)]/90 border border-[var(--border-subtle)] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                  {opponent.username} ({oppWpm} WPM)
                </span>
              </div>
            </div>
            </div>
          </div>

          {/* Typing Arena widget */}
          <div className="w-full bg-[var(--bg-panel)]/40 border border-[var(--border-subtle)] rounded-2xl shadow-inner relative overflow-hidden">
            <TypingArena
              key={resetKey}
              targetText={targetText}
              fontSize={config.fontSize}
              fontFamily={LANGUAGES.find(l => l.id === 'english')?.fonts.find(f => f.id === config.fontId)?.fontFamily || 'monospace'}
              cursorStyle={config.cursorStyle}
              strictMode={true}
              synth={config.synth}
              gameState={stage === 'racing' ? 'running' : 'completed'}
              onStart={() => {}}
              onComplete={handleUserComplete}
              onKeystroke={(isMistake) => {
                if (isMistake) {
                  errorCountRef.current++;
                  if (socketRef.current && roomId) {
                    socketRef.current.emit('keystroke', { roomId, isMistake: true });
                  }
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
      {stage === 'results' && opponent && (() => {
        const userRank = raceWinner === 'user' ? '#1' : '#2';
        const oppRank = raceWinner === 'opponent' ? '#1' : '#2';
        const oppRankText = raceWinner === 'opponent' ? '1st' : '2nd';
        
        // Calculate WPM and Accuracy
        const uWpm = userWpm;
        const uAcc = userAccuracy;
        const oWpm = oppWpm;
        const oAcc = oppAccuracy;
        
        // Estimate Raw Wpm
        const uRaw = Math.round(uWpm / (parseFloat(uAcc) / 100 || 1));
        const oRaw = Math.round(oWpm / (parseFloat(oAcc) / 100 || 1));

        // Character details breakdown
        const charsCorrect = correctCountRef.current;
        const charsIncorrect = errorCountRef.current;
        const charsExtra = Math.max(0, typedLengthRef.current - targetText.length);
        const charsMissed = Math.max(0, targetText.length - correctCountRef.current);

        const shareLink = typeof window !== 'undefined' 
          ? `${window.location.origin}/race/${roomId || 'lobby'}`
          : `https://typingthunder.com/race/${roomId || 'lobby'}`;

        const handleCopyLink = () => {
          navigator.clipboard.writeText(shareLink);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        };

        return (
          <div className="flex flex-col gap-8 animate-fadeIn w-full max-w-3xl mx-auto select-none">
            {/* Title / Winner Card Banner */}
            <div 
              className={`w-full p-5 rounded-2xl border flex flex-col sm:flex-row justify-between items-center gap-4 text-left backdrop-blur-md ${
                raceWinner === 'user'
                  ? 'border-yellow-500/30 bg-yellow-500/[0.02] text-[var(--accent-color)] shadow-[0_0_20px_rgba(226,183,20,0.05)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-panel)]/40 text-[var(--text-muted)]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center text-[var(--accent-color)]">
                  {raceWinner === 'user' ? <Award className="w-7 h-7 animate-bounce" /> : <Trophy className="w-7 h-7 text-[var(--text-muted)]" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)] uppercase font-sans tracking-tight">
                    {raceWinner === 'user' ? '🏆 Victory is Yours!' : `Match won by ${opponent.username}`}
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    1v1 speed race completed in {raceElapsed}s.
                  </p>
                </div>
              </div>
              <div className="font-mono text-xs tracking-wider font-extrabold bg-[var(--bg-panel)] border border-[var(--border-subtle)] px-5 py-2 rounded-full text-[var(--text-main)] uppercase">
                {raceWinner === 'user' ? 'Victory' : 'Defeat'}
              </div>
            </div>

            {/* Split Scorecards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* User Results Card (Left - wider) */}
              <div className={`md:col-span-7 bg-[var(--bg-panel)] border rounded-2xl p-6 flex flex-col justify-between text-left shadow-lg transition-all ${
                raceWinner === 'user' ? 'border-[var(--accent-color)]/30' : 'border-[var(--border-subtle)]'
              }`}>
                <div>
                  {/* Top info and rank */}
                  <div className="flex justify-between items-start border-b border-[var(--border-subtle)] pb-4 mb-5">
                    <div className="flex items-center gap-3">
                      {renderAvatar(user.avatarUrl, "w-10 h-10 border border-[var(--border-subtle)] bg-zinc-950")}
                      <div>
                        <h4 className="text-base font-bold text-[var(--text-main)] font-mono leading-none">{user.username}</h4>
                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mt-1 block">You</span>
                      </div>
                    </div>
                    <span className="text-5xl font-black font-mono leading-none text-[var(--accent-color)]">{userRank}</span>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold tracking-wider font-mono">Wpm</span>
                      <span className="text-3xl font-black text-[var(--text-main)] leading-none mt-1 font-mono">{uWpm}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold tracking-wider font-mono">Acc</span>
                      <span className="text-3xl font-black text-[var(--text-main)] leading-none mt-1 font-mono">{Math.round(parseFloat(uAcc))}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold tracking-wider font-mono">Secs</span>
                      <span className="text-3xl font-black text-[var(--text-main)] leading-none mt-1 font-mono">{raceElapsed}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold tracking-wider font-mono">Raw</span>
                      <span className="text-3xl font-black text-[var(--text-main)] leading-none mt-1 font-mono">{uRaw || uWpm}</span>
                    </div>
                  </div>
                </div>

                {/* Character breakdowns */}
                <div className="border-t border-[var(--border-subtle)] pt-4">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wider font-mono">Characters</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 font-mono text-center">
                    <div className="bg-[var(--bg-widget)] border border-[var(--border-subtle)] rounded-xl p-2 flex flex-col">
                      <span className="text-[9px] text-[var(--text-muted)]">Correct</span>
                      <span className="text-base font-bold text-[var(--text-main)] mt-0.5">{String(charsCorrect).padStart(2, '0')}</span>
                    </div>
                    <div className="bg-[var(--bg-widget)] border border-[var(--border-subtle)] rounded-xl p-2 flex flex-col">
                      <span className="text-[9px] text-[var(--text-muted)]">Incorrect</span>
                      <span className="text-base font-bold text-[var(--text-main)] mt-0.5">{String(charsIncorrect).padStart(2, '0')}</span>
                    </div>
                    <div className="bg-[var(--bg-widget)] border border-[var(--border-subtle)] rounded-xl p-2 flex flex-col">
                      <span className="text-[9px] text-[var(--text-muted)]">Extra</span>
                      <span className="text-base font-bold text-[var(--text-main)] mt-0.5">{String(charsExtra).padStart(2, '0')}</span>
                    </div>
                    <div className="bg-[var(--bg-widget)] border border-[var(--border-subtle)] rounded-xl p-2 flex flex-col">
                      <span className="text-[9px] text-[var(--text-muted)]">Missed</span>
                      <span className="text-base font-bold text-[var(--text-main)] mt-0.5">{String(charsMissed).padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opponent Results Card (Right - narrower) */}
              <div className={`md:col-span-5 bg-[var(--bg-panel)] border rounded-2xl p-6 flex flex-col justify-between text-left shadow-lg transition-all ${
                raceWinner === 'opponent' ? 'border-[var(--accent-color)]/30' : 'border-[var(--border-subtle)]'
              }`}>
                <div>
                  {/* Top info and rank */}
                  <div className="flex justify-between items-start border-b border-[var(--border-subtle)] pb-4 mb-5">
                    <div className="flex items-center gap-3">
                      {renderAvatar(opponent.avatarUrl, "w-10 h-10 border border-[var(--border-subtle)] bg-zinc-950")}
                      <div>
                        <h4 className="text-base font-bold text-[var(--text-main)] font-mono leading-none truncate max-w-[120px]">{opponent.username}</h4>
                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mt-1 block">Opponent ({oppRankText})</span>
                      </div>
                    </div>
                    <span className="text-5xl font-black font-mono leading-none text-[var(--text-muted)]/30">{oppRank}</span>
                  </div>

                  {/* Vertical Stats list */}
                  <div className="flex flex-col gap-3.5 font-mono text-sm">
                    <div className="flex justify-between items-center bg-[var(--bg-widget)] border border-[var(--border-subtle)]/50 px-3.5 py-2 rounded-xl">
                      <span className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Speed</span>
                      <span className="font-extrabold text-[var(--text-main)]">{oWpm} WPM</span>
                    </div>
                    <div className="flex justify-between items-center bg-[var(--bg-widget)] border border-[var(--border-subtle)]/50 px-3.5 py-2 rounded-xl">
                      <span className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Accuracy</span>
                      <span className="font-extrabold text-[var(--text-main)]">{Math.round(parseFloat(oAcc))}%</span>
                    </div>
                    <div className="flex justify-between items-center bg-[var(--bg-widget)] border border-[var(--border-subtle)]/50 px-3.5 py-2 rounded-xl">
                      <span className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Duration</span>
                      <span className="font-extrabold text-[var(--text-main)]">{raceElapsed}s</span>
                    </div>
                    <div className="flex justify-between items-center bg-[var(--bg-widget)] border border-[var(--border-subtle)]/50 px-3.5 py-2 rounded-xl">
                      <span className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Raw Wpm</span>
                      <span className="font-extrabold text-[var(--text-main)]">{oRaw || oWpm} Raw</span>
                    </div>
                  </div>
                </div>

                {/* Visual Expand Results link */}
                <div className="text-center mt-6">
                  <span className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-color)] cursor-pointer font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                    ‹ Expand results ›
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <button
                onClick={handleFindMatch}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--accent-color)] text-[var(--bg-body)] font-extrabold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg active:scale-95 hover:opacity-90"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Find New Match</span>
              </button>
              <button
                onClick={() => {
                  setStage('lobby');
                  window.history.pushState(null, '', '/play-1vs1');
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-panel)] text-[var(--text-main)] hover:bg-[var(--bg-hover)] font-bold text-xs uppercase tracking-wide transition-all duration-300 cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back to Lobby</span>
              </button>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-panel)] text-[var(--text-main)] hover:bg-[var(--bg-hover)] font-bold text-xs uppercase tracking-wide transition-all duration-300 cursor-pointer active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>Share</span>
              </button>
            </div>

            {/* Share Modal Overlay */}
            {isShareModalOpen && (
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
                onClick={() => setIsShareModalOpen(false)}
              >
                <div 
                  className="bg-[#18181c] border border-zinc-800 rounded-2xl p-6 w-full max-w-[380px] shadow-2xl relative text-left animate-slideIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => setIsShareModalOpen(false)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h3 className="text-base font-bold text-white font-sans">Share your results</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">If you want to save your result, share it with your friends</p>
                  
                  {/* Icons row */}
                  <div className="flex items-center justify-between gap-3 mt-6 mb-6">
                    <button className="w-11 h-11 rounded-full flex items-center justify-center text-white bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer" title="Share on Instagram">
                      <InstagramIcon className="w-5 h-5" />
                    </button>
                    <button className="w-11 h-11 rounded-full flex items-center justify-center text-white bg-[#1877f2] transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer" title="Share on Facebook">
                      <FacebookIcon className="w-5 h-5" />
                    </button>
                    <button className="w-11 h-11 rounded-full flex items-center justify-center text-white bg-[#ff4500] transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer" title="Share on Reddit">
                      <RedditIcon className="w-5 h-5" />
                    </button>
                    <button className="w-11 h-11 rounded-full flex items-center justify-center text-white bg-[#25d366] transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer" title="Share on WhatsApp">
                      <WhatsappIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Link field */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Shareable link</span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={shareLink} 
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-[11px] text-zinc-300 font-mono focus:outline-none"
                      />
                      <button 
                        onClick={handleCopyLink}
                        className="px-3.5 py-2 bg-[var(--accent-color)] hover:opacity-90 text-[var(--bg-body)] rounded-xl text-xs font-extrabold transition-all cursor-pointer active:scale-95 shrink-0"
                      >
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
