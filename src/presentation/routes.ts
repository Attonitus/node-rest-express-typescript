import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { CategoryRoutes } from "./category/routes";


export class AppRoutes{

    static get routes(): Router{
        const router = Router();

        // router.use('api/todos, TodosRoutes.routes')
        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/categories', CategoryRoutes.routes);

        return router;
    }
}