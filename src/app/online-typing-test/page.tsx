import { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Online Typing Test | Check Your WPM Free',
  description: 'Take our free online typing test to measure your words per minute (WPM). Get real-time feedback and detailed analytics to improve your typing speed online.',
  alternates: {
    canonical: 'https://typingthunder.com/online-typing-test',
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
          "name": "Are online typing tests accurate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our online typing test uses high-precision timing to accurately measure your keystrokes down to the millisecond, providing a highly accurate WPM calculation."
          }
        },
        {
          "@type": "Question",
          "name": "Is this online typing test free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely! TypingThunder is a 100% free online typing test platform. You can take as many tests as you like without downloading any software."
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
                Welcome to the internet's most fluid and responsive <strong>online typing test</strong>. Forget about downloading clunky software or dealing with ad-ridden platforms. TypingThunder runs entirely in your browser, allowing you to test your typing skills from any device, anywhere in the world.
              </p>
              <h3>Benefits of Testing Online</h3>
              <p>
                Taking an online typing test provides several unique advantages:
              </p>
              <ul>
                <li><strong>Immediate Feedback:</strong> See your WPM and accuracy update in real-time as you type.</li>
                <li><strong>Cross-Platform Compatibility:</strong> Whether you are on Windows, Mac, or Linux, our online test works flawlessly across all modern browsers.</li>
                <li><strong>Global Leaderboards:</strong> Since your results are processed online, you can instantly compare your scores with other typists around the globe.</li>
                <li><strong>Cloud Sync:</strong> Create an account to save your historical data to the cloud. Access your progression charts from any computer.</li>
              </ul>
              <h3>Is the test accurate?</h3>
              <p>
                Yes! Our online typing test engine utilizes high-precision browser APIs (`performance.now()`) to track your keystrokes down to the millisecond. This ensures that your final WPM calculation is completely precise and free from network latency, as the core test runs locally in your browser before securely syncing your results.
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
