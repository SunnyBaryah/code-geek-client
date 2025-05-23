import typingImage from "/typing-image2.svg";
import logo from "/logo.svg";
import tickIcon from "/tickIcon.svg";
import questionIcon from "/question-circle.svg";
import codeIcon from "/code-icon.svg";
import adminImg from "/admin-png.png";
import codingImg from "/coding-png.png";
import competitionImg from "/competition2-png.png";
import settingsIcon from "/settings-icon.svg";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "./../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { motion } from "framer-motion";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const status = useSelector((state: RootState) => state.auth.status);
  const navigate = useNavigate();
  useEffect(() => {
    if (status === false) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [status]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-[80%] mx-auto text-white py-20">
        <div className="min-h-screen">
          <div className="mb-28 xl:mb-32 flex justify-center items-center gap-2 md:gap-5">
            <img className="h-[60px] md:h-[95px] xl:h-[110px]" src={logo} />
            <h1 className="text-center text-5xl md:text-6xl xl:text-8xl font-bold">
              <span>Code</span>
              <span className="text-[#FFC100]">Geek</span>
            </h1>
          </div>
          <div className="flex flex-col xl:flex-row  justify-center xl:justify-between items-center gap-8 md:gap-12 xl:gap-20 w-[95%] xl:w-[90%] 2xl:w-[80%] mx-auto">
            <div className="w-[95%] xl:w-[70%] flex flex-col justify-between items-center gap-10">
              <h2 className="text-4xl text-center md:text-5xl xl:text-6xl font-bold ">
                <span className="leading-tight">Master Coding</span>
                <span className="leading-tight text-[#FFC100]">, </span>
                <span className="leading-tight">One Challenge at a Time</span>
                <span className="leading-tight text-[#FFC100]">.</span>
              </h2>
              {isLoggedIn === false && (
                <div className="w-full flex justify-center">
                  <button
                    className="hidden xl:block w-[40%] rounded-md bg-[#FFC100] text-gray-800 text-center hover:scale-105 transition duration-150 p-4 text-2xl"
                    onClick={() => {
                      navigate("/sign-up");
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
            <div className="w-[95%] xl:w-[30%] flex justify-center">
              <img
                className="self-center col-span-2 h-[190px] md:h-[250px] xl:h-[280px] 2xl:h-[300px]"
                src={typingImage}
              />
            </div>
          </div>
          {isLoggedIn === false && (
            <div className="w-full flex justify-center">
              <button
                className="xl:hidden w-[70%] mx-auto mt-20 mb-10 rounded-md bg-[#FFC100] text-gray-800 text-center hover:scale-105 transition duration-150 p-4 text-2xl"
                onClick={() => {
                  navigate("/sign-up");
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
        {isLoggedIn === false ? (
          <div className="bg-gray-600 flex flex-col gap-12 w-[95%] xl:w-[70%] mx-auto rounded-md shadow-md pt-10 pb-5">
            <h1 className="text-center font-bold text-3xl md:text-4xl xl:text-5xl">
              How to begin your journey?
            </h1>
            <div className="bg-gray-500 w-[85%] md:w-[55%] mx-auto rounded-lg shadow-lg">
              <img src={codingImg} className="w-[90%] mx-auto" />
            </div>
            <div className="  px-6 py-6 rounded-md flex flex-col gap-5 w-[95%] xl:w-[70%] mx-auto text-xl md:text-2xl xl:text-3xl">
              <div className="flex items-center justify-between gap-10">
                <span>1. Create your account</span>
                <span>
                  <img className="h-[35px] md:h-[45px]" src={tickIcon} />
                </span>
              </div>
              <div className="flex items-center justify-between  gap-10">
                <span>2. Choose a problem</span>
                <span>
                  <img className="h-[35px] md:h-[45px]" src={questionIcon} />
                </span>
              </div>
              <div className="flex items-center justify-between  gap-10">
                <span>3. Start Coding</span>
                <span>
                  <img className="h-[35px] md:h-[45px]" src={codeIcon} />
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-gray-600 flex flex-col gap-12 w-[95%] xl:w-[60%] mx-auto lg:mt-6 xl:mt-0 rounded-md shadow-md pt-5 pb-5 px-3">
              <h1 className=" text-center font-bold text-3xl xl:text-4xl leading-tight">
                Are you ready to tackle coding challenges?
              </h1>
              <div className="bg-gray-500 w-[85%] md:w-[55%] mx-auto rounded-lg shadow-lg">
                <img src={codingImg} className="w-[90%] mx-auto" />
              </div>
              <Button
                onClick={() => {
                  navigate("/problems");
                }}
                className="bg-[#FFC100] w-[80%] md:w-[50%] mx-auto py-2 text-gray-800 rounded-md"
              >
                <>Explore Problems</>
              </Button>
            </div>
            <div className="bg-gray-600 flex flex-col gap-12 w-[95%] xl:w-[60%] mx-auto mt-3 lg:mt-9 rounded-md shadow-md pt-5 pb-5 px-3">
              <h1 className=" text-center font-bold text-3xl xl:text-4xl leading-tight">
                Want some competition in coding?
              </h1>
              <div className="bg-gray-500 w-[85%] md:w-[55%] mx-auto rounded-lg shadow-lg">
                <img src={competitionImg} className="w-[90%] mx-auto" />
              </div>
              <Button
                onClick={() => {
                  navigate("/contests");
                }}
                className="bg-[#FFC100] w-[80%] md:w-[50%] mx-auto py-2 text-gray-800 rounded-md"
              >
                <>Explore Contests</>
              </Button>
            </div>
          </div>
        )}
        {isLoggedIn === false && (
          <div className="mt-14 bg-gray-600 flex flex-col gap-12 w-[95%] xl:w-[70%] mx-auto rounded-md shadow-md pt-10 pb-5">
            <h1 className="text-center font-bold text-3xl md:text-4xl xl:text-6xl">
              Are you an Admin?
            </h1>
            <div className="bg-gray-500 w-[85%] md:w-[55%] mx-auto rounded-lg shadow-lg">
              <img src={adminImg} className="w-[90%] mx-auto" />
            </div>
            <Link
              to="/admin/signin"
              className="w-[80%] md:w-[45%] mx-auto mb-10 rounded-md bg-[#FFC100] text-gray-800 flex justify-center items-center gap-3 hover:scale-105 transition duration-150 p-4 text-lg md:text-2xl"
            >
              <img className="w-[30px]" src={settingsIcon} />
              Admin Portal
              {/* <img className="w-[30px]" src={settingsIcon} /> */}
            </Link>
          </div>
        )}
      </div>
      <div className="w-full bg-[#FFC100] text-gray-800 py-2 flex flex-col justify-center items-center">
        <p>CODEGEEK © 2024</p>
        <div className="flex flex-col">
          <a
            className="text-sm text-gray-500"
            href="https://storyset.com/people"
          >
            People illustrations by Storyset
          </a>
        </div>
      </div>
    </motion.div>
  );
}
