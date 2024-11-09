import problemService from "../services/problem";
import { useEffect, useState } from "react";
import ProblemCard from "../components/common/ProblemCard";
import { Problem } from "../interfaces/Problem";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProblemsPage() {
  const [allProblems, setAllProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const problemsFetcher = async () => {
      setLoading(true);
      const response = await problemService.getAllProblems();
      setAllProblems(response.data.data.foundProblem);
    //   console.log(allProblems);
      setLoading(false);
    };
    problemsFetcher();
  }, []);

  return (
    <div>
      <h1 className="text-center my-4 text-white text-4xl font-semibold">
        DSA Problems
      </h1>
      <div className="flex-col w-[60%] mx-auto py-4 rounded-md bg-gray-800 min-h-[80vh] max-h-[80vh] overflow-auto shadow-md">
        {loading ? (
          <div className="flex flex-col gap-5">
            <Skeleton className="w-[80%] mx-auto h-[35px] bg-gray-600" />
            <Skeleton className="w-[80%] mx-auto h-[35px] bg-gray-600" />
          </div>
        ) : allProblems.length > 0 ? (
          allProblems.map((oneProb: Problem) => {
            const problem = {
              id: oneProb.id,
              title: oneProb.title,
              difficulty: oneProb.difficulty,
            };
            return (
              <div
                className="w-[80%] hover:scale-105 transition duration-200 my-4 mx-auto bg-gray-600 rounded-md"
                key={oneProb.id}
              >
                <ProblemCard className="" problem={problem} />
              </div>
            );
          })
        ) : (
          <div>
            <h1 className="text-center my-4 text-white text-3xl font-semibold">
              No Problems Found!
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
