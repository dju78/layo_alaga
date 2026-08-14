import db from '@/lib/db';
import { BusinessSettings, DEFAULT_SETTINGS } from './settings-types';

export * from './settings-types';

/**
 * Fetch all business settings from the database (ApplicationSetting table),
 * merging over DEFAULT_SETTINGS for missing keys.
 */
export async function getBusinessSettings(): Promise<BusinessSettings> {
  try {
    const records = await db.applicationSetting.findMany();
    const settingsMap = { ...DEFAULT_SETTINGS };

    for (const record of records) {
      if (record.key in settingsMap) {
        (settingsMap as any)[record.key] = record.value;
      }
    }

    return settingsMap;
  } catch (error) {
    console.warn('Failed to load settings from database, using defaults:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Upsert business settings into ApplicationSetting table.
 */
export async function updateBusinessSettings(
  updatedSettings: Partial<BusinessSettings>
): Promise<BusinessSettings> {
  const entries = Object.entries(updatedSettings);

  for (const [key, value] of entries) {
    if (value !== undefined && value !== null) {
      const strVal = String(value).trim();
      await db.applicationSetting.upsert({
        where: { key },
        update: { value: strVal },
        create: { key, value: strVal },
      });
    }
  }

  return await getBusinessSettings();
}
