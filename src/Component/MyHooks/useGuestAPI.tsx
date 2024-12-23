/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { optionsApiForGet } from '../WorkWithAPI/urlAndOptions';

const guestSessionUrl: string = 'https://api.themoviedb.org/3/authentication/guest_session/new';

interface State {
  guest_session_id: string;
  success: boolean;
}

const useGuestAPI = () => {
  const [sessionId, setSessionId] = useState<string>('');

  const getGuestSessionId = async (): Promise<void> => {
    if (sessionId || sessionStorage.getItem('sessionId')) return;

    try {
      const response = await fetch(guestSessionUrl, optionsApiForGet);
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      const data: State = await response.json();

      if (data.success) {
        sessionStorage.setItem('sessionId', data.guest_session_id);
      } else {
        throw new Error('Ошибка при загрузке гостевой сессии');
      }
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('sessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      getGuestSessionId();
    }
  }, []);

  return null;
};

export { useGuestAPI };
