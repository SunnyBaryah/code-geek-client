export interface ButtonProps{
    type?:string,
    children?:string;
    className?:string;
    disabled?:boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}