import SettingsClient from './SettingsClient';
import { getBusinessSettings } from '@/lib/settings';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Business Settings & Security | Admin – Alaga Alayo',
};

export default async function SettingsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const settings = await getBusinessSettings();

  return <SettingsClient initialSettings={settings} session={session} />;
}
