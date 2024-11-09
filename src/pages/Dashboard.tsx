import { useEffect } from "react";
import authService from "@/services/auth";
import { useState } from "react";
import { useSelector } from "react-redux";
import avatar from "/user-square-icon.svg";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { RootState } from "../store/store";

interface SolvedQuestions {
  problem_id: number;
  problem_title: string;
  difficulty: string;
}
export default function Dashboard() {
  const [solvedQuestions, setSolvedQuestions] = useState<SolvedQuestions[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const userData:{username:string; email:string;} = useSelector((state:RootState) => state.auth.userData) || { username: "", email: "" };;
  // console.log(userData);
  useEffect(() => {
    const getSolvedQuestions = async () => {
      const response = await authService.getSolvedProblems();
      setSolvedQuestions(response?.data.data);
      setLoading(false);
    };
    getSolvedQuestions();
  }, []);
  return (
    <div className="text-white py-4 mx-auto w-[80%] h-[60vh] grid grid-cols-3 grid-rows-2 gap-2">
      <div className="h-full px-2 col-span-1 bg-gray-800 row-span-1 rounded-md">
        <div className="text-center py-3">
          <h1 className="font-semibold text-3xl">User Details</h1>
        </div>
        <div className="h-[60%] w-full flex items-center justify-center gap-4">
          <div className="h-full flex justify-center items-center">
            <img className="h-[90%] rounded-md" src={avatar} />
          </div>
          <div className="flex flex-col items-start justify-center">
            <h1 className="font-semibold text-xl">{userData.username}</h1>
            <h2 className="text-gray-300">{userData.email}</h2>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-10 col-span-2 bg-gray-800 py-4 row-span-1 rounded-md">
        <h1 className="text-center font-semibold text-3xl">Current Progress</h1>
        {loading ? (
          <div className="w-full flex flex-col gap-6 justify-center items-center">
            <Skeleton className="bg-gray-700 w-[80%] h-[20px]" />
            <Skeleton className="bg-gray-700 w-[80%] h-[20px]" />
          </div>
        ) : (
          <div className="flex flex-col gap-8 pb-1">
            <div className="w-[60%] mx-auto flex gap-6 items-center">
              <Progress
                className=""
                value={
                  solvedQuestions && solvedQuestions.length > 0
                    ? (solvedQuestions.length / 5) * 100
                    : 0
                }
              />
              <p className="text-gray-300">
                {solvedQuestions && solvedQuestions.length > 0
                  ? Math.floor((solvedQuestions.length / 5) * 100)
                  : 0}
                %
              </p>
            </div>
            <div className="text-center text-gray-300">
              <p>
                Total{" "}
                {solvedQuestions && solvedQuestions.length > 0
                  ? solvedQuestions.length
                  : 0}{" "}
                out of 5 DSA problems solved
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-2 col-span-3 bg-gray-800 row-span-1 rounded-md h-[50vh] max-h-[50vh] overflow-auto">
        <h1 className="font-semibold text-3xl pt-4 pb-3">Solved Problems</h1>
        <div className="flex flex-col gap-3 w-full">
          {loading ? (
            <div className="my-2 w-full flex flex-col justify-center items-center">
              <Skeleton className="bg-gray-700 w-[80%] h-[60px]" />
            </div>
          ) : solvedQuestions && solvedQuestions.length > 0 ? (
            solvedQuestions.map((question: SolvedQuestions, index: number) => {
              return (
                <Link key={index} to={`/problems/${question.problem_id}`}>
                  <div className="w-[80%] mx-auto flex justify-between bg-gray-600 px-3 py-2 rounded-md hover:scale-105 transition duration-200">
                    <h1>
                      {question.problem_id}. {question.problem_title}
                    </h1>
                    <h1
                      className={`font-semibold ${
                        question.difficulty == "Easy"
                          ? "text-green-600"
                          : question.difficulty == "Medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {question.difficulty}
                    </h1>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="mt-4 text-center">
              <h1 className="text-xl text-gray-500">No problems solved yet!</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
