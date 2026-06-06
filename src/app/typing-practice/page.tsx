import { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { PracticeView } from '@/components/views/practice-view';

export const metadata: Metadata = {
  title: 'Typing Practice | Improve Typing Accuracy',
  description: 'Daily typing practice is the best way to improve your WPM. Drill your weak keys and practice typing efficiently with Centerville.',
  alternates: {
    canonical: 'https://centerville-typing.vercel.app/typing-practice',
  },
};

export default function TypingPracticePage() {
  return (
    <AppLayout 
      seoTitle="Typing Practice Hub"
      seoDescription="Consistent typing practice is the only way to build muscle memory and increase your typing speed. Use our Weak Keys drill mode to practice the exact letters you struggle with the most."
    >
      <PracticeView />
    </AppLayout>
  );
}
