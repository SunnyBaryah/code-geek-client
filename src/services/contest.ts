import { Contest } from "@/interfaces/Contest";
import axios from "../axios.ts";
export class ContestService {
  async getContest(id: number) {
    // console.log("Id received:", id);
    const response = await axios.get(`/contest/find?id=${id}`);
    // console.log(response);
    return response;
  }
  async getAllContests() {
    const response = await axios.get("/contest/findAll");
    // console.log(response);
    return response;
  }
  async addContest(data: Contest) {
    try {
      const response = await axios.post("/contest/add-contest", { data });
      // console.log(response);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async updateContest(data: Contest) {
    try {
      const response = await axios.put("/contest/update-contest", { data });
      // console.log(response);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async deleteContest(data: Contest) {
    try {
      const response = await axios.delete("/contest/delete-contest", { data });
      // console.log(response);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
const contestService = new ContestService();
export default contestService;
