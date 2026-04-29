export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[SW] Service Workers not supported in this browser');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('[SW] Registered successfully, scope:', registration.scope);
    return registration;
  } catch (err) {
    console.error('[SW] Registration failed:', err);
    return null;
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('[SW] Notifications not supported');
    return 'denied';
  }
  if (Notification.permission === 'granted') return 'granted';
  const permission = await Notification.requestPermission();
  return permission;
}

export async function showLocalNotification(
  title: string,
  options: NotificationOptions & { body: string }
): Promise<void> {
  const permission = await requestNotificationPermission();
  if (permission !== 'granted') return;

  const reg = await navigator.serviceWorker.ready;
  await reg.showNotification(title, {
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: `healthos-${Date.now()}`,
    ...options,
  });
}

export async function subscribeToPush(
  registration: ServiceWorkerRegistration,
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
    return subscription;
  } catch (err) {
    console.error('[SW] Push subscription failed:', err);
    return null;
  }
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}
