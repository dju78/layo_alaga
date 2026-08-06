import db from '@/lib/db';

export interface NotificationPayload {
  recipientEmail?: string;
  recipientPhone?: string;
  type: string;
  title: string;
  message: string;
  channel?: 'Email' | 'WhatsApp' | 'System';
}

export async function sendNotification(payload: NotificationPayload) {
  // Store notification in database log
  const notification = await db.notification.create({
    data: {
      recipientEmail: payload.recipientEmail || null,
      recipientPhone: payload.recipientPhone || null,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      channel: payload.channel || 'Email',
      status: 'SENT',
      sentAt: new Date(),
    },
  });

  // Log notification to console in mock/dev mode
  console.log(`[NOTIFICATION SENT] [${payload.channel || 'Email'}] to ${payload.recipientEmail || payload.recipientPhone}: ${payload.title}`);
  
  return notification;
}
