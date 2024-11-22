import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { login as authLogin } from "../../store/authSlice.ts";
import Input from "../common/Input.tsx";
import Button from "../common/Button.tsx";
import authService from "../../services/auth.ts";
import { toast } from "react-toastify";
import loadingIcon from "/loading-2-icon.svg";
interface LoginForm {
  email: string;
  password: string;
}
export default function Login() {
  const dispatch = useDispatch();
  const [error, setError] = useState<string>("");
  const { register, handleSubmit } = useForm<LoginForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const login: SubmitHandler<LoginForm> = async (data) => {
    setError("");
    setLoading(true);
    try {
      const session = await authService.login(data);
      console.log(session);
      if (session && session.status === 200) {
        const userData = await authService.getCurrentUser();
        // console.log("User Data : ", userData);
        if (userData) {
          const serializableUserData = {
            id: userData.data.data._id,
            email: userData.data.data.email,
            username: userData.data.data.username,
          };
          // console.log("Data : ", serializableUserData);
          dispatch(authLogin(serializableUserData));
          toast.success("Logged in successfully", { position: "bottom-right" });
        }
      }
    } catch (error: any) {
      console.log(error);
      switch (error.response.status) {
        case 401:
          setError("Incorrect Password");
          break;
        case 404:
          setError("User does not exist");
          break;
        case 400:
          setError("Email is required");
          break;
        default:
          setError(error.message);
      }
      // setError(error.message);
    }
    setLoading(false);
  };
  return (
    <div className="h-[80vh] flex items-center justify-center w-full ">
      <div
        className={`mx-3 lg:mx-auto w-full max-w-lg bg-gray-700 rounded-xl p-10 `}
      >
        {/* <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div> */}
        <h2 className="text-white text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-white/60">
          Don&apos;t have any account?&nbsp;
          <Link
            to="/sign-up"
            className="font-medium text-[#FFC100] transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-5 text-white">
            <Input
              label="Email: "
              placeholder="Enter your email "
              type="email"
              {...register("email", {
                required: true,
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />

            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-[#FFC100] py-2 rounded-md text-gray-800 flex justify-center items-center gap-5"
            >
              <>
                Sign in
                {loading && (
                  <img src={loadingIcon} className="h-[35px] animate-spin" />
                )}
              </>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
