import { Metadata } from 'next';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { PracticeView } from '@/components/views/practice-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Typing Practice | Improve Typing Accuracy',
  description: 'Daily typing practice is the best way to improve your WPM. Drill your weak keys and practice typing efficiently with TypingThunder.',
  alternates: {
    canonical: 'https://typingthunder.com/typing-practice',
  },
  openGraph: {
    url: 'https://typingthunder.com/typing-practice',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "TypingThunder Typing Practice",
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
          "name": "How much typing practice do I need daily?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Consistency is more important than duration. Practicing for 15-30 minutes every day is the most effective way to build the muscle memory required for fast <a href="https://en.wikipedia.org/wiki/Touch_typing" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">touch typing</a>."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best way to practice typing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best way is to focus entirely on accuracy first, not speed. Use targeted drill modes (like our Weak Keys feature) to practice the characters you struggle with most. Speed will naturally follow once your accuracy is near 100%."
          }
        }
      ]
    }
  ]
};

export default function TypingPracticePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLayout 
        seoTitle="Typing Practice Hub"
        seoDescription="Consistent typing practice is the only way to build muscle memory and increase your typing speed. Use our Weak Keys drill mode to practice the exact letters you struggle with the most."
        seoContent={
          <>
            <SeoContentSection title="The Ultimate Typing Practice Guide: English & Hindi">
              <p>
                Whether you're a beginner learning the home row or an advanced typist looking to break the 100 WPM barrier, consistent <strong>typing practice</strong> is the absolute key to success. Unlike riding a bike, high-speed touch typing is a perishable skill that requires regular fine-tuning. This applies equally whether you are typing in English or preparing for a rigorous Hindi typing exam.
              </p>

              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-zinc-800 my-8">
                <Image 
                  src="/images/typing-test-infographic.png" 
                  alt="Practicing a typing practice on TypingThunder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
              </div>
              
              <h3>Dual-Language Practice Strategies</h3>
              <p>
                TypingThunder is uniquely equipped to handle practice sessions across multiple languages and keyboard layouts. 
              </p>
              <ul>
                <li><strong>English Practice:</strong> Use our custom drills and Zen Mode to focus purely on the flow of your English strokes. Drill your weak keys and conquer complex punctuation effortlessly.</li>
                <li><strong>Hindi Practice (Mangal & Krutidev):</strong> Government exams (SSC, High Court, CPCT) demand extreme precision on specific layouts like InScript and Remington Gail. Our typing practice mode replicates the strict backspace constraints and phonetic rendering of these exact exams, giving you a completely authentic practice environment.</li>
              </ul>

              <h3>Building Muscle Memory</h3>
              <p>
                Touch typing is entirely based on muscle memory. When you first start typing practice, your brain has to consciously search for each letter. Through repetitive practice, that conscious effort transforms into subconscious reflexes. This is why we highly recommend our <em>Zen Mode</em> for un-timed, stress-free practice, allowing you to focus purely on the movement of your fingers.
              </p>
              
              <h3>How to Practice Effectively</h3>
              <ul>
                <li><strong>Prioritize Accuracy:</strong> Speed without accuracy is counterproductive. Slow down until you can hit 98% accuracy consistently, then slowly let your speed increase naturally.</li>
                <li><strong>Drill Your Weak Keys:</strong> Don't just type random texts. Use our smart analytics to find which specific keys slow you down (e.g., 'Z', 'X', 'P' or complex Hindi matras) and run targeted practice drills on those specific characters.</li>
                <li><strong>Maintain Good Posture:</strong> Keep your wrists slightly elevated, feet flat on the floor, and look directly at the screen—never at the keyboard!</li>
              </ul>

              <h3 className="mt-8 mb-4 border-b border-zinc-800 pb-2">Frequently Asked Questions (FAQ)</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-white">How much typing practice do I need daily?</h4>
                  <p className="text-zinc-400 mt-1">Consistency is more important than duration. Practicing for 15-30 minutes every day is the most effective way to build the muscle memory required for fast touch typing in any language.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">What is the best way to practice typing?</h4>
                  <p className="text-zinc-400 mt-1">The best way is to focus entirely on accuracy first, not speed. Use targeted drill modes (like our Weak Keys feature) to practice the characters you struggle with most. Speed will naturally follow once your accuracy is near 100%.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">Should I practice English and Hindi simultaneously?</h4>
                  <p className="text-zinc-400 mt-1">If your primary goal is passing a specific government exam, it is highly recommended to focus 80% of your practice time solely on the exam's required layout (e.g., Mangal InScript) to avoid confusing your muscle memory.</p>
                </div>
              </div>
            </SeoContentSection>
            <InternalLinks />
          </>
        }
      >
        <PracticeView />
      </AppLayout>
    </>
  );
}
