import { Metadata } from 'next';
import { TypingApp } from '@/components/typing-app';

export const metadata: Metadata = {
  title: 'Ratings & Leaderboard | Typing Master Standings',
  description: 'View the global typing rankings and ratings. Check who holds the highest WPM and accuracy records in our typing community.',
  alternates: {
    canonical: 'https://centerville-typing.vercel.app/ratings',
  },
};

export default function RatingsPage() {
  return (
    <TypingApp 
      initialTab="ratings"
      seoTitle="Global Typing Ratings & Leaderboards"
      seoDescription="Behold the fastest typists. Compare your stats, average WPM, and accuracy against the global ratings list powered by real-time run statistics."
    />
  );
}
