import { Metadata } from 'next';
import { TypingApp } from '@/components/typing-app';

export const metadata: Metadata = {
  title: 'Online Typing Test | Check Your WPM Free',
  description: 'Take our free online typing test to measure your words per minute (WPM). Get real-time feedback and detailed analytics to improve your typing speed online.',
  alternates: {
    canonical: 'https://centerville-typing.vercel.app/online-typing-test',
  },
};

export default function OnlineTypingTestPage() {
  return (
    <TypingApp 
      initialTab="test"
      seoTitle="Online Typing Test"
      seoDescription="Centerville is a premium, free online typing test designed to help you check your words per minute (WPM) and accuracy online in real-time. Practice today to improve your typing mechanics."
    />
  );
}
