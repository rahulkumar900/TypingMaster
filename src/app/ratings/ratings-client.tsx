'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { AuthGuard } from '@/components/auth-guard';
import { LeaderboardView } from '@/components/views/leaderboard-view';
import { useAuth } from '@/context/auth-context';

export default function RatingsClient() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <AppLayout>
        <LeaderboardView user={user || undefined} />
      </AppLayout>
    </AuthGuard>
  );
}
