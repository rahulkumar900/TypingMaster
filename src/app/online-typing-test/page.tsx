import { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Online Typing Test | Check Your WPM Free',
  description: 'Take our free online typing test to measure your words per minute (WPM). Get real-time feedback and detailed analytics to improve your typing speed in English and Regional Languages.',
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
          "name": "Can I take a government typing test online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! TypingThunder provides exact replicas of government exam software layouts, allowing you to take authentic Hindi Mangal and Krutidev tests online right in your browser."
          }
        },
        {
          "@type": "Question",
          "name": "Is the online test accurate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our online engine uses high-precision browser APIs to track keystrokes down to the millisecond, completely bypassing network latency issues for 100% accurate WPM calculations."
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
              
              <h3>English & Hindi Practice on the Web</h3>
              <p>
                Most online typing tests only support basic English layouts. TypingThunder sets itself apart by bringing enterprise-grade <strong>Regional Language Support</strong> directly to the web. 
              </p>
              <ul>
                <li><strong>English Typing:</strong> Jump in and start typing instantly. Track your WPM across different time limits or word counts to gauge your everyday fluency.</li>
                <li><strong>Hindi Typing (Mangal / Krutidev):</strong> Practice for SSC, CPCT, and other state-level exams online. Our platform perfectly emulates offline typing software, enforcing strict backspace rules and providing accurate phonetic rendering without needing to install complex desktop applications.</li>
              </ul>

              <h3>Benefits of Testing Online</h3>
              <ul>
                <li><strong>Immediate Feedback:</strong> See your WPM and accuracy update in real-time as you type.</li>
                <li><strong>Cross-Platform Compatibility:</strong> Whether you are on Windows, Mac, or Linux, our online test works flawlessly across all modern browsers.</li>
                <li><strong>Global Leaderboards:</strong> Since your results are processed online, you can instantly compare your scores with other typists around the globe.</li>
              </ul>

              <h3 className="mt-8 mb-4 border-b border-zinc-800 pb-2">Frequently Asked Questions (FAQ)</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-white">Can I take a government typing test online?</h4>
                  <p className="text-zinc-400 mt-1">Yes! TypingThunder provides exact replicas of government exam software layouts, allowing you to take authentic Hindi Mangal and Krutidev tests online right in your browser.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">Is the online test accurate?</h4>
                  <p className="text-zinc-400 mt-1">Our online engine uses high-precision browser APIs (`performance.now()`) to track your keystrokes down to the millisecond. This ensures that your final WPM calculation is completely precise and free from network latency.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">Does it save my progress?</h4>
                  <p className="text-zinc-400 mt-1">Yes, if you create an account, our online platform securely syncs your historical data to the cloud, allowing you to view interactive progression charts from any computer.</p>
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
