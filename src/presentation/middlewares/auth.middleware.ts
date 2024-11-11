import { NextFunction, Request, Response } from "express";
import { CustomError, UserEntity } from "../../domain";
import { JWTAdapter } from "../../config/jwt.adapter";
import { envs } from "../../config/envs";
import { UserModel } from "../../data";

const SEED = envs.JWT_SECRET_KEY;

export class AuthMiddleware{

    static async validateJWT(req: Request, res: Response, next: NextFunction){
        const authorization = req.header('Authorization');
        if(!authorization){
            res.status(400).json('No token provided');
            return;
        } 

        if(!authorization.startsWith('Bearer ')){
            res.status(400).json('Invalidad Bearer');
            return;
        }

        const token = authorization.split(' ').at(1) || '';

        try {
            const payload = await JWTAdapter.validateToken<{ id: string }>(token, SEED);
            if(!payload){
                res.status(400).json('Invalid token');
                return;
            } 

            const user = await UserModel.findById(payload.id);
            if(!user){
                res.status(401).json('User not exist');
                return;
            } 

            req.body.user = UserEntity.fromObject(user);

            next();

        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Server internal error"});
        }


    }
}