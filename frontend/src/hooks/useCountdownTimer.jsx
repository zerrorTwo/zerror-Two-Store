import { useEffect, useState } from "react";

function useCountdownTimer() {
  const targetTime = new Date().getTime() + 3600 * 1000; // 1 hour from now

  const calculateTimeLeft = () => {
    const currentTime = new Date().getTime();
    const difference = targetTime - currentTime;

    if (difference > 0) {
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft((prev) => {
        // Only update state if the values have changed
        if (
          prev.hours !== newTime.hours ||
          prev.minutes !== newTime.minutes ||
          prev.seconds !== newTime.seconds
        ) {
          return newTime;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}

export default useCountdownTimer;
