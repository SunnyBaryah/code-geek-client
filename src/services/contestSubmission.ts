import axios from "../axios.ts";
export class ContestSubmissionService {
  async getContestSubmissions(contest_id: number) {
    const response = await axios.get(
      `/contestSubmission/getAllSubmissions?contest_id=${contest_id}`
    );
    if (response.status === 200) {
      return response;
    }
    return null;
  }
  async getContestQuestionSubmissions(contest_id: number, question_id: number) {
    const response = await axios.get(
      `/contestSubmission/getAllQuestionSubmissions?contest_id=${contest_id}&question_id=${question_id}`
    );
    if (response.status === 200) {
      return response;
    }
    return null;
  }
  async postSubmission(props: {
    question_id: number;
    contest_id: number;
    submission_time_taken: number;
    code: string;
    status: string;
  }) {
    const response = await axios.post("/contestSubmission/submit", props);
    if (response.status === 200) {
      return response;
    }
    return null;
  }
}
const contestSubmissionService = new ContestSubmissionService();
export default contestSubmissionService;
