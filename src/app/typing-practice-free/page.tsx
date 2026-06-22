import { Metadata } from 'next';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Typing Practice Free - Interactive <a href="https://en.wikipedia.org/wiki/Touch_typing" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">touch typing</a> Drills',
  description: 'Access typing practice free online. Customize word limits, practice punctuation/numbers, and boost your professional speed.',
  alternates: {
    canonical: 'https://typingthunder.com/typing-practice-free',
  },
  openGraph: {
    url: 'https://typingthunder.com/typing-practice-free',
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
          "name": "Can I do typing practice free of charge?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! TypingThunder is completely free to use. You can access all settings, stats dashboards, word lists, and themes without paying anything."
          }
        },
        {
          "@type": "Question",
          "name": "How often should I use the practice engine?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We recommend doing short, focused 10-15 minute practice sessions daily. Daily practice trains muscle memory much faster than infrequent, long sessions."
          }
        }
      ]
    }
  ]
};

export default function TypingPracticeFreePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLayout 
        seoTitle="Free Typing Practice"
        seoDescription="Access typing practice free online. Customize your word limits, drill punctuation and numbers, and track your speed results."
        seoContent={
          <>
            <SeoContentSection title="Improve WPM with Typing Practice Free">
              <p>
                Utilizing <strong>typing practice free</strong> tools online helps you develop faster key movements. In our modern digital economy, typing is an indispensable career skill. For example, programmers, journalists, and clerks use keyboards daily. Therefore, learning touch typing saves hundreds of hours of work each year.
              </p>

              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-zinc-800 my-8">
                <Image 
                  src="/images/typing-test-infographic.png" 
                  alt="Practicing a typing practice free on TypingThunder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
              </div>

              <h3>Why Touch Typing is Superior</h3>
              <p>
                Many computer users look at their fingers while typing. Consequently, this slows their reading flow and introduces formatting errors. However, touch typing keeps your eyes fixed on the screen. By training all ten fingers, you build muscle memory. Over time, your hands move automatically, allowing you to write fluidly.
              </p>

              <h3>How to Measure Your WPM and Accuracy</h3>
              <p>
                Typing speed is measured in Words Per Minute (WPM). A single "word" is standardized to exactly five characters. For example, the phrase "typing" counts as 1.2 words. We calculate WPM by dividing correct characters by five, then dividing by the elapsed time. In addition, we track your key error rates.
              </p>

              <h3>Tips for Setting Up Practice Routines</h3>
              <p>
                If you want to see fast progress, you should practice in short, daily sessions. For example, practice for 15 minutes every morning. Keep your fingers resting on the home row keys (ASDF JKL;). Try not to look at your hands. Accuracy is key. Therefore, slow down if your accuracy falls below 95%.
              </p>

              <h3>Features of Our Free Practice Engine</h3>
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
