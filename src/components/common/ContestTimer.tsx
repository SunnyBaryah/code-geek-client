import { useState, useEffect } from "react";
import clockIcon from "/clock-icon.svg";
const ContestTimer = ({
  className,
  endTime,
}: {
  className: string;
  endTime: string;
}) => {
  const [remainingTime, setRemainingTime] = useState(() => {
    const time = new Date();
    const utcLocalTime = new Date(
      time.getTime() - time.getTimezoneOffset() * 60000
    ).toISOString();
    const local_time = new Date(utcLocalTime).getTime();
    return new Date(endTime).getTime() - local_time;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date();
      const utcLocalTime = new Date(
        time.getTime() - time.getTimezoneOffset() * 60000
      ).toISOString();
      const local_time = new Date(utcLocalTime).getTime();
      setRemainingTime(new Date(endTime).getTime() - local_time);
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [endTime]);

  // Convert remaining time from milliseconds to a readable format
  const formatTime = (ms: number) => {
    if (ms <= 0) return "00:00:00";

    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours} : ${minutes} : ${seconds}`;
  };

  return (
    <div className={`${className} gap-2`}>
      <img src={clockIcon} className="w-[40px]" />
      <p
        className={`bg-gray-600 px-3 py-1 rounded-md text-white flex justify-center items-center`}
      >
        {remainingTime > 0 ? `${formatTime(remainingTime)}` : "Contest Ended"}
      </p>
    </div>
  );
};

export default ContestTimer;
