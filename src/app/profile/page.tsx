import { Metadata } from 'next';
import ProfileClient from './profile-client';

export const metadata: Metadata = {
  title: 'My Profile | Typing Speed and Statistics Dashboard',
  description: 'Access your profile and detailed history. Analyze typing speed milestones, errors, accuracy, and key fatigue trends.',
  alternates: {
    canonical: 'https://typingthunder.com/profile',
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
