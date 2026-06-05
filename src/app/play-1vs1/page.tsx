import { Metadata } from 'next';
import { TypingApp } from '@/components/typing-app';

export const metadata: Metadata = {
  title: 'Play 1vs1 Typing Race | Compete in Real-Time',
  description: 'Enter a 1v1 multiplayer typing race and compete head-to-head. Prove you have the fastest hands and check your typing ratings live.',
  alternates: {
    canonical: 'https://centerville-typing.vercel.app/play-1vs1',
  },
};

export default function Play1vs1Page() {
  return (
    <TypingApp 
      initialTab="1v1"
      seoTitle="Play 1vs1 Real-time Typing Duel"
      seoDescription="Challenge other typing enthusiasts to a head-to-head typing duel. Our real-time matchmaking pairs you with a suitable opponent to test WPM and accuracy."
    />
  );
}
