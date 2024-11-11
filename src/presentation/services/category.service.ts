import { CategoryModel } from "../../data";
import { CategoryDto, CustomError, PaginationDto, UserEntity } from "../../domain";


export class CategoryService{

    constructor(){}

    async getAll(paginationDto : PaginationDto){
        const { page, limit } = paginationDto;
        try {

            const [total, categories] = await Promise.all([
                await CategoryModel.countDocuments(),
                await CategoryModel.find()
                .skip( (page - 1) * limit)
                .limit(limit)
            ]);

            return {
                page,
                limit,
                total,
                nextPage: (page >= Math.ceil(total / limit)) 
                ? null : `/api/categories?page=${page + 1}&limit=${limit}`,
                prevPage: ((page-1) <= 0 ? null : `/api/categories?page=${page - 1}&limit=${limit}`),
                categories: categories.map( category => {
                    const {id, name, available} = category;
                    return {
                        id,
                        name,
                        available
                    }
                })
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getById(id: string){

        const category = await CategoryModel.findOne({_id: id});
        if(!category) throw CustomError.badRequest("Category dont exist");
        
        try {

            return {
                id: category.id,
                name: category.name,
                available: category.available
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async create(categoryDto: CategoryDto, user: UserEntity){

        const category = await CategoryModel.findOne({name: categoryDto.name})
        if(category) throw CustomError.badRequest("Category already exists");

        try {

            const category = new CategoryModel({
                ...categoryDto,
                user: user.id
            });

            await category.save();

            return {
                id: category.id,
                name: category.name,
                user: category.user
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    
}