import { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Typing Speed Test | Calculate Your True WPM',
  description: 'Our typing speed test accurately calculates your gross and net Words Per Minute (WPM). Build lightning-fast keyboard speed with targeted practice modes.',
  alternates: {
    canonical: 'https://typingthunder.com/typing-speed-test',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "TypingThunder Typing Speed Test",
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
          "name": "How is WPM calculated in a typing speed test?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WPM is calculated by dividing the total number of characters typed by 5, and then dividing by the time elapsed in minutes. Net WPM subtracts your errors from this calculation."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between Gross WPM and Net WPM?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Gross WPM measures your raw typing speed regardless of mistakes. Net WPM takes your Gross WPM and penalizes you for uncorrected errors. Net WPM is your true, usable typing speed."
          }
        }
      ]
    }
  ]
};

export default function TypingSpeedTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLayout 
        seoTitle="Typing Speed Test"
        seoDescription="Welcome to the TypingThunder Typing Speed Test. We calculate your true WPM (Words Per Minute) using strict error penalties so you know exactly how fast your fingers fly across the keyboard."
        seoContent={
          <>
            <SeoContentSection title="Understanding Your Typing Speed Test Results">
              <p>
                When you complete a <strong>typing speed test</strong>, you are presented with two highly important metrics: your typing speed and your accuracy. But what do those numbers really mean?
              </p>
              <h3>Gross WPM vs Net WPM</h3>
              <p>
                In professional typing environments, there are two ways to measure speed:
              </p>
              <ul>
                <li><strong>Gross WPM:</strong> This is your raw, unfiltered typing speed. It calculates how fast you are hitting keys, without penalizing you for spelling mistakes.</li>
                <li><strong>Net WPM:</strong> This is your true typing speed. It calculates your Gross WPM, but then subtracts uncorrected errors. For example, if you typed 60 Gross WPM but left 5 errors in the text, your Net WPM would drop to 55 WPM.</li>
              </ul>
              <h3>What is a good typing speed?</h3>
              <p>
                The global average typing speed is roughly 40 WPM. However, for professional contexts (like programming, data entry, or transcription), a good typing speed is generally considered to be 60 WPM and above. Elite typists often reach speeds of over 100 WPM! Taking a regular typing speed test helps you track your progress towards these elite tiers.
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
