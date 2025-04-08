'use strict';
import { HttpStatus, HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { createTransport, SendMailOptions, SentMessageInfo, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
    private readonly _transporter: Transporter;

    constructor() {
        Logger.log('initialising nodemailer:', 'EMAIL SERVICE');
        // create reusable transporter object using the default SMTP transport
        this._transporter = createTransport({
            service: process.env.MAIL_SERVICE,
            auth: {
                type: process.env.MAIL_TYPE,
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });
    }

    /**
     *
     * @param {SendMailOptions} mailOptions
     */
    async sendMail(mailOptions: SendMailOptions) {
        // promise send mail
        return await this._transporter.sendMail(mailOptions).then((info: SentMessageInfo) => {
            Logger.log('success[sendMail]:', info);
            return {
                statusCode: HttpStatus.OK,
                message: 'Mail Sent',
                data: info,
            };
        }).catch((err) => {
            Logger.log('error[sendMail]:', err);
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Failed to send',
                data: err,
            }, HttpStatus.BAD_REQUEST);
        });
    }
}  