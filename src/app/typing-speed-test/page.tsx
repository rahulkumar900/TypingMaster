import { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';

export const metadata: Metadata = {
  title: 'Typing Speed Test | Calculate Your True WPM',
  description: 'Our typing speed test accurately calculates your gross and net Words Per Minute (WPM). Build lightning-fast keyboard speed with targeted practice modes.',
  alternates: {
    canonical: 'https://centerville-typing.vercel.app/typing-speed-test',
  },
};

export default function TypingSpeedTestPage() {
  return (
    <AppLayout 
      seoTitle="Typing Speed Test"
      seoDescription="Welcome to the Centerville Typing Speed Test. We calculate your true WPM (Words Per Minute) using strict error penalties so you know exactly how fast your fingers fly across the keyboard."
    >
      <SpeedTestView />
    </AppLayout>
  );
}
