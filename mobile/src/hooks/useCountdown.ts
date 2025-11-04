import { useEffect, useState } from 'react';

const getRemaining = (targetDate: string | null) => {
  if (!targetDate) return 0;
  return new Date(targetDate).getTime() - Date.now();
};

export const useCountdown = (targetDate: string | null) => {
  const [remaining, setRemaining] = useState(() => getRemaining(targetDate));

  useEffect(() => {
    if (!targetDate) {
      setRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      setRemaining(getRemaining(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (remaining <= 0) {
    return { hours: '00', minutes: '00', seconds: '00', isExpired: true };
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return { hours, minutes, seconds, isExpired: false };
};
