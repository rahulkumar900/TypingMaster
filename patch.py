import re
import sys

FILE_PATH = "src/components/views/sphere-view.tsx"

with open(FILE_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Import
content = content.replace(
    "import { LANGUAGES } from '@/lib/languages';",
    "import { LANGUAGES } from '@/lib/languages';\nimport { io, Socket } from 'socket.io-client';"
)

# 2. Inject Socket ref and useEffect
socket_code = """
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000', {
      withCredentials: true
    });

    socketRef.current.on('sphere_room_created', ({ roomCode, roomState }) => {
      setCurrentRoomCode(roomCode);
      setIsUserHost(true);
      setUserReady(true);
      setStage('room-lobby');
      setPlayers(roomState.players);
      if (roomState.targetText) setRoomPassage(roomState.targetText);
      setChatMessages([{ sender: 'System', avatarUrl: '', text: `Room ${roomCode} created. Share the code to invite friends!`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    });

    socketRef.current.on('sphere_room_joined', ({ roomState }) => {
      setCurrentRoomCode(roomState.roomCode);
      setIsUserHost(false);
      setUserReady(false);
      setIsJoinModalOpen(false);
      setStage('room-lobby');
      setPlayers(roomState.players);
      setCreateMode(roomState.mode);
      setCreateLimit(roomState.limit);
      if (roomState.targetText) setRoomPassage(roomState.targetText);
      setChatMessages([{ sender: 'System', avatarUrl: '', text: `Joined Room ${roomState.roomCode}. Waiting for host to start test.`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    });

    socketRef.current.on('sphere_join_error', ({ error }) => {
      alert(error);
    });

    socketRef.current.on('sphere_player_joined', ({ player }) => {
      setPlayers(prev => [...prev.filter(p => p.username !== player.username), player]);
      setChatMessages(prev => [...prev, { sender: 'System', avatarUrl: '', text: `${player.username} joined the room.`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    });

    socketRef.current.on('sphere_player_left', ({ username }) => {
      setPlayers(prev => prev.filter(p => p.username !== username));
      setChatMessages(prev => [...prev, { sender: 'System', avatarUrl: '', text: `${username} left the room.`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
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
      setPlayers(prev => prev.map(p => p.username === username ? { ...p, progress: 100, wpm, finished: true } : p));
      
      // Auto transition if we are done and someone else finishes, or we see everyone is done
      setPlayers(current => {
        const next = current.map(p => p.username === username ? { ...p, progress: 100, wpm, finished: true } : p);
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
"""

content = re.sub(
    r"const chatScrollRef = useRef<HTMLDivElement \| null>\(null\);",
    socket_code,
    content
)

# 3. Handle Create Room
create_room_regex = r"const handleCreateRoom = \(\) => \{.*?simulateBotChat\(\);\n  \};"
create_room_new = """const handleCreateRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit('create_sphere_room', { mode: createMode, limit: createLimit, avatarUrl: user.avatarUrl, targetText: roomPassage });
    }
  };"""
content = re.sub(create_room_regex, create_room_new, content, flags=re.DOTALL)


# 4. Handle Join Room
join_room_regex = r"const handleJoinRoom = \(code: string\) => \{.*?\}, 15000\);\n  \};"
join_room_new = """const handleJoinRoom = (code: string) => {
    if (!code || code.trim().length < 3) return;
    const cleanCode = code.toUpperCase().trim();
    if (socketRef.current) {
      socketRef.current.emit('join_sphere_room', { roomCode: cleanCode, avatarUrl: user.avatarUrl });
    }
  };"""
content = re.sub(join_room_regex, join_room_new, content, flags=re.DOTALL)

# 5. Remove simulateBotChat
content = re.sub(r"// Bot chat simulator.*?return \(\) => clearInterval\(timer\);\n  \};\n", "", content, flags=re.DOTALL)


# 6. Handle Send Message
send_message_regex = r"const handleSendMessage = \(e: React\.FormEvent\) => \{.*?\n  \};\n"
send_message_new = """const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socketRef.current) return;
    socketRef.current.emit('sphere_chat_send', { roomCode: currentRoomCode, text: inputMessage.trim() });
    setInputMessage('');
  };
"""
content = re.sub(send_message_regex, send_message_new, content, flags=re.DOTALL)


# 7. Start Countdown / Handle Start
countdown_regex = r"const triggerStartCountdown = \(\) => \{.*?\}, 1000\);\n  \};"
countdown_new = """const triggerStartCountdown = () => {
    if (socketRef.current && isUserHost) {
      socketRef.current.emit('sphere_start_race', { roomCode: currentRoomCode });
    }
  };
"""
content = re.sub(countdown_regex, countdown_new, content, flags=re.DOTALL)


# 8. Handle race logic (replace handleStartRace completely since we extracted startRaceLocal)
start_race_regex = r"const handleStartRace = \(\) => \{.*?\}, 1000\);\n  \};"
content = re.sub(start_race_regex, "", content, flags=re.DOTALL)

# 9. Handle Keystrokes (handleUserProgress & handleUserComplete)
user_prog_regex = r"const handleUserProgress = \(correctCount: number, typedLength: number\) => \{.*?\}\)\);\n  \};"
user_prog_new = """const handleUserProgress = (correctCount: number, typedLength: number, typedText: string) => {
    correctCountRef.current = correctCount;
    typedLengthRef.current = typedLength;

    if (socketRef.current && currentRoomCode) {
      socketRef.current.emit('keystroke', {
        roomId: `sphere_${currentRoomCode}`,
        typedText: typedText,
        isMistake: false
      });
    }
  };"""
content = re.sub(user_prog_regex, user_prog_new, content, flags=re.DOTALL)

user_comp_regex = r"const handleUserComplete = \(\) => \{.*?\}, 1500\);\n  \};"
user_comp_new = """const handleUserComplete = (finalTypedText: string) => {
    if (socketRef.current && currentRoomCode) {
      socketRef.current.emit('keystroke', {
        roomId: `sphere_${currentRoomCode}`,
        typedText: finalTypedText,
        isMistake: false
      });
    }
  };"""
content = re.sub(user_comp_regex, user_comp_new, content, flags=re.DOTALL)

# Update TypingArena component props to pass typedText
content = content.replace("onProgress={handleUserProgress}", "onProgress={(c, l, text) => handleUserProgress(c, l, text)}")
content = content.replace("onComplete={handleUserComplete}", "onComplete={(text) => handleUserComplete(text)}")

# Replace toggle ready mapping
content = content.replace(
    "className=\"px-7 py-2.5 rounded-full bg-zinc-800 text-white font-semibold text-xs uppercase tracking-wider hover:bg-zinc-700 transition-colors cursor-pointer active:scale-95 shadow-md\"",
    "onClick={() => { socketRef.current?.emit('sphere_toggle_ready', { roomCode: currentRoomCode }); }} className=\"px-7 py-2.5 rounded-full bg-zinc-800 text-white font-semibold text-xs uppercase tracking-wider hover:bg-zinc-700 transition-colors cursor-pointer active:scale-95 shadow-md\""
)

# Update host settings change events
content = content.replace(
    "setCreateMode(m);\n                            setCreateLimit(m === 'time' ? 60 : m === 'words' ? 25 : 60);",
    "socketRef.current?.emit('sphere_update_settings', { roomCode: currentRoomCode, mode: m, limit: m === 'time' ? 60 : m === 'words' ? 25 : 60 });"
)

content = content.replace(
    "onClick={() => setCreateLimit(limit)}",
    "onClick={() => socketRef.current?.emit('sphere_update_settings', { roomCode: currentRoomCode, mode: createMode, limit })}"
)

# Replace exit room 
exit_regex = r"const handleExitRoom = \(\) => \{.*?\};\n"
exit_new = """const handleExitRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit('leave_sphere_room', { roomCode: currentRoomCode });
    }
    setStage('lobby');
    setCurrentRoomCode('');
    setIsLeaveModalOpen(false);
    setUserReady(false);
    if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
  };
"""
content = re.sub(exit_regex, exit_new, content, flags=re.DOTALL)


with open(FILE_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print("Patch applied successfully.")
