import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth.services";
import { EmailService } from "../services/email.service";
import { envs } from "../../config/envs";


export class AuthRoutes{

    static get routes(): Router{
        const router = Router();

        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY
        );

        const authService = new AuthService(emailService);
        const controller = new AuthController(authService);

        // app.user('api/todos, TodosRoutes.routes')
        router.post("/login", controller.login);
        
        router.post("/register", controller.register);
        router.get("/verifiedMail/:token", controller.verifiedMail);

        return router;
    }
}