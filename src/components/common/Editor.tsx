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
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { BOILERPLATES } from "@/constants.ts";
import { BOILERPLATE } from "@/constants.ts";
import { OnMount} from "@monaco-editor/react";
import { editor as monacoEditor } from 'monaco-editor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function MonacoEditor(props: EditorProps) {
  const monacoEditorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState("");
  const [input, setInput] = useState<string>();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [codeStatus, setCodeStatus] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [langCode, setLangCode] = useState<number>(54);
  const probId: number = Number(useParams().problemId);
  const problemCodesObject:BOILERPLATE=BOILERPLATES.find((entry)=>entry.problem_id===probId)!;
  const problemCodes=problemCodesObject.langs;
  useEffect(() => {
    switch (langCode){
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
  }, [props.test_cases]);

  const onMount:OnMount = (editor) => {
    monacoEditorRef.current = editor;
    editor.focus();
  };
  const changeInput = (index: number) => {
    setSelectedIndex(index);
    setInput(props.test_cases[index].input);
  };
  const handleRun = async () => {
    if (monacoEditorRef.current) {
      setLoading(true);
      const code = monacoEditorRef.current.getValue();
      const test_cases = props.test_cases;
      // console.log(test_cases);
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
      // console.log(wrong.length);
      if (wrong.length == 0) {
        setCodeStatus("Accepted");
      } else {
        setCodeStatus("Wrong Answer");
      }
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // console.log("props : ", props);
    if (monacoEditorRef.current) {
      setLoading(true);

      const code = monacoEditorRef.current.getValue();
      const test_cases = props.test_cases;
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
        finalStatus = "Accpeted";
        const response = await authService.addSolvedProblem({
          problem_id: probId,
          difficulty: props.difficulty,
          problem_title: props.problem_title,
        });
        console.log(response);
      } else {
        finalStatus = "Wrong Answer";
      }
      // console.log("Final Status :", finalStatus);
      const submitResponse = await submissionService.postSubmission({
        problem_id: probId,
        code,
        status: finalStatus,
      });
      console.log(submitResponse);
      setLoading(false);
      toast.success(`Code submitted, result : ${finalStatus}`, {
        position: "bottom-right",
      });
    }
  };
  return (
    <div className={`mt-2 ${props.className}`}>
      <div className="w-full py-1 mb-2 flex justify-between items-center">
        <motion.button
          onClick={handleRun}
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
                  <Button className=" text-white hover:scale-100 " onClick={handleRun}>
                    Run
                  </Button>
                  <img className="h-[20px]" src={runIcon} />
                </div>
                <div className="flex items-center gap-2 justify-center border-l border-l-gray-700 bg-gray-600 hover:bg-gray-700 transition duration-150 rounded-r-md pl-2 pr-1">
                  <Button className=" text-white hover:scale-100 " onClick={handleSubmit}>
                    Submit
                  </Button>
                  <img className="h-[20px]" src={submitIcon} />
                </div>
              </div>
            </motion.div>
          )}
        </motion.button>
        <div className="text-white">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex justify-center items-center gap-2 bg-gray-600 hover:bg-gray-700 transition duration-200 text-white px-2 py-1 rounded-md">
              {langCode === 54 ? "C++" : langCode === 63 ? "JS" : "Python"}
              <img className="w-[25px]" src={DownwardIcon} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-700 text-white">
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
            language={langCode===54?"cpp":(langCode===63?"javascript":"python")}
            value={value}
            onMount={onMount}
            onChange={(value) => setValue(value ?? "")}
            />
          </div>
      </div>
      <div className="w-full bg-gray-800 text-white mr-2 rounded-md pt-1 pb-2 px-4 mt-2 max-h-40 overflow-auto">
        <AnimatePresence>
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
              <div className="flex gap-2 justify-center items-center">
                <h3 className="font-semibold">Input : </h3>
                <h3 className="text-gray-200 bg-gray-600 flex-grow pl-1 pr-2 py-2 rounded-md">
                  {input}
                </h3>
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
