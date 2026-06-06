'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { AuthGuard } from '@/components/auth-guard';
import { SphereView } from '@/components/views/sphere-view';
import { useAuth } from '@/context/auth-context';
import { useConfig } from '@/context/config-context';

export default function SphereClient() {
  const { user } = useAuth();
  const config = useConfig();

  return (
    <AuthGuard>
      <AppLayout>
        {user && <SphereView user={user} config={config} />}
      </AppLayout>
    </AuthGuard>
  );
}
