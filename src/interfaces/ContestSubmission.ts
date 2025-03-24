import { ObjectId } from "mongodb";

export interface ContestSubmission {
  _id: ObjectId;
  contest_id: number;
  user_id: string;
  code: string;
  status: "Accepted" | "Wrong Answer" | "Pending";
  question_id: number;
  submission_time_taken: number;
  __v: number;
}
