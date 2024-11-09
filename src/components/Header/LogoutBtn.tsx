import authService from "../../services/auth.ts";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice.ts";
import logoutIcon from "/logout-icon-2.svg";
import { toast } from "react-toastify";

export default function LogoutBtn(){
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutFunction = async () => {
    try {
      const response = await authService.logout();
      if (response && response.status === 200) {
        dispatch(logout());
        navigate("/");
        toast.success("Logged out successfully", { position: "bottom-right" });
      }
    } catch (e) {
      console.log("Error while logout process : ", e);
    }
  };
  return (
    <button className="hover:scale-105 transition duration-150" onClick={logoutFunction}>
      <img className="h-[43px]" src={logoutIcon}/>
    </button>
  );
}