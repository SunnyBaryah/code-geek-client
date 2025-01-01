import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { login as authLogin } from "../../store/authSlice.ts";
import authService from "../../services/auth.ts";
import { toast } from "react-toastify";
import Input from "../common/Input.tsx";
import Button from "../common/Button.tsx";
import loadingIcon from "/loading-2-icon.svg";
import { motion } from "framer-motion";
interface RegisterForm {
  email: string;
  password: string;
  username: string;
}
export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<RegisterForm>();

  const create: SubmitHandler<RegisterForm> = async (data) => {
    setLoading(true);
    try {
      const userData = await authService.createAccount(data);
      if (userData) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          const serializableUserData = {
            id: userData.data.data._id,
            email: userData.data.data.email,
            username: userData.data.data.username,
          };
          dispatch(authLogin(serializableUserData));
          toast.success("Signed Up successfully", { position: "bottom-right" });
          navigate("/problems");
        }
      }
    } catch (error: any) {
      switch (error.response.status) {
        case 400:
          setError("All fields are required");
          break;
        case 409:
          setError("User already exists");
          break;
        default:
          setError(error.message);
      }
    }
    setLoading(false);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
      exit={{ opacity: 0 }}
      className="h-[80vh] flex items-center justify-center"
    >
      <div
        className={`mx-4 lg:mx-auto w-full max-w-lg bg-gray-700 rounded-xl p-10 `}
      >
        <h2 className="text-white text-center text-2xl font-bold   leading-tight">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-white/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-[#FFC100] transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form className="pt-2 lg:pt-4" onSubmit={handleSubmit(create)}>
          <div className="space-y-5 text-white">
            <Input
              label="Username: "
              placeholder="Enter your username"
              {...register("username", {
                required: true,
              })}
            />
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
              })}
            />
            <Input
              label="Password :"
              placeholder="Enter your password"
              type="password"
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
                Create Account
                {loading && (
                  <img src={loadingIcon} className="h-[35px] animate-spin" />
                )}
              </>
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
