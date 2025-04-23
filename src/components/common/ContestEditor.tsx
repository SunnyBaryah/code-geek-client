import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import Button from "./Button.tsx";
import problemService from "../../services/problem.ts";
import runIcon from "/play-icon.svg";
import submitIcon from "/submit-icon.svg";
import DownwardIcon from "/angle-down.svg";
import codeIcon from "/code-web-icon.svg";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { BOILERPLATES } from "@/constants.ts";
import { BOILERPLATE } from "@/constants.ts";
import { OnMount } from "@monaco-editor/react";
import { editor as monacoEditor } from "monaco-editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContestEditorProps } from "@/interfaces/ContestEditorProps.ts";
import contestSubmissionService from "@/services/contestSubmission.ts";
import aiService from "@/services/ai.ts";

export default function ContestEditor(props: ContestEditorProps) {
  const monacoEditorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(
    null
  );
  const [value, setValue] = useState("");
  const [input, setInput] = useState<string>();
  const [expectedOutputs, setExpectedOutputs] = useState<string[]>([]);
  const [expectedOutput, setExpectedOutput] = useState<string>();
  const [output, setOutput] = useState<string>();
  const [outputs, setOutputs] = useState<string[]>([]);
  const [err, setErr] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [codeStatus, setCodeStatus] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [langCode, setLangCode] = useState<number>(54);

  const probId = props.problem_id;
  const problemCodesObject: BOILERPLATE = BOILERPLATES.find(
    (entry) => entry.problem_id === probId
  )!;
  const problemCodes = problemCodesObject.langs;

  const [remainingTime, setRemainingTime] = useState(() => {
    const time = new Date();
    const utcLocalTime = new Date(
      time.getTime() - time.getTimezoneOffset() * 60000
    ).toISOString();
    const local_time = new Date(utcLocalTime).getTime();
    return new Date(props.end_time).getTime() - local_time;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date();
      const utcLocalTime = new Date(
        time.getTime() - time.getTimezoneOffset() * 60000
      ).toISOString();
      const local_time = new Date(utcLocalTime).getTime();
      setRemainingTime(new Date(props.end_time).getTime() - local_time);
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [props.end_time]);

  useEffect(() => {
    switch (langCode) {
      case 54:
        setValue(problemCodes[0]);
        break;
      case 63:
        setValue(problemCodes[1]);
        break;
      default:
        setValue(problemCodes[2]);
    }
  }, [langCode, problemCodes]);

  useEffect(() => {
    setInput(props.test_cases[0].input);
    const unhiddenCases = props.test_cases.filter(
      (ele) => ele.isHidden === false
    );
    const exOutputs = unhiddenCases.map((ele) => ele.expected_output);
    setExpectedOutputs(exOutputs);
    setExpectedOutput(exOutputs[0]);
  }, [props.test_cases]);

  const onMount: OnMount = (editor) => {
    monacoEditorRef.current = editor;
    editor.focus();
  };

  const changeInput = (index: number) => {
    setSelectedIndex(index);
    setExpectedOutput(expectedOutputs[index]);
    setInput(props.test_cases[index].input);
    if (outputs.length > 0) setOutput(outputs[index]);
  };

  const getMostRepeatingElement = (arr: string[]): string => {
    if (arr.length === 0) return "";

    const frequencyMap: Record<string, number> = {};
    let maxCount = 0;
    let mostFrequentElement: string = "";

    for (const str of arr) {
      frequencyMap[str] = (frequencyMap[str] || 0) + 1;

      if (frequencyMap[str] > maxCount) {
        maxCount = frequencyMap[str];
        mostFrequentElement = str;
      }
    }

    return mostFrequentElement;
  };

  const handleRun = async () => {
    if (monacoEditorRef.current) {
      setLoading(true);
      const code = monacoEditorRef.current.getValue();
      const test_cases = props.test_cases;

      // console.log(test_cases);
      try {
        const response = await problemService.runTheCode({
          code,
          language_id: langCode,
          test_cases,
        });

        // console.log("All statuses : ", response.data.data.allStatuses);

        const stdouts: string[] = response.data.data.allStatuses
          .map((ele: { stdout: string }) =>
            ele.stdout !== null ? atob(ele.stdout) : null
          )
          .filter((op: string) => op !== null);
        // console.log("Outputs : ", stdouts);

        const stderr: string[] = response.data.data.allStatuses.map(
          (ele: { stderr: string }) =>
            ele.stderr !== null ? atob(ele.stderr) : null
        );

        const foundErrors = stderr.filter((op) => op !== null);
        if (foundErrors.length > 0) {
          setOutputs([]);
          setErr(stderr[0]);
        } else {
          const compilation_errors = response.data.data.allStatuses
            .map((ele: { compile_output: string }) =>
              ele.compile_output !== null ? atob(ele.compile_output) : null
            )
            .filter((op: string) => op !== null);
          if (compilation_errors.length > 0) {
            setOutputs([]);
            setErr(compilation_errors[0]);
          } else {
            setOutputs(stdouts);
            setOutput(stdouts[selectedIndex]);
            setErr("");
          }
        }

        const results: string[] = response.data.data.allStatuses
          .reduce(
            (
              acc: string[],
              curr: { status: { id: number; description: string } }
            ) => {
              acc.push(curr.status.description);
              return acc;
            },
            []
          )
          .filter((res: string) => res != "Accepted");
        // console.log("Results : ", results);

        setCodeStatus(
          results && results.length > 0
            ? getMostRepeatingElement(results)
            : "Accepted"
        );

        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        if (error.status) {
          toast.error(
            "Error: " +
              error.status +
              ", Server not able to run code now, please try after some time",
            { position: "bottom-center" }
          );
        } else {
          toast.error(
            "Server not able to run code now, please try after some time",
            { position: "bottom-center" }
          );
        }
      }
    }
  };

  const handleSubmit = async () => {
    // console.log("props : ", props);
    if (monacoEditorRef.current) {
      setLoading(true);

      const code = monacoEditorRef.current.getValue();
      const test_cases = props.test_cases;

      try {
        const response = await problemService.runTheCode({
          code,
          language_id: langCode,
          test_cases,
        });
        // console.log(response.data.data.allStatuses);
        const wrong = response.data.data.allStatuses.filter(
          (obj: { status: { id: number; description: string } }) => {
            // console.log(obj.status.id);
            return obj.status.id !== 3;
          }
        );
        // console.log(test_cases);
        // console.log(response.data.data.allStatuses);
        // console.log(wrong.length);
        let finalStatus = "";
        if (wrong.length == 0) {
          //plag check
          const prompt = "Give me a plagiarism score for this code : " + code;
          const response = await aiService.getPlagScore({ prompt });
          const score = response?.data.data.response;
          // console.log(score);
          if (Number(score) > 70) {
            finalStatus = "Accepted";
          } else {
            finalStatus = "Rejected! Copied Code";
          }
          // console.log(response);
        } else {
          finalStatus = "Wrong Answer";
        }
        // console.log("Final Status :", finalStatus);
        const time = new Date();
        const utcLocalTime = new Date(
          time.getTime() - time.getTimezoneOffset() * 60000
        ).toISOString();
        const local_time = new Date(utcLocalTime).getTime();

        await contestSubmissionService.postSubmission({
          question_id: probId,
          contest_id: props.contest_id,
          submission_time_taken:
            (local_time - new Date(props.start_time).getTime()) / 1000,
          code,
          status: finalStatus,
        });
        // console.log(submitResponse);
        setLoading(false);
        toast.success(`Code submitted, result : ${finalStatus}`, {
          position: "bottom-right",
        });
      } catch (error: any) {
        setLoading(false);
        if (error.status) {
          toast.error(
            "Error: " +
              error.status +
              ", Server not able to run code now, please try after some time",
            { position: "bottom-center" }
          );
        } else {
          toast.error(
            "Server not able to run code now, please try after some time",
            { position: "bottom-center" }
          );
        }
      }
    }
  };
  return (
    <div className={`mt-2  ${props.className}`}>
      <div className="w-full py-1 mb-2 flex justify-between items-center">
        <motion.button
          initial={{ width: "163px" }}
          animate={{
            width: loading ? "140px" : "163px", // Expand on running
            backgroundColor: loading ? "rgb(75,85,99)" : "rgb(75,85,99)", // Change color if needed
          }}
          transition={{ duration: 0.3 }}
          className=" text-white rounded-md flex items-center justify-center overflow-hidden"
        >
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-gray-300 py-1 flex items-center gap-2"
            >
              <span className="loading-spinner"></span>
              Running...
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className=""
            >
              <div className="flex">
                <div
                  className={`${
                    remainingTime < 0
                      ? "text-gray-700 hover:scale-100"
                      : "hover:scale-100 hover:bg-gray-700"
                  } flex items-center justify-center gap-2 border-r border-r-gray-700 bg-gray-600 transition duration-150 rounded-l-md px-2 py-1`}
                >
                  <Button
                    disabled={remainingTime < 0}
                    className={` ${
                      remainingTime < 0
                        ? "text-gray-700"
                        : "text-white hover:scale-100 hover:bg-gray-700"
                    }    flex justify-center items-center gap-2`}
                    onClick={handleRun}
                  >
                    <>
                      Run
                      {remainingTime > 0 && (
                        <img className="h-[20px]" src={runIcon} />
                      )}
                    </>
                  </Button>
                </div>
                <div
                  className={`${
                    remainingTime < 0
                      ? "text-gray-700 hover:scale-100"
                      : "hover:scale-100 hover:bg-gray-700"
                  } flex items-center gap-2 justify-center border-l border-l-gray-700 bg-gray-600 transition duration-150 rounded-r-md pl-2 pr-1`}
                >
                  <Button
                    disabled={remainingTime < 0}
                    className={`${
                      remainingTime < 0 ? "text-gray-700" : "text-white"
                    } hover:scale-100 flex justify-center items-center gap-2 `}
                    onClick={handleSubmit}
                  >
                    <>
                      Submit
                      {remainingTime > 0 && (
                        <img className="h-[20px]" src={submitIcon} />
                      )}
                    </>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.button>
        <div className="text-white flex gap-1 md:gap-5 ">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex justify-center items-center gap-2 bg-gray-600 hover:bg-gray-700 transition duration-200 text-white px-2 py-1 rounded-md">
              {langCode === 54 ? "C++" : langCode === 63 ? "JS" : "Python"}
              <img className="w-[25px]" src={DownwardIcon} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-700 text-white font-display">
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setLangCode(54);
                }}
              >
                C++
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setLangCode(63);
                }}
              >
                JavaScript
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setLangCode(71);
                }}
              >
                Python
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        className={`bg-gray-800 h-[60vh] shadow-sm mr-2 my-2 w-full rounded-md `}
      >
        <div className="text-white flex items-center gap-1 px-3 py-2">
          <img className="h-[25px]" src={codeIcon} />
          <h1>Code</h1>
        </div>
        <div className="mx-auto w-[99%] h-[90%]">
          <Editor
            theme="vs-dark"
            language={
              langCode === 54
                ? "cpp"
                : langCode === 63
                ? "javascript"
                : "python"
            }
            value={value}
            onMount={onMount}
            onChange={(value) => setValue(value ?? "")}
          />
        </div>
      </div>
      <div className="w-full bg-gray-800 text-white mr-2 rounded-md pt-1 pb-2 px-4 mt-2 max-h-40 overflow-auto">
        <AnimatePresence mode="wait">
          {loading == true ? (
            <motion.div
              key="loadingState"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }} // Keep height auto for loading state
              exit={{ opacity: 0, height: 0 }} // Collapse to 0
              transition={{ duration: 0.3 }}
              className=" py-6  text-gray-300 mt-2 flex justify-center items-center"
            >
              <span className="loading-spinner"></span>
              <span className="ml-2">Running tests...</span>
            </motion.div>
          ) : (
            <motion.ul
              initial={{ opacity: 1, height: "auto" }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} // Collapse height to 0
              transition={{ duration: 0.3 }}
              className="mt-2 pb-2"
            >
              {codeStatus && (
                <h1
                  className={`mb-3 text-2xl font-semibold ${
                    codeStatus.length > 0 ? "block" : "hidden"
                  } 
                    ${
                      codeStatus == "Accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  `}
                >
                  {codeStatus}
                </h1>
              )}
              {err !== "" ? (
                <div className="flex flex-col gap-2 justify-center items-start">
                  <h1 className="text-xl font-semibold w-full">Error :</h1>
                  <h2 className="w-full bg-red-700 rounded-lg px-3 py-2 text-red-300">
                    {err}
                  </h2>
                </div>
              ) : (
                <div>
                  <div className="flex gap-3 mb-5">
                    {props.test_cases &&
                      props.test_cases.map((test_case, index) => {
                        if (test_case.isHidden === false) {
                          return (
                            <button
                              key={index}
                              className={`py-1 px-2 rounded-md transition duration-200 ${
                                selectedIndex === index
                                  ? "bg-gray-600 text-white"
                                  : "text-gray-300 hover:bg-gray-600 hover:text-white"
                              }`}
                              onClick={() => changeInput(index)}
                            >
                              {`Case ${index + 1} `}
                            </button>
                          );
                        }
                        return null;
                      })}
                  </div>
                  <div className="flex flex-col gap-2 justify-center items-center">
                    <h3 className="font-semibold w-full">Input : </h3>
                    <h3 className="text-gray-200 bg-gray-600 flex-grow pl-1 pr-2 py-2 rounded-md w-full">
                      {input}
                    </h3>
                  </div>
                  <div className="mt-2 flex flex-col gap-2 justify-center items-center">
                    <h3 className="font-semibold w-full">Expected Output : </h3>
                    <h3 className="text-gray-200 bg-gray-600 flex-grow pl-1 pr-2 py-2 rounded-md w-full">
                      {expectedOutput}
                    </h3>
                  </div>
                </div>
              )}
              {outputs.length > 0 && (
                <div className="mt-2 flex flex-col gap-2 justify-center items-center">
                  <h3 className="font-semibold w-full">Output : </h3>
                  <h3 className="text-gray-200 bg-gray-600 flex-grow pl-1 pr-2 py-2 rounded-md w-full">
                    {output}
                  </h3>
                </div>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
