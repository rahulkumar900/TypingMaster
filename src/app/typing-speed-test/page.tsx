import { Metadata } from 'next';
import Image from 'next/image';
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
  openGraph: {
    url: 'https://typingthunder.com/typing-speed-test',
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
        seoDescription="Welcome to the TypingThunder Typing Speed Test. We calculate your true WPM (Words Per Minute) using strict error penalties so you know exactly how fast your fingers fly across the keyboard in both English and Regional Languages."
        seoContent={
          <>
            <SeoContentSection title="Understanding Your Typing Speed Test Results">
              <p>
                When you complete a <strong>typing speed test</strong>, you are presented with two highly important metrics: your typing speed and your accuracy. But what do those numbers really mean? Whether you are practicing general English typing or preparing for a rigorous government exam using a Hindi keyboard layout, the fundamental metrics remain the same.
              </p>

              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-zinc-800 my-8">
                <Image 
                  src="/images/typing-test-infographic.png" 
                  alt="Practicing a typing speed test on TypingThunder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
              </div>

              <h3>English vs Regional Language Typing Tests</h3>
              <p>
                A high-quality typing speed test should adapt to your needs. TypingThunder uniquely supports both <strong>English</strong> and regional languages like <strong>Hindi</strong>.
              </p>
              <ul>
                <li><strong>English Typing:</strong> Perfect for software developers, data entry professionals, and everyday communication. We offer various modes like Quotes, Time-based, and Word-based tests.</li>
                <li><strong>Hindi Typing (Mangal & Krutidev):</strong> If you are an aspirant for exams like SSC, CPCT, or state police boards, our engine flawlessly replicates the strict backspace and error rules of standard exam software using the exact phonetic and legacy layouts you need.</li>
              </ul>

              <h3>Gross WPM vs Net WPM</h3>
              <p>
                In professional typing environments, there are two ways to measure speed:
              </p>
              <ul>
                <li><strong>Gross WPM:</strong> This is your raw, unfiltered typing speed. It calculates how fast you are hitting keys, without penalizing you for spelling mistakes.</li>
                <li><strong>Net WPM:</strong> This is your true typing speed. It calculates your Gross WPM, but then subtracts uncorrected errors. For example, if you typed 60 Gross WPM but left 5 errors in the text, your Net WPM would drop to 55 WPM.</li>
              </ul>

              <h3 className="mt-8 mb-4 border-b border-zinc-800 pb-2">Frequently Asked Questions (FAQ)</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-white">How is WPM calculated in a typing speed test?</h4>
                  <p className="text-zinc-400 mt-1">WPM is calculated by dividing the total number of characters typed by 5, and then dividing by the time elapsed in minutes. Net WPM subtracts your errors from this calculation.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">What is the difference between Gross WPM and Net WPM?</h4>
                  <p className="text-zinc-400 mt-1">Gross WPM measures your raw typing speed regardless of mistakes. Net WPM takes your Gross WPM and penalizes you for uncorrected errors. Net WPM is your true, usable typing speed.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">Are Hindi typing speed tests scored differently?</h4>
                  <p className="text-zinc-400 mt-1">No, the core mathematical formula (total keystrokes divided by 5) remains identical. However, the input mechanics are much stricter depending on the font (Mangal vs Krutidev).</p>
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
