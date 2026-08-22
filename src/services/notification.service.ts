// Early Warning Notification Service
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface NotificationItem {
  id: string;
  userId: string;
  requestId?: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  read: boolean;
  createdAt: string;
}

export class NotificationService {
  /**
   * Dispatches an early warning notification to a user or admin queue
   */
  static async sendNotification(params: {
    userId: string;
    requestId?: string;
    title: string;
    message: string;
    type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  }): Promise<NotificationItem> {
    const item: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: params.userId,
      requestId: params.requestId,
      title: params.title,
      message: params.message,
      type: params.type,
      read: false,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('notifications').insert({
          user_id: item.userId,
          request_id: item.requestId,
          title: item.title,
          message: item.message,
          type: item.type,
        });
      } catch (err) {
        console.warn('[NotificationService] Supabase insert failed:', err);
      }
    }

    return item;
  }

  /**
   * Fetches user notifications
   */
  static async getUserNotifications(userId: string): Promise<NotificationItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(d => ({
            id: d.id,
            userId: d.user_id,
            requestId: d.request_id,
            title: d.title,
            message: d.message,
            type: d.type,
            read: d.read,
            createdAt: d.created_at,
          }));
        }
      } catch (err) {
        console.warn('[NotificationService] Fetch error:', err);
      }
    }

    return [];
  }
}
