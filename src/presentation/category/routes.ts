import { Router } from "express"
import { CategoryController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CategoryService } from "../services/category.service";


export class CategoryRoutes{



    static get routes(): Router{
        const router = Router();

        const categoryService = new CategoryService();
        const controller = new CategoryController(categoryService);

        router.get("/", controller.getAll);
        router.get("/:id", controller.getById);
        router.post("/", [AuthMiddleware.validateJWT], controller.create);
        router.delete("/:id", [AuthMiddleware.validateJWT], controller.delete);
        router.put("/:id", [AuthMiddleware.validateJWT], controller.update);

        return router;
    }
}