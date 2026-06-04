-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to avoid type/primary key conflicts
DROP TABLE IF EXISTS stats CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS match_players CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS room_players CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS passages CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Recreate Users Table with UUID Primary Key
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Passages Table to Store Texts
CREATE TABLE passages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100),
    content TEXT NOT NULL,
    language VARCHAR(20) DEFAULT 'english',
    difficulty VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Multiplayer Rooms/Lobbies
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code VARCHAR(10) UNIQUE,
    host_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20),
    max_players INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Players in a Room
CREATE TABLE room_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT NOW()
);

-- Typing Matches/Races
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    passage_id UUID REFERENCES passages(id) ON DELETE SET NULL,
    started_at TIMESTAMP,
    finished_at TIMESTAMP
);

-- Individual Match Results
CREATE TABLE match_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wpm DECIMAL(5,2),
    accuracy DECIMAL(5,2),
    mistakes INT DEFAULT 0,
    completion_percent DECIMAL(5,2),
    rank INT,
    finished BOOLEAN DEFAULT FALSE,
    finished_at TIMESTAMP
);

-- Persistent Aggregate User Statistics
CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    races_played INT DEFAULT 0,
    races_won INT DEFAULT 0,
    highest_wpm DECIMAL(5,2) DEFAULT 0.00,
    average_wpm DECIMAL(5,2) DEFAULT 0.00,
    average_accuracy DECIMAL(5,2) DEFAULT 0.00
);
