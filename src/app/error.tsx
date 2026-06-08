'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0c0d12] flex flex-col items-center justify-center text-white px-4">
      <div className="max-w-md w-full bg-[#161617] p-8 rounded-[28px] border border-zinc-800 shadow-2xl text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black font-sans tracking-tight">Something went wrong!</h2>
          <p className="text-zinc-400 text-sm font-medium">An unexpected error occurred in the application. We've logged the issue.</p>
        </div>

        <div className="flex flex-col w-full gap-3 mt-2">
          <button
            onClick={() => reset()}
            className="w-full bg-white text-black font-bold text-sm tracking-wide py-3 rounded-xl hover:bg-zinc-200 transition-colors"
          >
            Try again
          </button>
          <Link 
            href="/"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-sm tracking-wide py-3 rounded-xl hover:bg-zinc-800 transition-colors text-center"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
