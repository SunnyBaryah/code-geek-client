import problemService from "../../services/problem.ts";
import { useEffect, useState } from "react";
import { Problem } from "../../interfaces/Problem";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch } from "react-redux";
import { setProblems } from "@/store/problemsSlice";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
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

export default function AdminProblems() {
  const { register, handleSubmit, setValue, reset } = useForm<Problem>();
  const [allProblems, setAllProblems] = useState([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const create = async (data: Problem) => {
    let response;
    try {
      if (isEdit) {
        response = await problemService.updateProblem(data);
        if (response)
          toast.success("Problem updated successfully", {
            position: "bottom-center",
          });
      } else {
        response = await problemService.addProblem(data);
        if (response) toast.success("Problem added successfully");
        reset();
      }
      setIsEdit(false);
      problemsFetcher();
    } catch (error) {
      console.log(error);
    }
  };

  const problemsFetcher = async () => {
    setLoading(true);
    let data;
    data = await problemService.getAllProblems();
    dispatch(setProblems(data.data.data.foundProblem));
    setAllProblems(data.data.data.foundProblem);
    //   console.log(allProblems);
    setLoading(false);
  };

  useEffect(() => {
    const problemsFetcher = async () => {
      setLoading(true);
      let data;
      data = await problemService.getAllProblems();
      dispatch(setProblems(data.data.data.foundProblem));
      setAllProblems(data.data.data.foundProblem);
      //   console.log(allProblems);
      setLoading(false);
    };
    problemsFetcher();
  }, []);

  const handleEditClick = (item: Problem) => {
    if (isEdit === false) {
      setIsEdit(true);
    }
    setValue("constraints", item.constraints);
    setValue("description", item.description);
    setValue("difficulty", item.difficulty);
    setValue("examples", item.examples);
    setValue("id", item.id);
    setValue("test_cases", item.test_cases);
    setValue("title", item.title);
    setValue("_id", item._id);
  };

  const clearDetails = () => {
    if (isEdit === true) {
      setIsEdit(false);
    }
    reset();
  };

  const deleteProblem = async (data: Problem) => {
    try {
      const response = await problemService.deleteProblem(data);
      if (response && response.status === 201) {
        toast.success("Problem deleted successfully", {
          position: "bottom-center",
        });
      }
      problemsFetcher();
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
        DSA Problems
      </h1>
      <div className="flex flex-col gap-5 w-[80%] xl:w-[60%] mx-auto py-4 rounded-md bg-gray-800 min-h-[80vh] max-h-[80vh] overflow-auto shadow-md">
        <Dialog>
          <DialogTrigger
            onClick={clearDetails}
            className="bg-[#FFC100] hover:bg-[#ffd34e] duration-150 text-black px-2 py-3 mt-2 rounded-md w-[80%] mx-auto"
          >
            Add new Problem
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a problem</DialogTitle>
            </DialogHeader>
            <div>
              <form onSubmit={handleSubmit(create)} className="w-full">
                <Label htmlFor="id" className="text-right">
                  ID
                </Label>
                <Input
                  id="id"
                  {...register("id", {
                    required: true,
                  })}
                />
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  {...register("description", {
                    required: true,
                  })}
                />
                <Label htmlFor="difficulty" className="text-right">
                  Difficulty
                </Label>
                <Input
                  id="difficulty"
                  {...register("difficulty", {
                    required: true,
                  })}
                />
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  {...register("title", {
                    required: true,
                  })}
                />
                <Button
                  className="mt-5 w-full bg-[#FFC100] py-1 rounded-md text-black"
                  type="submit"
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
        ) : allProblems.length > 0 ? (
          allProblems.map((oneProb: Problem) => {
            return (
              <div
                className="w-[80%] hover:scale-105 transition duration-200 mx-auto bg-gray-600 rounded-md"
                key={oneProb.id}
              >
                <div className="text-sm lg:text-md xl:text-lg">
                  <div
                    className={` text-white flex gap-2 justify-between items-center rounded-md py-3 px-3`}
                  >
                    <h1 className="font-semibold w-[80%] md:w-[90%]">{`${oneProb.id}. ${oneProb.title}`}</h1>
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
                            <Label htmlFor="id" className="text-right">
                              ID
                            </Label>
                            <Input
                              id="id"
                              {...register("id", {
                                required: true,
                              })}
                            />
                            <Label htmlFor="description" className="text-right">
                              Description
                            </Label>
                            <Input
                              id="description"
                              {...register("description", {
                                required: true,
                              })}
                            />
                            <Label htmlFor="difficulty" className="text-right">
                              Difficulty
                            </Label>
                            <Input
                              id="difficulty"
                              {...register("difficulty", {
                                required: true,
                              })}
                            />
                            <Label htmlFor="title" className="text-right">
                              Title
                            </Label>
                            <Input
                              id="title"
                              {...register("title", {
                                required: true,
                              })}
                            />
                            <Button
                              className="mt-5 w-full bg-[#FFC100] py-1 rounded-md text-black"
                              type="submit"
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
                            delete the problem and remove the data from our
                            servers.
                          </DialogDescription>
                        </DialogHeader>
                        <div>
                          <Button
                            onClick={() => deleteProblem(oneProb)}
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
              No Problems Found!
            </h1>
          </div>
        )}
      </div>
    </motion.div>
  );
}
