import express, { Router } from "express"
import fileUpload from 'express-fileupload'


interface Options{
    port : number,
    router: Router,
    public_path?: string
}


export class Server{
    private readonly app = express();
    private readonly port: number;
    private readonly router : Router;
    private readonly public_path? : string;

    constructor(options: Options){
        const {port, router, public_path} = options;
        this.port = port;
        this.router = router;
        this.public_path = public_path; 
    }


    async start(){
        

        // Middlewares
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
            useTempFiles : true,
            tempFileDir : './uploads'
        }));

        //Routes
        this.app.use(this.router);


        this.app.listen(this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`);
        }); 

    }


}