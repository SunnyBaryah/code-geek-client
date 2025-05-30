import { User } from "@/interfaces/User.ts";
import axios from "../axios.ts";
import { toast } from "react-toastify";
export class AuthService {
  async createAccount(props: {
    username: string;
    email: string;
    password: string;
  }) {
    const response = await axios.post("/users/register", props);
    if (response.status === 201) {
      toast.success("Account created successfully", {
        position: "bottom-right",
      });
      const obj: { email: string; password: string } = {
        email: props.email,
        password: props.password,
      };
      return this.login(obj);
    } else return null;
  }
  async login(props: { email: string; password: string }) {
    const response = await axios.post("/users/login", props);
    if (response.status === 200) {
      localStorage.setItem("accessToken", response.data.data.accessToken);
      return response;
    }
    return null;
  }
  async getCurrentUser() {
    let token = localStorage.getItem("accessToken");

    if (!token) {
      // Try to refresh token if accessToken is missing
      try {
        const res = await axios.get("/users/refresh-access-token");
        token = res.data.accessToken;
        localStorage.setItem("accessToken", token!);
      } catch (err) {
        // console.log("Session expired, please log in again.");
        return null;
      }
    }

    return axios.get("/users/get-current-user", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  async logout() {
    localStorage.removeItem("accessToken");
    const response = await axios.post("/users/logout");
    if (response.status === 200) {
      return response;
    } else {
      console.log("Error while logging out");
    }
  }
  async addSolvedProblem(obj: {
    problem_id: number;
    difficulty: string;
    problem_title: string;
  }) {
    const response = await axios.put("/users/add-solved", obj);
    if (response.status === 200) {
      return response;
    } else {
      console.log("Error while adding solved problem");
    }
  }
  async getSolvedProblems() {
    const response = await axios.get("/users/get-solved-questions");
    if (response.status === 200) {
      return response;
    } else {
      console.log("Error while fetching solved problems");
    }
  }
  async getAllUsers() {
    const response = await axios.get("/users/get-all-users");
    if (response.status === 200) {
      return response;
    } else {
      console.log("Error while fetching users");
    }
  }
  async updateUser(data: User) {
    const response = await axios.put("/users/update-account-status", { data });
    if (response.status === 200) {
      return response;
    } else {
      console.log("Error while updating user");
    }
  }
  async deleteUser(data: User) {
    const response = await axios.delete("/users/delete-user", { data });
    if (response.status === 200) {
      return response;
    } else {
      console.log("Error while deleting user");
    }
  }
}

const authService = new AuthService();

export default authService;
