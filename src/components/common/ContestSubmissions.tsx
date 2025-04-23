import { ContestSubmission } from "@/interfaces/ContestSubmission.ts";
import contestSubmissionService from "@/services/contestSubmission.ts";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Skeleton } from "../ui/skeleton.tsx";
import { AnimatePresence, motion } from "framer-motion";
export default function ContestSubmissions({
  contest_id,
  question_id,
}: {
  contest_id: number;
  question_id: number;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ContestSubmission[]>();

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchContestSubmissions = async () => {
      let dataToDisplay;
      dataToDisplay =
        await contestSubmissionService.getContestQuestionSubmissions(
          contest_id,
          question_id
        );
      if (!dataToDisplay) {
        toast.error("Error while fetching submissions");
      } else {
        setData(dataToDisplay.data.data);
      }

      // console.log(allSubmissions?.data.data);
      setLoading(false);
      // console.log(submissions);
    };
    fetchContestSubmissions();
  }, [question_id]);
  return (
    <AnimatePresence>
      {loading === true ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 100 }}
          exit={{ opacity: 0 }}
          className="flex flex-col justify-center items-center gap-4 my-2"
        >
          <Skeleton className="bg-gray-700 w-[90%] h-[35px]" />
          <Skeleton className="bg-gray-700 w-[90%] h-[35px]" />
        </motion.div>
      ) : data && data.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 100 }}
          exit={{ opacity: 0 }}
          className="flex flex-col w-full border-t-2 border-gray-900 max-h-[50vh] lg:max-h-[77vh] overflow-auto"
        >
          <div className="flex justify-between w-full px-4 py-2 border-b border-gray-600">
            <h1 className="font-bold">Status</h1>
            <h3 className="font-bold">Time taken</h3>
          </div>
          {data.map((submission: ContestSubmission, index: number) => {
            // console.log(submission);
            return (
              <div
                key={index}
                className="flex justify-between w-full px-4 py-4 border-b border-gray-600"
              >
                <h1
                  className={`${
                    submission.status === "Accepted"
                      ? "text-green-600"
                      : "text-red-600"
                  } font-semibold`}
                >
                  {submission.status}
                </h1>
                <h3>{formatTime(submission.submission_time_taken)}</h3>
              </div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 100 }}
          exit={{ opacity: 0 }}
          className="flex justify-center py-4"
        >
          <h1 className="text-2xl">No Submissions!</h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
