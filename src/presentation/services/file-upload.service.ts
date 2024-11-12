import { UploadedFile } from "express-fileupload"
import { uploadImage } from "../../config/cloudinary.adapter"
import { CustomError } from "../../domain";
import fs from 'fs-extra'

export class FileUploadService{



    uploadSingleFile = async(files: UploadedFile, 
        folder: string = "uploads", 
        validExtensions = ["png", "jpeg", "jpg", "gif", "webp"],
    ) => {

        const type = files.mimetype.split("/").at(1);
        if(!validExtensions.includes(type!)){
            throw CustomError.badRequest("the file is not valid!");
        }
        try {
            console.log(files.mimetype);
            const [error, result] = await uploadImage(files.tempFilePath, "test");
            if(error){
                throw CustomError.badRequest("Error uploading image");
            }
            await fs.unlink(files.tempFilePath);
            return result?.url;
        } catch (error) {
            throw CustomError.internalServer(`Internal server error ${error}`);
        }

    }


    uploadMultipleFile = async(files: UploadedFile[], 
        folder: string = "uploads", 
        validExtensions = ["png", "jgep", "jpg", "gif",]
    ) => {
        try {
            const urls = files.map( async(file) => {
                const type = file.mimetype.split("/").at(1);
                if(!validExtensions.includes(type!)){
                    throw CustomError.badRequest("the file is not valid!");
                }
                try {
                    console.log(file.mimetype);
                    const [error, result] = await uploadImage(file.tempFilePath, "test");
                    if(error){
                        throw CustomError.badRequest("Error uploading image");
                    }
                    await fs.unlink(file.tempFilePath);
                    return {
                        urls: {
                            url: result?.secure_url
                        } 
                    };
                } catch (error) {
                    throw CustomError.internalServer(`Internal server error ${error}`);
                }
            })
            return urls;
        } catch (error) {
            throw CustomError.badRequest(`${error}`);
        }
    }
}