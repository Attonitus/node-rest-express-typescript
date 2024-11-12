import { validatorId } from "../../../config/validatorId";


export class ProductDto{

    private constructor(
        public name: string,
        public available: boolean,
        public price: number,
        public description: string,
        public user: string,
        public category: string
    ){}


    static create(props : { [key: string] : any }) : [string?, ProductDto?]{
        const {name, available, price, description, user, category} = props;
        console.log(user);
        if(!name) return ['Name is required'];

        if(!user) return ['User is required'];
        if(!validatorId.isValidId(user)) return ['User is not a valid ID'];

        if(!category) return ['Category is required'];
        if(!validatorId.isValidId(category)) return ['Category is not a valid ID'];

        let newAvailable = available;
        if(typeof available !== "boolean"){
            newAvailable = (available === "true");
        }

        return[undefined, new ProductDto(name, newAvailable, price, description, user, category)];
    }
}