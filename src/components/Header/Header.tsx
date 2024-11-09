import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import LogoutBtn from "./LogoutBtn";
import { Link } from "react-router-dom";
import logo from "/logo-png.png";
import puzzleIcon from "/puzzle-icon.svg";
import { RootState } from "../../store/store";
import homeIcon from "/user-circle-icon.svg";
export default function Header() {
  const navigate = useNavigate();
  const status = useSelector((state:RootState) => state.auth.status);

  const navItems = [
    {
      name: "Login",
      slug: "/login",
      class: "border border-gray-500 bg-gray-800 py-1.5 text-white hover:scale-105 transition duration-150",
      active: !status,
    },
    {
      name: "Sign up",
      slug: "/sign-up",
      class: "bg-[#FFC100] text-gray-900 hover:scale-105 transition duration-150",
      active: !status,
    },
  ];
  return (
    <div className="bg-gray-700">
      <div className="flex items-center w-[80%] mx-auto">
        <Link to="/" className="  text-white py-2 text-2xl">
          <img className="h-[48px]" src={logo} />
        </Link>

        <nav className="ml-auto">
          <div className="flex items-center gap-5">
            {navItems.map((item) =>
              item.active ? (
                <div key={item.name} onClick={() => navigate(item.slug)}>
                  <Button className={`${item.class} px-3 py-1 rounded-md`}>
                    {item.name}
                  </Button>
                </div>
              ) : null
            )}
            {status && (
              
                <Link
                  to="/dashboard"
                  className="py-2 text-2xl  hover:scale-105 transition duration-150"
                >
                  {/* <AvatarIcon className="h-[40px]"/> */}
                  <img className=" h-[44px]" src={homeIcon} />
                </Link>
              
            )}
            {status && (
              
                <Link
                  to="/problems"
                  className="py-2 mr-2 text-2xl  hover:scale-105 transition duration-150"
                >
                  <img className=" h-[35px]" src={puzzleIcon} />
                </Link>
              
            )}
            {status && (<LogoutBtn />)}
          </div>
        </nav>
      </div>
    </div>
  );
}
