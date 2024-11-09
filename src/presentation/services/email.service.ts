import{ createTransport, Transporter } from 'nodemailer'

interface IEmailOptions {
    to: string,
    subject: string,
    html: string
}


export class EmailService{

    private transporter: Transporter;

    constructor(
        private readonly mailerService: string,
        private readonly mailerEmail: string,
        private readonly mailerSecretKet: string
    ){
        this.transporter = createTransport({
            service: mailerService,
            auth: {
                user: mailerEmail,
                pass: mailerSecretKet
            }
        });
    }

    async sendMail( options : IEmailOptions): Promise<Boolean>{
        try {
            const {to, subject, html} = options;
    
            await this.transporter.sendMail({
                to,
                subject,
                html
            })
            return true;
        } catch (error) {
            return false;
        }

    }

}

