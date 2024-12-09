import { useEffect, useState } from 'react';
import { optionsForAPI } from '../../OptionsForAPI';

export const FetchGuest = () => {
  const [guestToken, setGuestToken] = useState<string>('');

  const fetchToken = async () => {
    try {
      const response = await fetch('https://api.themoviedb.org/3/authentication/token/new', optionsForAPI);
      const data = await response.json();
      console.log(data);
      setGuestToken(data.request_token);
    } catch (error) {
      console.error('Failed to fetch genres:', error);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);


  console.log(guestToken);
  console.log(`https://www.themoviedb.org/authenticate/${guestToken}`);
};
