import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { EditorProps } from "../../interfaces/EditorProps";
import Button from "./Button.tsx";
import authService from "../../services/auth.ts";
import problemService from "../../services/problem.ts";
import submissionService from "../../services/submission.ts";
import runIcon from "/play-icon.svg";
import submitIcon from "/submit-icon.svg";
import DownwardIcon from "/angle-down.svg";
import codeIcon from "/code-web-icon.svg";
import loadingIcon from "/loading-2-icon.svg";
import micOpenIcon from "/mic-open-icon.svg";
import micOffIcon from "/mic-off-icon.svg";
import clearIcon from "/clear-icon.svg";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.tsx";
import aiService from "@/services/ai.ts";
export default function MonacoEditor(props: EditorProps) {
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
  const [visiblePrompt, setVisiblePrompt] = useState<string>("Select Question");
  const [prompt, setPrompt] = useState<string>();
  const [aiResponding, setAiResponding] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>();
  const [queFormat, setQueFormat] = useState<number>(0);
  const [micOpen, setMicOpen] = useState<boolean>(false);

  const probId: number = Number(useParams().problemId);
  const problemCodesObject: BOILERPLATE = BOILERPLATES.find(
    (entry) => entry.problem_id === probId
  )!;
  const problemCodes = problemCodesObject.langs;
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

        // const wrong = response.data.data.allStatuses.filter(
        //   (obj: { status: { id: number; description: string } }) => {
        //     // console.log(obj.status.id);
        //     return obj.status.id !== 3;
        //   }
        // );
        // // console.log(wrong.length);
        // if (wrong.length == 0) {
        //   setCodeStatus("Accepted");
        // } else {
        //   setCodeStatus("Wrong Answer");
        // }
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
          finalStatus = "Accepted";
          await authService.addSolvedProblem({
            problem_id: probId,
            difficulty: props.difficulty,
            problem_title: props.problem_title,
          });
          // console.log(response);
        } else {
          finalStatus = "Wrong Answer";
        }
        // console.log("Final Status :", finalStatus);
        await submissionService.postSubmission({
          problem_id: probId,
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

  const changeAiQueFormat = (val: number) => {
    setQueFormat(val);
  };

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const handleMic = () => {
    if (!micOpen) {
      startListening();
    } else if (micOpen) {
      SpeechRecognition.stopListening();
      if (monacoEditorRef.current) {
        const code = monacoEditorRef.current.getValue();
        setPrompt(
          transcript +
            ". Question : " +
            props.problem_description +
            ". Code : " +
            code
        );
      } else {
        setPrompt(transcript + ". Question : " + props.problem_description);
      }
    }
    console.log("Voice prompt : ", prompt);
    setMicOpen(!micOpen);
  };

  const getResponseFromAI = async () => {
    // console.log(prompt);
    if (prompt) {
      setAiResponse(null);
      setAiResponding(true);
      const response = await aiService.getResponse({ prompt });
      if (response) {
        setAiResponse(response.data.data.response);
      } else {
        setAiResponse(
          "Sorry, currently the assistant is not working. Please try again after some time."
        );
      }
      setAiResponding(false);
    } else {
      setAiResponse("Select a question first");
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
                <div className="flex items-center justify-center gap-2 border-r border-r-gray-700 bg-gray-600 hover:bg-gray-700 transition duration-150 rounded-l-md px-2 py-1">
                  <Button
                    className=" text-white hover:scale-100 flex justify-center items-center gap-2"
                    onClick={handleRun}
                  >
                    <>
                      Run
                      <img className="h-[20px]" src={runIcon} />
                    </>
                  </Button>
                </div>
                <div className="flex items-center gap-2 justify-center border-l border-l-gray-700 bg-gray-600 hover:bg-gray-700 transition duration-150 rounded-r-md pl-2 pr-1">
                  <Button
                    className=" text-white hover:scale-100 flex justify-center items-center gap-2 "
                    onClick={handleSubmit}
                  >
                    <>
                      Submit
                      <img className="h-[20px]" src={submitIcon} />
                    </>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.button>
        <div className="text-white flex gap-1 md:gap-5 ">
          <Sheet>
            <SheetTrigger className="bg-[#FFC100] px-4 rounded-md hover:bg-gray-600 hover:text-[#FFC100] transition duration-200 text-xs sm:text-base text-black">
              Geeky AI
            </SheetTrigger>
            <SheetContent className="bg-gray-200 border border-gray-600">
              <SheetHeader>
                <SheetTitle>Ask Geeky AI</SheetTitle>
                <div className="flex justify-between w-full">
                  {["Questions", "Use Voice"].map((txt, index) => (
                    <button
                      key={index}
                      className={`w-[48%] py-1 px-2 rounded-md transition duration-200 ${
                        queFormat === index
                          ? "bg-[#FFC100] text-gray-800"
                          : "bg-gray-600 text-gray-200 hover:bg-gray-600 hover:text-white"
                      }`}
                      onClick={() => changeAiQueFormat(index)}
                    >
                      {`${txt}`}
                    </button>
                  ))}
                </div>
                {queFormat == 0 && (
                  <SheetDescription>
                    <div className="flex justify-between gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex justify-center items-center gap-2 bg-gray-600 hover:bg-gray-500 transition duration-200 text-white px-2 py-1 rounded-md text-left">
                          {visiblePrompt}
                          <img className="w-[25px]" src={DownwardIcon} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-600 text-white font-display">
                          <DropdownMenuLabel>Choose Command</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              if (monacoEditorRef.current) {
                                const code = monacoEditorRef.current.getValue();
                                const enteredPrompt =
                                  "Review my code, here is the code : " +
                                  String(code);
                                setPrompt(enteredPrompt);
                              } else {
                                setPrompt("Review my code");
                              }
                              setVisiblePrompt("Review my code");
                            }}
                            className="hover:bg-white hover:text-gray-600"
                          >
                            Review my code
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const question = props.problem_description;
                              setPrompt(
                                "Tell best practices to follow, related to question. Question : " +
                                  question
                              );
                              setVisiblePrompt(
                                "Tell best practices to follow, related to question"
                              );
                            }}
                            className="hover:bg-white hover:text-gray-600"
                          >
                            Tell best practices to follow, related to question
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const question = props.problem_description;
                              setPrompt(
                                "Give hints after seeing the question. Question : " +
                                  question
                              );
                              setVisiblePrompt(
                                "Give hints after seeing the question"
                              );
                            }}
                            className="hover:bg-white hover:text-gray-600"
                          >
                            Give hints after seeing the question
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (monacoEditorRef.current) {
                                const code = monacoEditorRef.current.getValue();
                                const question = props.problem_description;
                                const enteredPrompt =
                                  "Give me hints after seeing the code and question. Question :" +
                                  question +
                                  ". Code : " +
                                  code;
                                setPrompt(enteredPrompt);
                              } else {
                                setPrompt(
                                  "Give me hints after seeing the code and question"
                                );
                              }
                              setVisiblePrompt(
                                "Give me hints after seeing the code and question"
                              );
                            }}
                            className="hover:bg-white hover:text-gray-600"
                          >
                            Give me hints after seeing the code and question
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (monacoEditorRef.current) {
                                const code = monacoEditorRef.current.getValue();
                                setPrompt(
                                  "Give suggestions related to optimisation of code. Code : " +
                                    code
                                );
                              } else {
                                setPrompt(
                                  "Give suggestions related to optimisation of code"
                                );
                              }
                              setVisiblePrompt(
                                "Give suggestions related to optimisation of code"
                              );
                            }}
                            className="hover:bg-white hover:text-gray-600"
                          >
                            Give suggestions related to optimisation of code
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        onClick={() => getResponseFromAI()}
                        className="bg-gray-700 text-[#FFC100] px-2 rounded-md"
                      >
                        <>Send Request</>
                      </Button>
                    </div>
                    {aiResponding && (
                      <div className="bg-[#FFC100] w-full flex justify-center mt-2 rounded-md p-2">
                        <img
                          src={loadingIcon}
                          className="h-[35px] animate-spin"
                        />
                      </div>
                    )}
                    {aiResponse && (
                      <div className="text-gray-800 bg-[#FFC100] p-3 mt-3 rounded-lg text-lg leading-8 text-left">
                        <p className="max-h-[80vh] overflow-auto">
                          {aiResponse}
                        </p>
                      </div>
                    )}
                  </SheetDescription>
                )}
                {queFormat == 1 && browserSupportsSpeechRecognition && (
                  <SheetDescription>
                    <div className="bg-gray-800 rounded-md">
                      <p className="min-h-14 p-3 max-h-24 md:max-h-36 overflow-auto text-gray-400">
                        {transcript == "" ? "Speak Something" : transcript}
                      </p>
                      <div className="flex">
                        <button
                          onClick={resetTranscript}
                          className="w-1/2 flex justify-center items-center bg-gray-700 hover:bg-gray-600 transition duration-200 py-1 rounded-bl-md"
                        >
                          <img className="w-9" src={clearIcon} />
                        </button>

                        <button
                          onClick={handleMic}
                          className="w-1/2 flex justify-center items-center bg-[#FFC100] hover:bg-[#ffd24a] transition duration-200 py-1 rounded-br-md"
                        >
                          {micOpen ? (
                            <img className="w-8" src={micOffIcon} />
                          ) : (
                            <img className="w-8" src={micOpenIcon} />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        if (transcript != "") {
                          getResponseFromAI();
                        } else {
                          toast.error("Please say something first", {
                            position: "bottom-center",
                          });
                        }
                      }}
                      className="bg-gray-700 text-[#FFC100] px-2 rounded-md w-full py-2 my-5"
                    >
                      <>Send Request</>
                    </Button>
                    {aiResponding && (
                      <div className="bg-[#FFC100] w-full flex justify-center mt-2 rounded-md p-2">
                        <img
                          src={loadingIcon}
                          className="h-[35px] animate-spin"
                        />
                      </div>
                    )}
                    {aiResponse && (
                      <div className="text-gray-800 bg-[#FFC100] p-3 mt-3 rounded-lg text-lg leading-8 text-left">
                        <p className="max-h-[50vh] md:max-h-[55vh] overflow-auto">
                          {aiResponse}
                        </p>
                      </div>
                    )}
                  </SheetDescription>
                )}
              </SheetHeader>
            </SheetContent>
          </Sheet>
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
                    codeStatus == "Accepted" ? "text-green-600" : "text-red-600"
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
