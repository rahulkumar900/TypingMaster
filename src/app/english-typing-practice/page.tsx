import { Metadata } from 'next';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'English Typing Practice - Speed Up Your Keyboard Skills',
  description: 'Practice English typing online with interactive paragraphs. Eliminate keyboard hunting and build muscle memory.',
  alternates: {
    canonical: 'https://typingthunder.com/english-typing-practice',
  },
  openGraph: {
    url: 'https://typingthunder.com/english-typing-practice',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "TypingThunder Practice Hub",
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
          "name": "Why is English typing practice helpful for coders?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "English typing practice helps coders type key structural words, special symbols, and variables automatically, which reduces cognitive load and syntax mistakes."
          }
        },
        {
          "@type": "Question",
          "name": "How do I practice English typing with punctuation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can toggle the punctuation setting on our typing tool. This includes periods, commas, question marks, and uppercase letters in practice drills."
          }
        }
      ]
    }
  ]
};

export default function EnglishTypingPracticePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLayout 
        seoTitle="English Typing Practice"
        seoDescription="Speed up your keyboard skills. Access free English typing practice online, customized text modes, and real-time accuracy scoring."
        seoContent={
          <>
            <SeoContentSection title="Boost WPM with English Typing Practice">
              <p>
                Engaging in structured <strong>english typing practice</strong> represents the most effective way to improve your keyboard speed. In a digital economy, fast text input is a competitive advantage. For example, writers, coders, and clerks use keyboards daily. Therefore, practicing correct finger movements saves hundreds of hours of work.
              </p>

              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-zinc-800 my-8">
                <Image 
                  src="/images/typing-test-infographic.png" 
                  alt="Practicing a english typing practice on TypingThunder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
              </div>

              <h3>Why <a href="https://en.wikipedia.org/wiki/Touch_typing" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">touch typing</a> Beats Hunt-and-Peck</h3>
              <p>
                Many computer users look at their fingers while typing. Consequently, this breaks their concentration and slows their reading flow. However, touch typing trains all ten fingers to find keys automatically. By resting your hands on the home row keys (ASDF JKL;), you build strong muscle memory.
              </p>

              <h3>How to Measure Your WPM and Accuracy</h3>
              <p>
                Typing speed is measured in Words Per Minute (WPM). A single "word" is standardized to exactly five characters. For example, the phrase "practice" counts as 1.6 words. We calculate WPM by dividing correct characters by five, then dividing by the elapsed time. In addition, we record your accuracy.
              </p>

              <h3>Ergonomic and Posture Guidelines</h3>
              <p>
                To succeed, you must maintain proper ergonomics. Sit up straight with your feet flat on the floor. Keep your elbows at a 90-degree angle. Position your keyboard close to your body. Because good posture reduces wrist strain, you can practice comfortably for longer periods.
              </p>

              <h3>Features of Our Practice Engine</h3>
              <p>
                Our web app offers advanced settings to help you improve. You can choose different layouts, toggle numbers and punctuation, and configure custom texts. In addition, our dashboard stores your history locally or to your cloud profile. Try our free typing practice today to track your stats.
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
