import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/file-upload.service";
import { UploadedFile } from "express-fileupload";


export class FileUploadController{

    constructor(
        private readonly fileUploadService: FileUploadService
    ){}


    private handleError = (error: CustomError, res: Response) => {
        if(error instanceof CustomError){
            res.status(error.statusCode).json({error: error.message});
            return;
        }
        res.status(500).json({error: `internal server error ${error}`});
    }

    uploadFile = (  req: Request, res: Response ) => {

        if(!req.files || Object.keys(req.files).length === 0){
            res.status(400).json({error: "No files allowed"});
            return;
        }

        const file = req.files.file as UploadedFile;

        this.fileUploadService.uploadSingleFile(file)
        .then( url => res.json({url}))
        .catch(error => this.handleError(error, res));
    }

    uploadMultipleFile = (  req: Request, res: Response ) => {
        throw CustomError.internalServer("Not implemented");

    }

}