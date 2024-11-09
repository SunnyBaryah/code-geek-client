import axios from "../axios.ts";
export class SubmissionService{
    async getSubmission(problem_id:number){
        const response=await axios.get(`/submission/getSubmissions?id=${problem_id}`);
        if (response.status === 200) {
            return response;
        }
        return null;
    }
    async postSubmission(props:{problem_id:number, code:string, status:string}){
        const response=await axios.post("/submission/submit", props);
        if(response.status===200){
            return response;
        }
        return null;
    }
};
const submissionService=new SubmissionService();
export default submissionService;