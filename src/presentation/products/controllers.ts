import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { CustomError, PaginationDto, ProductDto } from "../../domain";


export class ProductController{

    constructor(
        private readonly productService: ProductService
    ){}

    private handleError(error: CustomError, res: Response){
        if(error instanceof CustomError){
            res.status(error.statusCode).json({error: `${error.message}`});
        }
        res.status(500).json({error: `internal server error ${error}`});
    }

    getAll = (req: Request, res: Response) => {
        const {page = 1, limit = 5} = req.query;

        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if(error){
            res.status(400).json({error});
            return;
        }

        this.productService.getAll(paginationDto!)
        .then(categories => res.json(categories))
        .catch(error => this.handleError(error, res));
    }

    create = (req: Request, res: Response) => {
        const [error, productDto] = ProductDto.create({
            ...req.body,
            user: req.body.user.id
        });
        if(error){
            res.status(400).json({error});
            return;
        }

        this.productService.create(productDto!)
        .then( product => res.status(201).json(product))
        .catch(error => this.handleError(error, res));
    }
}