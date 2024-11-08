import {connect} from 'mongoose';

interface Options{
    mongoUrl: string,
    dbName: string
}


export class MongoConnection{

    static async connect(options: Options) {
        const { mongoUrl, dbName } = options;
        try {
            await connect(mongoUrl, {
                dbName
            });
            return true;
        } catch (error) {
            console.log("Mongo db connection error");
            return error;
        }
    } 
}