import { ButtonProps } from "../../interfaces/ButtonProps.ts";

export default function Button(props:ButtonProps){
    return(<button disabled={props.disabled} onClick={props.onClick} className={`${props.className} hover:scale-105 transition duration-200 `}>
        {props.children}
        </button>
    );
}
