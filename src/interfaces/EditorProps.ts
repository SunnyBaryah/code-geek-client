export interface EditorProps {
  className?: string;
  difficulty: string;
  problem_title: string;
  problem_description: string;
  test_cases: [
    {
      input: string;
      expected_output: string;
      isHidden: boolean;
    }
  ];
}
