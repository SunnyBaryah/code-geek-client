import { Link } from "react-router-dom";
import { ContestCardProps } from "@/interfaces/ContestCardProps";
import Button from "./Button";
import { useEffect, useState } from "react";
export default function ContestCard(props: ContestCardProps) {
  const start_time = new Date(props.contest.start_time);
  const end_time = new Date(props.contest.end_time);
  const local_start_time = new Date(start_time).getTime();
  const local_end_time = new Date(end_time).getTime();
  const time = new Date();
  const utcLocalTime = new Date(
    time.getTime() - time.getTimezoneOffset() * 60000
  ).toISOString();
  const local_time = new Date(utcLocalTime).getTime();
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

  const [remainingTime, setRemainingTime] = useState(() => {
    const time = new Date();
    const utcLocalTime = new Date(
      time.getTime() - time.getTimezoneOffset() * 60000
    ).toISOString();
    const local_time = new Date(utcLocalTime).getTime();
    if (new Date(start_time).getTime() - local_time > 0) {
      return new Date(start_time).getTime() - local_time;
    }
    return new Date(end_time).getTime() - local_time;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date();
      const utcLocalTime = new Date(
        time.getTime() - time.getTimezoneOffset() * 60000
      ).toISOString();
      const local_time = new Date(utcLocalTime).getTime();
      if (new Date(start_time).getTime() - local_time > 0) {
        setRemainingTime(new Date(start_time).getTime() - local_time);
      } else {
        setRemainingTime(new Date(end_time).getTime() - local_time);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [start_time]);
  // console.log("Local Start time : ", local_start_time);
  // console.log("Local End time : ", local_end_time);
  // console.log("Local time : ", local_time);
  return (
    <Link
      to={`/contests/${props.contest.id}`}
      className="text-sm lg:text-md xl:text-lg"
    >
      <button disabled={local_start_time > local_time} className="w-[100%]">
        <div
          className={`${props.className} text-white flex gap-2 justify-between items-center rounded-md py-3 px-3`}
        >
          <h1 className="font-semibold">{`Weekly Contest ${props.contest.id}`}</h1>
          <div className="flex gap-2 justify-end md:gap-5 items-center md:justify-center flex-wrap">
            <Link to={`/contests/${props.contest.id}/rankings`}>
              <Button
                disabled={local_start_time > local_time}
                className="bg-[#FFC100] text-black px-2 py-1 rounded-md"
              >
                <p className="text-center">Rankings</p>
              </Button>
            </Link>
            <p
              className={
                local_end_time < local_time
                  ? `text-red-600 ml-auto font-semibold`
                  : local_start_time > local_time
                  ? `text-yellow-600 ml-auto font-semibold`
                  : `text-green-600 ml-auto font-semibold`
              }
            >
              {local_end_time < local_time
                ? "Ended"
                : local_start_time > local_time
                ? "Upcoming"
                : "Active"}
            </p>
          </div>
        </div>
        <div className="w-[80%] mx-auto text-white">
          {local_end_time < local_time ? null : local_start_time >
            local_time ? (
            <div className="flex justify-center gap-2 py-2 bg-gray-700 rounded-md mb-2">
              <p>Starts in : </p>
              <div>{formatTime(remainingTime)}</div>
            </div>
          ) : (
            <div className="flex justify-center gap-2 py-2 bg-gray-700 rounded-md mb-2">
              <p>Ends in : </p>
              <div>{formatTime(remainingTime)}</div>
            </div>
          )}
        </div>
      </button>
    </Link>
  );
}
