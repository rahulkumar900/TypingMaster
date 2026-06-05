import { Metadata } from 'next';
import { TypingApp } from '@/components/typing-app';

export const metadata: Metadata = {
  title: 'My Profile | Typing Speed and Statistics Dashboard',
  description: 'Access your profile and detailed history. Analyze typing speed milestones, errors, accuracy, and key fatigue trends.',
  alternates: {
    canonical: 'https://centerville-typing.vercel.app/profile',
  },
};

export default function ProfilePage() {
  return (
    <TypingApp 
      initialTab="profile"
      seoTitle="User Profile & Stats Dashboard"
      seoDescription="Track your typing journey. View your complete performance history, average speed progression, and details of past runs."
    />
  );
}
