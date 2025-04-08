import { IsNotEmpty, IsString } from "class-validator";


export class SendEmailRequest {

    @IsNotEmpty()
    to: string;

    cc?: string;
    from?: string;

    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    body: string;

    html?: string;
    
}