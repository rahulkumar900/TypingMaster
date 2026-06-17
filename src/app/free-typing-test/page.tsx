import { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Free Typing Test Online: Check WPM Speed & Accuracy',
  description: 'Check your typing speed with our free typing test. Get instant WPM scorecard, accuracy metrics, and practice Hindi/English.',
  alternates: {
    canonical: 'https://typingthunder.com/free-typing-test',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "TypingThunder Free Typing Speedometer",
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
          "name": "Is there a completely free typing test online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! TypingThunder provides a 100% free typing test with no ads, account requirements, or limitations. You can measure speed, accuracy, and track weak keys."
          }
        },
        {
          "@type": "Question",
          "name": "What is the standard duration for a typing speed check?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most typing tests offer durations of 15 seconds, 30 seconds, 1 minute, or 2 minutes. A 1-minute test is standard for general speed calculation."
          }
        }
      ]
    }
  ]
};

export default function FreeTypingTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLayout 
        seoTitle="Free Typing Test"
        seoDescription="Check your raw and net typing speed online. Take our free typing test to analyze your WPM accuracy, key errors, and progress."
        seoContent={
          <>
            <SeoContentSection title="Check Performance with a Free Typing Test">
              <p>
                Using a <strong>free typing test</strong> helps you discover your actual keyboard speed in just a few minutes. In today's digital world, typing is a basic skill. For example, high speed increases your efficiency when messaging, coding, or writing documents. Therefore, analyzing your Words Per Minute (WPM) score can boost your career prospects.
              </p>

              <h3>Why Choose an Ad-Free Typing Test?</h3>
              <p>
                Many online tests contain popups and ads that distract you while typing. Consequently, these distractions lower your focus and accuracy. However, our minimalist tool provides a clean, distraction-free environment. This allows you to focus 100% of your energy on the text, ensuring a much more accurate score.
              </p>

              <h3>Standard Scoring Definitions and Rules</h3>
              <p>
                We calculate WPM using standard definitions. A "word" is exactly five character inputs, including spaces. For example, "hello" counts as one word. We divide correct inputs by the test duration to find Net WPM. In addition, we record your accuracy percentage. This shows the ratio of correct keys to total keys pressed.
              </p>

              <h3>How to Achieve a High Score</h3>
              <p>
                If you want to type faster, you must practice touch typing. Keep your fingers resting on the home row keys (ASDF JKL;). Try to look only at the screen. In addition, maintain a steady rhythm while typing. It is better to type slowly and accurately than to type fast with mistakes.
              </p>

              <h3>Check Weak Keys and Improve</h3>
              <p>
                Our results dashboard shows detailed metrics. You can see your speed consistency chart and a list of weak keys. For example, if you frequently miss the "B" or "Q" keys, you can focus on these letters during practice. Try our free typing test online daily to build muscle memory and type faster.
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
