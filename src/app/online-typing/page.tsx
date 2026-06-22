import { Metadata } from 'next';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Online Typing Test & Free Practice Engine',
  description: 'Test your online typing speed and accuracy. Practice minimalist <a href="https://en.wikipedia.org/wiki/Touch_typing" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">touch typing</a> in English and regional Indian layouts.',
  alternates: {
    canonical: 'https://typingthunder.com/online-typing',
  },
  openGraph: {
    url: 'https://typingthunder.com/online-typing',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "TypingThunder Online Engine",
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
          "name": "What is online typing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Online typing refers to practice or speed tests done directly in the web browser. It helps users improve keyboard speed and accuracy without downloading software."
          }
        },
        {
          "@type": "Question",
          "name": "Does this tool support regional keyboard layouts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We support standard English layouts and regional Indian layouts like Hindi Mangal (Remington Gail, InScript) and Krutidev."
          }
        }
      ]
    }
  ]
};

export default function OnlineTypingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLayout 
        seoTitle="Online Typing"
        seoDescription="Test your online typing speed and accuracy. Practice touch typing in English and multiple regional keyboard layouts."
        seoContent={
          <>
            <SeoContentSection title="Master Keyboard Skills with Online Typing">
              <p>
                A high-quality <strong>online typing</strong> interface is the perfect environment to measure and improve your keyboard skills. Modern careers require rapid text input. For example, developers, writers, and students type constantly. Therefore, learning how to touch type without looking down is highly valuable.
              </p>

              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-zinc-800 my-8">
                <Image 
                  src="/images/typing-test-infographic.png" 
                  alt="Practicing a online typing on TypingThunder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
              </div>

              <h3>Why Browser-Based Typing is Convenient</h3>
              <p>
                In the past, users had to download heavy software to practice typing. However, modern web applications let you test your speed instantly in the browser. In addition, you can save your progress to the cloud. Our typing engine is lightweight and responsive, ensuring that every keystroke is recorded instantly.
              </p>

              <h3>Understanding Typing Speed Standards</h3>
              <p>
                We calculate typing speed using the standard Words Per Minute (WPM) formula. One word is defined as exactly five keystrokes, including spaces. For example, if you type 250 characters in a minute, your raw speed is 50 WPM. Accuracy is the percentage of correct keys out of total keys typed.
              </p>

              <h3>Ergonomic and Posture Tips for Typists</h3>
              <p>
                To succeed at online typing, you must maintain proper posture. Sit up straight with your feet flat on the floor. Keep your elbows at a 90-degree angle. In addition, position your keyboard close to your body. Because good posture reduces hand and wrist fatigue, you can practice comfortably for longer periods.
              </p>

              <h3>Practice Regional Keyboard Mappings</h3>
              <p>
                Different languages require specific layout profiles. For example, our platform supports English QWERTY, alongside Hindi Mangal and Krutidev layouts. This is helpful for candidates preparing for regional government clerical exams. Take our free online typing test daily to build confidence and muscle memory.
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
