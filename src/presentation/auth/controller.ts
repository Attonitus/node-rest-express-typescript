import { Request, Response } from "express";
import { CustomError, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.services";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";


export class AuthController{

    constructor(
        public readonly authService: AuthService
    ){}

    private handleError = (error: unknown, res: Response) => {
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message});
        }

        return res.status(500).json({error: "Internal error server"});
    }


    login = (req: Request, res: Response) => {
        const [error, userLoginDto] = LoginUserDto.login(req.body);
        if(error){
            res.status(400).json({error});
            return;
        }

        this.authService.loginUser(userLoginDto!)
        .then(info => res.json(info))
        .catch(error => this.handleError(error, res));
    }
    
    register = (req: Request, res: Response) => {
        const [error , registerUser] = RegisterUserDto.create(req.body);

        if(error){
            res.status(400).json({error});
            return;
        }

        this.authService.registerUser(registerUser!)
        .then( user => res.json(user))
        .catch( error => this.handleError(error, res));
    }

    verifiedMail = (req: Request, res: Response) => {
        const {token} = req.params;

        this.authService.validateEmail(token)
        .then(user => res.json('Email validated'))
        .catch(error => this.handleError(error, res));
    }
}