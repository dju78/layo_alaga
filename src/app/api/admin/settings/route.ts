import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getBusinessSettings, updateBusinessSettings, BusinessSettings } from '@/lib/settings';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await getBusinessSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access. Please log in.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Basic validation
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 });
    }

    const updatedSettings = await updateBusinessSettings(body as Partial<BusinessSettings>);

    // Revalidate paths for immediate updates
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/settings');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({
      ok: true,
      settings: updatedSettings,
      message: 'Settings saved successfully',
    });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save settings to database' },
      { status: 500 }
    );
  }
}
