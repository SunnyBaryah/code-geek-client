import problemService from "../services/problem";
import { useEffect, useState } from "react";
import ProblemCard from "../components/common/ProblemCard";
import { Problem } from "../interfaces/Problem";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setProblems } from "@/store/problemsSlice";
import { motion } from "framer-motion";
export default function ProblemsPage() {
  const [allProblems, setAllProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const stateData = useSelector((state: RootState) => state.problems.problems);
  useEffect(() => {
    const problemsFetcher = async () => {
      setLoading(true);
      let data;
      if (stateData.length > 0) {
        // console.log("State Data : ", stateData);
        data = stateData;
        setAllProblems(data);
      } else {
        data = await problemService.getAllProblems();
        dispatch(setProblems(data.data.data.foundProblem));
        setAllProblems(data.data.data.foundProblem);
      }
      //   console.log(allProblems);
      setLoading(false);
    };
    problemsFetcher();
  }, [dispatch, stateData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-center my-4 text-white text-4xl font-semibold">
        DSA Problems
      </h1>
      <div className="flex-col w-[80%] xl:w-[60%] mx-auto py-4 rounded-md bg-gray-800 min-h-[80vh] max-h-[80vh] overflow-auto shadow-md">
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
    </motion.div>
  );
}
