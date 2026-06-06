import { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';

export const metadata: Metadata = {
  title: 'Typing Test | Check WPM and Accuracy',
  description: 'A beautiful, minimalist typing test that tracks your words per minute and error rate. Practice typing in 14 regional languages with our free tool.',
  alternates: {
    canonical: 'https://centerville-typing.vercel.app/typing-test',
  },
};

export default function TypingTestPage() {
  return (
    <AppLayout 
      seoTitle="Free Typing Test"
      seoDescription="Take a quick typing test to measure your WPM and accuracy. Our minimalist, ad-free typing test supports English and 13 Indian regional languages."
    >
      <SpeedTestView />
    </AppLayout>
  );
}
