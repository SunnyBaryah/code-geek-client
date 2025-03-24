import contestService from "@/services/contest";
import { useEffect, useState } from "react";
import { Contest } from "@/interfaces/Contest";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import plusIcon from "/plus-icon.svg";
import crossIcon from "/cross-icon.svg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/components/common/Button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "react-toastify";
import binIcon from "/bin-icon.svg";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function AdminContests() {
  const { register, handleSubmit, reset, setValue } = useForm<Contest>();

  const [questions, setQuestions] = useState<number[]>([]);

  const handleAddQuestion = () => {
    setQuestions([...questions, 1]);
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    // setValue("question_ids", updatedQuestions);
  };

  const handleQuestionChange = (index: number, value: number) => {
    const updatedQuestions: number[] = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
    // setValue("question_ids", updatedQuestions);
  };

  const [allContests, setAllContests] = useState([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const create = async (data: Contest) => {
    data.question_ids = questions;

    const localDate = new Date(data.start_time);
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    ).toISOString();
    data.start_time = utcDate;

    const localDate2 = new Date(data.end_time);
    const utcDate2 = new Date(
      localDate2.getTime() - localDate2.getTimezoneOffset() * 60000
    ).toISOString();
    data.end_time = utcDate2;

    // console.log("Data : ", data);
    let response;
    try {
      if (isEdit) {
        response = await contestService.updateContest(data);
        if (response)
          toast.success("Contest updated successfully", {
            position: "bottom-center",
          });
      } else {
        response = await contestService.addContest(data);
        if (response) toast.success("Contest added successfully");
        reset();
      }
      setIsEdit(false);
      setQuestions([]);
      contestsFetcher();
    } catch (error) {
      console.log(error);
    }
  };
  const contestsFetcher = async () => {
    setLoading(true);
    let data;
    data = await contestService.getAllContests();
    // dispatch(setProblems(data.data.data.foundProblem));
    setAllContests(data.data.data.foundContest);
    //   console.log(allProblems);
    setLoading(false);
  };

  useEffect(() => {
    const contestsFetcher = async () => {
      setLoading(true);
      let data;
      data = await contestService.getAllContests();
      // dispatch(setProblems(data.data.data.foundProblem));
      setAllContests(data.data.data.foundContest);
      //   console.log(allProblems);
      setLoading(false);
    };
    contestsFetcher();
  }, []);

  const handleEditClick = (item: Contest) => {
    if (isEdit === false) {
      setIsEdit(true);
    }
    const formatDateTimeLocal = (isoString: string): string => {
      return isoString.slice(0, 16); // Extracts 'YYYY-MM-DDTHH:MM'
    };
    setQuestions(item.question_ids);
    setValue("_id", item._id);
    setValue("id", item.id);
    setValue("start_time", formatDateTimeLocal(item.start_time));
    setValue("end_time", formatDateTimeLocal(item.end_time));
  };

  const clearDetails = () => {
    if (isEdit === true) {
      setIsEdit(false);
    }
    setQuestions([]);
    reset();
  };

  const deleteContest = async (data: Contest) => {
    try {
      const response = await contestService.deleteContest(data);
      if (response && response.status === 201) {
        toast.success("Contest deleted successfully", {
          position: "bottom-center",
        });
      }
      contestsFetcher();
      reset();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-center my-4 text-white text-4xl font-semibold">
        Manage Contests
      </h1>
      <div className="flex flex-col gap-5 w-[80%] xl:w-[60%] mx-auto py-4 rounded-md bg-gray-800 min-h-[80vh] max-h-[80vh] overflow-auto shadow-md">
        <Dialog>
          <DialogTrigger
            onClick={clearDetails}
            className="bg-[#FFC100] hover:bg-[#ffd34e] duration-150 text-black px-2 py-3 mt-2 rounded-md w-[80%] mx-auto"
          >
            Add new Contest
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a contest</DialogTitle>
            </DialogHeader>
            <div>
              <form onSubmit={handleSubmit(create)} className="w-full">
                <div className="mb-2">
                  <Label htmlFor="id">ID</Label>
                  <Input
                    id="id"
                    type="number"
                    {...register("id", { required: true })}
                  />
                </div>
                <div className="my-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    {...register("start_time", { required: true })}
                  />
                </div>

                <div className="my-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    {...register("end_time", { required: true })}
                  />
                </div>

                <div className="flex items-center my-2">
                  <Label>Question IDs</Label>
                  <Button
                    className="ml-2"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddQuestion();
                    }}
                  >
                    <img className="w-[20px]" src={plusIcon} />
                  </Button>
                </div>
                {questions.map((question, index) => (
                  <div key={index} className="flex items-center gap-2 my-2">
                    <Input
                      type="number"
                      value={question}
                      onChange={(e) =>
                        handleQuestionChange(index, Number(e.target.value))
                      }
                    />
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveQuestion(index);
                      }}
                    >
                      <img className="w-[25px]" src={crossIcon} />
                    </Button>
                  </div>
                ))}

                <Button
                  type="submit"
                  className="mt-5 w-full bg-[#FFC100] py-1 rounded-md text-black"
                >
                  <>Save changes</>
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
        {loading ? (
          <div className="flex flex-col gap-5">
            <Skeleton className="w-[80%] mx-auto h-[35px] bg-gray-600" />
            <Skeleton className="w-[80%] mx-auto h-[35px] bg-gray-600" />
          </div>
        ) : allContests.length > 0 ? (
          allContests.map((oneProb: Contest) => {
            return (
              <div
                className="w-[80%] hover:scale-105 transition duration-200 mx-auto bg-gray-600 rounded-md"
                key={oneProb.id}
              >
                <div className="text-sm lg:text-md xl:text-lg">
                  <div
                    className={` text-white flex gap-2 justify-between items-center rounded-md py-3 px-3`}
                  >
                    <h1 className="font-semibold w-[80%] md:w-[90%]">{`Contest No : ${oneProb.id} `}</h1>
                    <Dialog>
                      <DialogTrigger
                        onClick={() => handleEditClick(oneProb)}
                        className="bg-[#FFC100] hover:bg-[#ffd34e] duration-150 text-black px-2 py-1 rounded-md w-[20%] md:w-[10%]"
                      >
                        Edit
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Details</DialogTitle>
                        </DialogHeader>
                        <div>
                          <form
                            onSubmit={handleSubmit(create)}
                            className="w-full"
                          >
                            <div className="mb-2">
                              <Label htmlFor="id">ID</Label>
                              <Input
                                id="id"
                                type="number"
                                {...register("id", { required: true })}
                              />
                            </div>
                            <div className="my-2">
                              <Label htmlFor="start_time">Start Time</Label>
                              <Input
                                id="start_time"
                                type="datetime-local"
                                {...register("start_time", { required: true })}
                              />
                            </div>

                            <div className="my-2">
                              <Label htmlFor="end_time">End Time</Label>
                              <Input
                                id="end_time"
                                type="datetime-local"
                                {...register("end_time", { required: true })}
                              />
                            </div>

                            <div className="flex items-center my-2">
                              <Label>Question IDs</Label>
                              <Button
                                className="ml-2"
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleAddQuestion();
                                }}
                              >
                                <img
                                  className="w-[15px] md:w-[20px]"
                                  src={plusIcon}
                                />
                              </Button>
                            </div>
                            {questions.length > 0 &&
                              questions.map((question, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 my-2"
                                >
                                  <Input
                                    type="number"
                                    value={question}
                                    onChange={(e) =>
                                      handleQuestionChange(
                                        index,
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                  <Button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleRemoveQuestion(index);
                                    }}
                                  >
                                    <img className="w-[25px]" src={crossIcon} />
                                  </Button>
                                </div>
                              ))}

                            <Button
                              type="submit"
                              className="mt-5 w-full bg-[#FFC100] py-1 rounded-md text-black"
                            >
                              <>Save changes</>
                            </Button>
                          </form>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger
                        onClick={() => handleEditClick(oneProb)}
                        className="bg-gray-400 hover:bg-gray-500 duration-150 text-red-700 px-2 py-1 rounded-md w-[20%] md:w-[10%] flex justify-center items-center"
                      >
                        <img
                          className="w-[90%] sm:w-[50%] md:w-[60%] xl:w-[50%]"
                          src={binIcon}
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-2xl mb-3">
                            Are you absolutely sure?
                          </DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete the contest and remove the data from our
                            servers.
                          </DialogDescription>
                        </DialogHeader>
                        <div>
                          <Button
                            onClick={() => deleteContest(oneProb)}
                            className="w-full mt-2 bg-[#FFC100] py-1 rounded-md text-black"
                          >
                            <>Yes</>
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>
            <h1 className="text-center my-4 text-white text-3xl font-semibold">
              No Contest Found!
            </h1>
          </div>
        )}
      </div>
    </motion.div>
  );
}
