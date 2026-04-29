import { useEffect } from 'react';
import { onAuthChange } from '../services/firebase';
import { useAuthStore } from '../store/authStore';

export function useAuthListener() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, [setUser, setLoading]);
}
