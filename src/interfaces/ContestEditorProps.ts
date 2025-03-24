export interface ContestEditorProps {
  problem_id: number;
  contest_id: number;
  problem_title: string;
  problem_description: string;
  className?: string;
  end_time: string;
  start_time: string;
  difficulty: string;
  test_cases: [
    {
      input: string;
      expected_output: string;
      isHidden: boolean;
    }
  ];
}
