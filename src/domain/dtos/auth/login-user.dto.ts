import { regularExps } from "../../../config/regular-exps";


export class LoginUserDto{
    private constructor(
        public readonly email :string,
        public readonly password : string,
    ){}


    static login(object : { [key: string]: any }): [string?, LoginUserDto?]{
        const {password, email} = object;

        if(!email) return ['Email is required!'];
        if(!regularExps.email.test(email)) return ['Must be a valid email'];
        
        if(!password) return ['Password is required!'];
        if(password.length < 7) return ['Password must be 8 characters long'];

        return [undefined, new LoginUserDto(email, password)];
    }
}