import { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Typing Test & WPM Speed Test | English & Hindi',
  description: 'Boost your typing speed (WPM) with our free online typing test. Practice General English or master Regional Languages like Hindi Mangal and Krutidev.',
  alternates: {
    canonical: 'https://typingthunder.com/',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "Typing Test & WPM Speed Test | English & Hindi",
      "description": "Boost your typing speed (WPM) with our free online typing test. Practice General English or master Regional Languages like Hindi Mangal and Krutidev.",
      "url": "https://typingthunder.com"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How is WPM calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WPM stands for Words Per Minute. It is calculated by dividing your total correct keystrokes by 5 (the standard word length), and then dividing that by the time elapsed in minutes."
          }
        },
        {
          "@type": "Question",
          "name": "Do you support Hindi typing tests?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We fully support regional language typing, including Hindi Mangal (Remington Gail, InScript) and Krutidev keyboard layouts which are standard for government exams like SSC and CPCT."
          }
        }
      ]
    }
  ]
};

export default function Home() {
  return (
    <AppLayout
      seoContent={
        <>
          <SeoContentSection title="Master Your Typing Speed in English and Regional Languages">
            <p>
              Welcome to TypingThunder, the ultimate typing test platform designed to help you increase your Words Per Minute (WPM) and accuracy. Whether you are aiming to improve your general English typing speed for professional work, or preparing for high-stakes government typing exams in regional languages, our platform provides a flawless, ad-free environment to practice.
            </p>

            <h3>The Perfect Balance: English and Hindi Typing</h3>
            <p>
              Unlike standard typing tests that only cater to an English-speaking audience, TypingThunder is built from the ground up to offer a balanced experience. We provide beautiful, minimalist interfaces for <strong>General English Typing</strong>, alongside strict, examination-grade modes for <strong>Hindi Typing</strong>.
            </p>
            <p>
              If you are preparing for SSC, CPCT, UP Police, or other government examinations, you can seamlessly switch to our Hindi Mangal Font (Remington Gail & InScript) or Krutidev 010 layouts. Our phonetic engine perfectly mirrors the strict rules of offline examination software, ensuring that your practice perfectly translates to the real world.
            </p>

            <h3>Why Take a WPM Typing Speed Test?</h3>
            <ul>
              <li><strong>Enhance Productivity:</strong> Increasing your WPM directly translates to hours saved when writing emails, code, or documents.</li>
              <li><strong>Build Muscle Memory:</strong> Regular practice with our test eliminates the need to look down at your keyboard.</li>
              <li><strong>Track Your Progress:</strong> We provide detailed, interactive charts mapping your raw speed and consistency over time.</li>
            </ul>

            <h3 className="mt-8 mb-4 border-b border-zinc-800 pb-2">Frequently Asked Questions (FAQ)</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white">How is WPM calculated?</h4>
                <p className="text-zinc-400 mt-1">WPM (Words Per Minute) is calculated using the international standard: (Total correct keystrokes / 5) / Time in minutes. This ensures fairness across different languages and long words.</p>
              </div>
              <div>
                <h4 className="font-bold text-white">Do you support Hindi typing tests?</h4>
                <p className="text-zinc-400 mt-1">Absolutely. We provide full, native-level support for Hindi Mangal (InScript and Remington Gail) and Krutidev layouts, specifically tailored for Indian government exam preparation.</p>
              </div>
              <div>
                <h4 className="font-bold text-white">What is Strict Mode?</h4>
                <p className="text-zinc-400 mt-1">Strict Mode forces you to correct any mistakes before moving forward. It builds perfect muscle memory and is highly recommended for typists striving for 100% accuracy.</p>
              </div>
            </div>
          </SeoContentSection>

          <InternalLinks />
        </>
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SpeedTestView />
    </AppLayout>
  );
}
