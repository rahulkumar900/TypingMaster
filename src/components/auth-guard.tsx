'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

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
      <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-main)] flex flex-col items-center font-sans w-full p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-[1380px] flex flex-col gap-8">
          <div className="flex justify-between items-center w-full mb-4">
            <Skeleton className="w-32 h-6" />
            <div className="flex gap-4">
              <Skeleton className="w-16 h-8 rounded-full" />
              <Skeleton className="w-16 h-8 rounded-full" />
            </div>
          </div>
          <div className="w-full h-[50vh] flex flex-col items-center justify-center gap-6 mt-10">
            <Skeleton className="w-3/4 max-w-3xl h-12" />
            <Skeleton className="w-2/4 max-w-xl h-10" />
            <Skeleton className="w-full max-w-4xl h-32 mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Prevent layout flashes before redirect completes
  }

  return <>{children}</>;
}
