import "regenerator-runtime/runtime";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import authService from "./services/auth";
import { useDispatch } from "react-redux";
import { login as authLogin } from "./store/authSlice.ts";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
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
        // console.log("User :", user);
      } catch (err) {
        console.log("User not logged in");
      }
    };
    checkIfLoggedIn();
  }, []);
  return (
    <div className="bg-gray-900 min-h-screen font-display">
      <Header />
      <Outlet />
      <ToastContainer theme="dark" />
    </div>
  );
}

export default App;
