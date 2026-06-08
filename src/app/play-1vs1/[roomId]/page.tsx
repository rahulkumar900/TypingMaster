import { Metadata } from 'next';
import Play1vs1Client from '../play-1vs1-client';

export const metadata: Metadata = {
  title: 'Play 1vs1 Typing Room | TypingThunder',
  description: 'Join a 1v1 multiplayer typing race and compete head-to-head.',
};

export default function Play1vs1RoomPage() {
  return <Play1vs1Client />;
}
