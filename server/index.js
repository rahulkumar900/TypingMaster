const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const path = require('path');
const redisClient = require('./redis-client');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for dev
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url} - Body keys:`, Object.keys(req.body || {}));
  next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// -- AUTHENTICATION MIDDLEWARE -- //
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Helper to sanitize guest IDs for DB queries
function getDbUserId(userId) {
  if (!userId || userId.toString().startsWith('guest_')) {
    return null;
  }
  return userId;
}

// -- AUTH APIs -- //

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const avatar_url = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;

    // Insert user into UUID-based users table
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, avatar) VALUES ($1, $2, $3, $4) RETURNING id, username, email, avatar',
      [username, email, password_hash, avatar_url]
    );

    const user = result.rows[0];

    // Initialize user stats row
    await pool.query(
      'INSERT INTO user_stats (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING',
      [user.id]
    );

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatar
      },
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatar
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -- STATS APIs -- //

app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    // Join matches and match_players tables to retrieve user stats history
    const result = await pool.query(
      `SELECT 
        mp.id, 
        mp.wpm, 
        mp.accuracy, 
        m.started_at as date,
        COALESCE(p.title, 'Solo Race') as mode
      FROM match_players mp
      JOIN matches m ON mp.match_id = m.id
      LEFT JOIN passages p ON m.passage_id = p.id
      WHERE mp.user_id = $1 AND mp.finished = TRUE
      ORDER BY m.started_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.post('/api/stats', authenticateToken, async (req, res) => {
  const { wpm, accuracy, test_type } = req.body;
  if (wpm === undefined || accuracy === undefined || !test_type) {
    return res.status(400).json({ error: 'Missing required metrics' });
  }

  try {
    // 1. Create a match record for solo test (room_id = NULL)
    const matchResult = await pool.query(
      'INSERT INTO matches (room_id, passage_id, started_at, finished_at) VALUES (NULL, NULL, NOW(), NOW()) RETURNING id'
    );
    const matchId = matchResult.rows[0].id;

    // 2. Insert match_player record
    const playerResult = await pool.query(
      `INSERT INTO match_players (match_id, user_id, wpm, accuracy, completion_percent, finished, finished_at) 
       VALUES ($1, $2, $3, $4, 100.0, TRUE, NOW()) 
       RETURNING id, wpm, accuracy, finished_at as date`,
      [matchId, req.user.id, wpm, accuracy]
    );

    // 3. Update persistent user_stats aggregates
    await pool.query(
      `INSERT INTO user_stats (user_id, races_played, races_won, highest_wpm, average_wpm, average_accuracy)
       VALUES ($1, 1, 0, $2, $2, $3)
       ON CONFLICT (user_id) DO UPDATE SET
         races_played = user_stats.races_played + 1,
         highest_wpm = GREATEST(user_stats.highest_wpm, EXCLUDED.highest_wpm),
         average_wpm = (user_stats.average_wpm * user_stats.races_played + EXCLUDED.average_wpm) / (user_stats.races_played + 1),
         average_accuracy = (user_stats.average_accuracy * user_stats.races_played + EXCLUDED.average_accuracy) / (user_stats.races_played + 1)`,
      [req.user.id, wpm, accuracy]
    );

    res.status(201).json({
      id: playerResult.rows[0].id,
      wpm,
      accuracy,
      mode: test_type,
      date: playerResult.rows[0].date
    });
  } catch (err) {
    console.error('Error saving stats:', err);
    res.status(500).json({ error: 'Failed to save stats' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        u.username,
        u.avatar as "avatarUrl",
        us.races_played as "racesPlayed",
        us.races_won as "racesWon",
        us.highest_wpm as "highestWpm",
        us.average_wpm as "averageWpm",
        us.average_accuracy as "averageAccuracy"
      FROM user_stats us
      JOIN users u ON us.user_id = u.id
      ORDER BY us.highest_wpm DESC
      LIMIT 100`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
});

// -- SOCKET IO MIDDLEWARE -- //
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    // Guest connection
    socket.user = { id: 'guest_' + socket.id, username: 'Guest ' + socket.id.substring(0, 4) };
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error('Authentication error'));
  }
});

// -- MULTIPLAYER & 1v1 GAME LOBBY -- //

const MATCH_PASSAGES = [
  "The storm clouds rolled in over the horizon, flashing brilliant arches of lightning that lit up the typing arena. Speed and precision are the only shields in this thunderous duel. Keep your hands relaxed, find your keycap rhythm, and strike like a bolt from the blue.",
  "A steady hand and a calm mind are the secret weapons of any champion. Focus on the flow of characters across the screen, let your muscle memory guide your fingers, and maintain your tempo through each word.",
  "The click-clack of mechanical keys echoes in the quiet room. Each keypress is a step closer to the finish line. Do not rush, do not look back, just keep moving forward with precision and speed."
];

let waitingPlayers = [];
const activeRooms = new Map(); // roomId -> roomState

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.username} (${socket.id})`);

  socket.on('join_queue', async (data) => {
    if (waitingPlayers.some(p => p.socketId === socket.id)) return;

    const player = {
      socketId: socket.id,
      user: socket.user,
      avatarUrl: data?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${socket.user.username}`
    };

    waitingPlayers.push(player);
    console.log(`${socket.user.username} joined queue. Queue length: ${waitingPlayers.length}`);

    if (waitingPlayers.length >= 2) {
      const p1 = waitingPlayers.shift();
      const p2 = waitingPlayers.shift();
      
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Select a random passage from passages table
      let targetText = MATCH_PASSAGES[Math.floor(Math.random() * MATCH_PASSAGES.length)];
      let passageId = null;
      try {
        const passagesRes = await pool.query('SELECT id, content FROM passages ORDER BY RANDOM() LIMIT 1');
        if (passagesRes.rows.length > 0) {
          passageId = passagesRes.rows[0].id;
          targetText = passagesRes.rows[0].content;
        }
      } catch (dbErr) {
        console.error('Failed to fetch passage from DB, falling back to static text:', dbErr.message);
      }

      // Create Room and Match records in database
      let dbRoomId = null;
      let dbMatchId = null;

      try {
        const p1UserId = getDbUserId(p1.user.id);
        const p2UserId = getDbUserId(p2.user.id);

        // Insert Room
        const roomRes = await pool.query(
          'INSERT INTO rooms (room_code, host_user_id, status) VALUES ($1, $2, $3) RETURNING id',
          [roomCode, p1UserId, 'countdown']
        );
        dbRoomId = roomRes.rows[0].id;

        // Insert Room Players
        if (p1UserId) {
          await pool.query('INSERT INTO room_players (room_id, user_id) VALUES ($1, $2)', [dbRoomId, p1UserId]);
        }
        if (p2UserId) {
          await pool.query('INSERT INTO room_players (room_id, user_id) VALUES ($1, $2)', [dbRoomId, p2UserId]);
        }

        // Insert Match (started_at is NULL until countdown finishes)
        const matchRes = await pool.query(
          'INSERT INTO matches (room_id, passage_id, started_at) VALUES ($1, $2, NULL) RETURNING id',
          [dbRoomId, passageId]
        );
        dbMatchId = matchRes.rows[0].id;
      } catch (dbErr) {
        console.error('Failed to create room/match records in PostgreSQL:', dbErr.message);
      }

      // Fallback in-memory IDs if DB writes failed
      const roomId = dbRoomId || `room_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const matchId = dbMatchId || `match_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const roomState = {
        roomId,
        matchId,
        targetText,
        startTime: null,
        p1: {
          socketId: p1.socketId,
          user: p1.user,
          avatarUrl: p1.avatarUrl,
          typedText: '',
          correctCount: 0,
          totalKeystrokes: 0,
          incorrectKeystrokes: 0,
          wpm: 0,
          accuracy: 100,
          complete: false
        },
        p2: {
          socketId: p2.socketId,
          user: p2.user,
          avatarUrl: p2.avatarUrl,
          typedText: '',
          correctCount: 0,
          totalKeystrokes: 0,
          incorrectKeystrokes: 0,
          wpm: 0,
          accuracy: 100,
          complete: false
        }
      };

      activeRooms.set(roomId, roomState);

      const s1 = io.sockets.sockets.get(p1.socketId);
      const s2 = io.sockets.sockets.get(p2.socketId);
      
      if (s1) s1.join(roomId);
      if (s2) s2.join(roomId);

      // Emit match found with selected targetText
      io.to(p1.socketId).emit('match_found', {
        roomId,
        targetText,
        opponent: { username: p2.user.username, avatarUrl: p2.avatarUrl }
      });

      io.to(p2.socketId).emit('match_found', {
        roomId,
        targetText,
        opponent: { username: p1.user.username, avatarUrl: p1.avatarUrl }
      });

      // Synchronize and run countdown on the server
      let countdown = 3;
      const countdownInterval = setInterval(async () => {
        io.to(roomId).emit('countdown_tick', countdown);
        countdown--;

        if (countdown < 0) {
          clearInterval(countdownInterval);
          roomState.startTime = Date.now();
          io.to(roomId).emit('race_start');
          console.log(`Race started in room ${roomId}: ${p1.user.username} vs ${p2.user.username}`);

          // Update database tables started_at and status
          if (dbRoomId && dbMatchId) {
            try {
              await pool.query('UPDATE rooms SET status = $1 WHERE id = $2', ['running', dbRoomId]);
              await pool.query('UPDATE matches SET started_at = NOW() WHERE id = $1', [dbMatchId]);
            } catch (dbErr) {
              console.error('Failed to update room/match start in DB:', dbErr.message);
            }
          }
        }
      }, 1000);
    }
  });

  // Handle server-side keystroke scoring live by key
  socket.on('keystroke', async ({ roomId, typedText }) => {
    const room = activeRooms.get(roomId);
    if (!room || !room.startTime) return;

    const isP1 = room.p1.socketId === socket.id;
    const player = isP1 ? room.p1 : room.p2;
    const opponent = isP1 ? room.p2 : room.p1;

    if (player.complete) return;

    const prevText = player.typedText;
    player.typedText = typedText;

    // Track total and incorrect keystrokes
    if (typedText.length > prevText.length) {
      const addedCount = typedText.length - prevText.length;
      player.totalKeystrokes += addedCount;

      for (let i = prevText.length; i < typedText.length; i++) {
        if (typedText[i] !== room.targetText[i]) {
          player.incorrectKeystrokes += 1;
        }
      }
    }

    // Longest matching prefix
    let correctCount = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === room.targetText[i]) {
        correctCount++;
      } else {
        break;
      }
    }
    player.correctCount = correctCount;

    // Compute live metrics
    const elapsedSecs = (Date.now() - room.startTime) / 1000;
    const mins = Math.max(0.001, elapsedSecs / 60);

    player.wpm = Math.round((correctCount / 5) / mins);
    player.accuracy = player.totalKeystrokes > 0
      ? Math.round(((player.totalKeystrokes - player.incorrectKeystrokes) / player.totalKeystrokes) * 100)
      : 100;
    player.accuracy = Math.max(0, Math.min(100, player.accuracy));

    const progress = (correctCount / room.targetText.length) * 100;

    // Update real-time progress in Redis
    const redisKey = `match:${room.matchId}:user:${socket.user.id}`;
    const progressData = {
      matchId: room.matchId,
      userId: socket.user.id,
      position: correctCount,
      wpm: player.wpm,
      accuracy: player.accuracy
    };
    await redisClient.set(redisKey, progressData, 300); // 5 mins expiry

    // Broadcast computed progress live to the opponent
    io.to(opponent.socketId).emit('opponent_progress', {
      progress,
      wpm: player.wpm,
      accuracy: player.accuracy
    });

    // Send computed progress back to the typing player
    socket.emit('player_progress', {
      progress,
      wpm: player.wpm,
      accuracy: player.accuracy
    });

    // Check completion
    if (correctCount === room.targetText.length) {
      player.complete = true;

      const firstFinisher = !opponent.complete;
      const rank = firstFinisher ? 1 : 2;
      const winner = firstFinisher ? player.user.username : opponent.user.username;

      // Save statistics in the database if logged in
      const dbUserId = getDbUserId(player.user.id);
      if (dbUserId) {
        try {
          const isDbMatch = !room.matchId.toString().startsWith('match_');
          if (isDbMatch) {
            // Insert match_player result record
            await pool.query(
              `INSERT INTO match_players (match_id, user_id, wpm, accuracy, mistakes, completion_percent, rank, finished, finished_at) 
               VALUES ($1, $2, $3, $4, $5, 100.0, $6, TRUE, NOW())`,
              [room.matchId, dbUserId, player.wpm, player.accuracy, player.incorrectKeystrokes, rank]
            );

            // Update user stats
            const isWinner = firstFinisher ? 1 : 0;
            await pool.query(
              `INSERT INTO user_stats (user_id, races_played, races_won, highest_wpm, average_wpm, average_accuracy)
               VALUES ($1, 1, $2, $3, $3, $4)
               ON CONFLICT (user_id) DO UPDATE SET
                 races_played = user_stats.races_played + 1,
                 races_won = user_stats.races_won + EXCLUDED.races_won,
                 highest_wpm = GREATEST(user_stats.highest_wpm, EXCLUDED.highest_wpm),
                 average_wpm = (user_stats.average_wpm * user_stats.races_played + EXCLUDED.average_wpm) / (user_stats.races_played + 1),
                 average_accuracy = (user_stats.average_accuracy * user_stats.races_played + EXCLUDED.average_accuracy) / (user_stats.races_played + 1)`,
              [dbUserId, isWinner, player.wpm, player.accuracy]
            );

            // Update match finished_at and room status to finished
            if (opponent.complete || opponent.socketId === null) {
              await pool.query('UPDATE matches SET finished_at = NOW() WHERE id = $1', [room.matchId]);
              await pool.query('UPDATE rooms SET status = $1 WHERE id = (SELECT room_id FROM matches WHERE id = $2)', ['finished', room.matchId]);
            }
          }
        } catch (dbErr) {
          console.error('Error saving multiplayer stats to Supabase PostgreSQL:', dbErr.message);
        }
      }

      // Notify completion details to both clients
      io.to(player.socketId).emit('race_complete', {
        winner,
        wpm: player.wpm,
        accuracy: player.accuracy,
        opponentStats: {
          wpm: opponent.wpm,
          accuracy: opponent.accuracy,
          progress: (opponent.correctCount / room.targetText.length) * 100
        }
      });

      io.to(opponent.socketId).emit('race_complete', {
        winner,
        wpm: opponent.wpm,
        accuracy: opponent.accuracy,
        opponentStats: {
          wpm: player.wpm,
          accuracy: player.accuracy,
          progress: 100
        }
      });

      console.log(`Race completed in room ${roomId}. Winner: ${winner}`);

      if (room.p1.complete && room.p2.complete) {
        // Clean up Redis progress keys
        redisClient.del(`match:${room.matchId}:user:${room.p1.user.id}`).catch(() => {});
        redisClient.del(`match:${room.matchId}:user:${room.p2.user.id}`).catch(() => {});

        activeRooms.delete(roomId);
        console.log(`Room ${roomId} fully completed and removed.`);
      }
    }
  });

  // Handle player leaving or disconnecting
  const handlePlayerLeft = async (socketId) => {
    waitingPlayers = waitingPlayers.filter(p => p.socketId !== socketId);

    for (const [roomId, room] of activeRooms.entries()) {
      if (room.p1.socketId === socketId || room.p2.socketId === socketId) {
        const isP1 = room.p1.socketId === socketId;
        const opponent = isP1 ? room.p2 : room.p1;

        io.to(opponent.socketId).emit('opponent_left', {
          reason: 'Opponent disconnected or left the match.'
        });

        // Update database records
        try {
          const isDbMatch = !room.matchId.toString().startsWith('match_');
          if (isDbMatch) {
            await pool.query('UPDATE matches SET finished_at = NOW() WHERE id = $1', [room.matchId]);
            await pool.query('UPDATE rooms SET status = $1 WHERE id = (SELECT room_id FROM matches WHERE id = $2)', ['finished', room.matchId]);

            // Save partial statistics for the player that stayed
            const opponentDbUserId = getDbUserId(opponent.user.id);
            if (opponentDbUserId && !opponent.complete) {
              const progressPercent = (opponent.correctCount / room.targetText.length) * 100;
              await pool.query(
                `INSERT INTO match_players (match_id, user_id, wpm, accuracy, mistakes, completion_percent, rank, finished, finished_at) 
                 VALUES ($1, $2, $3, $4, $5, $6, 1, TRUE, NOW())`,
                [room.matchId, opponentDbUserId, opponent.wpm, opponent.accuracy, opponent.incorrectKeystrokes, progressPercent]
              );

              // Update stats
              await pool.query(
                `INSERT INTO user_stats (user_id, races_played, races_won, highest_wpm, average_wpm, average_accuracy)
                 VALUES ($1, 1, 1, $2, $2, $3)
                 ON CONFLICT (user_id) DO UPDATE SET
                   races_played = user_stats.races_played + 1,
                   races_won = user_stats.races_won + EXCLUDED.races_won,
                   highest_wpm = GREATEST(user_stats.highest_wpm, EXCLUDED.highest_wpm),
                   average_wpm = (user_stats.average_wpm * user_stats.races_played + EXCLUDED.average_wpm) / (user_stats.races_played + 1),
                   average_accuracy = (user_stats.average_accuracy * user_stats.races_played + EXCLUDED.average_accuracy) / (user_stats.races_played + 1)`,
                [opponentDbUserId, opponent.wpm, opponent.accuracy]
              );
            }
          }
        } catch (dbErr) {
          console.error('Error handling abort room in DB:', dbErr.message);
        }

        // Clean up Redis keys
        redisClient.del(`match:${room.matchId}:user:${room.p1.user.id}`).catch(() => {});
        redisClient.del(`match:${room.matchId}:user:${room.p2.user.id}`).catch(() => {});

        activeRooms.delete(roomId);
        console.log(`Room ${roomId} aborted because player ${socketId} left.`);
        break;
      }
    }
  };

  socket.on('cancel_queue', () => {
    handlePlayerLeft(socket.id);
  });

  socket.on('disconnect', () => {
    handlePlayerLeft(socket.id);
    console.log(`User disconnected: ${socket.user.username}`);
  });
});

// -- AUTO DATABASE INITIALIZATION -- //
const PORT = process.env.PORT || 4000;

const initDb = async () => {
  try {
    const checkRes = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `);
    
    if (!checkRes.rows[0].exists) {
      console.log('Database tables do not exist. Initializing schema...');
      const fs = require('fs');
      const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
      await pool.query(schemaSql);
      console.log('✅ Database schema initialized successfully');

      // Seed default passages
      console.log('Seeding default passages...');
      const defaultPassages = [
        ["Storm Clouds", "The storm clouds rolled in over the horizon, flashing brilliant arches of lightning that lit up the typing arena. Speed and precision are the only shields in this thunderous duel. Keep your hands relaxed, find your keycap rhythm, and strike like a bolt from the blue.", "english", "medium"],
        ["Steady Hand", "A steady hand and a calm mind are the secret weapons of any champion. Focus on the flow of characters across the screen, let your muscle memory guide your fingers, and maintain your tempo through each word.", "english", "easy"],
        ["Mechanical Keys", "The click-clack of mechanical keys echoes in the quiet room. Each keypress is a step closer to the finish line. Do not rush, do not look back, just keep moving forward with precision and speed.", "english", "easy"]
      ];

      for (const [title, content, language, difficulty] of defaultPassages) {
        await pool.query(
          'INSERT INTO passages (title, content, language, difficulty) VALUES ($1, $2, $3, $4)',
          [title, content, language, difficulty]
        );
      }
      console.log('✅ Default passages seeded.');
    } else {
      console.log('Database tables verified.');
    }
  } catch (err) {
    console.error('Error auto-creating database tables:', err);
  }
};

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDb();
});
