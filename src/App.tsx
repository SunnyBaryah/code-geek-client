import "regenerator-runtime/runtime";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import authService from "./services/auth";
import { useDispatch } from "react-redux";
import { login as authLogin } from "./store/authSlice.ts";
import { motion, AnimatePresence } from "framer-motion";
function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        setLoading(true);
        const response = await authService.getCurrentUser();
        // console.log(response);
        if (response?.data?.statusCode === 200) {
          // console.log(response.data.data);
          const serializableUserData = {
            id: response.data.data._id,
            email: response.data.data.email,
            username: response.data.data.username,
          };
          dispatch(authLogin(serializableUserData));
        }
        setLoading(false);
        // console.log("User :", user);
      } catch (err) {
        console.log("User not logged in");
      }
    };
    checkIfLoggedIn();
  }, []);
  return (
    <AnimatePresence>
      {loading === true ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ y: "-100vh" }} // Slide fully out of screen upwards
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-gray-900 z-50 text-white font-display flex justify-center items-center border-b-[1px] border-white"
        >
          <span className="loading-spinner-2"></span>
          <span className="ml-3 text-xl">Loading...</span>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 1, height: "auto" }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }} // Collapse height to 0
          transition={{ duration: 0.3 }}
          className="bg-gray-900 min-h-screen font-display"
        >
          <Header />
          <Outlet />
          <ToastContainer theme="dark" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
