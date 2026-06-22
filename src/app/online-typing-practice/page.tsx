import { Metadata } from 'next';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Online Typing Practice - Boost Your Typing Speed',
  description: 'Practice typing online with custom text and real-time WPM metrics. Build finger muscle memory with free daily lessons.',
  alternates: {
    canonical: 'https://typingthunder.com/online-typing-practice',
  },
  openGraph: {
    url: 'https://typingthunder.com/online-typing-practice',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "TypingThunder Practice Engine",
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
          "name": "What is the best way to do online typing practice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best way is to practice <a href="https://en.wikipedia.org/wiki/Touch_typing" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">touch typing</a> on the home row without looking down at the keyboard. Focus on accuracy, keep your posture correct, and practice for 15 minutes daily."
          }
        },
        {
          "@type": "Question",
          "name": "Can typing practice help reduce keyboard fatigue?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Learning proper ergonomics and finger mappings prevents strain and fatigue by distributing the work evenly across all fingers."
          }
        }
      ]
    }
  ]
};

export default function OnlineTypingPracticePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLayout 
        seoTitle="Online Typing Practice"
        seoDescription="Improve your key accuracy and typing speed. Practice typing online with standard passages, quotes, or custom layouts."
        seoContent={
          <>
            <SeoContentSection title="Optimize WPM with Online Typing Practice">
              <p>
                Structured <strong>online typing practice</strong> remains the best way to accelerate your keyboard speed. In a digitized world, text entry is a continuous task. For example, writers, coders, and administrators use keyboards hourly. Therefore, practicing correct posture and key positioning increases productivity and saves time.
              </p>

              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-zinc-800 my-8">
                <Image 
                  src="/images/typing-test-infographic.png" 
                  alt="Practicing a online typing practice on TypingThunder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
              </div>

              <h3>Why Traditional Typing Mappings Work</h3>
              <p>
                Many computer users develop bad habits, such as looking down or typing with two fingers. However, touch typing utilizes all ten fingers. By dividing the keyboard layout, each finger controls a specific set of keys. Consequently, you build muscle memory. Over time, your brain executes keystrokes automatically, allowing you to focus on the screen.
              </p>

              <h3>Features of a Premium Practice Tool</h3>
              <p>
                Our practice tool calculates your performance in real time. We track your words per minute (WPM), accuracy, and mistake patterns. In addition, our system highlights weak keys. This helps you target specific letters that slow you down. By correcting these specific mistakes, you can achieve smoother typing flow.
              </p>

              <h3>How to Maximize Your Practice Sessions</h3>
              <p>
                If you want to improve, you must follow strict guidelines. For example, always keep your fingers on the home row keys (ASDF JKL;). Never look at the keys while typing. If you make an error, backspace and correct it immediately. In addition, take short breaks to prevent hand fatigue. Consistency is far more valuable than marathon sessions.
              </p>

              <h3>Tailor Exercises for Government Exams</h3>
              <p>
                Many administrative exams require strict typing tests. For example, candidates must type at 30 to 35 WPM under high pressure. Therefore, our practice mode includes timers and layouts that mirror exam requirements. Daily drills build the confidence and speed needed to pass official typing tests easily.
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
