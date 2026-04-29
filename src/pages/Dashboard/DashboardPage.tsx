import { useEffect, useMemo, useState } from 'react';
import { BellRing, X } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useNotificationPermission } from '../../hooks/useNotificationPermission';
import { APPOINTMENTS, ACTIVITY_FEED, PATIENTS } from '../../data/mockData';
import type { ActivityItem } from '../../types';

const SEVERITY_DOT: Record<NonNullable<ActivityItem['severity']>, string> = {
  error: 'bg-red-500',
  warning: 'bg-amber-400',
  info: 'bg-zinc-400',
  success: 'bg-green-500',
};

export default function DashboardPage() {
  const { addNotification } = useNotificationStore();
  const { permission, request } = useNotificationPermission();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => addNotification({
      title: 'Vital Sign Alert',
      body: 'Patient William Taylor (ICU-02) showing abnormal heart rate — 142 bpm',
      type: 'alert',
    }), 8000);
    return () => clearTimeout(t);
  }, [addNotification]);

  const critical = useMemo(() => PATIENTS.filter(p => p.status === 'Critical'), []);

  return (
    <div className="max-w-5xl space-y-6">
      {/* Notification permission nudge */}
      {permission === 'default' && !dismissed && (
        <div className="flex items-center gap-3 text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-4 py-2.5">
          <BellRing size={13} className="flex-shrink-0" />
          <span className="flex-1">Enable push notifications to get real-time clinical alerts.</span>
          <button onClick={() => request()} className="font-medium underline underline-offset-2 hover:no-underline">
            Enable
          </button>
          <button onClick={() => setDismissed(true)} className="text-amber-500 hover:text-amber-800 ml-1">
            <X size={12} />
          </button>
        </div>
      )}

      {/* Stat bar — replaces the 4-card KPI grid */}
      <div className="bg-white border border-zinc-200 rounded px-6 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-4">
          Overview · Today
        </p>
        <div className="flex items-end gap-10">
          <Stat value="1,284" label="Total patients" />
          <div className="w-px h-8 bg-zinc-100" />
          <Stat value="3" label="Critical" valueClass="text-red-600" />
          <div className="w-px h-8 bg-zinc-100" />
          <Stat value="47" label="Appointments" />
          <div className="w-px h-8 bg-zinc-100" />
          <Stat value="94.2%" label="Recovery rate" />
          <div className="w-px h-8 bg-zinc-100" />
          <Stat value="82%" label="Bed occupancy" />
        </div>
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Activity log — 2 cols, no card wrapper on the list */}
        <div className="col-span-2 bg-white border border-zinc-200 rounded">
          <div className="px-5 pt-4 pb-3 border-b border-zinc-100 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              Activity log
            </p>
            <span className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              live
            </span>
          </div>
          <div>
            {ACTIVITY_FEED.map(item => {
              const sev = item.severity ?? 'info';
              return (
                <div key={item.id} className="flex items-start gap-4 px-5 py-3 border-b border-zinc-50 hover:bg-zinc-50/60 transition-colors last:border-0">
                  <span className="text-[11px] font-mono text-zinc-400 w-16 flex-shrink-0 pt-0.5 leading-none">{item.time}</span>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px] ${SEVERITY_DOT[sev]}`} />
                  <p className="text-[13px] text-zinc-700 leading-snug flex-1">{item.message}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Schedule */}
          <div className="bg-white border border-zinc-200 rounded">
            <div className="px-4 pt-4 pb-3 border-b border-zinc-100">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                Schedule
              </p>
            </div>
            <div>
              {APPOINTMENTS.map(appt => (
                <div key={appt.id} className="flex items-start gap-3 px-4 py-3 border-b border-zinc-50 last:border-0">
                  <span className="text-[11px] font-mono text-zinc-400 w-10 flex-shrink-0 pt-0.5">{appt.time.split(' ')[0]}</span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-zinc-800 truncate">{appt.patientName}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{appt.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical */}
          <div className="bg-white border border-zinc-200 rounded">
            <div className="px-4 pt-4 pb-3 border-b border-zinc-100 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                Critical watch
              </p>
              <span className="text-[11px] font-mono text-red-500">{critical.length}</span>
            </div>
            <div>
              {critical.map(p => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3 border-b border-zinc-50 last:border-0">
                  <div>
                    <p className="text-[13px] font-medium text-zinc-800">{p.name}</p>
                    <p className="text-[11px] text-zinc-400">{p.condition}</p>
                  </div>
                  <span className="text-[11px] font-mono text-red-500 flex-shrink-0 ml-2">{p.roomNumber}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label, valueClass = 'text-zinc-900' }: { value: string; label: string; valueClass?: string }) {
  return (
    <div>
      <p className={`text-2xl font-semibold tracking-tight ${valueClass}`}>{value}</p>
      <p className="text-[11px] text-zinc-400 mt-0.5">{label}</p>
    </div>
  );
}
