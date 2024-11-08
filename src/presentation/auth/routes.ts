import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth.services";


export class AuthRoutes{

    static get routes(): Router{
        const router = Router();

        const authService = new AuthService();

        const controller = new AuthController(authService);

        // app.user('api/todos, TodosRoutes.routes')
        router.post("/login", controller.login);
        
        router.post("/register", controller.register);
        router.get("/verifiedMail/:token", controller.verifiedMail);

        return router;
    }
}