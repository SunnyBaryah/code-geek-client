export interface User {
  email: string;
  password: string;
  refreshToken: string;
  solved_questions: [
    {
      _id: string;
      problem_id: number;
      problem_title: string;
      difficulty: string;
    }
  ];
  username: string;
  _id: string;
  isAdmin?: boolean;
  __v: number;
}
