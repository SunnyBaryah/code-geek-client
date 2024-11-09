import axios from "../axios.ts";
import { toast } from "react-toastify";
export class AuthService {
  async createAccount(props:{ username:string, email:string, password:string }) {
      const response = await axios.post("/users/register", props);
      console.log(response);
      if (response.status === 200) {
        toast.success("Account created successfully", {
            position: "bottom-right",
        });
        const obj:{email:string, password:string}={email:props.email,password:props.password }
        return this.login(obj);
      } 
      else return null;
  }
  async login(props:{ email:string, password:string }) {
      const response = await axios.post("/users/login", props);
      if (response.status === 200) {
        return response;
      }
      return null;
  }
  async getCurrentUser() {
    const response = await axios.get("/users/get-current-user");
    if (response.status === 200) {
      return response;
    } else return null;
  }
  async logout() {
    const response = await axios.post("/users/logout");
    if (response.status === 200) {
      return response;
    } else {
      console.log("Error while logging out");
    }
  }
  async addSolvedProblem(obj:{problem_id:number, difficulty:string, problem_title:string}){
    const response = await axios.put("/users/add-solved", obj);
    if (response.status === 200) {
      return response;
    } else {
      console.log("Error while adding solved problem");
    }
  }
  async getSolvedProblems(){
    const response=await axios.get("/users/get-solved-questions");
    if (response.status === 200) {
      return response;
    } else {
      console.log("Error while fetching solved problems");
    }
  }
}

const authService = new AuthService();

export default authService;