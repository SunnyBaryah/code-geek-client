import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
import authService from "@/services/auth.ts";
import { User } from "@/interfaces/User";
import { DialogDescription } from "@radix-ui/react-dialog";
import binIcon from "/bin-icon.svg";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

export default function AdminUsers() {
  const { register, handleSubmit, setValue, reset } = useForm<User>();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const create = async (data: User) => {
    let response;
    try {
      response = await authService.updateUser(data);
      if (response)
        toast.success("User updated successfully", {
          position: "bottom-center",
        });
      usersFetcher();
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const usersFetcher = async () => {
    setLoading(true);
    let data;
    data = await authService.getAllUsers();
    setAllUsers(data?.data.data.data);
    setLoading(false);
  };

  useEffect(() => {
    const usersFetcher = async () => {
      setLoading(true);
      let data;
      data = await authService.getAllUsers();
      // console.log(data?.data.data.data);
      setAllUsers(data?.data.data.data);
      setLoading(false);
    };
    usersFetcher();
  }, []);

  const handleEditClick = (item: User) => {
    setValue("email", item.email);
    setValue("password", item.password);
    setValue("refreshToken", item.refreshToken);
    setValue("solved_questions", item.solved_questions);
    setValue("username", item.username);
    setValue("_id", item._id);
    setValue("isAdmin", item.isAdmin);
    setValue("__v", item.__v);
  };

  const deleteUser = async (data: User) => {
    try {
      const response = await authService.deleteUser(data);
      if (response && response.status === 201) {
        toast.success("User deleted successfully", {
          position: "bottom-center",
        });
      }
      usersFetcher();
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
        Manage Users
      </h1>
      <div className="flex flex-col gap-5 w-[80%] xl:w-[60%] mx-auto py-4 rounded-md bg-gray-800 min-h-[80vh] max-h-[80vh] overflow-auto shadow-md">
        {loading ? (
          <div className="flex flex-col gap-5">
            <Skeleton className="w-[80%] mx-auto h-[35px] bg-gray-600" />
            <Skeleton className="w-[80%] mx-auto h-[35px] bg-gray-600" />
          </div>
        ) : allUsers.length > 0 ? (
          allUsers.map((user: User, index) => {
            return (
              <div
                className="w-[80%] hover:scale-105 transition duration-200 mx-auto bg-gray-600 rounded-md"
                key={user._id}
              >
                <div className="text-sm lg:text-md xl:text-lg">
                  <div
                    className={` text-white flex gap-2 justify-between items-center rounded-md py-3 px-3`}
                  >
                    <h1 className="font-semibold w-[80%] md:w-[90%]">{`${
                      index + 1
                    }. ${user.username}`}</h1>
                    <Dialog>
                      <DialogTrigger
                        onClick={() => handleEditClick(user)}
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
                            <Label htmlFor="username" className="text-right">
                              Username
                            </Label>
                            <Input
                              id="username"
                              {...register("username", {
                                required: true,
                              })}
                            />
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              {...register("email", {
                                required: true,
                              })}
                            />
                            <Label htmlFor="isAdmin" className="text-right">
                              isAdmin
                            </Label>
                            <Select
                              onValueChange={(value) => {
                                setValue(
                                  "isAdmin",
                                  value === "true" ? true : false
                                );
                              }}
                              defaultValue={
                                user.isAdmin !== undefined
                                  ? String(user.isAdmin)
                                  : ""
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="true">True</SelectItem>
                                  <SelectItem value="false">False</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
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
                        onClick={() => handleEditClick(user)}
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
                            delete the user's account and remove the data from
                            our servers.
                          </DialogDescription>
                        </DialogHeader>
                        <div>
                          <Button
                            onClick={() => deleteUser(user)}
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
              No Users Found!
            </h1>
          </div>
        )}
      </div>
    </motion.div>
  );
}
