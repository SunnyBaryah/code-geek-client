import ContestTimer from "@/components/common/ContestTimer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Contest } from "@/interfaces/Contest";
import contestService from "@/services/contest";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import hamburgerIcon from "/hamburger-icon.svg";
import problemService from "@/services/problem";
import { Problem } from "@/interfaces/Problem";
import { QuestionData } from "@/interfaces/QuestionData";
import { motion } from "framer-motion";
import Question from "@/components/common/Question";
import ContestSubmissions from "@/components/common/ContestSubmissions";
import ContestEditor from "@/components/common/ContestEditor";

export default function ContestPage() {
  const [contest, setContest] = useState<Contest | undefined>(undefined);
  const [selectedProbIndex, setSelectedProbIndex] = useState<number>(0);
  const [problem, setProblem] = useState<Problem>();
  const [question, setQuestion] = useState<QuestionData | undefined>(undefined);
  const [leftIndex, setLeftIndex] = useState<number>(0);

  const id: number = Number(useParams().contestId);

  useEffect(() => {
    const changeQuestion = async () => {
      if (contest) {
        // console.log(contest.end_time);
        const content = await problemService.getProblem(
          contest.question_ids[selectedProbIndex]
        );
        setProblem(content.data.data.foundProblem[0]);
      }
    };
    changeQuestion();
  }, [contest, selectedProbIndex]);

  useEffect(() => {
    const contestFetcher = async () => {
      const content = await contestService.getContest(id);
      setContest(content.data.data.foundContest[0]);
    };
    contestFetcher();
  }, [id]);

  useEffect(() => {
    if (problem) {
      setQuestion({
        title: problem.title,
        id: problem.id,
        description: problem.description,
        difficulty: problem.difficulty,
        constraints: problem.constraints,
        examples: problem.examples,
      });
    }
  }, [problem]);

  return (
    <div>
      <div className="flex w-[95%] xl:w-[80%] mx-auto justify-between py-3 px-2">
        <Sheet>
          <SheetTrigger className="w-[10%] flex justify-center items-center bg-[#FFC100] rounded-md hover:bg-[#e2ba41] hover:text-[#FFC100] transition duration-200">
            <img src={hamburgerIcon} className="w-[25px]" />
          </SheetTrigger>
          <SheetContent
            side={"left"}
            className="bg-gray-200 border border-gray-600"
          >
            <SheetHeader>
              <SheetTitle>Problems</SheetTitle>
              <div className="flex flex-col justify-center w-full">
                {contest &&
                  contest.question_ids.length > 0 &&
                  contest?.question_ids.map((_, index) => (
                    <button
                      key={index}
                      className={`w-full py-1 px-2 mb-2 rounded-md transition duration-200 hover:bg-gray-400 hover:scale-105 ${
                        selectedProbIndex === index
                          ? "bg-gray-600 text-[#FFC100]"
                          : "bg-white"
                      } `}
                      onClick={() => setSelectedProbIndex(index)}
                    >
                      {`Problem ${index + 1}`}
                    </button>
                  ))}
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        {contest && (
          <ContestTimer
            className="w-[90%] flex justify-center"
            endTime={contest?.end_time}
          />
        )}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 100 }}
        exit={{ opacity: 0 }}
        className="w-[95%] xl:w-[80%] mx-auto flex flex-wrap justify-between"
      >
        <div className="w-full lg:w-[34%] xl:w-[34%] 2xl:w-[34%] bg-gray-800 rounded-md mt-2 text-white">
          <div className="flex gap-2 items-center py-2 px-3">
            <button
              className={`${
                leftIndex === 0 ? "text-gray-200 bg-gray-600" : "text-gray-400"
              } 
                    hover:text-gray-200 hover:bg-gray-600 transition rounded-md px-2 py-1`}
              onClick={() => {
                setLeftIndex(0);
              }}
            >
              Description
            </button>
            <p className="text-gray-500">|</p>
            <button
              className={`${
                leftIndex === 1 ? "text-gray-200 bg-gray-600" : "text-gray-400"
              } 
                    hover:text-gray-200 hover:bg-gray-600 transition rounded-md px-2 py-1`}
              onClick={() => {
                setLeftIndex(1);
              }}
            >
              Submissions
            </button>
          </div>
          {leftIndex === 0 && question && <Question question={question} />}
          {contest && leftIndex === 1 && (
            <ContestSubmissions
              question_id={contest.question_ids[selectedProbIndex]}
              contest_id={contest?.id}
            />
          )}
        </div>
        <div className="w-full lg:w-[65%] pb-2 lg:pb-0">
          {contest && problem && (
            <ContestEditor
              problem_id={contest.question_ids[selectedProbIndex]}
              contest_id={contest.id}
              end_time={contest.end_time}
              start_time={contest.start_time}
              problem_description={problem.description}
              problem_title={problem.title}
              difficulty={problem.difficulty}
              test_cases={problem.test_cases}
              className=""
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
