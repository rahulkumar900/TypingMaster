import { Metadata } from 'next';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'English Typing Test - Check Your WPM and Accuracy',
  description: 'Take our free English typing test online. Check your WPM speed, accuracy, and learn tips to type faster with daily <a href="https://en.wikipedia.org/wiki/Touch_typing" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">touch typing</a> drills.',
  alternates: {
    canonical: 'https://typingthunder.com/english-typing-test',
  },
  openGraph: {
    url: 'https://typingthunder.com/english-typing-test',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "TypingThunder English Typing Test",
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
          "name": "How is WPM calculated on this English typing test?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WPM stands for Words Per Minute. The system divides your total correct keystrokes by 5 (the standard word length), and then divides that by the time elapsed in minutes."
          }
        },
        {
          "@type": "Question",
          "name": "What is a good typing speed for English?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An average English typing speed is around 40 WPM. Professional typists, programmers, and administrative staff usually target 60 to 80 WPM with high accuracy."
          }
        }
      ]
    }
  ]
};

export default function EnglishTypingTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLayout 
        seoTitle="English Typing Test"
        seoDescription="Check your WPM and accuracy with our online English typing test. Complete touch typing exercises and track your progression."
        seoContent={
          <>
            <SeoContentSection title="Boost Skills with Our English Typing Test">
              <p>
                Taking an <strong>english typing test</strong> represents the most effective method to measure your raw speed and typing accuracy. In today's digital economy, keyboard proficiency determines how quickly you can execute tasks. For example, programmers and writers save hours of work by typing faster. Therefore, practicing touch typing is highly beneficial for your career.
              </p>

              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-zinc-800 my-8">
                <Image 
                  src="/images/typing-test-infographic.png" 
                  alt="Practicing a english typing test on TypingThunder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
              </div>

              <h3>Why You Need an English Typing Test</h3>
              <p>
                Many professionals rely on typing daily, but they still hunt and peck keys. In addition, looking at the keyboard slows down your creative flow. However, you can easily build finger muscle memory. Our typing tool provides instant feedback so you can identify weak keys. Consequently, regular practice helps you type automatically without looking down.
              </p>

              <h3>How the WPM Score is Calculated</h3>
              <p>
                We calculate your typing speed using standard formulas. In typing metrics, a single word consists of exactly five keystrokes, including spaces. For example, the word "tests" counts as one word. We divide your total correct keystrokes by five to find Gross Words. After that, we calculate Net WPM by subtracting errors from your gross score. This method guarantees fairness across different languages.
              </p>

              <h3>Tips to Improve Your Touch Typing</h3>
              <p>
                If you want to type faster, you must focus on accuracy first. For example, resting your fingers on the home row (ASDF JKL;) is crucial. Because your hands stay in a neutral position, your fingers reach keys efficiently. In addition, you should practice in a quiet environment. Daily 15-minute drills are much better than a single weekly session.
              </p>

              <h3>Practice for Government & Clerical Exams</h3>
              <p>
                Many civil service positions require candidates to pass a strict typing test. For example, central government clerical roles mandate a minimum speed of 35 WPM in English. Therefore, our platform offers an exam mode that replicates real test parameters. This allows you to build confidence and ensure success under exam conditions.
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
