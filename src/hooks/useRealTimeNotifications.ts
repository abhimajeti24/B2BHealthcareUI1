import { useEffect, useRef } from 'react';
import { useNotificationStore } from '../store/notificationStore';

const SIMULATED_ALERTS = [
  { title: 'Lab Result Ready', body: 'Complete blood count for Patricia Adams is ready for review', type: 'reminder' as const },
  { title: 'Medication Alert', body: 'Scheduled medication for Thomas Brown (Room 508B) is due in 30 minutes', type: 'reminder' as const },
  { title: 'New Admission', body: 'Emergency admission: male, 67, chest pain — ETA 10 mins to Ward 2', type: 'alert' as const },
  { title: 'Vital Signs Alert', body: 'Patient Nancy White (ICU-07) O₂ saturation dropped to 88%', type: 'alert' as const },
];

// Simulates a real-time push channel — in production this would be a WebSocket or SSE connection
export function useRealTimeNotifications(enabled: boolean) {
  const { addNotification } = useNotificationStore();
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      const alert = SIMULATED_ALERTS[indexRef.current % SIMULATED_ALERTS.length];
      addNotification(alert);
      indexRef.current += 1;
    }, 45000); // fire every 45s to simulate real-time stream

    return () => clearInterval(interval);
  }, [enabled, addNotification]);
}
