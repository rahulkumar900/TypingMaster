import { Metadata } from 'next';
import SphereClient from './sphere-client';

export const metadata: Metadata = {
  title: 'Sphere Rooms | Custom Private Typing Rooms',
  description: 'Create private custom typing rooms, invite friends to join via share code, chat in real-time, and run multitrack speed races.',
  alternates: {
    canonical: 'https://typingthunder.com/sphere',
  },
};

import { Suspense } from 'react';

export default function SpherePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0c0d12] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div></div>}>
      <SphereClient />
    </Suspense>
  );
}
