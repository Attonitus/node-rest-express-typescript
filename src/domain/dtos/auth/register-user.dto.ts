import { regularExps } from "../../../config/regular-exps";


export class RegisterUserDto{
    private constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string
    ){}


    static create(object : { [key: string]: any }): [string?, RegisterUserDto?] {
        const {name, email, password} = object;

        if(!name) return ['Name is required'];
        if(!email) return ['Email is required'];
        
        if(!regularExps.email.test(email)) return ['Must be a valid email'];
        if(!password) return ['Password is required!'];
        if(password.length < 7) return ['Password must be 8 characters long'];

        return [undefined, new RegisterUserDto(name, email, password)];
    }
}