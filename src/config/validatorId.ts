import {isValidObjectId} from "mongoose";


export class validatorId{

    static isValidId(id: string){
        return isValidObjectId(id);
    }
}