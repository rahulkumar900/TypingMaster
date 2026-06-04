'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Users, Plus, MessageSquare, Send, Zap, Shield, Play, LogOut, Award, Clipboard } from 'lucide-react';
import { TypingArena } from '@/components/typing-arena';
import { LANGUAGES } from '@/lib/languages';

interface SphereViewProps {
  user: { username: string; avatarUrl: string };
  config: any;
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

const ROOM_PASSAGE = "Thunderstorms are majestic displays of atmospheric electricity. The flash of lightning precedes the rumble of thunder because light travels faster than sound. Similarly, in typing, visual recognition of words precedes muscle memory keystrokes. Align your hands, take a breath, and accelerate.";

export function SphereView({ user, config }: SphereViewProps) {
  const [stage, setStage] = useState<'lobby' | 'room-lobby' | 'room-racing' | 'room-results'>('lobby');
  
  // Lobby state
  const [activeRooms, setActiveRooms] = useState([
    { code: 'AB49F2', creator: 'SpeedDemon_88', mode: 'time (60s)', players: 3, maxPlayers: 8, status: 'Waiting' },
    { code: 'TH77X9', creator: 'KeyStorm_⚡', mode: 'words (25)', players: 1, maxPlayers: 5, status: 'Waiting' },
    { code: 'ssc_practice', creator: 'SSC_Trainer', mode: 'govt-exam (chsl)', players: 4, maxPlayers: 10, status: 'Waiting' }
  ]);
  const [joinCode, setJoinCode] = useState('');
  const [createMode, setCreateMode] = useState<'time' | 'words' | 'govt-exam'>('time');
  const [createLimit, setCreateLimit] = useState(60);

  // Active room state
  const [currentRoomCode, setCurrentRoomCode] = useState('');
  const [isUserHost, setIsUserHost] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  
  // Racing states
  const [raceElapsed, setRaceElapsed] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [userWpm, setUserWpm] = useState(0);
  const [userAccuracy, setUserAccuracy] = useState('100.00');

  const raceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const oppIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const correctCountRef = useRef(0);
  const typedLengthRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    setCurrentRoomCode(code);
    setIsUserHost(true);
    setStage('room-lobby');
    
    // Set initial players
    setPlayers([
      { username: user.username, avatarUrl: user.avatarUrl, isHost: true, progress: 0, wpm: 0, finished: false },
      { username: 'KeyStorm_⚡', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=KeyStorm', isHost: false, progress: 0, wpm: 0, finished: false },
      { username: 'FingerDrifter', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=FingerDrifter', isHost: false, progress: 0, wpm: 0, finished: false }
    ]);

    setChatMessages([
      { sender: 'System', avatarUrl: '', text: `Room ${code} created. Share the code to invite friends!`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) },
      { sender: 'KeyStorm_⚡', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=KeyStorm', text: "What's up! Ready to drift keys.", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) },
      { sender: 'FingerDrifter', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=FingerDrifter', text: "glhf", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
    ]);

    simulateBotChat();
  };

  const handleJoinRoom = (code: string) => {
    if (!code || code.trim().length < 3) return;
    const cleanCode = code.toUpperCase().trim();
    setCurrentRoomCode(cleanCode);
    setIsUserHost(false);
    setStage('room-lobby');

    setPlayers([
      { username: 'RoomOwner', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=RoomOwner', isHost: true, progress: 0, wpm: 0, finished: false },
      { username: user.username, avatarUrl: user.avatarUrl, isHost: false, progress: 0, wpm: 0, finished: false },
      { username: 'ClackAddict', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ClackAddict', isHost: false, progress: 0, wpm: 0, finished: false }
    ]);

    setChatMessages([
      { sender: 'System', avatarUrl: '', text: `Joined Room ${cleanCode}. Waiting for host to start test.`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) },
      { sender: 'RoomOwner', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=RoomOwner', text: `Welcome to the room, ${user.username}!`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), isHost: true }
    ]);

    simulateBotChat();

    // If joined as guest, simulate the host starting the test after 15 seconds
    setTimeout(() => {
      setStage((currentStage) => {
        if (currentStage === 'room-lobby') {
          handleStartRace();
          return 'room-racing';
        }
        return currentStage;
      });
    }, 15000);
  };

  // Bot chat simulator
  const simulateBotChat = () => {
    const timer = setInterval(() => {
      setPlayers((currentPlayers) => {
        if (currentPlayers.length <= 1) return currentPlayers;
        
        // Find a random bot (not user)
        const bots = currentPlayers.filter(p => p.username !== user.username);
        const randomBot = bots[Math.floor(Math.random() * bots.length)];
        const randomText = CHAT_RESPONSES[Math.floor(Math.random() * CHAT_RESPONSES.length)];

        setChatMessages(prev => [
          ...prev,
          {
            sender: randomBot.username,
            avatarUrl: randomBot.avatarUrl,
            text: randomText,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            isHost: randomBot.isHost
          }
        ]);
        
        return currentPlayers;
      });
    }, 8000);

    return () => clearInterval(timer);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setChatMessages(prev => [
      ...prev,
      {
        sender: user.username,
        avatarUrl: user.avatarUrl,
        text: inputMessage.trim(),
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }
    ]);

    setInputMessage('');

    // Trigger instant reply from one bot 35% of the time
    if (Math.random() < 0.35) {
      setTimeout(() => {
        setPlayers((curr) => {
          const bots = curr.filter(p => p.username !== user.username);
          if (bots.length > 0) {
            const randomBot = bots[Math.floor(Math.random() * bots.length)];
            setChatMessages(prev => [
              ...prev,
              {
                sender: randomBot.username,
                avatarUrl: randomBot.avatarUrl,
                text: `Awesome, typing is rhythm.`,
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                isHost: randomBot.isHost
              }
            ]);
          }
          return curr;
        });
      }, 1500);
    }
  };

  const handleStartRace = () => {
    setStage('room-racing');
    setRaceElapsed(0);
    setResetKey(prev => prev + 1);

    // Set all players progress back to 0
    setPlayers(prev => prev.map(p => ({ ...p, progress: 0, wpm: 0, finished: false })));

    correctCountRef.current = 0;
    typedLengthRef.current = 0;
    startTimeRef.current = Date.now();

    // Track elapsed time
    raceIntervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsedSecs = (Date.now() - startTimeRef.current) / 1000;
      setRaceElapsed(Math.floor(elapsedSecs));

      if (elapsedSecs > 0.5) {
        const mins = elapsedSecs / 60;
        const currentWpm = Math.round((correctCountRef.current / 5) / mins);
        setUserWpm(currentWpm);
        
        // Also update player's local list WPM
        setPlayers(prev => prev.map(p => {
          if (p.username === user.username) {
            return { ...p, wpm: currentWpm };
          }
          return p;
        }));
      }
    }, 1000);

    // Track simulated bots progress
    oppIntervalRef.current = setInterval(() => {
      setPlayers((currentPlayers) => {
        const updated = currentPlayers.map((player) => {
          if (player.username === user.username) return player;
          if (player.finished) return player;

          // Introduce typing velocity
          const baseSpeed = player.username === 'RoomOwner' ? 70 : player.username === 'KeyStorm_⚡' ? 76 : 60;
          const currentWpm = baseSpeed + Math.round(Math.random() * 8 - 4);
          const cps = (currentWpm * 5) / 60;
          const totalChars = ROOM_PASSAGE.length;
          const incrementalPercentage = (cps / totalChars) * 100;
          const nextProg = Math.min(100, player.progress + incrementalPercentage);
          const isDone = nextProg >= 100;

          return {
            ...player,
            progress: nextProg,
            wpm: currentWpm,
            finished: isDone
          };
        });

        // If everyone has finished, transition to results
        const unfinished = updated.filter(p => !p.finished);
        if (unfinished.length === 0) {
          clearInterval(oppIntervalRef.current!);
          clearInterval(raceIntervalRef.current!);
          setTimeout(() => {
            setStage('room-results');
          }, 1500);
        }

        return updated;
      });
    }, 1000);
  };

  const handleUserProgress = (correctCount: number, typedLength: number) => {
    correctCountRef.current = correctCount;
    typedLengthRef.current = typedLength;

    const percentage = Math.min(100, (typedLength / ROOM_PASSAGE.length) * 100);
    
    let currentWpm = 0;
    if (startTimeRef.current) {
      const elapsedSecs = (Date.now() - startTimeRef.current) / 1000;
      if (elapsedSecs > 0.5) {
        const mins = elapsedSecs / 60;
        currentWpm = Math.round((correctCount / 5) / mins);
        setUserWpm(currentWpm);
      } else {
        currentWpm = Math.round((correctCount / 5) / (0.5 / 60));
        setUserWpm(currentWpm);
      }
      
      const acc = typedLength > 0 ? ((correctCount / typedLength) * 100).toFixed(2) : '100.00';
      setUserAccuracy(acc);
    }

    setPlayers(prev => prev.map(p => {
      if (p.username === user.username) {
        return {
          ...p,
          progress: percentage,
          wpm: currentWpm
        };
      }
      return p;
    }));
  };

  const handleUserComplete = () => {
    setPlayers(prev => prev.map(p => {
      if (p.username === user.username) {
        return {
          ...p,
          progress: 100,
          finished: true
        };
      }
      return p;
    }));

    // Check if other players are done
    setTimeout(() => {
      setPlayers(current => {
        const unfinished = current.filter(p => !p.finished);
        if (unfinished.length === 0) {
          if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
          if (oppIntervalRef.current) clearInterval(oppIntervalRef.current);
          setStage('room-results');
        }
        return current;
      });
    }, 1500);
  };

  const handleExitRoom = () => {
    setStage('lobby');
    setCurrentRoomCode('');
    if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
    if (oppIntervalRef.current) clearInterval(oppIntervalRef.current);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(currentRoomCode);
  };

  return (
    <div className="w-full text-zinc-300">
      
      {/* ── STAGE: LOBBY ── */}
      {stage === 'lobby' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn text-left">
          {/* Left panel: Active Rooms */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-2">
              <Users className="w-4 h-4 text-yellow-500" /> Active Sphere Rooms
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeRooms.map((room) => (
                <div 
                  key={room.code}
                  className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 hover:border-zinc-800 transition-all flex flex-col justify-between min-h-[140px]"
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm font-black text-yellow-500 tracking-wider">#{room.code}</span>
                      <span className="text-[10px] text-zinc-500 font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full uppercase">
                        {room.players}/{room.maxPlayers} players
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-zinc-500 font-mono">Creator: <strong className="text-zinc-300">{room.creator}</strong></p>
                      <p className="text-xs text-zinc-500 font-mono mt-1">Rule: <strong className="text-zinc-300">{room.mode}</strong></p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleJoinRoom(room.code)}
                    className="mt-4 w-full py-2 rounded-xl bg-zinc-900 hover:bg-yellow-500 hover:text-black border border-zinc-800 hover:border-transparent text-white text-xs font-bold font-mono tracking-wider transition-colors cursor-pointer"
                  >
                    Join Room
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Room Actions */}
          <div className="space-y-6">
            {/* Create Room Card */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-1.5 border-b border-zinc-900 pb-3">
                <Plus className="w-4 h-4 text-yellow-500" /> Create Room
              </h3>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Test Mode</label>
                  <select 
                    value={createMode}
                    onChange={(e) => setCreateMode(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-yellow-500/50"
                  >
                    <option value="time">Time Countdown</option>
                    <option value="words">Fixed Words</option>
                    <option value="govt-exam">Government Exam Mode</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Limit Parameters</label>
                  <select 
                    value={createLimit}
                    onChange={(e) => setCreateLimit(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-yellow-500/50"
                  >
                    {createMode === 'time' && (
                      <>
                        <option value="15">15 seconds</option>
                        <option value="30">30 seconds</option>
                        <option value="60">60 seconds</option>
                      </>
                    )}
                    {createMode === 'words' && (
                      <>
                        <option value="10">10 words</option>
                        <option value="25">25 words</option>
                        <option value="50">50 words</option>
                      </>
                    )}
                    {createMode === 'govt-exam' && (
                      <>
                        <option value="SSC">SSC CHSL Rules</option>
                        <option value="SSC_CGL">SSC CGL Rules</option>
                      </>
                    )}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Create Room
                </button>
              </form>
            </div>

            {/* Join via Code Card */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white font-mono border-b border-zinc-900 pb-3">
                Join with Room Code
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  maxLength={6}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="E.G. AB49F2"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-center text-sm font-black font-mono tracking-widest text-white placeholder-zinc-700 uppercase focus:outline-none focus:border-yellow-500/50"
                />
                <button
                  onClick={() => handleJoinRoom(joinCode)}
                  className="w-full py-2.5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 text-yellow-500 font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STAGE: ROOM LOBBY ── */}
      {stage === 'room-lobby' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn text-left h-[calc(100vh-140px)] min-h-[500px]">
          {/* Left Panel: Joined Players & Room info */}
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                    <Shield className="w-5 h-5 text-yellow-500" /> Room Configuration
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono mt-1">Rule preset: standard test mode</p>
                </div>
                {/* Copiable Code pill */}
                <button 
                  onClick={copyRoomCode}
                  className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 hover:border-yellow-500/30 transition-colors font-mono cursor-pointer"
                  title="Copy Code"
                >
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Room Code:</span>
                  <span className="text-sm font-black text-yellow-500 tracking-wider">{currentRoomCode}</span>
                  <Clipboard className="w-3.5 h-3.5 text-zinc-500" />
                </button>
              </div>

              {/* Player list */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Players Connected</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {players.map((player) => (
                    <div 
                      key={player.username}
                      className="flex items-center justify-between bg-zinc-900/40 border border-zinc-900 rounded-xl p-3.5"
                    >
                      <div className="flex items-center gap-3">
                        <img src={player.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800" />
                        <div>
                          <p className="text-xs font-bold text-white font-mono">{player.username}</p>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono mt-0.5 block">
                            {player.isHost ? '⚡ Host' : 'Player'}
                          </span>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Control Action Button */}
            <div className="flex justify-between items-center border-t border-zinc-900 pt-5 mt-6">
              <button
                onClick={handleExitRoom}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer font-mono"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit Room</span>
              </button>

              {isUserHost ? (
                <button
                  onClick={handleStartRace}
                  className="flex items-center gap-2.5 px-8 py-3 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-lg font-mono shadow-[0_4px_20px_rgba(245,158,11,0.2)]"
                >
                  <Play className="w-4 h-4 text-black" />
                  <span>Start Test</span>
                </button>
              ) : (
                <div className="text-xs text-zinc-500 font-mono italic animate-pulse">
                  Waiting for host to start test...
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Sphere Chat */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between h-full">
            <h3 className="text-xs font-bold text-white font-mono border-b border-zinc-900 pb-3 flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-yellow-500 animate-pulse" /> Sphere Chat
            </h3>

            {/* Message logs */}
            <div 
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin max-h-[350px] min-h-[220px]"
            >
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2.5 text-xs text-left ${
                    msg.sender === 'System' ? 'justify-center text-center opacity-65 my-2' : ''
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
                          <span className="text-[8px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-1 py-0.2 rounded scale-90 font-mono font-bold">HOST</span>
                        )}
                        <span className="text-[9px] text-zinc-600 font-mono">{msg.time}</span>
                      </div>
                    )}
                    <p className={`leading-relaxed break-words font-sans ${msg.sender === 'System' ? 'text-[10px] text-yellow-500/80 font-mono' : 'text-zinc-300'}`}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-zinc-900 pt-3.5 mt-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-yellow-500/50"
              />
              <button
                type="submit"
                className="w-8.5 h-8.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-black" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── STAGE: ROOM RACING ── */}
      {stage === 'room-racing' && (
        <div className="flex flex-col gap-6 animate-fadeIn w-full">
          {/* Race tracks progress grid */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center text-xs font-mono text-zinc-500 border-b border-zinc-900 pb-3">
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-500 animate-pulse" /> Sphere Room Race</span>
              <span>Time: <strong className="text-white">{raceElapsed}s</strong></span>
            </div>

            {/* Dynamic multilane race track */}
            <div className="flex flex-col gap-4 text-left">
              {players.map((player) => (
                <div key={player.username} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <img src={player.avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full bg-zinc-900" />
                      {player.username} {player.username === user.username ? <span className="text-[9px] text-zinc-500">(You)</span> : ''}
                    </span>
                    <span className={`${player.username === user.username ? 'text-yellow-500' : 'text-zinc-400'} font-bold`}>
                      {Math.round(player.progress)}% • {player.wpm} WPM
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 relative ${
                        player.username === user.username 
                          ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]' 
                          : 'bg-zinc-700'
                      }`}
                      style={{ width: `${player.progress}%` }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typing Arena widget */}
          <div className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl">
            <TypingArena
              key={resetKey}
              targetText={ROOM_PASSAGE}
              fontSize={config.fontSize}
              fontFamily={LANGUAGES.find(l => l.id === 'english')?.fonts.find(f => f.id === config.fontId)?.fontFamily || 'monospace'}
              cursorStyle={config.cursorStyle}
              synth={config.synth}
              gameState="running"
              onStart={() => {}}
              onComplete={handleUserComplete}
              onKeystroke={() => {}}
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

      {/* ── STAGE: ROOM RESULTS ── */}
      {stage === 'room-results' && (
        <div className="flex flex-col gap-6 animate-fadeIn w-full max-w-2xl mx-auto">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 text-left space-y-6">
            <h2 className="text-xl font-bold text-white font-mono border-b border-zinc-900 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500 animate-pulse" /> Final Room Standings
            </h2>

            {/* Ranked list of players */}
            <div className="flex flex-col gap-3">
              {[...players]
                .sort((a, b) => b.wpm - a.wpm)
                .map((player, index) => (
                  <div 
                    key={player.username}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      player.username === user.username
                        ? 'border-yellow-500/20 bg-yellow-500/[0.02]'
                        : 'border-zinc-900 bg-zinc-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Index badge */}
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                        index === 0 ? 'bg-yellow-500 text-black' : index === 1 ? 'bg-zinc-400 text-zinc-950' : 'bg-amber-800 text-amber-200'
                      }`}>
                        {index + 1}
                      </span>
                      <img src={player.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800" />
                      <div>
                        <p className="text-xs font-bold text-white font-mono">{player.username}</p>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                          {player.isHost ? '⚡ Host' : 'Player'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-black text-white font-mono">{player.wpm} <span className="text-[10px] text-zinc-500">WPM</span></div>
                      <span className="text-[10px] text-zinc-500 font-mono">Finished</span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-zinc-900">
              <button
                onClick={handleExitRoom}
                className="px-6 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer font-mono"
              >
                Exit Room Lobby
              </button>

              <button
                onClick={() => setStage('room-lobby')}
                className="flex items-center gap-1 px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs tracking-wider uppercase transition-colors cursor-pointer font-mono"
              >
                Back to Waiting Room
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
