// import React from "react";
import { useParams } from "react-router-dom";
import MonacoEditor from "../components/common/Editor.tsx";
import Question from "../components/common/Question.tsx";
import problemService from "../services/problem.ts";

import { useEffect, useState } from "react";
import { Problem } from "../interfaces/Problem.ts";
import { QuestionData } from "../interfaces/QuestionData.ts";
import Submissions from "../components/common/Submissions.tsx";

export default function ProblemPage() {
  const [problem, setProblem] = useState<Problem | undefined>(undefined);
  const [question, setQuestion] = useState<QuestionData | undefined>(undefined);
  const [leftIndex, setLeftIndex] = useState<number>(0);
  const id: number = Number(useParams().problemId);
  // const id:{problemId:AxiosRequestConfig<number>}=useParams();
  // console.log(id);
  useEffect(() => {
    const problemFetcher = async () => {
      const content = await problemService.getProblem(id);
      setProblem(content.data.data.foundProblem[0]);
    };
    problemFetcher();
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
    <div className="w-[95%] xl:w-[80%] mx-auto flex flex-wrap justify-between">
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
        {leftIndex === 1 && <Submissions />}
      </div>
      <div className="w-full lg:w-[65%] pb-2 lg:pb-0">
        {problem && (
          <MonacoEditor
            problem_title={problem.title}
            difficulty={problem.difficulty}
            test_cases={problem.test_cases}
            className=""
          />
        )}
      </div>
    </div>
  );
}
