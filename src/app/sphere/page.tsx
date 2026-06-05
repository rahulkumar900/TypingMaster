import { Metadata } from 'next';
import { TypingApp } from '@/components/typing-app';

export const metadata: Metadata = {
  title: 'Sphere Rooms | Custom Private Typing Rooms',
  description: 'Create private custom typing rooms, invite friends to join via share code, chat in real-time, and run multitrack speed races.',
  alternates: {
    canonical: 'https://centerville-typing.vercel.app/sphere',
  },
};

export default function SpherePage() {
  return (
    <TypingApp 
      initialTab="sphere"
      seoTitle="Sphere Multiplayer Typing Rooms"
      seoDescription="Welcome to Sphere Mode. Create custom private typing rooms for you and your friends, chat, customize presets, and compete in multiplayer typing races."
    />
  );
}
