import { useState, useEffect, useCallback } from 'react';
import { requestNotificationPermission } from '../services/serviceWorker';

export type PermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

export function useNotificationPermission() {
  const [permission, setPermission] = useState<PermissionState>(() => {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission as PermissionState;
  });

  // Keep in sync if the user changes permission in browser settings
  useEffect(() => {
    if (!('permissions' in navigator)) return;
    let desc: PermissionStatus;
    navigator.permissions.query({ name: 'notifications' }).then((status) => {
      desc = status;
      const update = () => setPermission(status.state === 'prompt' ? 'default' : status.state as PermissionState);
      status.addEventListener('change', update);
    });
    return () => {
      if (desc) desc.removeEventListener('change', () => {});
    };
  }, []);

  const request = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermission(result as PermissionState);
    return result;
  }, []);

  return { permission, request };
}
