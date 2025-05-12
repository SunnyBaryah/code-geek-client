// import { ContestSubmission } from "@/interfaces/ContestSubmission";
import contestSubmissionService from "@/services/contestSubmission";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
interface Submission {
  user_id: string;
  question_id: number;
  submission_time_taken: number;
  username: string;
}

interface UserSubmissionData {
  username: string;
  user_id: string;
  maxSubmissionTime: number;
  questionTimeMap: Map<number, number>;
}

interface UserSubmissionResult {
  username: string;
  user_id: string;
  distinctQuestionsCount: number;
  maxSubmissionTime: number;
}

export default function ContestRankings() {
  const contest_id = Number(useParams().contestId);
  const [loading, setLoading] = useState<Boolean>(false);
  const [data, setData] = useState<UserSubmissionResult[]>();

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00:00";

    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const remainingSeconds = String(Math.floor(seconds % 60)).padStart(2, "0");

    return `${hours} : ${minutes} : ${remainingSeconds}`;
  };

  useEffect(() => {
    const allSubmissionsFetcher = async () => {
      setLoading(true);

      try {
        const response = await contestSubmissionService.getContestSubmissions(
          contest_id
        );

        if (!response) {
          toast.error("Error while fetching submissions");
          return;
        }

        const submissions: Submission[] = response.data.data;

        // Step 1: Group submissions by user_id and retain the fastest submission per question_id
        const groupedData: Record<string, UserSubmissionData> = {};

        submissions.forEach(
          ({ user_id, question_id, submission_time_taken, username }) => {
            if (!groupedData[user_id]) {
              groupedData[user_id] = {
                username,
                user_id,
                questionTimeMap: new Map<number, number>(), // { question_id -> min(submission_time_taken) }
                maxSubmissionTime: 0,
              };
            }

            const questionTimeMap = groupedData[user_id].questionTimeMap;

            // Keep the lowest submission_time_taken for each question_id
            if (
              !questionTimeMap.has(question_id) ||
              questionTimeMap.get(question_id)! > submission_time_taken
            ) {
              questionTimeMap.set(question_id, submission_time_taken);
            }
          }
        );

        // Step 2: Convert grouped object to an array, calculate distinct count, and find max submission time
        const sortedData: UserSubmissionResult[] = Object.values(groupedData)
          .map(({ username, user_id, questionTimeMap }) => {
            const distinctQuestionsCount = questionTimeMap.size;
            const maxSubmissionTime = Math.max(...questionTimeMap.values()); // Get max submission time among retained ones

            return {
              username,
              user_id,
              distinctQuestionsCount,
              maxSubmissionTime,
            };
          })
          .sort(
            (a, b) =>
              b.distinctQuestionsCount - a.distinctQuestionsCount || // Higher is better
              a.maxSubmissionTime - b.maxSubmissionTime // Lower is better
          );

        console.log("Sorted data : ", sortedData);

        // Step 3: Set data state
        setData(sortedData);
      } catch (error) {
        toast.error("Error while fetching submissions");
        console.error(error);
      }

      setLoading(false);
    };

    allSubmissionsFetcher();
  }, []);
  return (
    <motion.div>
      <h1 className="text-white text-center my-5 font-semibold text-4xl">
        Contest Rankings
      </h1>
      {loading ? (
        <div className="flex flex-col gap-5">
          <Skeleton className="w-[80%] mx-auto h-[35px] bg-gray-600" />
          <Skeleton className="w-[80%] mx-auto h-[35px] bg-gray-600" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="bg-gray-600 w-[90%] md:w-[80%] mx-auto rounded-md p-2 sm:p-4 md:p-9 max-h-[80vh] overflow-auto">
          <div className="grid grid-cols-3 gap-2 text-[#FFC100] text-base md:text-3xl mb-4">
            <p className="text-center">Username</p>
            <p className="text-center">Questions Solved</p>
            <p className="text-center">Time taken</p>
          </div>
          {data.map((personRecord, index) => (
            <div
              key={index}
              className="text-base text-gray-300 md:text-xl my-2 grid grid-cols-3 gap-2"
            >
              <p className="text-center">
                {index + 1}. {personRecord.username}
              </p>
              <p className="text-center">
                {personRecord.distinctQuestionsCount}
              </p>
              <p className="text-center">
                {formatTime(personRecord.maxSubmissionTime)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h1 className="text-gray-300 text-center my-5 font-semibold text-2xl bg-gray-600 w-[80%] mx-auto rounded-md py-5">
            No participants!
          </h1>
        </div>
      )}
    </motion.div>
  );
}
