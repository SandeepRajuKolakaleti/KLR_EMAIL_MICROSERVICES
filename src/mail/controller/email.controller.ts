import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { SendEmailRequest } from '../models/dto/SendEmail.request';
import { MailTemplate } from '../templates/mail.templates';

@Controller('email')
export class EmailController {
    constructor(private mailTemplate: MailTemplate) { }

    @Post('send')
    sendMail(@Body() request: SendEmailRequest) {
        return this.mailTemplate.userEmailTemplate(request);
        // test app constants - AppConstants.app.xyz
    }

}
