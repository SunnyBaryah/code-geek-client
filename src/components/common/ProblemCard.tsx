import { Link } from "react-router-dom";
import { ProblemCardProps } from "../../interfaces/ProblemCardProps";
export default function ProblemCard(props:ProblemCardProps){
    return(
        <Link to={`/problems/${props.problem.id}`}>
            <div className={`${props.className} text-white flex rounded-md py-3 px-3`}>
                <h1 className="font-semibold">{`${props.problem.id}. ${props.problem.title}`}</h1>
                <p className={props.problem.difficulty=="Hard"?`text-red-600 ml-auto font-semibold`:
                    (props.problem.difficulty=="Medium"?`text-yellow-400 ml-auto font-semibold`:
                    `text-green-600 ml-auto font-semibold`)}>
                        {props.problem.difficulty}
                </p>
            </div>
        </Link>
    );
}