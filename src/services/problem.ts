import { Problem } from "@/interfaces/Problem.ts";
import axios from "../axios.ts";
interface problemData {
  code?: string;
  language_id: number;
  test_cases: [
    {
      input: string;
      expected_output: string;
      isHidden: boolean;
    }
  ];
}

export class ProblemService {
  async runTheCode(problem: problemData) {
    // console.log(problem);
    const response = await axios.post("/problem/run", problem);
    // console.log(response);
    return response;
  }
  async getProblem(id: number) {
    // console.log("Id received:", id);
    const response = await axios.get(`/problem/find?id=${id}`);
    // console.log(response);
    return response;
  }
  async getAllProblems() {
    const response = await axios.get("/problem/findAll");
    // console.log(response);
    return response;
  }
  async addProblem(data: Problem) {
    try {
      const response = await axios.post("/problem/add-problem", { data });
      // console.log(response);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async updateProblem(data: Problem) {
    try {
      const response = await axios.put("/problem/update-problem", { data });
      // console.log(response);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async deleteProblem(data: Problem) {
    try {
      const response = await axios.delete("/problem/delete-problem", { data });
      // console.log(response);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const problemService = new ProblemService();
export default problemService;
