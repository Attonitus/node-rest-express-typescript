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
                available: category.available,
                userID: category.user
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

    async delete(idCategory: string, user: UserEntity){
        if(!idCategory) throw CustomError.badRequest('is is required');

        const category = await CategoryModel.findOne({_id: idCategory});
        if(!category) throw CustomError.badRequest("Category dont exist");

        const [error, categoryDto] = CategoryDto.fromDatabase(category);
        if(error) throw CustomError.badRequest('Error on CategoryDto');

        if(user.id != categoryDto!.user) throw CustomError.badRequest('Category userId and user id is not the same');

        try {
            await CategoryModel.deleteOne({_id: idCategory});
            return 'Category deleted';
        } catch (error) {
            throw CustomError.internalServer('Internal server');
        }

    }

    async update(categoryParam: CategoryDto, user: UserEntity, idCategory: string){
        const {name, available} = categoryParam;

        if(!idCategory) throw CustomError.badRequest('ID is required');

        const isCategoryName = await CategoryModel.findOne({name})
        if(isCategoryName) throw CustomError.badRequest("Category name already exists");

        const category = await CategoryModel.findOne({_id: idCategory});
        if(!category) throw CustomError.badRequest("Category dont exist");

        if(!category.user.equals(user.id)) throw CustomError.badRequest('Category userId and user id is not the same');
        
        try {
            const updatedCategory = await CategoryModel.findByIdAndUpdate(idCategory, {
                available,
                name
            });

            return {
                id: updatedCategory?.id,
                name: updatedCategory?.name,
                available: updatedCategory?.available
            }
        } catch (error) {
            throw CustomError.internalServer('Internal server error');
        }
    }
    
}