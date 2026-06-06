import { Metadata } from 'next';
import RatingsClient from './ratings-client';

export const metadata: Metadata = {
  title: 'Ratings & Leaderboard | Typing Master Standings',
  description: 'View the global typing rankings and ratings. Check who holds the highest WPM and accuracy records in our typing community.',
  alternates: {
    canonical: 'https://centerville-typing.vercel.app/ratings',
  },
};

export default function RatingsPage() {
  return <RatingsClient />;
}
