import { cookies } from 'next/headers';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

const ADMIN_SESSION_COOKIE = 'alaga_admin_session';

export interface AdminUserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function verifyAdminPassword(password: string, passwordHash: string): Promise<boolean> {
  return await bcrypt.compare(password, passwordHash);
}

export async function createAdminSession(user: AdminUserSession) {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify(user);
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getAdminSession(): Promise<AdminUserSession | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!cookie?.value) return null;
    return JSON.parse(cookie.value) as AdminUserSession;
  } catch (error) {
    return null;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
