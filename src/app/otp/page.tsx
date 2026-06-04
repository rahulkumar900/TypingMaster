'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/views/auth-layout';
import { Button } from '@/components/ui/button';

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 4) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 5) return;

    setIsLoading(true);
    setError(false);

    // TODO: Connect to backend to verify OTP
    setTimeout(() => {
      setIsLoading(false);
      // Simulate error or success
      if (code === '12345') {
        router.push('/login');
      } else {
        setError(true);
      }
    }, 1000);
  };

  return (
    <AuthLayout
      title="Enter OTP"
      subtitle="Please enter the 5-digit code sent to you at"
    >
      <div className="absolute top-8 right-8 text-sm text-[#a1a1aa]">
        Don't have an account? <Link href="/signup" className="text-white underline underline-offset-4 hover:text-yellow-500 transition-colors">Sign Up</Link>
      </div>

      <form onSubmit={handleVerify} className="space-y-6 mt-4">
        
        <div className="flex justify-between max-w-[320px]">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`w-12 h-14 rounded-xl border bg-zinc-900/50 text-center text-xl font-bold text-white transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-500/20 ${
                error ? 'border-red-500/50' : 'border-zinc-800 focus-visible:border-yellow-500/50'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-500 font-mono">
            Incorrect OTP. Please check your code and try again.
          </p>
        )}

        <div className="text-xs text-zinc-500 font-mono mt-4">
          Resend OTP in 00:52 seconds
        </div>

        <div className="pt-6">
          <Button 
            type="submit" 
            disabled={isLoading || otp.join('').length < 5}
            className="w-full bg-white hover:bg-zinc-200 text-black h-12 rounded-xl font-bold tracking-wide shadow-[0_4px_14px_rgba(255,255,255,0.1)]"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
