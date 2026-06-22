import { Metadata } from 'next';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Typing Test Practice - Improve Your Speed and Accuracy',
  description: 'Improve your performance with daily typing test practice. Track consistency, identify weak keys, and qualify exams.',
  alternates: {
    canonical: 'https://typingthunder.com/typing-test-practice',
  },
  openGraph: {
    url: 'https://typingthunder.com/typing-test-practice',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "TypingThunder Practice Hub",
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
          "name": "How does typing test practice help you type faster?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Regular practice trains your fingers to find keys automatically. This builds muscle memory, allowing you to type without looking at the keyboard."
          }
        },
        {
          "@type": "Question",
          "name": "What metrics should I focus on during typing practice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You should prioritize accuracy first. Aim for 98% accuracy or higher before trying to increase your raw WPM speed."
          }
        }
      ]
    }
  ]
};

export default function TypingTestPracticePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLayout 
        seoTitle="Typing Test Practice"
        seoDescription="Access free typing test practice online. Complete speed building exercises, track key accuracy, and study exam layout presets."
        seoContent={
          <>
            <SeoContentSection title="Boost Speed with Typing Test Practice">
              <p>
                Engaging in structured <strong>typing test practice</strong> is the best way to raise your keyboard output. In a digital environment, speed and accuracy are crucial skills. For example, writers and software programmers save days of work by typing quickly. Therefore, consistent daily practice is highly beneficial.
              </p>

              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-zinc-800 my-8">
                <Image 
                  src="/images/typing-test-infographic.png" 
                  alt="Practicing a typing test practice on TypingThunder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
              </div>

              <h3>Why Finger Placement is Crucial for Typists</h3>
              <p>
                Many beginners rely on look-and-type methods. Consequently, they limit their speed to around 30 WPM. However, <a href="https://en.wikipedia.org/wiki/Touch_typing" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">touch typing</a> uses standard finger placement. Rest your hands on the home row (ASDF JKL;). By utilizing all ten fingers, you distribute the keyboard load. This makes typing faster and reduces hand fatigue.
              </p>

              <h3>How We Measure Your Performance</h3>
              <p>
                Our practice dashboard tracks detailed statistics. We display your raw WPM, net WPM, and accuracy percentage. In addition, our consistency graph shows how steady your speed is. If you frequently make mistakes on certain letters, our system lists them as weak keys. This helps you focus on your problem areas.
              </p>

              <h3>The Importance of Accuracy First</h3>
              <p>
                When starting typing test practice, always prioritize accuracy over speed. If you type quickly but make mistakes, you must delete characters. Consequently, correcting errors breaks your rhythm and ruins your speed. Therefore, try to maintain a calm and steady tempo. Hit each key cleanly before speeding up.
              </p>

              <h3>Practice for Indian Government Exams</h3>
              <p>
                Many administrative jobs require a strict typing test. For example, candidates must type at 30 to 35 WPM under exam conditions. Our system includes exam presets like SSC CHSL and CGL. By practicing with our realistic mock layouts, you can ensure success and qualify for your official exams.
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
