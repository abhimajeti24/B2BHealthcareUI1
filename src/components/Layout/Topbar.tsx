import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { Bell, BellOff, X, Check, Trash2, BellRing, ShieldAlert } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useNotificationPermission } from '../../hooks/useNotificationPermission';
import type { NotificationItem } from '../../types';

const DOT: Record<NotificationItem['type'], string> = {
  alert: 'bg-red-500',
  reminder: 'bg-amber-400',
  info: 'bg-blue-400',
};

const Topbar = memo(({ title }: { title: string }) => {
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotificationStore();
  const { permission, request } = useNotificationPermission();
  const [open, setOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [close]);

  const timeAgo = (iso: string) => {
    const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    return h < 24 ? `${h}h` : `${Math.floor(h / 24)}d`;
  };

  return (
    <header className="fixed top-0 left-52 right-0 h-12 bg-white border-b border-zinc-200 z-20 flex items-center px-6">
      <span className="text-[13px] font-medium text-zinc-900 flex-1">{title}</span>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(p => !p)}
          className={`relative h-7 w-7 flex items-center justify-center rounded transition-colors ${
            permission === 'denied' ? 'text-red-400 hover:bg-red-50' : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700'
          }`}
        >
          {permission === 'denied' ? <BellOff size={14} /> : <Bell size={14} />}
          {unreadCount > 0 && permission !== 'denied' && (
            <span className="absolute top-0.5 right-0.5 min-w-[14px] h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          {permission === 'default' && (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-amber-400 rounded-full border border-white" />
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-9 w-72 bg-white border border-zinc-200 shadow-lg rounded z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-100">
              <span className="text-[12px] font-semibold text-zinc-900">Notifications</span>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && <button onClick={markAllRead} className="text-[11px] text-blue-600 flex items-center gap-0.5"><Check size={10} /> All read</button>}
                <button onClick={clearAll} className="text-zinc-400 hover:text-zinc-600"><Trash2 size={11} /></button>
                <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-600"><X size={12} /></button>
              </div>
            </div>

            {permission === 'default' && (
              <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex gap-2.5">
                <BellRing size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[12px] font-medium text-amber-900">Enable push notifications</p>
                  <button
                    onClick={async () => { setRequesting(true); await request(); setRequesting(false); }}
                    disabled={requesting}
                    className="mt-1.5 text-[11px] font-medium bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-2.5 py-1 rounded transition-colors"
                  >
                    {requesting ? 'Requesting…' : 'Enable'}
                  </button>
                </div>
              </div>
            )}

            {permission === 'denied' && (
              <div className="px-4 py-3 bg-red-50 border-b border-red-100 flex gap-2.5">
                <ShieldAlert size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-red-700 leading-relaxed">
                  Notifications blocked. Enable in browser Site Settings.
                </p>
              </div>
            )}

            {permission === 'granted' && (
              <div className="px-4 py-2 border-b border-zinc-50 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <p className="text-[11px] text-zinc-400">Push notifications active</p>
              </div>
            )}

            <div className="max-h-64 overflow-y-auto divide-y divide-zinc-50">
              {notifications.length === 0
                ? <p className="text-center text-zinc-400 text-xs py-8">Nothing here</p>
                : notifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex gap-2.5 transition-colors ${!n.read ? 'bg-blue-50/20' : ''}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${!n.read ? DOT[n.type] : 'bg-zinc-200'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <p className="text-[12px] font-medium text-zinc-800 truncate">{n.title}</p>
                        <span className="text-[10px] text-zinc-400 flex-shrink-0 font-mono">{timeAgo(n.timestamp)}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">{n.body}</p>
                    </div>
                  </button>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </header>
  );
});

Topbar.displayName = 'Topbar';
export default Topbar;
