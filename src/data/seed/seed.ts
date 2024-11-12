import { envs } from "../../config/envs";
import { MongoConnection } from "../mongo/connection";
import { CategoryModel } from "../mongo/models/category-model";
import { ProductModel } from "../mongo/models/product-model";
import { UserModel } from "../mongo/models/user-model";
import { seedData } from "./data";


(async () => {
    await MongoConnection.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    });
    await main();

    await MongoConnection.disconnected();
})();


const randomBetween = (x: number) => {
    return Math.floor(Math.random() * x);
}

async function main(){

    await Promise.all([
        await UserModel.deleteMany(),
        await ProductModel.deleteMany(),
        await CategoryModel.deleteMany(),
    ]);

    const users = await UserModel.insertMany(seedData.users);

    const categories = await CategoryModel.insertMany(
        seedData.categories.map( category => {
            return {
                ...category,
                user: users[0].id
            }
        })
    );

    const products = await ProductModel.insertMany(
        seedData.products.map( product => {
            return {
                ...product,
                category: categories[randomBetween(seedData.users.length - 1)].id,
                user: users[randomBetween(seedData.users.length - 1)].id
            }
        })
    );

    console.log("SEEDED")
}