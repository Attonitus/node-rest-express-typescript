import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { envs } from "../../config/envs";
import { JWTAdapter } from "../../config/jwt.adapter";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { EmailService } from "./email.service";


const SEED = envs.JWT_SECRET_KEY;
const WEBSITE_URL = envs.WEBSITE_URL;

export class AuthService{

    constructor(
        private emailService: EmailService
    ){}


    async registerUser(registerUserDto: RegisterUserDto){
        const {  email } = registerUserDto;

        const existEmail = await UserModel.findOne({ email });
        if(existEmail) throw CustomError.badRequest("Email is already register");

        try {
            const user = new UserModel(registerUserDto);
            
            user.password = bcryptAdapter.hash(user.password);
            
            await user.save();

            //send email
            const isSent = await this.sendEmailValidationLink(user.email, WEBSITE_URL);
            if(!isSent) throw CustomError.internalServer('Error sending email');

            const {password, ...userInfo} = UserEntity.fromObject(user);

            const token = await JWTAdapter.generateToken({ id: userInfo.id}, SEED);
            if(!token) throw CustomError.internalServer('Error crating JWT');

            return {
                user: userInfo,
                token
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

            const token = await JWTAdapter.generateToken({ id: userInfo.id}, SEED);
            if(!token) throw CustomError.internalServer('Error crating JWT');

            return {
                user: userInfo,
                token
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    private async sendEmailValidationLink(email : string, websiteUrl: string){
        const token = await JWTAdapter.generateToken({ email }, SEED);
        if(!token) throw CustomError.internalServer('Error creating JWT');

        const link = `${websiteUrl}/api/auth/verifiedMail/${token}`;

        const html = `
        <h1>Validate your email</h1>
        <p>Thank you for use this website. To complete your register please validate your email give click here: </p>
        <a href="${link}">Click here</a>
        `

        this.emailService.sendMail({
            to: email,
            subject: "Validate your email",
            html
        });

        return true;
    }

    async validateEmail(token:string){
        const payload = await JWTAdapter.validateToken(token, SEED);
        if(!payload) throw CustomError.notAuthorized('Invalid token');

        const { email } = payload as {email: string};
        if(!email) throw CustomError.internalServer('Email not in token');

        const user = await UserModel.findOne({ email });
        if(!user) throw CustomError.internalServer('Email not exist');

        user.emailValidated = true;

        await user.save();
        return true;

    }
}