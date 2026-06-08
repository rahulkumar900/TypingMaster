import { Metadata } from 'next';
import Play1vs1Client from './play-1vs1-client';

export const metadata: Metadata = {
  title: 'Play 1vs1 Typing Race | Compete in Real-Time',
  description: 'Enter a 1v1 multiplayer typing race and compete head-to-head. Prove you have the fastest hands and check your typing ratings live.',
  alternates: {
    canonical: 'https://typingthunder.com/play-1vs1',
  },
};

export default function Play1vs1Page() {
  return <Play1vs1Client />;
}
