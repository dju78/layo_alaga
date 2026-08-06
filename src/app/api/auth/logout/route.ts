import { NextResponse } from 'next/server';
import { clearAdminSession, getAdminSession } from '@/lib/auth';
import db from '@/lib/db';

export async function POST() {
  try {
    const session = await getAdminSession();
    if (session) {
      await db.auditLog.create({
        data: { userId: session.id, userEmail: session.email, action: 'LOGOUT', targetResource: 'auth', details: '{}' },
      });
    }
    await clearAdminSession();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
