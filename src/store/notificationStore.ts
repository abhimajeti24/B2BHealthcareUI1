import { create } from 'zustand';
import type { NotificationItem } from '../types';
import { showLocalNotification } from '../services/serviceWorker';

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (n: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const INITIAL: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Critical Alert',
    body: 'Patient Robert Martinez vitals require immediate attention',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    type: 'alert',
  },
  {
    id: 'n2',
    title: 'Lab Results Ready',
    body: 'Lab results for Nancy White are available for review',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    type: 'reminder',
  },
  {
    id: 'n3',
    title: 'Appointment Reminder',
    body: 'Dr. Chen has 5 consultations starting at 9:00 AM today',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    read: true,
    type: 'info',
  },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: INITIAL,
  unreadCount: INITIAL.filter((n) => !n.read).length,

  addNotification: (n) => {
    const newItem: NotificationItem = {
      ...n,
      id: `n${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((state) => ({
      notifications: [newItem, ...state.notifications].slice(0, 50),
      unreadCount: state.unreadCount + 1,
    }));
    // Also show browser notification via SW
    showLocalNotification(n.title, { body: n.body });
  },

  markRead: (id) => {
    const { notifications } = get();
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    set({ notifications: updated, unreadCount: updated.filter((n) => !n.read).length });
  },

  markAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
