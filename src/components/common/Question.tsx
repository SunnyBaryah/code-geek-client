import { QuestionData } from "../../interfaces/QuestionData";
export default function Question(props: { question: QuestionData }) {
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case "Hard":
        return "text-red-600";
      case "Medium":
        return "text-yellow-400";
      default:
        return "text-green-600 ";
    }
  };
  return (
    <div className="h-full text-white border-t-2 border-gray-900 px-4 py-3 max-h-[80vh] overflow-auto">
      <h1 className="font-semibold text-2xl text-gray-200 mb-3">{`${props.question.id}. ${props.question.title} `}</h1>
      <p
        className={`${getDifficultyClass(
          props.question.difficulty
        )} bg-gray-700 text-xs mb-5 max-w-fit border border-gray-400 px-1.5 py-0.5 rounded-xl`}
      >
        {props.question.difficulty}
      </p>
      <p className="text-gray-300 mb-5">{`${props.question.description}`}</p>
      {props.question.examples.map((example, index) => {
        return (
          <div key={index} className="text-gray-300 mb-4">
            <h3 className="font-bold">{`Example ${index + 1} :`}</h3>
            <div className="ml-3">
              <h4>{`Input : ${example.input}`}</h4>
              <h4>{`Output : ${example.output}`}</h4>
              <h4>{`Explanation : ${example.explanation}`}</h4>
            </div>
          </div>
        );
      })}
      <h3 className="font-bold mb-2">Constraints : </h3>
      {props.question.constraints.map((constraint, index) => {
        return (
          <div key={index} className="text-gray-300 mb-2 ml-2">
            <p>{`• ${constraint.item}`}</p>
          </div>
        );
      })}
    </div>
  );
}
