'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#161617] text-zinc-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
            <div className="absolute inset-0 rounded-full border-2 border-t-zinc-100 animate-spin" />
          </div>
          <span className="text-zinc-500 font-mono text-[11px] tracking-wider uppercase">Hydrating Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Prevent layout flashes before redirect completes
  }

  return <>{children}</>;
}
