import { AppLayout } from '@/components/layout/app-layout';
import { SpeedTestView } from '@/components/views/speed-test-view';

export default function Home() {
  return (
    <AppLayout>
      <SpeedTestView />
    </AppLayout>
  );
}
