import { Link } from "react-router-dom";
import logo from "/logo-png.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import LogoutBtn from "../Header/LogoutBtn";
import usersIcon from "/users-icon.svg";
import questionsIcon from "/questions-icon.svg";
import trophyIcon from "/trophy-icon.svg";
const Header = () => {
  // const navigate = useNavigate();
  const status = useSelector((state: RootState) => state.auth.status);

  return (
    <div className="bg-gray-700">
      <div className="flex items-center w-[88%] xl:w-[80%] mx-auto">
        <Link to="/admin/dashboard" className="  text-white py-2 text-2xl">
          <img className="h-[48px]" src={logo} />
        </Link>

        <nav className="ml-auto">
          <div className="flex items-center gap-2 md:gap-5">
            {status && (
              <Link
                to="/admin/users"
                className="py-2 mr-3 text-2xl  hover:scale-105 transition duration-150"
              >
                {/* <AvatarIcon className="h-[40px]"/> */}
                <img className=" h-[39px]" src={usersIcon} />
              </Link>
            )}
            {status && (
              <Link
                to="/admin/problems"
                className="py-2 mr-2 text-2xl  hover:scale-105 transition duration-150"
              >
                <img className=" h-[35px]" src={questionsIcon} />
              </Link>
            )}
            {status && (
              <Link
                to="/admin/contests"
                className="py-2 mr-2 text-2xl  hover:scale-105 transition duration-150"
              >
                <img className=" h-[35px]" src={trophyIcon} />
              </Link>
            )}
            {status && <LogoutBtn />}
          </div>
        </nav>
      </div>
    </div>
  );
};
export default Header;
