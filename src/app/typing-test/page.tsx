import { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Typing Test | Check WPM and Accuracy',
  description: 'A beautiful, minimalist typing test that tracks your words per minute and error rate. Practice typing in 14 regional languages with our free tool.',
  alternates: {
    canonical: 'https://centerville-typing.vercel.app/typing-test',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Centerville Typing Test",
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
          "name": "What is a typing test?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A typing test measures how fast and accurately you can type. It calculates your Words Per Minute (WPM) by dividing the number of characters typed by five."
          }
        },
        {
          "@type": "Question",
          "name": "How can I improve my typing speed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Improving your typing speed requires practicing touch typing, maintaining proper posture, looking at the screen instead of the keyboard, and taking typing practice tests regularly."
          }
        }
      ]
    }
  ]
};

export default function TypingTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLayout 
        seoTitle="Free Typing Test"
        seoDescription="Take a quick typing test to measure your WPM and accuracy. Our minimalist, ad-free typing test supports English and 13 Indian regional languages."
        seoContent={
          <>
            <SeoContentSection title="Why Take a Typing Test?">
              <p>
                Taking a <strong>typing test</strong> is the best way to determine your baseline typing speed and accuracy. Whether you are applying for a data entry job, seeking to improve your coding efficiency, or simply want to type faster to save time, our free typing test provides immediate, actionable feedback on your Words Per Minute (WPM).
              </p>
              <p>
                A standard typing test evaluates two main components:
              </p>
              <ul>
                <li><strong>Speed (WPM):</strong> How fast your fingers can press keys. We use the universal standard where one "word" equals five keystrokes.</li>
                <li><strong>Accuracy:</strong> How often you hit the correct key without using backspace. High accuracy is often more important than raw speed because correcting mistakes costs significant time.</li>
              </ul>
              <h3>How to Prepare for a Typing Test</h3>
              <p>
                To achieve your highest score, make sure you are seated comfortably with your feet flat on the floor. Rest your fingers on the "Home Row" (ASDF and JKL;) and let your muscle memory guide your hands. Do not look down at the keyboard! If you make a mistake, quickly correct it or move on depending on the test rules, but prioritize rhythm over panic.
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
