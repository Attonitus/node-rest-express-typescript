import { envs } from "./config/envs";
import { MongoConnection } from "./data";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(() => {
    main();
})();



async function main(){

    await MongoConnection.connect({
        mongoUrl: envs.MONGO_URL,
        dbName: envs.MONGO_DB_NAME
    });

    const server = new Server({
        port: envs.PORT,
        router: AppRoutes.routes,
    });

    server.start();
}