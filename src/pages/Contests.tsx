import contestService from "@/services/contest";
import { useEffect, useState } from "react";
// import ProblemCard from "../components/common/ProblemCard";
import { Skeleton } from "@/components/ui/skeleton";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/store/store";
// import { setProblems } from "@/store/problemsSlice";
import { motion } from "framer-motion";
import { Contest } from "@/interfaces/Contest";
import ContestCard from "@/components/common/ContestCard";

export default function ContestsPage() {
  const [allContests, setAllContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const contestsFetcher = async () => {
      setLoading(true);
      let data;
      // if (stateData.length > 0) {
      //   // console.log("State Data : ", stateData);
      //   data = stateData;
      //   setAllContests(data);
      // } else {
      data = await contestService.getAllContests();
      // dispatch(setProblems(data.data.data.foundProblem));
      setAllContests(data.data.data.foundContest);
      // }
      //   console.log(allProblems);
      setLoading(false);
    };
    contestsFetcher();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-center my-4 text-white text-4xl font-semibold">
        Weekly Contests
      </h1>
      <div className="flex-col w-[80%] xl:w-[60%] mx-auto py-4 rounded-md bg-gray-800 min-h-[80vh] max-h-[80vh] overflow-auto shadow-md">
        {loading ? (
          <div className="flex flex-col gap-5">
            <Skeleton className="w-[80%] mx-auto h-[35px] bg-gray-600" />
            <Skeleton className="w-[80%] mx-auto h-[35px] bg-gray-600" />
          </div>
        ) : allContests.length > 0 ? (
          allContests.map((oneProb: Contest) => {
            const contest = {
              id: oneProb.id,
              end_time: oneProb.end_time,
              start_time: oneProb.start_time,
            };
            return (
              <div
                className="w-[80%] hover:scale-105 transition duration-200 my-4 mx-auto bg-gray-600 rounded-md"
                key={oneProb.id}
              >
                <ContestCard className="" contest={contest} />
              </div>
            );
          })
        ) : (
          <div>
            <h1 className="text-center my-4 text-white text-3xl font-semibold">
              No Contests Found!
            </h1>
          </div>
        )}
      </div>
    </motion.div>
  );
}
