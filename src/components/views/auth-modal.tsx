'use client';

import React, { useState } from 'react';
import { Shield, Sparkles, X, Key, User, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { username: string; avatarUrl: string }) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate network latency
    setTimeout(() => {
      setLoading(false);
      // Generate a mock avatar based on username characters
      const avatarSeed = Math.abs(
        username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 9
      ) + 1;
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;

      onLoginSuccess({
        username: username.trim(),
        avatarUrl,
      });
      onClose();
    }, 1200);
  };

  const handleQuickDemo = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        username: 'ThunderTyper_99',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ThunderTyper_99',
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-yellow-500/20 bg-zinc-950 p-6 md:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] z-10 transition-all duration-300 animate-fadeIn text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5 font-sans">
            ⚡ TypingThunder Security
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-[280px]">
            Please sign in to unlock 1v1 Matches, Sphere Rooms, Leaderboards, and Profiles.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-800 mb-6">
          <button
            onClick={() => { setIsLoginTab(true); setError(''); }}
            className={`flex-1 pb-3 text-sm font-bold tracking-wide transition-colors relative cursor-pointer text-center ${
              isLoginTab ? 'text-yellow-500' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sign In
            {isLoginTab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500" />}
          </button>
          <button
            onClick={() => { setIsLoginTab(false); setError(''); }}
            className={`flex-1 pb-3 text-sm font-bold tracking-wide transition-colors relative cursor-pointer text-center ${
              !isLoginTab ? 'text-yellow-500' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Create Account
            {!isLoginTab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500" />}
          </button>
        </div>

        {/* Forms */}
        <form onSubmit={handleAuth} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400 font-mono text-center">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Username</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. thunder_racer"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                <Key className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all font-mono"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(245,158,11,0.2)] active:scale-[0.98]"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLoginTab ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <span className="relative bg-zinc-950 px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
            Or Skip With Demo
          </span>
        </div>

        {/* Quick Demo Login */}
        <button
          onClick={handleQuickDemo}
          disabled={loading}
          className="w-full py-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 text-yellow-500 font-bold text-xs tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:border-yellow-500/40 active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 animate-bounce" />
          <span>One-Click Guest Login</span>
        </button>
      </div>
    </div>
  );
}
