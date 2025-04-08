import { IsNotEmpty } from "class-validator";

export class MailDto {

    @IsNotEmpty()
    to: string;

    cc?: string;

    @IsNotEmpty()
    from?: string;

    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    body?: string;

    @IsNotEmpty()
    html?: string;

}