import usersIcon from "/users-icon.svg";
import questionsIcon from "/questions-icon.svg";
import trophyIcon from "/trophy-icon.svg";
import { Link } from "react-router-dom";
const AdminDashboard = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-white py-2 text-4xl md:text-7xl my-5">
        Admin Portal
      </h1>

      <div className="rounded-lg bg-gray-500 flex justify-center gap-2 md:gap-4 min-h-[60vh] w-[90%] md:w-[80%] md:px-5 flex-wrap py-4">
        <Link
          to="/admin/problems"
          className="flex flex-col justify-center items-center gap-6 text-[#FFC100] w-[45%] bg-gray-800 my-2  rounded-lg hover:scale-105 hover:bg-gray-700 transition duration-200 text-xl md:text-2xl"
        >
          <img className="w-[70px] md:w-[100px]" src={questionsIcon} />
          <p className="text-center">Manage Problems</p>
        </Link>
        <Link
          to="/admin/users"
          className="flex flex-col justify-center items-center gap-6 text-[#FFC100] w-[45%] bg-gray-800 my-2 rounded-lg hover:scale-105 hover:bg-gray-700 transition duration-200 text-xl md:text-2xl"
        >
          <img className="w-[70px] md:w-[100px]" src={usersIcon} />
          <p className="text-center">Manage Users</p>
        </Link>
        <Link
          to="/admin/contests"
          className="flex flex-col justify-center items-center gap-6 text-[#FFC100] w-[91%] bg-gray-800 my-2 rounded-lg hover:scale-105 hover:bg-gray-700 transition duration-200 text-xl md:text-2xl"
        >
          <img className="w-[70px] md:w-[100px]" src={trophyIcon} />
          <p className="text-center">Manage Contests</p>
        </Link>
      </div>
    </div>
  );
};
export default AdminDashboard;
