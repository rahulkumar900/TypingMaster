import { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';

export const metadata: Metadata = {
  title: 'Online Typing Test | Check Your WPM Free',
  description: 'Take our free online typing test to measure your words per minute (WPM). Get real-time feedback and detailed analytics to improve your typing speed online.',
  alternates: {
    canonical: 'https://centerville-typing.vercel.app/online-typing-test',
  },
};

export default function OnlineTypingTestPage() {
  return (
    <AppLayout 
      seoTitle="Online Typing Test"
      seoDescription="Centerville is a premium, free online typing test designed to help you check your words per minute (WPM) and accuracy online in real-time. Practice today to improve your typing mechanics."
    >
      <SpeedTestView />
    </AppLayout>
  );
}
