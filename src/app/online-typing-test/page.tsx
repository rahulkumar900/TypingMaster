import { Metadata } from 'next';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Free Online Typing Test | Measure WPM Speed & Accuracy',
  description: 'Take our free online typing test to measure your words per minute (WPM). Get real-time feedback, detailed analytics, and improve your typing speed in English and Hindi. Great for professionals, students, and government exam preparation.',
  keywords: 'online typing test, free typing test, wpm test online, check typing speed online, typing speed test, <a href="https://en.wikipedia.org/wiki/Touch_typing" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">touch typing</a> test, english typing test, hindi typing test online',
  alternates: {
    canonical: 'https://typingthunder.com/online-typing-test',
  },
  openGraph: {
    url: 'https://typingthunder.com/online-typing-test',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "TypingThunder Online Typing Test",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How is WPM calculated in the online typing test?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WPM (Words Per Minute) is calculated by taking the total number of characters you type, dividing by 5 (which is the standard average word length), and then dividing by the time elapsed in minutes. Our online engine factors in errors to give you an accurate Net WPM."
          }
        },
        {
          "@type": "Question",
          "name": "What is considered a good typing speed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An average typing speed is around 40 WPM. A good typing speed for professionals is 60-70 WPM. Competitive typists and elite professionals often reach 100+ WPM."
          }
        },
        {
          "@type": "Question",
          "name": "Can I take a government typing test online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! TypingThunder provides exact replicas of government exam software layouts, allowing you to take authentic Hindi Mangal and Krutidev tests online right in your browser."
          }
        },
        {
          "@type": "Question",
          "name": "Is the online test accurate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our online engine uses high-precision browser APIs to track keystrokes down to the millisecond, completely bypassing network latency issues for 100% accurate WPM calculations."
          }
        }
      ]
    }
  ]
};

export default function OnlineTypingTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLayout 
        seoTitle="Online Typing Test"
        seoDescription="TypingThunder is a premium, free online typing test designed to help you check your words per minute (WPM) and accuracy online in real-time. Practice today to improve your typing mechanics."
        seoContent={
          <>
            <SeoContentSection title="Take a Free Online Typing Test">
              <p>
                Welcome to the internet's most fluid and responsive <strong>online typing test</strong>. Forget about downloading clunky software or dealing with ad-ridden platforms. TypingThunder runs entirely in your browser, allowing you to test your typing skills from any device, anywhere in the world. Whether you are aiming to increase your productivity, prepare for a rigorous government exam, or simply challenge your friends, our typing test provides everything you need.
              </p>

              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-zinc-800 my-8">
                <Image 
                  src="/images/typing-test-infographic.png" 
                  alt="Practicing a online typing test on TypingThunder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
              </div>
              
              <h3>Why Take an Online Typing Test?</h3>
              <p>
                In today's digital age, typing speed is directly tied to productivity. A robust <strong>typing speed test</strong> allows you to establish a baseline for your current skills. By regularly practicing online, you build muscle memory, reduce the time spent looking at your keyboard, and ultimately achieve a state of flow where your thoughts instantly translate to the screen. 
              </p>
              <ul>
                <li><strong>Professional Advancement:</strong> Many jobs in data entry, transcription, and software development require high WPM benchmarks. Our tests prepare you for these demands.</li>
                <li><strong>Cognitive Benefits:</strong> Touch typing improves hand-eye coordination and allows you to focus purely on content creation rather than mechanical typing.</li>
                <li><strong>Exam Preparation:</strong> Government and banking exams often have strict typing speed prerequisites. We offer dedicated modes to mimic these exact scenarios.</li>
              </ul>

              <h3>Understanding Typing Speeds: What is a Good WPM?</h3>
              <p>
                After taking an <strong>online typing test</strong>, it's common to wonder how your score stacks up. Here is a general breakdown of typing percentiles:
              </p>
              <ul>
                <li><strong>Beginner (20 - 30 WPM):</strong> You likely still look at the keyboard occasionally (hunt-and-peck).</li>
                <li><strong>Average (40 - 50 WPM):</strong> The global average. Sufficient for most casual email and office tasks.</li>
                <li><strong>Professional (60 - 80 WPM):</strong> A strong touch typist. Highly sought after in fast-paced professional environments.</li>
                <li><strong>Elite (100+ WPM):</strong> You type as fast as you think. Only a small percentage of the population reaches this level.</li>
              </ul>

              <h3>How to Improve Your Typing Speed Online</h3>
              <p>
                Improving your WPM requires more than just mashing keys. It requires deliberate practice. Here are expert tips to boost your scores on our <strong>free typing test</strong>:
              </p>
              <ul>
                <li><strong>Master the Home Row:</strong> Rest your fingers on the ASDF and JKL; keys. Every keystroke should return to this base position.</li>
                <li><strong>Don't Look Down:</strong> Touch typing relies entirely on muscle memory. Even if it slows you down initially, keep your eyes fixed on the screen.</li>
                <li><strong>Prioritize Accuracy Over Speed:</strong> It's a common misconception that typing faster yields higher WPM. In reality, correcting mistakes takes significantly more time than typing a word correctly the first time. Focus on achieving 98%+ accuracy, and speed will naturally follow.</li>
              </ul>

              <h3>English & Hindi Practice on the Web</h3>
              <p>
                Most online typing tests only support basic English layouts. TypingThunder sets itself apart by bringing enterprise-grade <strong>Regional Language Support</strong> directly to the web. 
              </p>
              <ul>
                <li><strong>English Typing:</strong> Jump in and start typing instantly. Track your WPM across different time limits or word counts to gauge your everyday fluency.</li>
                <li><strong>Hindi Typing (Mangal / Krutidev):</strong> Practice for SSC, CPCT, and other state-level exams online. Our platform perfectly emulates offline typing software, enforcing strict backspace rules and providing accurate phonetic rendering without needing to install complex desktop applications.</li>
              </ul>

              <h3>Benefits of the TypingThunder Engine</h3>
              <ul>
                <li><strong>Immediate Feedback:</strong> See your WPM and accuracy update in real-time as you type, allowing you to adjust your rhythm on the fly.</li>
                <li><strong>Cross-Platform Compatibility:</strong> Whether you are on Windows, Mac, or ChromeOS, our online test works flawlessly across all modern browsers.</li>
                <li><strong>Global Leaderboards:</strong> Since your results are processed online, you can instantly compare your scores with other typists around the globe.</li>
              </ul>

              <h3 className="mt-8 mb-4 border-b border-zinc-800 pb-2">Frequently Asked Questions (FAQ)</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-white">How is WPM calculated in the online typing test?</h4>
                  <p className="text-zinc-400 mt-1">WPM (Words Per Minute) is calculated by taking the total number of characters you type, dividing by 5 (which is the standard average word length), and then dividing by the time elapsed in minutes. Our online engine factors in errors to give you an accurate Net WPM.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">Can I take a government typing test online?</h4>
                  <p className="text-zinc-400 mt-1">Yes! TypingThunder provides exact replicas of government exam software layouts, allowing you to take authentic Hindi Mangal and Krutidev tests online right in your browser.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">Is the online test accurate?</h4>
                  <p className="text-zinc-400 mt-1">Our online engine uses high-precision browser APIs (`performance.now()`) to track your keystrokes down to the millisecond. This ensures that your final WPM calculation is completely precise and free from network latency.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">Does it save my progress?</h4>
                  <p className="text-zinc-400 mt-1">Yes, if you create an account, our online platform securely syncs your historical data to the cloud, allowing you to view interactive progression charts from any computer.</p>
                </div>
              </div>
            </SeoContentSection>
            <InternalLinks />
          </>
        }
      >
        <SpeedTestView />
      </AppLayout>
    </>
  );
}
