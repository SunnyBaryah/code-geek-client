import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/admin/Header";
const AdminApp = () => {
  return (
    <div className="bg-gray-900 min-h-screen font-display">
      <Header />
      <Outlet />
      <ToastContainer theme="dark" />
    </div>
  );
};
export default AdminApp;
