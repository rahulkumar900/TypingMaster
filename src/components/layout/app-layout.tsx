'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useConfig } from '@/context/config-context';
import { SettingsPanel } from '@/components/settings-panel';
import { StatsDashboard, TestRecord } from '@/components/stats-dashboard';
import { Mail, Shield, Lock, DollarSign, Settings, Trophy, Globe, X, Check } from 'lucide-react';

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 01-1.873-.894.077.077 0 01-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 01.077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 01.078.009c.12.099.246.195.373.289a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03a.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const renderAvatar = (url: string, sizeClass = "w-6 h-6") => {
  if (url && !url.includes('seed=Lakshayyyy') && !url.includes('seed=default')) {
    return (
      <div className={`${sizeClass} rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 overflow-hidden bg-zinc-900`}>
        <img src={url} alt="Avatar" className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`${sizeClass} rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 overflow-hidden bg-zinc-800`}>
      <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
      </svg>
    </div>
  );
};

interface AppLayoutProps {
  children: React.ReactNode;
  seoTitle?: string;
  seoDescription?: string;
  hideHeaderAndFooterDuringRace?: boolean;
  isRacing?: boolean;
}

export function AppLayout({
  children,
  seoTitle,
  seoDescription,
  hideHeaderAndFooterDuringRace = false,
  isRacing = false
}: AppLayoutProps) {
  const pathname = usePathname();
  const { user: currentUser, logout, token } = useAuth();
  const config = useConfig();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [dashboardHistory, setDashboardHistory] = useState<TestRecord[]>([]);

  // Apply theme classes dynamically to document body
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeTheme = config.currentTheme || 'carbon';
      document.body.className = document.body.className
        .split(' ')
        .filter(c => !c.startsWith('theme-'))
        .join(' ');
      document.body.classList.add(`theme-${activeTheme}`);
    }
  }, [config.currentTheme]);

  // Fetch run history dynamically when Stats Dashboard is opened
  useEffect(() => {
    if (isDashboardOpen) {
      const loadHistory = () => {
        if (token) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://typingmaster-bibp.onrender.com';
          fetch(`${apiUrl}/api/stats`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(res => (res.ok ? res.json() : null))
          .then(data => {
            if (data && Array.isArray(data)) {
              const mapped: TestRecord[] = data.map((item: any) => ({
                id: item.id.toString(),
                date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                mode: item.mode,
                limitValue: 0,
                wpm: item.wpm,
                accuracy: parseFloat(item.accuracy).toFixed(2),
                rawAccuracy: Math.round(parseFloat(item.accuracy)),
                missedKeys: {},
                wpmHistory: [],
                rawWpmHistory: [],
                timeHistory: []
              }));
              setDashboardHistory(mapped);
            } else {
              loadLocalHistory();
            }
          })
          .catch(() => loadLocalHistory());
        } else {
          loadLocalHistory();
        }
      };

      const loadLocalHistory = () => {
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('centerville_test_history');
          if (saved) {
            try {
              setDashboardHistory(JSON.parse(saved));
            } catch (e) {}
          }
        }
      };

      loadHistory();
    }
  }, [isDashboardOpen, token]);

  const handleClearHistory = () => {
    setDashboardHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('centerville_test_history');
    }
  };

  const navItems = [
    { label: 'Speed Test', href: '/typing-test' },
    { label: 'Play 1 v 1', href: '/play-1vs1' },
    { label: 'Practice', href: '/typing-practice' },
    { label: 'Sphere', href: '/sphere' },
    { label: 'Ratings', href: '/ratings' }
  ];

  // Detect which tab should be styled active based on current path
  const getActiveTab = () => {
    if (pathname === '/typing-test' || pathname === '/' || pathname === '/online-typing-test' || pathname === '/typing-speed-test') return '/typing-test';
    if (pathname === '/play-1vs1') return '/play-1vs1';
    if (pathname === '/typing-practice') return '/typing-practice';
    if (pathname === '/sphere') return '/sphere';
    if (pathname === '/ratings') return '/ratings';
    return '';
  };

  const activeTabPath = getActiveTab();
  const shouldHideHeaderFooter = hideHeaderAndFooterDuringRace && isRacing;

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-main)] transition-colors duration-500 relative flex flex-col justify-between items-center overflow-x-hidden font-sans">
      
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--accent-color)]/2 rounded-full blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-white/1 rounded-full blur-[100px] pointer-events-none select-none z-0" />

      {/* Main Wrapper */}
      <div className="w-full max-w-[1380px] p-4 sm:p-6 md:p-8 flex flex-col justify-between flex-grow z-10 min-h-screen overflow-hidden">
        
        {/* Shared Global Header */}
        <header 
          className={`flex flex-wrap items-center justify-between w-full transition-all duration-500 mb-6 md:mb-10 gap-y-4 gap-x-2 border-b border-[var(--border-subtle)] pb-5 ${
            shouldHideHeaderFooter 
              ? 'opacity-0 pointer-events-none mb-0 h-0 overflow-hidden py-0 border-none' 
              : 'opacity-100'
          }`}
        >
          {/* Logo */}
          <Link 
            href="/typing-test"
            className="flex items-center gap-2.5 cursor-pointer select-none group order-1"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-6l2-7H5L3 15h6l-2 7 12-13z" />
            </svg>
            <div className="text-lg font-bold text-[var(--text-main)] tracking-tight leading-none font-sans">
              TypingThunder
            </div>
          </Link>

          {/* Right side Profile controls */}
          <div className="flex items-center gap-3 sm:gap-5 order-2 md:order-3">
            {currentUser ? (
              <Link 
                href="/profile"
                className="flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
                title="Go to Profile"
              >
                {renderAvatar(currentUser.avatarUrl, "w-8 h-8 md:w-9 md:h-9 shadow-md")}
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-full bg-white text-zinc-950 text-xs font-bold transition-all hover:bg-zinc-200 cursor-pointer shadow-sm animate-scaleIn"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="text-[var(--text-main)] hover:text-white text-xs font-bold transition-all cursor-pointer px-3 py-2 rounded-full hover:bg-[var(--bg-hover)]"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Navigation link pills */}
          <nav className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-semibold text-[var(--text-muted)] order-3 md:order-2 w-full md:w-auto mt-2 md:mt-0">
            {navItems.map((item) => {
              const isActive = activeTabPath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`hover:text-white cursor-pointer transition-colors relative pb-1.5 ${
                    isActive ? 'text-white font-bold' : 'text-[var(--text-muted)]'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-grow w-full flex flex-col justify-center">
          {children}
        </main>

        {/* Footer controls & Links */}
        <footer 
          className={`flex flex-wrap items-center justify-center gap-6 mt-16 text-[var(--text-muted-alt)] text-xs select-none transition-all duration-500 border-t border-[var(--border-subtle)] pt-6 ${
            shouldHideHeaderFooter
              ? 'opacity-0 pointer-events-none mt-0 h-0 overflow-hidden py-0 border-none' 
              : 'opacity-100'
          }`}
        >
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
          
          {currentUser && (
            <button
              onClick={() => setIsDashboardOpen(true)}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Stats Dashboard</span>
            </button>
          )}

          <span className="text-zinc-800">|</span>

          <a href="mailto:support@typingthunder.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </a>
          <a href="https://twitter.com/typingthunder" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <TwitterIcon className="w-3.5 h-3.5" />
            <span>Twitter</span>
          </a>
          <a href="https://discord.gg/typingthunder" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <DiscordIcon className="w-3.5 h-3.5" />
            <span>Discord</span>
          </a>
          <a href="https://github.com/typingthunder" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a href="/security" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Shield className="w-3.5 h-3.5" />
            <span>Security</span>
          </a>
          <a href="/privacy" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy</span>
          </a>
          <a href="/support" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Support</span>
          </a>
        </footer>

      </div>

      {/* Shared SEO block rendered below app layout */}
      <section 
        className={`w-full max-w-[1380px] mx-auto px-6 md:px-8 mb-12 text-left font-sans transition-all duration-500 ${
          shouldHideHeaderFooter 
            ? 'hidden' 
            : 'block opacity-100'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] shadow-sm">
          <article>
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-3">{seoTitle || "About this Typing Test"}</h2>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-4">
              {seoDescription || "TypingThunder is a premium, minimalist typing speed test designed to help you improve your words per minute (WPM) and accuracy. Whether you are practicing for a government typing exam, learning to touch type, or just warming up your fingers for coding, our tool provides real-time feedback and detailed analytics."}
            </p>
            <h3 className="text-[14px] font-semibold text-[var(--text-main)] mt-6 mb-2">What is a good WPM?</h3>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
              An average typing speed is around 40 WPM. Speeds above 60 WPM are considered good for most administrative or data entry jobs. If you can type over 90 WPM, you are considered a fast typist, and speeds over 120 WPM are exceptional. Use our Ghost Pacer feature to constantly push your average up!
            </p>
          </article>
          
          <article>
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-3 font-sans">Why accuracy matters</h2>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-4">
              Speed means nothing without accuracy. Typing 100 WPM with 80% accuracy is often slower in actual workflows than typing 70 WPM with 100% accuracy, because correcting errors takes significant time. Focus on accuracy first, and the speed will develop naturally over time.
            </p>
            <h3 className="text-[14px] font-semibold text-[var(--text-main)] mt-6 mb-2">How WPM is calculated</h3>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
              WPM stands for Words Per Minute. It is calculated by taking the number of characters typed correctly, dividing that number by 5 (which is the standard word length in English, including spaces), and then dividing by the time in minutes.
            </p>
          </article>
        </div>
      </section>

      {/* Shared settings overlay panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        languageId={config.languageId}
        fontId={config.fontId}
        onFontIdChange={(fId) => {
          config.setFontId(fId);
          config.saveConfig({ fontId: fId });
        }}
        cursorStyle={config.cursorStyle}
        onCursorChange={(style) => {
          config.setCursorStyle(style);
          config.saveConfig({ cursorStyle: style });
        }}
        fontSize={config.fontSize}
        onFontSizeChange={(size) => {
          config.setFontSize(size);
          config.saveConfig({ fontSize: size });
        }}
        switchProfile={config.switchProfile}
        onSwitchChange={(profile) => {
          config.setSwitchProfile(profile);
          config.saveConfig({ switchProfile: profile });
        }}
        includePunctuation={config.includePunctuation}
        onPunctuationChange={(val) => {
          config.setIncludePunctuation(val);
          config.saveConfig({ includePunctuation: val });
        }}
        includeNumbers={config.includeNumbers}
        onNumbersChange={(val) => {
          config.setIncludeNumbers(val);
          config.saveConfig({ includeNumbers: val });
        }}
        showSpeedometer={config.showSpeedometer}
        onShowSpeedometerChange={(val) => {
          config.setShowSpeedometer(val);
          config.saveConfig({ showSpeedometer: val });
        }}
        suddenDeath={config.suddenDeath}
        onSuddenDeathChange={(val) => {
          config.setSuddenDeath(val);
          config.saveConfig({ suddenDeath: val });
        }}
        ghostWpm={config.ghostWpm}
        onGhostWpmChange={(wpm) => {
          config.setGhostWpm(wpm);
          config.saveConfig({ ghostWpm: wpm });
        }}
      />

      {/* Shared stats dashboard panel */}
      <StatsDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        history={dashboardHistory}
        onClearHistory={handleClearHistory}
      />

    </div>
  );
}
