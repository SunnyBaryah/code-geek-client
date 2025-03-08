export interface QuestionData {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  examples: [
    {
      input: string;
      output: string;
      explanation: string;
    }
  ];
  constraints: [
    {
      item: string;
    }
  ];
}
