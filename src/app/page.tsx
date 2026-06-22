import { Metadata } from 'next';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Typing Test & WPM Speed Test | English & Hindi Typing Practice',
  description: 'Boost your typing speed (WPM) with our free online typing test. Practice General English or master Regional Languages like Hindi Mangal and Krutidev. Track your progress with advanced analytics.',
  keywords: 'typing test, typing speed test, wpm test, english typing test, hindi typing test online, typing practice, touch typing practice, check typing speed, online typing master, typing speed online, mangal typing test, krutidev typing test, ssc typing test',
  alternates: {
    canonical: 'https://typingthunder.com/',
  },
  openGraph: {
    url: 'https://typingthunder.com/',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "TypingThunder",
      "url": "https://typingthunder.com/",
      "description": "The ultimate platform for free online typing tests, typing practice, and checking WPM speed in English and Hindi.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://typingthunder.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "name": "TypingThunder",
      "url": "https://typingthunder.com",
      "logo": "https://typingthunder.com/icon.png",
      "sameAs": []
    },
    {
      "@type": "SoftwareApplication",
      "name": "TypingThunder WPM Engine",
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
        },
        {
          "@type": "Question",
          "name": "How do I increase my typing speed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Focus on accuracy first. Keep your fingers on the home row (ASDF JKL;), avoid looking at your keyboard, and practice daily using our typing test tool for at least 15 minutes."
          }
        }
      ]
    }
  ]
};

export default function Home() {
  return (
    <AppLayout
      seoTitle="Typing Test & WPM Speed Test | English & Hindi"
      seoDescription="Boost your typing speed (WPM) with our free online typing test. Practice General English or master Regional Languages like Hindi Mangal and Krutidev."
      seoContent={
        <>
          <SeoContentSection title="Master Your Typing Speed in English and Regional Languages">
            <p>
              Welcome to <strong>TypingThunder</strong>, the ultimate typing test platform designed to help you increase your Words Per Minute (WPM) and accuracy. For instance, you might be aiming to improve your general English typing speed for professional work. Alternatively, you could be learning touch typing from scratch, or preparing for high-stakes government typing exams in regional languages. In any case, our platform provides a flawless, ad-free environment for <a href="https://en.wikipedia.org/wiki/Touch_typing" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">typing practice</a>.
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

            <h3>The Perfect Balance: English and Hindi Typing</h3>
            <p>
              Unlike standard typing speed tests that only cater to an English-speaking audience, TypingThunder is built from the ground up to offer a balanced, bilingual experience. Consequently, we provide beautiful, minimalist interfaces for General English Typing. In addition, we offer strict, examination-grade modes for Hindi Typing.
            </p>
            <p>
              If you are preparing for SSC, CPCT, UP Police, or other government examinations, you can seamlessly switch to our Hindi Mangal Font (Remington Gail & InScript) or Krutidev 010 layouts. Our phonetic engine perfectly mirrors the strict rules of offline examination software, ensuring that your typing practice perfectly translates to the real world.
            </p>

            <h3>Why Take a WPM Typing Speed Test?</h3>
            <ul>
              <li><strong>Enhance Productivity:</strong> Increasing your WPM directly translates to hours saved when writing emails, code, or documents. Therefore, a fast typing speed is a crucial modern skill.</li>
              <li><strong>Build Muscle Memory:</strong> Furthermore, regular typing practice with our online typing test eliminates the need to look down at your keyboard.</li>
              <li><strong>Track Your Progress:</strong> Create a free account to access detailed, interactive charts mapping your raw speed, accuracy, and consistency over time.</li>
              <li><strong>Compete Globally:</strong> Test your skills against friends or global players in our real-time typing arena.</li>
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
                <p className="text-zinc-400 mt-1">Strict Mode forces you to correct any mistakes before moving forward. It builds perfect muscle memory and is highly recommended for typists striving for 100% accuracy during their typing practice.</p>
              </div>
              <div>
                <h4 className="font-bold text-white">How do I increase my typing speed?</h4>
                <p className="text-zinc-400 mt-1">Focus on accuracy first. Keep your fingers on the home row (ASDF JKL;), avoid looking at your keyboard, and practice daily using our typing test tool for at least 15 minutes.</p>
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
