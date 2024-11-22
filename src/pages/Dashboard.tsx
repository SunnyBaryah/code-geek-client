import { useEffect } from "react";
import authService from "@/services/auth";
import { useState } from "react";
import { useSelector } from "react-redux";
import avatar from "/user-square-icon.svg";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { RootState } from "../store/store";
import problemService from "@/services/problem";
import { useDispatch } from "react-redux";
import { setProblems } from "@/store/problemsSlice";

interface SolvedQuestions {
  problem_id: number;
  problem_title: string;
  difficulty: string;
}
export default function Dashboard() {
  const dispatch = useDispatch();
  const [solvedQuestions, setSolvedQuestions] = useState<SolvedQuestions[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [progressLoading, setProgressLoading] = useState<boolean>(true);
  const [problemCount, setProblemCount] = useState<number>(0);
  const stateData = useSelector((state: RootState) => state.problems.problems);
  const userData: { username: string; email: string } = useSelector(
    (state: RootState) => state.auth.userData
  ) || { username: "", email: "" };
  // console.log(userData);

  useEffect(() => {
    const problemsFetcher = async () => {
      setProgressLoading(true);
      let data;
      if (stateData.length > 0) {
        // console.log("State Data : ", stateData);
        data = stateData;
        setProblemCount(data.length);
      } else {
        data = await problemService.getAllProblems();
        dispatch(setProblems(data.data.data.foundProblem));
        setProblemCount(data.data.data.foundProblem.length);
      }
      //   console.log(allProblems);
      setProgressLoading(false);
    };
    problemsFetcher();
  }, [dispatch, stateData]);

  useEffect(() => {
    const getSolvedQuestions = async () => {
      const response = await authService.getSolvedProblems();
      setSolvedQuestions(response?.data.data);
      setLoading(false);
    };
    getSolvedQuestions();
  }, []);
  return (
    <div className="text-white py-4 mx-auto w-[95%] xl:w-[80%] flex flex-wrap justify-between xl:gap-2">
      <div className="mb-4 w-full lg:w-[40%] px-2 col-span-1 bg-gray-800 row-span-1 rounded-md">
        <div className="text-center py-3">
          <h1 className="font-semibold text-3xl">User Details</h1>
        </div>
        <div className="w-full flex items-center justify-center lg:mt-3 2xl:mt-1 gap-4">
          <div className="w-[30%] md:w-[20%] xl:w-[35%] 2xl:w-[30%] flex justify-center items-center">
            <img className="rounded-md" src={avatar} />
          </div>
          <div className="flex flex-col items-start justify-center">
            <h1 className="font-semibold text-xl">{userData.username}</h1>
            <h2 className="text-gray-300">{userData.email}</h2>
          </div>
        </div>
      </div>
      <div className="mb-4 w-full lg:w-[59%] flex flex-col gap-12 xl:gap-16 2xl:gap-20 bg-gray-800 py-4 row-span-1 rounded-md">
        <h1 className="text-center font-semibold text-3xl">Current Progress</h1>
        {progressLoading ? (
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
                    ? (solvedQuestions.length / problemCount) * 100
                    : 0
                }
              />
              <p className="text-gray-300">
                {solvedQuestions && solvedQuestions.length > 0
                  ? Math.floor((solvedQuestions.length / problemCount) * 100)
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
                out of {problemCount} DSA problems solved
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex flex-col items-center gap-5  bg-gray-800 row-span-1 rounded-md h-[50vh] max-h-[50vh] overflow-auto">
        <h1 className="font-semibold text-3xl pt-4 pb-3">Solved Problems</h1>
        <div className="flex flex-col gap-3 w-full ">
          {loading ? (
            <div className="my-2 w-full flex flex-col justify-center items-center">
              <Skeleton className="bg-gray-700 w-[80%] h-[60px]" />
            </div>
          ) : solvedQuestions && solvedQuestions.length > 0 ? (
            solvedQuestions.map((question: SolvedQuestions, index: number) => {
              return (
                <Link key={index} to={`/problems/${question.problem_id}`}>
                  <div className="text-sm xl:text-lg w-[90%] xl:w-[80%] mx-auto flex justify-between bg-gray-600 px-3 py-2 rounded-md hover:scale-105 transition duration-200">
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
