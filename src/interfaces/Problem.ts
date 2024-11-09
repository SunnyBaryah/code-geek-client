export interface Problem{
    id:number,
    constraints: [
        {
            item:string
        }
    ],
    description:string,
    difficulty:string,
    examples:[
        {
            input:string,
            output:string,
            explanation:string,
        }
    ],
    test_cases:[
        {
            input:string,
            expected_output:string,
            isHidden:true,
        }
    ], 
    title: string,
    _id: string,
}