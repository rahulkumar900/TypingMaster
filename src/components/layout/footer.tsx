import React from 'react';
import Link from 'next/link';
import { Mail, Disc } from 'lucide-react';

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

export function GlobalFooter() {
  return (
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-panel)] mt-12 pt-16 pb-8">
      <div className="max-w-[1380px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <svg className="w-6 h-6 text-white group-hover:text-[var(--accent-color)] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-6l2-7H5L3 15h6l-2 7 12-13z" />
              </svg>
              <span className="text-xl font-bold tracking-tight text-white">Centerville</span>
            </Link>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-6">
              The premier online typing speed test platform. Practice, compete, and improve your words per minute (WPM) with advanced analytics.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-white transition-colors" aria-label="Twitter">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-white transition-colors" aria-label="GitHub">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-white transition-colors" aria-label="Discord">
                <DiscordIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-semibold text-white mb-4">Tools</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/typing-test" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Typing Speed Test</Link></li>
              <li><Link href="/online-typing-test" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Online Typing Test</Link></li>
              <li><Link href="/play-1vs1" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Multiplayer Arena</Link></li>
              <li><Link href="/typing-practice" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Typing Practice</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/blog" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Blog</Link></li>
              <li><Link href="/ratings" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Leaderboards</Link></li>
              <li><Link href="/profile" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">User Profiles</Link></li>
              <li><a href="mailto:support@centerville.com" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted-alt)]">
            © {new Date().getFullYear()} Centerville Typing. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-[var(--text-muted-alt)] font-mono">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
