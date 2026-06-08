import { Metadata } from 'next';
import SphereClient from './sphere-client';

export const metadata: Metadata = {
  title: 'Sphere Room | TypingMaster',
  description: 'Join a private custom typing room.',
};

import { Suspense } from 'react';

export default async function SphereRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0c0d12] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[var(--accent-color)] border-t-transparent animate-spin"></div></div>}>
      <SphereClient roomId={resolvedParams.roomId} />
    </Suspense>
  );
}
