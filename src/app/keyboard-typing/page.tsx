import { Metadata } from 'next';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Keyboard Typing Test: Master QWERTY & Transliteration',
  description: 'Improve keyboard typing speed and learn <a href="https://en.wikipedia.org/wiki/Touch_typing" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">touch typing</a> rules. Learn about different layout mappings and matra key structures.',
  alternates: {
    canonical: 'https://typingthunder.com/keyboard-typing',
  },
  openGraph: {
    url: 'https://typingthunder.com/keyboard-typing',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "TypingThunder Keyboard Coach",
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
          "name": "What is touch typing on a physical keyboard?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Touch typing is the ability to type on a physical keyboard using muscle memory, without looking down at the keys. It utilizes all ten fingers."
          }
        },
        {
          "@type": "Question",
          "name": "How do transliteration keyboard layouts work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Transliteration layouts map Latin characters to phonetic equivalents in other scripts (like Devanagari). For example, typing 'a' on a phonetic layout produces 'आ'."
          }
        }
      ]
    }
  ]
};

export default function KeyboardTypingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLayout 
        seoTitle="Keyboard Typing"
        seoDescription="Master QWERTY and transliteration keyboards. Take our free keyboard typing test to improve speeds and learn touch typing rules."
        seoContent={
          <>
            <SeoContentSection title="Boost Skills with Keyboard Typing Tests">
              <p>
                Engaging in structured <strong>keyboard typing</strong> practice represents the best way to improve your writing speed. In today's digital landscape, keyboard proficiency is a key career asset. For example, programmers, journalists, and clerks use keyboards constantly. Therefore, learning touch typing is highly beneficial.
              </p>

              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-zinc-800 my-8">
                <Image 
                  src="/images/typing-test-infographic.png" 
                  alt="Practicing a keyboard typing on TypingThunder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
              </div>

              <h3>Why Touch Typing is Superior to Hunting Keys</h3>
              <p>
                Many computer users look at their fingers while typing. Consequently, this slows their reading flow and introduces formatting errors. However, touch typing trains all ten fingers to find keys automatically. By resting your hands on the home row keys (ASDF JKL;), you build strong muscle memory.
              </p>

              <h3>How We Measure Your Performance</h3>
              <p>
                Our typing test tracks detailed statistics. We display your raw WPM, net WPM, and accuracy percentage. In addition, our consistency graph shows how steady your speed is. If you frequently make mistakes on certain letters, our system lists them as weak keys. This helps you focus on your problem areas.
              </p>

              <h3>Understanding Different Keyboard Layouts</h3>
              <p>
                Different languages require specific layout profiles. For example, our platform supports English QWERTY, alongside Hindi Mangal and Krutidev layouts. This is helpful for candidates preparing for regional government clerical exams. Take our free online typing test daily to build confidence and muscle memory.
              </p>

              <h3>Ergonomic and Posture Guidelines</h3>
              <p>
                To succeed, you must maintain proper ergonomics. Sit up straight with your feet flat on the floor. Keep your elbows at a 90-degree angle. Position your keyboard close to your body. Because good posture reduces wrist strain, you can practice comfortably for longer periods.
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
