import { Metadata } from 'next';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';

export const metadata: Metadata = {
  title: 'Typing Tips & Blog | TypingThunder',
  description: 'Read the latest tips, tricks, and guides on how to improve your typing speed and accuracy. Learn about mechanical keyboards, ergonomic posture, and touch typing.',
  alternates: {
    canonical: 'https://typingthunder.com/blog',
  },
};

const POSTS = [
  {
    slug: 'how-to-type-faster-5-proven-tips',
    title: 'How to Type Faster: 5 Proven Tips for 2026',
    excerpt: 'Breaking the 100 WPM barrier is difficult but not impossible. Learn the five scientifically proven methods to increase your typing velocity.',
    date: 'June 8, 2026',
  },
  {
    slug: 'touch-typing-vs-hunt-and-peck',
    title: 'Touch Typing vs. Hunt and Peck: Why Form Matters',
    excerpt: 'Are you still looking down at your keyboard? Discover why transitioning to full touch typing is essential for long-term productivity.',
    date: 'June 1, 2026',
  },
  {
    slug: 'best-mechanical-switches-for-typing',
    title: 'The Best Mechanical Switches for High-Speed Typing',
    excerpt: 'Linear, tactile, or clicky? We break down the physics behind Cherry MX, Gateron, and Kailh switches to find the perfect match for typists.',
    date: 'May 20, 2026',
  }
];

export default function BlogIndex() {
  return (
    <AppLayout>
      <div className="w-full max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">TypingThunder Blog</h1>
        <p className="text-[14px] text-[var(--text-muted)] mb-12">
          Insights, guides, and typing science to help you reach your maximum potential.
        </p>

        <div className="grid gap-8">
          {POSTS.map(post => (
            <article key={post.slug} className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] hover:border-[var(--accent-color)]/50 transition-colors group">
              <span className="text-[11px] text-[var(--text-muted-alt)] font-mono uppercase tracking-wider mb-2 block">{post.date}</span>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--accent-color)] transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-4">
                {post.excerpt}
              </p>
              <Link href={`/blog/${post.slug}`} className="text-[12px] font-bold text-[var(--accent-color)] hover:underline inline-flex items-center gap-1">
                Read Article
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
