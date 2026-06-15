import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';

// Mock data for blog posts
const POSTS = {
  'how-to-type-faster-5-proven-tips': {
    title: 'How to Type Faster: 5 Proven Tips for 2026',
    date: 'June 8, 2026',
    excerpt: "Breaking the 100 WPM barrier is difficult but not impossible. Learn the five scientifically proven methods to increase your typing velocity.",
    content: (
      <div className="space-y-6">
        <p>Typing fast is not about moving your hands rapidly in a chaotic manner; it's about <strong>eliminating wasted motion</strong>. The best typists in the world look like their hands are barely moving. Here is the definitive guide to breaking past your plateau.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Master the Home Row (Strict Adherence)</h2>
        <p>Always return your fingers to <code className="bg-zinc-800 px-1 rounded">ASDF</code> and <code className="bg-zinc-800 px-1 rounded">JKL;</code>. If you do not anchor your hands, your brain has to dynamically calculate the distance to the next key based on where your hand happens to be. Anchoring provides a static coordinate system.</p>
        
        <div className="bg-[var(--bg-widget)] border-l-4 border-yellow-500 p-4 rounded-r my-6 text-[14px]">
          <strong className="text-yellow-500 block mb-1">Pro Tip:</strong> 
          Feel for the physical bumps on the F and J keys. You should be able to find the home row with your eyes closed.
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Look at the Screen, Not the Keyboard</h2>
        <p>Looking down at the keyboard creates a visual feedback loop that introduces massive latency. Trust your muscle memory. If you make a mistake, trust your right pinky to find the backspace key automatically.</p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Prioritize Accuracy Over Speed</h2>
        <p>A common misconception is that you must push yourself to type faster than you comfortably can. <strong>This is wrong.</strong> Speed is a natural byproduct of high accuracy. If you type at 98%+ accuracy, your speed will naturally increase. If you type at 90% accuracy, the time spent pressing backspace will forever cap your WPM.</p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Target Your Weak Keys</h2>
        <p>Everyone has weak keys. Usually, it's the keys assigned to the pinky and ring fingers (like <code>P</code>, <code>Q</code>, <code>Z</code>, or numbers). Use TypingThunder's Weak Keys drill to isolate the exact characters holding you back.</p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Optimize Your Ergonomics</h2>
        <p>A mechanical keyboard with tactile switches (like Cherry MX Browns) provides physical confirmation that a key was registered, allowing your brain to move to the next character milliseconds faster. Furthermore, ensure your wrists are floating or resting on a plush pad, not planting rigidly on the desk.</p>
      </div>
    )
  },
  'touch-typing-vs-hunt-and-peck': {
    title: 'Touch Typing vs. Hunt and Peck: Why Form Matters',
    date: 'June 1, 2026',
    excerpt: "Are you still looking down at your keyboard? Discover why transitioning to full touch typing is essential for long-term productivity.",
    content: (
      <div className="space-y-6">
        <p>Many people can achieve 60 WPM using just two fingers (a method affectionately known as "Hunt and Peck"). Because they reach an acceptable speed, they never feel the need to learn proper touch typing. <strong>This is a critical mistake.</strong></p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Hard Ceiling of Hunt and Peck</h2>
        <p>When you use two fingers, your hands must physically travel across the entire keyboard. This introduces a physical speed limit based on hand-travel distance. Touch typing engages all 10 fingers, dividing the keyboard into distinct zones. The travel distance for any given finger is reduced to mere millimeters.</p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Ergonomic Cost</h2>
        <p>Hunt and peck requires constant neck movement—looking down at the keys, then back up at the screen. Over an 8-hour workday, this causes severe cervical strain and eye fatigue.</p>

        <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-lg my-6">
          <h3 className="text-red-400 font-bold mb-2">The Transition Period</h3>
          <p className="text-zinc-300 text-sm">Making the switch to touch typing will be painful. Your speed will drop from 60 WPM to 15 WPM for the first week. You will feel incredibly frustrated. But if you stick with it, you will surpass your old speed within a month, and you will thank yourself for the rest of your life.</p>
        </div>
      </div>
    )
  },
  'best-mechanical-switches-for-typing': {
    title: 'The Best Mechanical Switches for High-Speed Typing',
    date: 'May 20, 2026',
    excerpt: "Linear, tactile, or clicky? We break down the physics behind mechanical switches to find the perfect match for typists.",
    content: (
      <div className="space-y-6">
        <p>The keyboard you use dictates the feedback loop between your fingers and your brain. The great debate in the mechanical keyboard community is which switch type reigns supreme for pure typing speed.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
            <h3 className="font-bold text-red-400 mb-2">Linear (Red)</h3>
            <p className="text-sm text-zinc-400">Smooth all the way down. Great for double-tapping and gaming, but prone to accidental presses while typing since there is no feedback.</p>
          </div>
          <div className="bg-zinc-900 p-4 rounded-lg border border-yellow-800">
            <h3 className="font-bold text-yellow-600 mb-2">Tactile (Brown)</h3>
            <p className="text-sm text-zinc-400">A slight physical bump right before actuation. Considered the holy grail for typists because your fingers can feel exactly when the key registers.</p>
          </div>
          <div className="bg-zinc-900 p-4 rounded-lg border border-blue-900">
            <h3 className="font-bold text-blue-400 mb-2">Clicky (Blue)</h3>
            <p className="text-sm text-zinc-400">Very satisfying audio feedback and a sharp bump. Incredible for typing rhythm, but completely unacceptable in a shared office environment.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Verdict</h2>
        <p>For high-speed typing, we strongly recommend <strong>Light Tactile</strong> switches. The tactile bump informs your brain that the keystroke was successful, allowing your finger to immediately lift off and move to the next key before bottoming out. This "floating" typing style is how 150+ WPM typists maintain their speed without finger fatigue.</p>
      </div>
    )
  },
  'mastering-hindi-typing-mangals-vs-krutidev': {
    title: 'Mastering Hindi Typing: Mangal vs. Krutidev',
    date: 'June 12, 2026',
    excerpt: "Are you preparing for a government exam? Understanding the difference between Legacy Krutidev and Unicode Mangal layouts is the key to passing.",
    content: (
      <div className="space-y-6">
        <p>If you are preparing for SSC, UPSSSC, or High Court typing exams, you must understand the deep technical differences between Hindi typing layouts.</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Legacy Standard: KrutiDev 010</h2>
        <p>Krutidev is a legacy, non-Unicode font. This means the computer actually thinks you are typing in English, but the font visually renders the English characters as Hindi letters.</p>
        <ul className="list-disc pl-6 space-y-2 text-zinc-300">
          <li><strong>Pros:</strong> Extensively used in older government departments. Extremely predictable keystrokes.</li>
          <li><strong>Cons:</strong> Cannot be used on the modern web or social media without translation tools. Uses complex Alt-codes for special characters (e.g., Alt+0161 for 'चंद्रबिंदु').</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Modern Standard: Mangal (Inscript / Remington)</h2>
        <p>Mangal is a true Unicode font. When you type in Mangal, the computer natively understands it as Hindi data. Government exams test Mangal using two primary keyboard mappings: Inscript and Remington Gail.</p>
        <ul className="list-disc pl-6 space-y-2 text-zinc-300">
          <li><strong>Inscript:</strong> The scientifically designed Indian standard. Vowels are on the left hand, consonants on the right. It is incredibly logical once learned.</li>
          <li><strong>Remington Gail:</strong> A mapping that emulates the old mechanical Hindi typewriters. It is much harder to learn, but typists migrating from physical typewriters prefer it.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">How to Prepare</h2>
        <p>Always check your specific exam notification. If it specifies "Unicode", practice strictly on Mangal. TypingThunder supports exact emulations of KrutiDev 010, Mangal Inscript, and Mangal Remington Gail to ensure your practice perfectly matches the exam environment.</p>
      </div>
    )
  },
  'breaking-100-wpm-mathematical-approach': {
    title: 'The Ultimate Guide to Breaking 100 WPM: A Mathematical Approach',
    date: 'June 14, 2026',
    excerpt: 'Getting stuck at 80 WPM is normal. Breaking into the triple digits requires a mathematical approach to N-grams, rolling keystrokes, and lookahead buffering.',
    content: (
      <div className="space-y-6">
        <p>Hitting 60 WPM is about learning touch typing. Hitting 80 WPM is about practice. But breaking the 100 WPM barrier? That requires a fundamental shift in how your brain processes text. You can no longer afford to read word by word; you must process text mathematically.</p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Theory of N-Grams</h2>
        <p>In linguistics and computer science, an <strong>N-gram</strong> is a contiguous sequence of <var>n</var> items from a given sample of text. For typists, we care about Bigrams (2 letters) and Trigrams (3 letters).</p>
        
        <div className="bg-zinc-900 border-l-4 border-blue-500 p-5 my-6 rounded">
          <p className="text-zinc-300 font-mono text-sm mb-2">The most common English Bigrams:</p>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-zinc-800 px-2 py-1 rounded text-blue-400 font-bold">TH</span>
            <span className="bg-zinc-800 px-2 py-1 rounded text-blue-400 font-bold">HE</span>
            <span className="bg-zinc-800 px-2 py-1 rounded text-blue-400 font-bold">IN</span>
            <span className="bg-zinc-800 px-2 py-1 rounded text-blue-400 font-bold">ER</span>
            <span className="bg-zinc-800 px-2 py-1 rounded text-blue-400 font-bold">AN</span>
          </div>
        </div>

        <p>At 100+ WPM, you are no longer typing individual letters. You are firing pre-programmed muscle memory macros for highly frequent N-grams. When you see the word "There", your brain should not process <code>T</code> - <code>H</code> - <code>E</code> - <code>R</code> - <code>E</code>. It should process the macro <code>THE</code> followed by the macro <code>RE</code>.</p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Rolling Keystrokes (The Secret to 150+ WPM)</h2>
        <p>Look at the word "power". If you type this normally, you press P, lift your finger, press O, lift your finger, press W, and so on. This introduces mechanical delays.</p>
        <p><strong>Rolling</strong> is the technique of pressing the next key <em>before</em> your finger has fully lifted off the previous key. Because most mechanical keyboards actuate halfway down the keypress (approx 2mm), you can actually overlap your keystrokes. When typing "er" (as in pow<strong>er</strong>), your left middle finger should be pressing 'E' while your left index finger is already moving downwards towards 'R'. This overlapping wave motion is called a "roll".</p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Lookahead Buffering</h2>
        <p>Your eyes must always be 2 to 3 words ahead of your fingers. If you are looking at the word you are currently typing, your brain will pause when you finish the word to process the next one. This creates micro-stutters in your WPM graph.</p>
        
        <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-lg my-6">
          <h3 className="text-red-400 font-bold mb-2">The Golden Rule of Reading Ahead</h3>
          <p className="text-zinc-300 text-sm">Force your eyes to the right. While your fingers are autonomously typing the current word via muscle memory, your conscious brain should be reading the next two words and loading their N-grams into your "buffer".</p>
        </div>
      </div>
    )
  },
  'ssc-typing-test-rules-and-evaluation': {
    title: 'Cracking the SSC Typing Test: Exact Rules & Evaluation Math',
    date: 'June 15, 2026',
    excerpt: 'One wrong keystroke can cost you your government job. Understand the strict rules for Full Mistakes, Half Mistakes, and how the SSC algorithm calculates your final net WPM.',
    content: (
      <div className="space-y-6">
        <p>Government typing exams (like SSC CHSL, SSC CGL, and EPFO) do not calculate WPM the same way modern typing websites do. They use highly rigid mathematical formulas to penalize errors. If you do not understand these rules, you will fail the exam even if your raw speed is high.</p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">What Constitutes a "Word"?</h2>
        <p>In all SSC exams, a "word" is mathematically defined as exactly <strong>5 keystrokes</strong> (including spaces). Therefore, if you type 1750 keystrokes in 10 minutes, you have typed exactly 350 words, resulting in a raw speed of 35 WPM.</p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Error Evaluation: Full vs. Half Mistakes</h2>
        <p>The Staff Selection Commission categorizes errors into two rigid buckets.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="bg-red-950/30 border border-red-900/50 p-5 rounded-lg">
            <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Full Mistakes (100% Penalty)
            </h3>
            <ul className="list-disc pl-5 text-sm text-zinc-300 space-y-2">
              <li><strong>Omission:</strong> Missing a word entirely.</li>
              <li><strong>Substitution:</strong> Typing a completely different word (e.g., typing 'there' instead of 'their').</li>
              <li><strong>Addition:</strong> Typing a word that does not exist in the passage.</li>
            </ul>
          </div>

          <div className="bg-yellow-950/30 border border-yellow-900/50 p-5 rounded-lg">
            <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Half Mistakes (50% Penalty)
            </h3>
            <ul className="list-disc pl-5 text-sm text-zinc-300 space-y-2">
              <li><strong>Spacing Errors:</strong> Missing a space between words (e.g., 'Ihope' instead of 'I hope').</li>
              <li><strong>Capitalization:</strong> Typing a lowercase letter when uppercase was required.</li>
              <li><strong>Punctuation:</strong> Missing a comma or period.</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Calculation Formula</h2>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg font-mono text-sm overflow-x-auto">
          <p className="text-zinc-400 mb-2">// SSC Final Net Speed Calculation</p>
          <div className="text-green-400 mb-1">Total Errors = Full Mistakes + (Half Mistakes / 2)</div>
          <div className="text-blue-400 mb-1">Error Penalty = (Total Errors * 10)</div>
          <div className="text-purple-400 mb-4">Net Keystrokes = Total Keystrokes Typed - Error Penalty</div>
          <div className="text-white font-bold border-t border-zinc-700 pt-3">Final Net WPM = (Net Keystrokes / 5) / Time In Minutes</div>
        </div>

        <p className="mt-6">Because of the heavy 10x multiplier penalty on errors, accuracy is vastly more important than raw speed. A single omitted word costs you 50 net keystrokes. Use TypingThunder's Government Exam mode to practice against this exact algorithm!</p>
      </div>
    )
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
    description: post.excerpt,
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
            
            <div className="text-[16px] text-zinc-300 leading-relaxed space-y-6">
              {post.content}
            </div>
          </article>
        </div>
      </AppLayout>
    </>
  );
}
