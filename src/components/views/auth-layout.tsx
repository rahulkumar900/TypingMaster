'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  illustrationText?: string;
  illustrationSubtext?: string;
}

export function AuthLayout({ children, title, subtitle, illustrationText, illustrationSubtext }: AuthLayoutProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!illustrationText) return;
    setDisplayedText(''); // reset
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(illustrationText.slice(0, i + 1));
      i++;
      if (i >= illustrationText.length) {
        clearInterval(interval);
      }
    }, 50); // Typing speed

    return () => clearInterval(interval);
  }, [illustrationText]);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#121212] font-sans selection:bg-yellow-500/30">
      {/* Left Side: Brand & Illustration */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Abstract glowing orbs background (from mockup) */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 flex items-center gap-2 mb-12">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-6l2-7H5L3 15h6l-2 7 12-13z" />
          </svg>
          <span className="text-xl font-bold text-white tracking-tight">TypingThunder</span>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-md">
          {illustrationText ? (
            <>
              <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight tracking-tight mb-6">
                {displayedText} <span className="inline-block animate-pulse">|</span>
              </h1>
              <p className="text-[#a1a1aa] leading-relaxed text-sm">
                {illustrationSubtext}
              </p>
            </>
          ) : (
            // Placeholder for the illustrative character in later screens
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-64 h-64 bg-zinc-900 rounded-full animate-pulse opacity-50" />
            </div>
          )}
          
          <div className="mt-8">
            <Link 
              href="/typing-test" 
              className="inline-flex items-center px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-transform active:scale-95"
            >
              Take a Speed Test
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-white tracking-tight">{title}</h2>
            <p className="text-sm text-[#a1a1aa] mt-2">{subtitle}</p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
