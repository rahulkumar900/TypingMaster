'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { AuthGuard } from '@/components/auth-guard';
import { ProfileView } from '@/components/views/profile-view';
import { useAuth } from '@/context/auth-context';
import { useConfig } from '@/context/config-context';
import { useTypingEngine } from '@/hooks/use-typing-engine';

export default function ProfileClient() {
  const { user, updateUser, logout } = useAuth();
  const config = useConfig();
  const engine = useTypingEngine(config);

  return (
    <AuthGuard>
      <AppLayout>
        {user && (
          <ProfileView 
            user={user} 
            onUpdateAvatar={(url) => {
              updateUser({ avatarUrl: url });
            }}
            history={engine.testHistory}
            onLogout={logout}
          />
        )}
      </AppLayout>
    </AuthGuard>
  );
}
