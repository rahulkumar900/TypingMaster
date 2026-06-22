import { Metadata } from 'next';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Free Typing Lessons - Learn <a href="https://en.wikipedia.org/wiki/Touch_typing" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">touch typing</a> Fast',
  description: 'Master touch typing with our free typing lessons. Learn correct finger positions, home row rules, and practice to type faster.',
  alternates: {
    canonical: 'https://typingthunder.com/typing-lessons',
  },
  openGraph: {
    url: 'https://typingthunder.com/typing-lessons',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "TypingThunder Touch Typing Course",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Any",
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
          "name": "Why are typing lessons important for beginners?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Typing lessons help beginners establish correct finger habits early. They teach home row placement and prevent the development of bad habits like looking at the keys."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to learn touch typing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most users see progress within 2 to 4 weeks of daily 15-minute lessons. Achieving high professional speeds of 60+ WPM may take a few months of practice."
          }
        }
      ]
    }
  ]
};

export default function TypingLessonsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLayout 
        seoTitle="Free Typing Lessons"
        seoDescription="Learn touch typing online. Follow our step-by-step typing lessons to master correct finger positions and increase speed."
        seoContent={
          <>
            <SeoContentSection title="Master Touch Typing with Free Lessons">
              <p>
                Structured <strong>typing lessons</strong> help you transition from slow hunt-and-peck typing to fast touch typing. In today's digital landscape, typing efficiency is a core professional skill. For example, writers and software engineers rely on their keyboards constantly. Therefore, learning correct finger positions saves time and reduces muscle strain.
              </p>

              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-zinc-800 my-8">
                <Image 
                  src="/images/typing-test-infographic.png" 
                  alt="Practicing a typing lessons on TypingThunder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
              </div>

              <h3>Lesson 1: The Core Foundation of the Home Row</h3>
              <p>
                Every touch typing lesson starts with the home row. Place your left-hand fingers on ASDF and your right-hand fingers on JKL;. The F and J keys feature physical bumps. These allow you to locate the home row without looking down. By resting your hands here, your fingers can reach other keys quickly and return to their baseline position.
              </p>

              <h3>Lesson 2: Proper Finger Mappings and Extension</h3>
              <p>
                Each finger is responsible for a diagonal column of keys. For example, your left index finger handles F, R, V, T, G, and B. In addition, your pinky fingers control layout modifiers like Shift and Enter. You must follow these mappings strictly. Because your fingers reach keys consistently, you build accurate muscle memory faster.
              </p>

              <h3>Lesson 3: Developing Perfect Accuracy and Rhythm</h3>
              <p>
                When taking typing lessons, you should prioritize precision over speed. If you try to type too fast, you will make mistakes. Consequently, fixing errors breaks your rhythm and slows you down. Therefore, focus on maintaining a steady tempo. Hit each key cleanly. Speed will naturally develop as your fingers move more confidently.
              </p>

              <h3>Daily Exercises and Practice Routine</h3>
              <p>
                Consistent daily practice is the best way to train your hands. For example, spend 10 to 15 minutes practicing every morning. Try to keep your eyes on the screen, not your fingers. If you struggle, repeat the keys slowly. Our interactive lessons and test modes help monitor your WPM and accuracy progression over time.
              </p>
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
