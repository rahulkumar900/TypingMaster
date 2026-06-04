'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/views/auth-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Handle successful login
      login(data.user, data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AuthLayout
      title="Login"
      subtitle="Login to test your typing speed with your companions."
      illustrationText="Compete with your friends in a"
      illustrationSubtext="Assess and improve your typing speed with our interactive typing tests. Receive instant feedback and track your progress over time."
    >
      <div className="absolute top-8 right-8 text-sm text-[#a1a1aa]">
        Don't have an account? <Link href="/signup" className="text-white underline underline-offset-4 hover:text-yellow-500 transition-colors">Sign Up</Link>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div className="text-sm text-red-500 font-mono bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <Input
            type="text"
            placeholder="Enter username or registered email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className={error ? "border-red-500/50 focus-visible:border-red-500/50 focus-visible:ring-red-500/20" : ""}
          />
          {error && error.includes('looks like an email') && (
            <p className="text-xs text-red-500 font-mono mt-1">Doesn't look like an email address. Try again.</p>
          )}
        </div>

        <div className="space-y-1 relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={error ? "border-red-500/50 focus-visible:border-red-500/50 focus-visible:ring-red-500/20" : ""}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 checked:bg-yellow-500 checked:border-yellow-500 focus:ring-yellow-500/20 focus:ring-offset-0 text-yellow-500 transition-all" />
            <span className="text-sm text-[#a1a1aa] group-hover:text-white transition-colors">Remember me</span>
          </label>
          <Link href="/reset-password" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">
            Reset password
          </Link>
        </div>

        <div className="pt-4 space-y-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-white hover:bg-zinc-200 text-black h-12 rounded-xl font-bold tracking-wide shadow-[0_4px_14px_rgba(255,255,255,0.1)]"
          >
            {isLoading ? "Signing in..." : "Continue"}
          </Button>

          <Button 
            type="button"
            className="w-full bg-transparent hover:bg-zinc-900 text-white border border-zinc-800 h-12 rounded-xl flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
