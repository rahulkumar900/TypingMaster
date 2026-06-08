import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';

// Mock data for blog posts
const POSTS = {
  'how-to-type-faster-5-proven-tips': {
    title: 'How to Type Faster: 5 Proven Tips for 2026',
    date: 'June 8, 2026',
    content: `
      Typing fast is not about moving your hands rapidly in a chaotic manner; it's about eliminating wasted motion. Here are 5 tips:
      1. **Learn the Home Row**: Always return your fingers to ASDF and JKL;.
      2. **Look at the Screen, Not the Keyboard**: Trust your muscle memory.
      3. **Prioritize Accuracy Over Speed**: Speed naturally follows high accuracy.
      4. **Practice with Weak Keys Drills**: Use our specialized drills for the letters you miss most.
      5. **Use a Mechanical Keyboard**: Tactile feedback helps your brain register keystrokes faster.
    `
  },
  'touch-typing-vs-hunt-and-peck': {
    title: 'Touch Typing vs. Hunt and Peck: Why Form Matters',
    date: 'June 1, 2026',
    content: `
      Many people can achieve 60 WPM using just two fingers (Hunt and Peck). However, they will eventually hit a hard ceiling.
      Touch typing engages all 10 fingers, drastically reducing the travel distance for each finger. 
      Furthermore, hunt and peck requires constant neck movement, leading to severe ergonomic strain over long coding or writing sessions.
      Make the switch today—it will be slow for the first two weeks, but you will thank yourself for the rest of your life.
    `
  },
  'best-mechanical-switches-for-typing': {
    title: 'The Best Mechanical Switches for High-Speed Typing',
    date: 'May 20, 2026',
    content: `
      The great debate: Linear vs. Tactile vs. Clicky.
      - **Linear (e.g., Cherry MX Red)**: Smooth all the way down. Great for double-tapping but prone to accidental presses.
      - **Tactile (e.g., Cherry MX Brown)**: A slight bump before actuation. Considered the holy grail for typists because you can feel when the key registers.
      - **Clicky (e.g., Cherry MX Blue)**: Very satisfying audio feedback, but often too loud for office environments.
      We recommend starting with a light tactile switch for the best typing experience.
    `
  }
};

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const post = POSTS[params.slug as keyof typeof POSTS];
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | TypingThunder Blog`,
    description: post.content.substring(0, 150) + '...',
    alternates: {
      canonical: `https://typingthunder.com/blog/${params.slug}`,
    },
  };
}

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = POSTS[params.slug as keyof typeof POSTS];

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "datePublished": new Date(post.date).toISOString(),
    "author": {
      "@type": "Organization",
      "name": "TypingThunder"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLayout>
        <div className="w-full max-w-3xl mx-auto py-12">
          <Link href="/blog" className="text-[13px] text-[var(--text-muted)] hover:text-white inline-flex items-center gap-2 mb-8 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
          
          <article className="prose prose-invert prose-zinc max-w-none">
            <span className="text-[12px] font-mono text-[var(--accent-color)] uppercase tracking-widest">{post.date}</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-4 mb-8 leading-tight">{post.title}</h1>
            
            <div className="text-[15px] text-[var(--text-muted)] leading-relaxed space-y-6 whitespace-pre-wrap">
              {post.content.trim()}
            </div>
          </article>
        </div>
      </AppLayout>
    </>
  );
}
