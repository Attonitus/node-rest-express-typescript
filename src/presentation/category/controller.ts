import { Request, Response } from "express";
import { CategoryDto, CustomError, PaginationDto } from "../../domain";
import { CategoryService } from "../services/category.service";


export class CategoryController{

    constructor(
        public readonly categoryService: CategoryService
    ){}

    private handleError = (error: unknown, res: Response) => {
        if(error instanceof CustomError){
            res.status(error.statusCode).json({error: `${error.message}`});
            return;
        }
        res.status(500).json(`${error}`);
    }

    getAll = (req:Request , res: Response) => {
        const {page = 1, limit = 5} = req.query;

        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if(error){
            res.status(400).json({error});
            return;
        }

        this.categoryService.getAll(paginationDto!)
        .then(categories => res.json(categories))
        .catch(error => this.handleError(error, res));
    }

    getById = (req:Request , res: Response) => {
        const {id} = req.params;

        this.categoryService.getById(id)
        .then( category => res.json(category))
        .catch( error => this.handleError(error, res));
    } 

    create = (req:Request , res: Response) => {
        const [error, categoryDto] = CategoryDto.create(req.body);
        if(error){
            res.status(400).json({error});
            return;
        }

        this.categoryService.create(categoryDto!, req.body.user)
        .then( category => res.status(201).json(category))
        .catch(error => this.handleError(error, res));
    }

    update = (req:Request , res: Response) => {
        const [error, categoryDto] = CategoryDto.create(req.body);
        if(error){
            res.status(400).json({error});
            return;
        }

        this.categoryService.create(categoryDto!, req.body.user)
        .then( category => res.status(201).json(category))
        .catch(error => this.handleError(error, res));
    }
}