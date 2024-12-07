import authService from "../../services/auth.ts";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice.ts";
import logoutIcon from "/logout-icon-2.svg";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function LogoutBtn() {
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
      toast.error(`Error while logging out : ${e}`, { position: "bottom-right" });
      console.log("Error while logout process : ", e);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger className="hover:scale-105 transition duration-150">
        <img src={logoutIcon} className="h-[43px]" />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#FFC100] border border-[#FFC100] font-display">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will be logged out from the app.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="font-display">
          <AlertDialogCancel className="bg-gray-200 hover:bg-gray-100">
            No
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-gray-700 hover:bg-gray-800"
            onClick={logoutFunction}
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
