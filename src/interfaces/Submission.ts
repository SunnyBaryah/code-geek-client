import { ObjectId } from 'mongodb';

export interface Submission {
    _id: ObjectId;                
    user_id: string;              
    problem_id: number;           
    code: string;                 
    status: 'Accepted' | 'Wrong Answer' | 'Pending'; 
    createdAt: string;              
    updatedAt: string;              
    __v: number;                  
}