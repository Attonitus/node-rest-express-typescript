import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { envs } from "../../config/envs";
import { JWTAdapter } from "../../config/jwt.adapter";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";


const SEED = envs.JWT_SECRET_KEY;

export class AuthService{

    constructor(){}


    async registerUser(registerUserDto: RegisterUserDto){
        const {  email } = registerUserDto;

        const existEmail = await UserModel.findOne({ email });
        if(existEmail) throw CustomError.badRequest("Email is already register");

        try {
            const user = new UserModel(registerUserDto);
            
            user.password = bcryptAdapter.hash(user.password);
            
            await user.save();

            const {password, ...userInfo} = UserEntity.fromObject(user);

            return {
                user: userInfo,
                token: 'ABCD'
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async loginUser(loginUserDto: LoginUserDto){
        const {password : passwordDto, email} = loginUserDto;

        // email exist
        const userExist = await UserModel.findOne({email});
        if(!userExist) throw CustomError.badRequest("User dont exist");

        //if exist compare password
        const correctPass = bcryptAdapter.compare(passwordDto, userExist.password);
        if(!correctPass) throw CustomError.badRequest('Wrong password');

        try {

            const {password, ...userInfo} = UserEntity.fromObject(userExist);

            const token = await JWTAdapter.generateToken({ id: userInfo.id, email: userInfo.email }, SEED);
            if(!token) throw CustomError.internalServer('Error crating JWT');

            return {
                user: userInfo,
                token
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}