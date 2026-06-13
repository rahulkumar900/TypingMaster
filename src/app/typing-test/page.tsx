import { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';
import { SeoContentSection } from '@/components/seo/seo-content-section';
import { InternalLinks } from '@/components/seo/internal-links';

export const metadata: Metadata = {
  title: 'Typing Test | Check WPM and Accuracy',
  description: 'A beautiful, minimalist typing test that tracks your words per minute and error rate. Practice typing in 14 regional languages with our free tool.',
  alternates: {
    canonical: 'https://typingthunder.com/typing-test',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "TypingThunder Typing Test",
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
          "name": "What is a typing test?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A typing test measures how fast and accurately you can type. It calculates your Words Per Minute (WPM) by dividing the number of characters typed by five."
          }
        },
        {
          "@type": "Question",
          "name": "How can I improve my typing speed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Improving your typing speed requires practicing touch typing, maintaining proper posture, looking at the screen instead of the keyboard, and taking typing practice tests regularly."
          }
        }
      ]
    }
  ]
};

export default function TypingTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppLayout 
        seoTitle="Free Typing Test"
        seoDescription="Take a quick typing test to measure your WPM and accuracy. Our minimalist, ad-free typing test supports English and 13 Indian regional languages."
        seoContent={
          <>
            <SeoContentSection title="The Ultimate Guide to Typing Tests">
              <p>
                Taking a <strong>typing test</strong> is the best way to determine your baseline typing speed and accuracy. Whether you are applying for a data entry job, pursuing a career in programming, or preparing for an SSC typing exam in Hindi, understanding your current Words Per Minute (WPM) is the first step toward improvement.
              </p>

              <h3>Why Typing Speed is Critical in the Modern World</h3>
              <p>
                In today's digital economy, your keyboard is your primary tool for communication and creation. Improving your typing speed is highly important because:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>It Saves Hundreds of Hours:</strong> A person typing at 60 WPM will finish a 3,000-word report in 50 minutes. A person at 30 WPM will take nearly two hours. Over a year, this translates to weeks of saved time.</li>
                <li><strong>Reduces Cognitive Load:</strong> When you touch type automatically via muscle memory, your brain is freed from searching for keys. This allows you to focus 100% of your cognitive power on the <em>content</em> you are creating, resulting in better code, better writing, and fewer mental blocks.</li>
                <li><strong>Required for Government & Corporate Jobs:</strong> High-stakes roles, especially state and central government clerical jobs (SSC, High Court), mandate strict typing exams in both English and Regional languages (Hindi/Marathi) with zero tolerance for high error rates.</li>
              </ul>
              
              <h3>The Mathematics of a Typing Test: Formulas Explained</h3>
              <p>
                Have you ever wondered exactly how your score is calculated? TypingThunder uses the strict international standard for calculating WPM and errors. Here are the exact formulas:
              </p>
              
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 my-4 space-y-6 font-mono text-sm">
                <div>
                  <span className="text-yellow-500 font-bold text-base mb-2 block">1. Gross Words</span>
                  <p className="text-zinc-400 mt-1 mb-3 font-sans">In typing math, a "word" is exactly 5 characters, including spaces. A 10-letter word counts as 2 words.</p>
                  <div className="bg-zinc-900/80 rounded p-3 flex items-center border border-zinc-800/50 text-zinc-300 w-fit">
                    <span className="mr-3 font-semibold">Gross Words =</span>
                    <div className="inline-flex flex-col items-center justify-center">
                      <span className="border-b border-zinc-500 pb-1 px-2">Total Keystrokes</span>
                      <span className="pt-1 px-2">5</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-blue-400 font-bold text-base mb-2 block">2. Gross WPM (Raw Speed)</span>
                  <p className="text-zinc-400 mt-1 mb-3 font-sans">Your speed without penalizing for mistakes.</p>
                  <div className="bg-zinc-900/80 rounded p-3 flex items-center border border-zinc-800/50 text-zinc-300 w-fit">
                    <span className="mr-3 font-semibold">Gross WPM =</span>
                    <div className="inline-flex flex-col items-center justify-center">
                      <span className="border-b border-zinc-500 pb-1 px-2">Gross Words</span>
                      <span className="pt-1 px-2">Time (in minutes)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-red-400 font-bold text-base mb-2 block">3. Net WPM (True Speed)</span>
                  <p className="text-zinc-400 mt-1 mb-3 font-sans">Your actual, usable typing speed after removing errors.</p>
                  <div className="bg-zinc-900/80 rounded p-3 flex items-center border border-zinc-800/50 text-zinc-300 w-fit">
                    <span className="mr-3 font-semibold">Net WPM =</span>
                    <span>Gross WPM</span>
                    <span className="mx-2">−</span>
                    <div className="inline-flex flex-col items-center justify-center">
                      <span className="border-b border-zinc-500 pb-1 px-2">Uncorrected Errors</span>
                      <span className="pt-1 px-2">Time (in minutes)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-green-400 font-bold text-base mb-2 block">4. Accuracy Percentage</span>
                  <p className="text-zinc-400 mt-1 mb-3 font-sans">The ratio of correct inputs to total inputs.</p>
                  <div className="bg-zinc-900/80 rounded p-3 flex items-center border border-zinc-800/50 text-zinc-300 w-fit">
                    <span className="mr-3 font-semibold">Accuracy % =</span>
                    <span className="mr-2">(</span>
                    <div className="inline-flex flex-col items-center justify-center">
                      <span className="border-b border-zinc-500 pb-1 px-2">Correct Keystrokes</span>
                      <span className="pt-1 px-2">Total Keystrokes</span>
                    </div>
                    <span className="ml-2">)</span>
                    <span className="mx-2">×</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              <h3>Understanding Errors and Penalties</h3>
              <p>
                Not all mistakes are created equal. Depending on the test mode (especially in regional language government exams), errors are heavily penalized.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Corrected Errors:</strong> Mistakes you make but immediately fix using the backspace key. These do not drop your Accuracy or Net WPM, but they do waste valuable time, thereby lowering your Gross WPM.</li>
                <li><strong>Uncorrected Errors:</strong> Mistakes you leave in the text when the test ends. These violently drop your Net WPM (usually a 1-word penalty per uncorrected error).</li>
                <li><strong>Extra/Missed Characters:</strong> Typing a letter that wasn't there, or skipping a letter entirely. Both count as a full error for that specific word.</li>
              </ul>

              <h3>Typing Speed Benchmarks: Where Do You Stand?</h3>
              <p>
                Curious about how your WPM compares to the rest of the world? Here is a general breakdown of typing speeds across different skill levels:
              </p>
              
              <div className="overflow-x-auto my-6">
                <table className="w-full text-left border-collapse border border-zinc-800 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-zinc-900 text-zinc-300">
                      <th className="p-3 border-b border-zinc-800">Skill Level</th>
                      <th className="p-3 border-b border-zinc-800">WPM Range</th>
                      <th className="p-3 border-b border-zinc-800">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-zinc-400">
                    <tr>
                      <td className="p-3 border-b border-zinc-800 font-semibold text-white">Beginner</td>
                      <td className="p-3 border-b border-zinc-800">10 - 30 WPM</td>
                      <td className="p-3 border-b border-zinc-800">Often uses the "hunt and peck" method. Needs to look at the keyboard constantly.</td>
                    </tr>
                    <tr className="bg-zinc-900/30">
                      <td className="p-3 border-b border-zinc-800 font-semibold text-white">Average</td>
                      <td className="p-3 border-b border-zinc-800">40 - 50 WPM</td>
                      <td className="p-3 border-b border-zinc-800">The global average. Can touch type basic words without looking down.</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-zinc-800 font-semibold text-white">Professional</td>
                      <td className="p-3 border-b border-zinc-800">60 - 80 WPM</td>
                      <td className="p-3 border-b border-zinc-800">Required for most coding, transcription, or data entry jobs. High accuracy.</td>
                    </tr>
                    <tr className="bg-zinc-900/30">
                      <td className="p-3 border-b border-zinc-800 font-semibold text-white">Elite</td>
                      <td className="p-3 border-b border-zinc-800">100+ WPM</td>
                      <td className="p-3 border-b border-zinc-800">Competitive typists with near 100% accuracy and complete muscle memory.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>5 Actionable Tips to Improve Your Typing Test Score</h3>
              <p>
                Don't just take tests blindly. Follow these structured tips to see rapid improvement in both your English and Regional Language (Hindi Mangal/Krutidev) typing tests:
              </p>
              <ol className="list-decimal pl-6 space-y-3 mb-6">
                <li><strong>Master the Home Row:</strong> Always rest your fingers on `ASDF` (left hand) and `JKL;` (right hand). Your index fingers should feel the small physical bumps on the `F` and `J` keys to orient yourself without looking.</li>
                <li><strong>Never Look Down:</strong> Looking at the keyboard breaks your concentration and destroys your speed. If you make a mistake, trust your fingers to find the backspace key.</li>
                <li><strong>Focus on Accuracy First:</strong> Do not try to type fast. Try to type <em>perfectly</em>. Speed is a natural byproduct of flawless accuracy.</li>
                <li><strong>Use the Right Hardware:</strong> A good mechanical keyboard or a high-quality laptop keyboard with tactile feedback can significantly reduce missed keystrokes.</li>
                <li><strong>Practice Daily:</strong> Typing is pure muscle memory. 15 minutes of focused practice every day yields much better results than 2 hours of practice once a week.</li>
              </ol>

              <h3 className="mt-10 mb-4 border-b border-zinc-800 pb-2">Frequently Asked Questions (FAQ)</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-white">What is a typing test?</h4>
                  <p className="text-zinc-400 mt-1">A typing test measures how fast and accurately you can type. It calculates your Words Per Minute (WPM) by dividing the total number of characters typed by five.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">How can I improve my typing speed?</h4>
                  <p className="text-zinc-400 mt-1">Improving your typing speed requires daily touch typing practice, maintaining proper wrist posture, looking at the screen instead of the keyboard, and prioritizing 100% accuracy over raw speed.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">Is a Hindi typing test harder than an English one?</h4>
                  <p className="text-zinc-400 mt-1">It depends on your familiarity. Hindi typing (especially on government-standard legacy fonts like Krutidev or modern Mangal layouts) requires complex modifier keys for matras and half-characters, resulting in a steeper learning curve than standard English QWERTY typing.</p>
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
