'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Plus, MessageSquare, Send, Zap, Shield, Play, LogOut, Award, Clipboard, Check,
  LogIn, Clock, BookOpen, Sparkles, Sliders, Settings, AlertTriangle, Keyboard, Globe, X, Share2, CornerDownLeft
} from 'lucide-react';
import { TypingArena } from '@/components/typing-arena';
import { LANGUAGES } from '@/lib/languages';
import { io, Socket } from 'socket.io-client';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SphereViewProps {
  user: { username: string; avatarUrl: string };
  config: any;
  initialRoomId?: string;
}

interface Message {
  sender: string;
  avatarUrl: string;
  text: string;
  time: string;
  isHost?: boolean;
}

interface Player {
  username: string;
  avatarUrl: string;
  isHost: boolean;
  progress: number;
  wpm: number;
  finished: boolean;
  rank?: number;
  ready?: boolean;
}

const CHAT_RESPONSES = [
  "glhf everyone!",
  "Let's see who has the fastest keystrokes today.",
  "Remington GAIL or English layout? I'm standard English qwerty.",
  "I'm aimin' for 85 WPM this round.",
  "ready when you are",
  "Don't choke on the capital letters!",
  "That text passage looks spicy.",
  "Nice room settings, host!"
];

const COMMON_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
];

const DEFAULT_LOBBY_PASSAGE = "Most of them are based on basic text fields that were modified to better handle specific types of information, like the credit card numbers. Here are just a few examples of input types that are most commonly used throughout UIs we creating.";

export function SphereView({ user, config, initialRoomId }: SphereViewProps) {
  const router = useRouter();

  const [stage, setStage] = useState<'lobby' | 'room-lobby' | 'room-racing' | 'room-results'>('lobby');
  
  // Lobby State
  const [joinCode, setJoinCode] = useState('');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeRooms, setActiveRooms] = useState([
    { code: 'AB49F2', creator: 'SpeedDemon_88', mode: 'time (60s)', players: 3, maxPlayers: 8 },
    { code: 'TH77X9', creator: 'KeyStorm_⚡', mode: 'words (25)', players: 1, maxPlayers: 5 },
    { code: 'SSC2026', creator: 'SSC_Trainer', mode: 'govt-exam (chsl)', players: 4, maxPlayers: 10 }
  ]);
  
  // Room configuration
  const [createMode, setCreateMode] = useState<'time' | 'words' | 'govt-exam'>('time');
  const [createLimit, setCreateLimit] = useState(60);
  const [roomPassage, setRoomPassage] = useState(DEFAULT_LOBBY_PASSAGE);

  // Active room state
  const [currentRoomCode, setCurrentRoomCode] = useState('');
  const [isUserHost, setIsUserHost] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userReady, setUserReady] = useState(false);

  // Countdown Overlay
  const [countdown, setCountdown] = useState<number | null>(null);
  
  // Racing states
  const [raceElapsed, setRaceElapsed] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [userWpm, setUserWpm] = useState(0);
  const [userAccuracy, setUserAccuracy] = useState('100.00');
  const [charStats, setCharStats] = useState({ correct: 0, incorrect: 0, extra: 0, missed: 0 });

  const raceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const oppIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('typing_thunder_token') : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://typingmaster-bibp.onrender.com';
    socketRef.current = io(apiUrl, {
      auth: { token }
    });

    socketRef.current.on('connect', () => {
      if (initialRoomId) {
        socketRef.current?.emit('join_sphere_room', { roomCode: initialRoomId.toUpperCase().trim(), avatarUrl: user.avatarUrl });
      }
    });

    socketRef.current.on('sphere_room_created', ({ roomCode }) => {
      router.push(`/sphere/${roomCode}`);
    });

    socketRef.current.on('sphere_room_joined', ({ roomState }) => {
      setCurrentRoomCode(roomState.roomCode);
      
      const me = roomState.players.find((p: any) => p.username === user.username);
      if (me && me.isHost) {
        setIsUserHost(true);
        setUserReady(true);
        setChatMessages([{ sender: 'System', avatarUrl: '', text: `Room ${roomState.roomCode} created. Share the link to invite friends!`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      } else {
        setIsUserHost(false);
        setUserReady(false);
        setChatMessages([{ sender: 'System', avatarUrl: '', text: `Joined Room ${roomState.roomCode}. Waiting for host to start test.`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      }

      setIsJoinModalOpen(false);
      setStage('room-lobby');
      setPlayers(roomState.players);
      setCreateMode(roomState.mode);
      setCreateLimit(roomState.limit);
      if (roomState.targetText) setRoomPassage(roomState.targetText);
    });

    socketRef.current.on('sphere_join_error', ({ error }) => {
      alert(error);
    });

    socketRef.current.on('sphere_player_joined', ({ player }) => {
      setPlayers(prev => [...prev.filter(p => p.username !== player.username), player]);
      setChatMessages(prev => [...prev, { sender: 'System', avatarUrl: '', text: `${player.username} joined the room.`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      toast.success(`${player.username} joined the room!`);
    });

    socketRef.current.on('sphere_player_left', ({ username }) => {
      setPlayers(prev => prev.filter(p => p.username !== username));
      setChatMessages(prev => [...prev, { sender: 'System', avatarUrl: '', text: `${username} left the room.`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      toast.info(`${username} left the room.`);
    });

    socketRef.current.on('sphere_new_host', ({ username }) => {
      setPlayers(prev => prev.map(p => p.username === username ? { ...p, isHost: true } : p));
      if (username === user.username) {
        setIsUserHost(true);
        setChatMessages(prev => [...prev, { sender: 'System', avatarUrl: '', text: `You are now the host.`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      }
    });

    socketRef.current.on('sphere_chat_message', (msg) => {
      setChatMessages(prev => [...prev, msg]);
    });

    socketRef.current.on('sphere_settings_changed', ({ mode, limit, targetText }) => {
      setCreateMode(mode);
      setCreateLimit(limit);
      setRoomPassage(targetText);
    });

    socketRef.current.on('sphere_player_ready_changed', ({ username, ready }) => {
      setPlayers(prev => prev.map(p => p.username === username ? { ...p, ready } : p));
    });

    socketRef.current.on('sphere_countdown_tick', (count) => {
      setCountdown(count);
      setPlayers(prev => prev.map(p => ({ ...p, ready: true })));
    });

    socketRef.current.on('sphere_race_start', () => {
      setCountdown(null);
      startRaceLocal();
    });

    socketRef.current.on('sphere_progress', ({ username, progress, wpm, accuracy }) => {
      setPlayers(prev => prev.map(p => p.username === username ? { ...p, progress, wpm } : p));
    });

    socketRef.current.on('player_progress', ({ progress, wpm, accuracy }) => {
      setUserWpm(wpm);
      setUserAccuracy(accuracy.toString());
      setPlayers(prev => prev.map(p => p.username === user.username ? { ...p, progress, wpm } : p));
    });

    socketRef.current.on('sphere_player_complete', ({ username, wpm, accuracy }) => {
      setPlayers(current => {
        const nextRank = Math.max(0, ...current.map(p => p.rank || 0)) + 1;
        const next = current.map(p => p.username === username ? { ...p, progress: 100, wpm, finished: true, rank: nextRank } : p);
        if (next.every(p => p.finished)) {
          setTimeout(() => setStage('room-results'), 1500);
        }
        return next;
      });
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [user]);

  const startRaceLocal = () => {
    setStage('room-racing');
    setRaceElapsed(0);
    setResetKey(prev => prev + 1);

    // Set all players progress back to 0
    setPlayers(prev => prev.map(p => ({ ...p, progress: 0, wpm: 0, finished: false })));

    correctCountRef.current = 0;
    typedLengthRef.current = 0;
    startTimeRef.current = Date.now();
    setCharStats({ correct: 0, incorrect: 0, extra: 0, missed: 0 });

    // Track elapsed time
    if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
    raceIntervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsedSecs = (Date.now() - startTimeRef.current) / 1000;
      const roundedElapsed = Math.floor(elapsedSecs);
      setRaceElapsed(roundedElapsed);

      if (createMode === 'time' && roundedElapsed >= createLimit) {
        if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
        setTimeout(() => {
          setStage('room-results');
        }, 1500);
      }
    }, 1000);
  };


  const correctCountRef = useRef(0);
  const typedLengthRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Generate passage based on rules
  const updatePassage = (mode: 'time' | 'words' | 'govt-exam', limit: number) => {
    if (mode === 'govt-exam') {
      setRoomPassage(DEFAULT_LOBBY_PASSAGE);
      return;
    }
    const count = mode === 'words' ? limit : 45;
    const wordsList = [];
    for (let i = 0; i < count; i++) {
      wordsList.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]);
    }
    // Make the first letter capital and add a period
    let passage = wordsList.join(' ');
    passage = passage.charAt(0).toUpperCase() + passage.slice(1) + '.';
    setRoomPassage(passage);
  };

  useEffect(() => {
    updatePassage(createMode, createLimit);
  }, [createMode, createLimit]);

  const handleCreateRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit('create_sphere_room', { mode: createMode, limit: createLimit, avatarUrl: user.avatarUrl, targetText: roomPassage });
    }
  };

  const handleJoinRoom = (code: string) => {
    if (!code || code.trim().length < 3) return;
    const cleanCode = code.toUpperCase().trim();
    if (socketRef.current) {
      socketRef.current.emit('join_sphere_room', { roomCode: cleanCode, avatarUrl: user.avatarUrl });
    }
  };

  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socketRef.current) return;
    socketRef.current.emit('sphere_chat_send', { roomCode: currentRoomCode, text: inputMessage.trim() });
    setInputMessage('');
  };

  const triggerStartCountdown = () => {
    if (socketRef.current && isUserHost) {
      socketRef.current.emit('sphere_start_race', { roomCode: currentRoomCode });
    }
  };


  

  const handleUserProgress = (correctCount: number, typedLength: number, typedText: string) => {
    correctCountRef.current = correctCount;
    typedLengthRef.current = typedLength;

    if (socketRef.current && currentRoomCode) {
      socketRef.current.emit('keystroke', {
        roomId: `sphere_${currentRoomCode}`,
        typedText: typedText,
        isMistake: false
      });
    }
  };

  const handleUserComplete = () => {
    if (socketRef.current && currentRoomCode) {
      // The backend detects completion automatically via keystrokes when typedLength >= targetLength, 
      // but we can also set a local completed state if needed.
    }
  };

  const handleExitRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit('leave_sphere_room', { roomCode: currentRoomCode });
    }
    setStage('lobby');
    setCurrentRoomCode('');
    setIsLeaveModalOpen(false);
    setUserReady(false);
    if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(currentRoomCode);
    toast.success('Room code copied to clipboard!');
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/sphere/${currentRoomCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Invite link copied to clipboard!');
  };

  // Rank calculations: Sort by assigned rank first, then by WPM for those who didn't finish
  const rankedPlayers = [...players]
    .sort((a, b) => {
      if (a.rank && b.rank) return a.rank - b.rank;
      if (a.rank) return -1;
      if (b.rank) return 1;
      return b.wpm - a.wpm;
    })
    .map((p, idx) => ({ ...p, rank: p.rank || idx + 1 }));

  const userRankedRecord = rankedPlayers.find(p => p.username === user.username);
  const otherPlayersRanked = rankedPlayers.filter(p => p.username !== user.username);

  return (
    <div className="w-full text-zinc-300">
      
      {/* ── STAGE: LOBBY ── */}
      {stage === 'lobby' && (
        <div className="flex flex-col gap-6 animate-fadeIn text-center w-full max-w-[800px] mx-auto py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Create Room Card */}
            <div 
              onClick={() => setIsCreateModalOpen(true)}
              className="group relative flex flex-col items-center justify-center p-8 bg-[#161617] border border-zinc-800 rounded-[28px] hover:bg-zinc-900/40 transition-all duration-300 w-full h-[220px] cursor-pointer shadow-lg active:scale-98"
            >
              <div className="w-14 h-14 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900/60 text-zinc-400 group-hover:text-white group-hover:border-zinc-700 transition-all duration-300">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold text-white tracking-wide mt-4">Create Room</span>
            </div>

            {/* Join Room Card */}
            <div 
              onClick={() => setIsJoinModalOpen(true)}
              className="group relative flex flex-col items-center justify-center p-8 bg-[#161617] border border-zinc-800 rounded-[28px] hover:bg-zinc-900/40 transition-all duration-300 w-full h-[220px] cursor-pointer shadow-lg active:scale-98"
            >
              <div className="w-14 h-14 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900/60 text-zinc-400 group-hover:text-white group-hover:border-zinc-700 transition-all duration-300">
                <LogIn className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold text-white tracking-wide mt-4">Join Room</span>
            </div>
          </div>

          {/* Description text block */}
          <p className="text-[13px] text-zinc-500 max-w-[620px] mx-auto mt-8 leading-relaxed font-sans">
            Introducing Sphere Mode: Unleash a fun of friendly competition by creating a room to test your typing skills with friends. Simply generate a unique code, share it with your pals, and let the typing challenge begin.
          </p>

          {/* Active rooms list */}
          <div className="w-full text-left space-y-4 mt-10">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-2 select-none">
              <Users className="w-4 h-4 text-zinc-400" /> Active rooms you can join
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activeRooms.map((room) => (
                <div 
                  key={room.code}
                  className="bg-[#161617] border border-zinc-800 rounded-2xl p-4.5 flex flex-col justify-between min-h-[140px] shadow-sm hover:border-zinc-700 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-black text-[#00d8f6] tracking-wider">#{room.code}</span>
                    <span className="text-[9px] text-zinc-500 font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full uppercase">
                      {room.players}/{room.maxPlayers} players
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-zinc-500 font-mono">
                    <p>Host: <strong className="text-zinc-400">{room.creator}</strong></p>
                    <p className="mt-0.5">Preset: <strong className="text-zinc-400">{room.mode}</strong></p>
                  </div>
                  <button 
                    onClick={() => handleJoinRoom(room.code)}
                    className="mt-3.5 w-full py-1.5 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 hover:border-transparent text-white text-[11px] font-bold font-mono tracking-wider transition-colors cursor-pointer"
                  >
                    Join Room
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Footer links */}
          <footer className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-zinc-600 font-sans mt-16 border-t border-zinc-900 pt-6">
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">Contact</span>
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">Twitter</span>
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">Discord</span>
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">GitHub</span>
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">Security</span>
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">Support</span>
          </footer>
        </div>
      )}

      {/* ── STAGE: ROOM LOBBY ── */}
      {stage === 'room-lobby' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn text-left h-[calc(100vh-170px)] min-h-[500px] relative">
          
          {/* Countdown timer overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40 rounded-[28px] flex items-center justify-center select-none">
              <div className="text-center">
                <span className="text-[14px] font-bold text-zinc-500 uppercase tracking-widest font-mono block mb-2">Preparing Race</span>
                <span className="text-6xl font-black text-white font-sans animate-bounce">Starting in: {countdown}</span>
              </div>
            </div>
          )}

          {/* Left Panel: Waiting Room Area */}
          <div className="lg:col-span-2 bg-[#161617] border border-zinc-800 rounded-[28px] p-6 flex flex-col justify-between shadow-lg">
            <div>
              {/* Header with Invite banner */}
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-2">
                    <Shield className="w-4 h-4 text-zinc-400" /> Waiting Room
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono mt-1">
                    Preset: {createMode === 'govt-exam' ? 'Govt Rules' : createMode === 'words' ? `${createLimit} words` : `${createLimit}s timer`}
                  </p>
                </div>
                {/* Invite friends banner */}
                <button
                  onClick={copyInviteLink}
                  className="bg-[#00d8f6] text-black hover:bg-[#00c5e0] font-mono text-[11px] font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 shadow-md"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share and invite</span>
                </button>
              </div>

              {/* Player waiting track line */}
              <div className="w-full mt-4 mb-10 select-none relative pt-4">
                <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-zinc-800 rounded-full -translate-y-1/2" />
                
                {/* Avatars stacked at Start */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center -space-x-2.5 pl-2">
                  {players.map((player) => (
                    <div key={player.username} className="relative group">
                      <img 
                        src={player.avatarUrl} 
                        alt="Avatar" 
                        className={`w-7 h-7 rounded-full bg-zinc-900 border-2 ${player.ready ? 'border-emerald-400' : 'border-zinc-800'} transition-all`} 
                      />
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-zinc-950/90 text-white text-[9px] px-1.5 py-0.5 rounded border border-zinc-800 hidden group-hover:block whitespace-nowrap font-mono z-20">
                        {player.username} ({player.ready ? 'Ready' : 'Waiting'})
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono pt-4 mt-1.5">
                  <span>Start</span>
                  <span>End</span>
                </div>
              </div>

              {/* Faded typing text preview */}
              <div className="w-full text-left bg-black/10 border border-zinc-900/60 rounded-[20px] p-6 text-zinc-600 font-mono select-none pointer-events-none opacity-50 relative min-h-[120px] flex items-center justify-center leading-relaxed">
                {roomPassage}
              </div>

              {/* Bottom Config Pills (only editable for host) */}
              <div className="flex flex-wrap items-center gap-4 mt-6">
                {isUserHost ? (
                  /* Editable host view */
                  <>
                    {/* Pill 1: Mode Toggle */}
                    <div className="flex items-center h-[46px] p-[2px] rounded-full border border-zinc-800 bg-zinc-950/30 backdrop-blur-sm select-none gap-[6px]">
                      {(['time', 'words', 'govt-exam'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            socketRef.current?.emit('sphere_update_settings', { roomCode: currentRoomCode, mode: m, limit: m === 'time' ? 60 : m === 'words' ? 25 : 60 });
                          }}
                          className={`w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            createMode === m
                              ? 'bg-zinc-800 text-white font-bold'
                              : 'text-zinc-500 hover:text-white'
                          }`}
                          title={`${m} mode`}
                        >
                          {m === 'time' ? <Clock className="w-4.5 h-4.5" /> : m === 'words' ? <BookOpen className="w-4.5 h-4.5" /> : <Keyboard className="w-4.5 h-4.5" />}
                        </button>
                      ))}
                    </div>

                    {/* Pill 2: Limits */}
                    <div className="flex items-center h-[46px] p-[2px] rounded-full border border-zinc-800 bg-zinc-950/30 backdrop-blur-sm select-none gap-[6px]">
                      {createMode === 'time' && ([15, 30, 60] as const).map((limit) => (
                        <button
                          key={limit}
                          onClick={() => socketRef.current?.emit('sphere_update_settings', { roomCode: currentRoomCode, mode: createMode, limit })}
                          className={`w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all cursor-pointer text-xs font-bold ${
                            createLimit === limit
                              ? 'bg-zinc-800 text-white font-bold'
                              : 'text-zinc-500 hover:text-white'
                          }`}
                        >
                          {limit}
                        </button>
                      ))}
                      {createMode === 'words' && ([10, 25, 50] as const).map((limit) => (
                        <button
                          key={limit}
                          onClick={() => socketRef.current?.emit('sphere_update_settings', { roomCode: currentRoomCode, mode: createMode, limit })}
                          className={`w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all cursor-pointer text-xs font-bold ${
                            createLimit === limit
                              ? 'bg-zinc-800 text-white font-bold'
                              : 'text-zinc-500 hover:text-white'
                          }`}
                        >
                          {limit}
                        </button>
                      ))}
                      {createMode === 'govt-exam' && (
                        <span className="text-[10px] text-zinc-500 font-mono px-4 font-bold uppercase tracking-wider">CHSL Rules preset</span>
                      )}
                    </div>
                  </>
                ) : (
                  /* Read only guest view */
                  <>
                    <div className="flex items-center h-[46px] px-5 rounded-full border border-zinc-850 bg-zinc-950/10 select-none text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-600" />
                      <span>Mode: {createMode}</span>
                    </div>
                    <div className="flex items-center h-[46px] px-5 rounded-full border border-zinc-850 bg-zinc-950/10 select-none text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest gap-2">
                      <Sliders className="w-3.5 h-3.5 text-zinc-600" />
                      <span>Limit: {createLimit} {createMode === 'words' ? 'words' : 'seconds'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom info & action bar */}
            <div className="flex justify-between items-center border-t border-zinc-900 pt-5 mt-8 font-mono">
              {/* Room Code displaying at bottom */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Sphere Code:</span>
                <button 
                  onClick={copyRoomCode}
                  className="text-xs font-black text-[#00d8f6] tracking-wider hover:underline flex items-center gap-1.5 cursor-pointer"
                  title="Copy room code"
                >
                  #{currentRoomCode}
                  <Clipboard className="w-3 h-3 text-[#00d8f6]/70" />
                </button>
              </div>

              {/* Lobby Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="px-5 py-2.5 rounded-full border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer"
                >
                  Leave
                </button>

                {isUserHost ? (
                  <button
                    onClick={triggerStartCountdown}
                    disabled={!players.filter(p => !p.isHost).every(p => p.ready)}
                    className={`px-7 py-2.5 rounded-full font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer active:scale-95 shadow-md ${
                      players.filter(p => !p.isHost).every(p => p.ready)
                        ? 'bg-white text-black hover:bg-zinc-200'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                    title={!players.filter(p => !p.isHost).every(p => p.ready) ? 'Waiting for players to be ready' : 'Start Race'}
                  >
                    Start
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (socketRef.current) {
                        socketRef.current.emit('sphere_toggle_ready', { roomCode: currentRoomCode });
                      }
                      const nextReady = !userReady;
                      setUserReady(nextReady);
                      setPlayers(prev => prev.map(p => p.username === user.username ? { ...p, ready: nextReady } : p));
                    }}
                    className={`px-7 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer active:scale-95 ${
                      userReady
                        ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/20'
                        : 'bg-white text-zinc-950 hover:bg-zinc-200'
                    }`}
                  >
                    {userReady ? 'Ready ✓' : 'Ready'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Sphere Chat */}
          <div className="bg-[#161617] border border-zinc-800 rounded-[28px] p-5 flex flex-col justify-between h-full shadow-lg">
            <h3 className="text-xs font-bold text-white font-mono border-b border-zinc-900 pb-3 flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-zinc-400" /> Sphere Chat
            </h3>

            {/* Chat list */}
            <div 
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin max-h-[360px] min-h-[200px]"
            >
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2.5 text-xs text-left ${
                    msg.sender === 'System' ? 'justify-center text-center opacity-60 my-2' : ''
                  }`}
                >
                  {msg.sender !== 'System' && (
                    <img src={msg.avatarUrl} alt="Avatar" className="w-6.5 h-6.5 rounded-full bg-zinc-900 border border-zinc-800" />
                  )}
                  <div className="flex-1 min-w-0">
                    {msg.sender !== 'System' && (
                      <div className="flex items-baseline gap-1.5 mb-0.5">
                        <span className="font-bold text-white font-mono truncate">{msg.sender}</span>
                        {msg.isHost && (
                          <span className="text-[8px] bg-[#00d8f6]/10 border border-[#00d8f6]/20 text-[#00d8f6] px-1 py-0.2 rounded font-mono font-bold scale-90">HOST</span>
                        )}
                        <span className="text-[9px] text-zinc-650 font-mono">{msg.time}</span>
                      </div>
                    )}
                    <p className={`leading-relaxed break-words font-sans ${msg.sender === 'System' ? 'text-[9.5px] text-zinc-550 font-mono' : 'text-zinc-300'}`}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-zinc-900 pt-3.5 mt-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 bg-zinc-900 border border-zinc-850 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-750 placeholder-zinc-600 font-sans"
              />
              <button
                type="submit"
                className="w-8.5 h-8.5 rounded-xl bg-white hover:bg-zinc-200 text-black flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-black" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── STAGE: ROOM RACING ── */}
      {stage === 'room-racing' && (
        <div className="flex flex-col gap-6 animate-fadeIn w-full">
          {/* Race tracks progress grid */}
          <div className="bg-[#161617] border border-zinc-800 rounded-[28px] p-6 flex flex-col gap-6 shadow-lg">
            <div className="flex justify-between items-center text-xs font-mono text-zinc-500 border-b border-zinc-900 pb-3">
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-white animate-pulse" /> Sphere Speed Race</span>
              <span>Time: <strong className="text-white">{raceElapsed}s</strong></span>
            </div>

            {/* Premium Multilane Track Layout */}
            <div className="flex flex-col gap-4 w-full max-w-[800px] mx-auto mt-4 mb-14 select-none px-6 sm:px-10">
              {players.map((player, idx) => {
                const colors = ['bg-[#00d8f6]', 'bg-amber-400', 'bg-purple-400', 'bg-emerald-400'];
                const borderColors = ['border-[#00d8f6]', 'border-amber-400', 'border-purple-400', 'border-emerald-400'];
                const color = colors[idx % colors.length];
                const borderColor = borderColors[idx % borderColors.length];

                return (
                  <div key={player.username} className="relative h-6 w-full flex items-center">
                    {/* The progress track line */}
                    <div className="absolute left-0 right-0 h-[2px] bg-zinc-800/60 rounded-full" />
                    <div 
                      className={`absolute left-0 h-[2px] rounded-full transition-all duration-300 ${color}`}
                      style={{ width: `${player.progress}%` }}
                    />
                    
                    {/* Floating Avatar positioned exactly at progress percentage */}
                    <div 
                      className="absolute flex items-center gap-1.5 transition-all duration-300"
                      style={{ 
                        left: `${player.progress}%`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <div className="relative group flex flex-col items-center">
                        <img 
                          src={player.avatarUrl} 
                          alt="Avatar" 
                          className={`w-7 h-7 rounded-full bg-zinc-950 border-2 ${borderColor} shadow-md`} 
                        />
                        <span className="absolute -bottom-7 bg-zinc-950/90 text-white text-[8px] px-1 rounded border border-zinc-850 whitespace-nowrap font-mono z-20">
                          {player.username === user.username ? 'You' : player.username} ({player.wpm} WPM)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Typing Arena widget */}
          <div className="w-full bg-[#161617] border border-zinc-800 rounded-[28px] overflow-hidden shadow-lg">
            <TypingArena
              targetText={roomPassage}
              fontSize={config.fontSize}
              fontFamily={LANGUAGES.find(l => l.id === 'english')?.fonts.find(f => f.id === config.fontId)?.fontFamily || 'monospace'}
              cursorStyle={config.cursorStyle}
              strictMode={true}
              synth={config.synth}
              gameState="running"
              onStart={() => {}}
              onComplete={handleUserComplete}
              onKeystroke={() => {}}
              onProgress={(c, l, text) => handleUserProgress(c, l, text || '')}
              resetCounter={resetKey}
              testMode={createMode === 'govt-exam' ? 'govt-exam' : createMode === 'words' ? 'words' : 'time'}
              timeLeft={createMode === 'time' ? Math.max(0, createLimit - raceElapsed) : raceElapsed}
              liveWpm={userWpm}
              language="english"
            />
          </div>
        </div>
      )}

      {/* ── STAGE: ROOM RESULTS ── */}
      {stage === 'room-results' && (
        <div className="flex flex-col gap-6 animate-fadeIn w-full max-w-[960px] mx-auto py-8">
          <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center">
            
            {/* Left Card: Main detailed user scorecard */}
            {userRankedRecord && (
              <div className="relative flex-1 bg-[#161617] border border-zinc-800 rounded-[28px] p-8 flex flex-col justify-between h-[360px] md:h-[400px] shadow-lg text-left">
                {/* User Identity Header */}
                <div>
                  <h2 className="text-xl font-bold text-white font-sans tracking-tight">
                    {userRankedRecord.username}
                    <span className="text-zinc-500 font-mono text-[13px] ml-1.5 font-normal">(You)</span>
                  </h2>
                  <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Typing Speed Standings</p>
                </div>

                {/* Giant Rank badge in top right */}
                <div className="absolute top-8 right-8 flex flex-col items-end">
                  <span className="text-6xl font-black text-white/95 font-sans italic tracking-tighter select-none">
                    #{userRankedRecord.rank}
                  </span>
                </div>

                {/* Detailed metrics grid */}
                <div className="grid grid-cols-4 gap-4 mt-4 select-none">
                  <div>
                    <span className="text-3xl font-black text-white font-sans">{userRankedRecord.wpm}</span>
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block mt-0.5">WPM</span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-white font-sans">{userAccuracy}%</span>
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block mt-0.5">Accuracy</span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-white font-sans">{raceElapsed}s</span>
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block mt-0.5">Seconds</span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-white font-sans">{Math.round(userRankedRecord.wpm * 1.15)}</span>
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block mt-0.5">Raw</span>
                  </div>
                </div>

                {/* Characters breakdown list */}
                <div className="border-t border-zinc-900 pt-5 mt-4">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Characters Breakdown</span>
                  <div className="grid grid-cols-4 gap-4 mt-2.5 text-left font-mono">
                    <div>
                      <span className="text-white font-bold text-base block">{charStats.correct}</span>
                      <span className="text-[9.5px] text-zinc-550 uppercase tracking-wider">Correct</span>
                    </div>
                    <div>
                      <span className="text-rose-500 font-bold text-base block">{charStats.incorrect}</span>
                      <span className="text-[9.5px] text-zinc-550 uppercase tracking-wider">Incorrect</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 font-bold text-base block">{charStats.extra}</span>
                      <span className="text-[9.5px] text-zinc-550 uppercase tracking-wider">Extra</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-bold text-base block">{charStats.missed}</span>
                      <span className="text-[9.5px] text-zinc-550 uppercase tracking-wider">Missed</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Side: Horizontal row of player vertical cards */}
            <div className="flex flex-row gap-4 items-stretch">
              {otherPlayersRanked.map((player) => {
                const isFirst = player.rank === 1;
                return (
                  <div 
                    key={player.username}
                    className={`w-[80px] rounded-[28px] p-5 flex flex-col items-center justify-between border ${
                      isFirst 
                        ? 'border-amber-500/20 bg-amber-500/[0.01]' 
                        : 'border-zinc-800 bg-zinc-900/10'
                    } h-[360px] md:h-[400px] shadow-lg transition-all hover:scale-102`}
                  >
                    {/* Avatar at top */}
                    <img 
                      src={player.avatarUrl} 
                      alt="Avatar" 
                      className={`w-7 h-7 rounded-full bg-zinc-900 border-2 ${
                        isFirst ? 'border-amber-400' : 'border-zinc-800'
                      }`} 
                    />
                    
                    {/* Username and Rank written vertically */}
                    <div 
                      className="flex-1 flex items-center justify-center py-5 select-none"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      <span className="font-sans text-xs font-black tracking-wide uppercase text-zinc-300">
                        {player.username} 
                        <span className={isFirst ? 'text-amber-400 ml-2' : 'text-zinc-500 ml-2'}>
                          ({player.rank === 1 ? '1st' : player.rank === 2 ? '2nd' : player.rank === 3 ? '3rd' : `${player.rank}th`})
                        </span>
                      </span>
                    </div>

                    {/* Speed indicator at bottom */}
                    <div className="flex flex-col items-center font-mono">
                      <span className="text-xs font-bold text-white leading-none">{player.wpm}</span>
                      <span className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider mt-0.5">WPM</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results Action Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8 font-mono">
            <button
              onClick={handleExitRoom}
              className="px-8 py-3 rounded-full border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-white text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
            >
              Back to Lobby
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-8 py-3 rounded-full bg-white text-black font-extrabold text-xs tracking-wider uppercase hover:bg-zinc-200 transition-colors cursor-pointer shadow-md"
            >
              Share Results
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL OVERLAY: CREATE ROOM ── */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div 
            className="bg-[#0c0d12] border border-zinc-850 rounded-[28px] p-8 w-full max-w-[400px] text-center flex flex-col items-stretch gap-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-zinc-850 hover:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Sphere Mode Room</span>
              <h4 className="text-sm font-bold text-white">Create a Custom Room</h4>
            </div>

            {/* Form Selector for Mode */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Test Mode</label>
              <select 
                value={createMode}
                onChange={(e) => {
                  const m = e.target.value as any;
                  setCreateMode(m);
                  setCreateLimit(m === 'time' ? 60 : m === 'words' ? 25 : 60);
                }}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-zinc-750 cursor-pointer"
              >
                <option value="time" className="bg-zinc-950">Time Countdown</option>
                <option value="words" className="bg-zinc-950">Fixed Words</option>
                <option value="govt-exam" className="bg-zinc-950">Government Exam Mode</option>
              </select>
            </div>

            {/* Form Selector for Parameter Limit */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Limit Parameters</label>
              <select 
                value={createLimit}
                onChange={(e) => setCreateLimit(Number(e.target.value))}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-zinc-750 cursor-pointer"
              >
                {createMode === 'time' && (
                  <>
                    <option value="15" className="bg-zinc-950">15 seconds</option>
                    <option value="30" className="bg-zinc-950">30 seconds</option>
                    <option value="60" className="bg-zinc-950">60 seconds</option>
                  </>
                )}
                {createMode === 'words' && (
                  <>
                    <option value="10" className="bg-zinc-950">10 words</option>
                    <option value="25" className="bg-zinc-950">25 words</option>
                    <option value="50" className="bg-zinc-950">50 words</option>
                  </>
                )}
                {createMode === 'govt-exam' && (
                  <>
                    <option value="60" className="bg-zinc-950">SSC CHSL Rules preset</option>
                  </>
                )}
              </select>
            </div>

            <button
              onClick={() => {
                setIsCreateModalOpen(false);
                handleCreateRoom();
              }}
              className="w-full py-3 mt-2 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-extrabold text-xs tracking-wider uppercase transition-colors cursor-pointer"
            >
              Create Room
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL OVERLAY: JOIN ROOM ── */}
      {isJoinModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsJoinModalOpen(false)}
        >
          <div 
            className="bg-[#0c0d12] border border-zinc-850 rounded-[28px] p-8 w-full max-w-[380px] text-center flex flex-col items-center gap-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-zinc-850 hover:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Sphere Mode Join</span>
              <h4 className="text-sm font-bold text-white">Enter Sphere Code Below</h4>
            </div>

            <input
              type="text"
              maxLength={6}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter Code"
              className="w-full bg-zinc-900/60 border border-zinc-850 rounded-2xl px-4 py-3 text-center text-3xl font-black font-mono tracking-[0.2em] text-white placeholder-zinc-800 uppercase focus:outline-none focus:border-zinc-700 transition-all"
            />

            <button
              onClick={() => handleJoinRoom(joinCode)}
              className="w-full py-3 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-extrabold text-xs tracking-wider uppercase transition-colors cursor-pointer"
            >
              Join
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL OVERLAY: LEAVE ROOM CONFIRMATION ── */}
      {isLeaveModalOpen && (
        <div 
          className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsLeaveModalOpen(false)}
        >
          <div 
            className="bg-[#0c0d12] border border-zinc-850 rounded-[28px] p-7 w-full max-w-[340px] text-center flex flex-col items-center gap-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
              <LogOut className="w-4.5 h-4.5" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Leave Room</span>
              <h4 className="text-sm font-bold text-white">Are you sure to leave this sphere?</h4>
            </div>

            <div className="flex flex-col gap-2.5 w-full font-mono">
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs border border-zinc-850 hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Stay in this sphere room
              </button>
              <button
                onClick={handleExitRoom}
                className="w-full py-2.5 rounded-xl bg-red-950/20 hover:bg-red-950/40 text-red-400 text-xs font-semibold border border-red-900/30 transition-all cursor-pointer"
              >
                Leave this sphere
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL OVERLAY: RESULTS SHARING ── */}
      {isShareModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div 
            className="bg-[#0c0d12] border border-zinc-850 rounded-[28px] p-7 w-full max-w-[380px] text-center flex flex-col items-center gap-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-zinc-850 hover:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Share results</span>
              <h4 className="text-sm font-bold text-white">If you want to live proud, share it with your friends!</h4>
            </div>

            {/* Social Circle buttons */}
            <div className="flex items-center justify-center gap-4">
              <button className="w-10 h-10 rounded-full bg-[#E1306C]/10 border border-[#E1306C]/20 hover:bg-[#E1306C]/20 text-[#E1306C] flex items-center justify-center transition-all cursor-pointer active:scale-90" title="Instagram">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-[#1877F2]/10 border border-[#1877F2]/20 hover:bg-[#1877F2]/20 text-[#1877F2] flex items-center justify-center transition-all cursor-pointer active:scale-90" title="Facebook">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-[#FF4500]/10 border border-[#FF4500]/20 hover:bg-[#FF4500]/20 text-[#FF4500] flex items-center justify-center transition-all cursor-pointer active:scale-90" title="Reddit">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5a3 3 0 0 1-2 0 1 1 0 0 1 0-2 3 3 0 0 1 2 0 1 1 0 0 1 0 2zm.8-6.1a1.2 1.2 0 0 1 .4.9 2 2 0 0 1-1.7 2 2 2 0 0 1-1.7-2 1.2 1.2 0 0 1 .4-.9.8.8 0 0 0 .5-.7 1.2 1.2 0 0 0-1-.6h-.6a1.2 1.2 0 0 0-1 .6.8.8 0 0 0 .5.7 1.2 1.2 0 0 1 .4.9 2 2 0 0 1-1.7 2 2 2 0 0 1-1.7-2 1.2 1.2 0 0 1 .4-.9.8.8 0 0 0 .5-.7c0-.5-.4-.9-.9-.9s-.9.4-.9.9c0 .7.5 1.2 1.2 1.2a2 2 0 0 0 2-2 1.2 1.2 0 0 1 .9-.9h.2a1.2 1.2 0 0 1 .9.9 2 2 0 0 0 2 2c.7 0 1.2-.5 1.2-1.2 0-.5-.4-.9-.9-.9s-.9.4-.9.9a.8.8 0 0 0 .5.7z"></path></svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 text-[#25D366] flex items-center justify-center transition-all cursor-pointer active:scale-90" title="WhatsApp">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </button>
            </div>

            {/* Room Copiable Link */}
            <div className="w-full flex items-center gap-2 bg-zinc-900 border border-zinc-850 rounded-xl p-2.5 font-mono">
              <span className="flex-1 text-left text-[10.5px] text-zinc-550 truncate">
                {window.location.origin}/sphere/{currentRoomCode}
              </span>
              <button 
                onClick={copyInviteLink}
                className="bg-white hover:bg-zinc-200 text-black px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer active:scale-95"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
