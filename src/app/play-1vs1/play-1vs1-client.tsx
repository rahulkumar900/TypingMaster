'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { AuthGuard } from '@/components/auth-guard';
import { Lobby1v1View } from '@/components/views/lobby-1v1-view';
import { useAuth } from '@/context/auth-context';
import { useConfig } from '@/context/config-context';

export default function Play1vs1Client() {
  const { user } = useAuth();
  const config = useConfig();

  return (
    <AuthGuard>
      <AppLayout>
        {user && <Lobby1v1View user={user} config={config} />}
      </AppLayout>
    </AuthGuard>
  );
}
