export interface ContestCardProps {
  className?: string;
  contest: {
    id: number;
    end_time: string;
    start_time: string;
  };
}
