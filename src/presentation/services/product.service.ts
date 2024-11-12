import { ProductModel } from "../../data";
import { CustomError, PaginationDto, ProductDto } from "../../domain";



export class ProductService{

    async getAll(paginationDto: PaginationDto){
        const { page, limit } = paginationDto;
        try {

            const [total, products] = await Promise.all([
                await ProductModel.countDocuments(),
                await ProductModel.find()
                .skip( (page - 1) * limit)
                .limit(limit)
                .populate('user')
            ]);

            return {
                page,
                limit,
                total,
                nextPage: (page >= Math.ceil(total / limit)) 
                ? null : `/api/products?page=${page + 1}&limit=${limit}`,
                prevPage: ((page-1) <= 0 ? null : `/api/products?page=${page - 1}&limit=${limit}`),
                products,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async create(productDto: ProductDto){

        try {

            const category = new ProductModel({
                ...productDto,
            });

            await category.save();

            return category;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}