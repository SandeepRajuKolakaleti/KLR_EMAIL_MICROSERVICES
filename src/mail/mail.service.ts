import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }
  transporter: any;
  async sendUserConfirmation(urlStr: string) {
    const smtpTransport = nodemailer.createTransport({
      service:process.env.MAIL_SERVICE,
      auth: {
        type:process.env.MAIL_TYPE,
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    });
    smtpTransport.sendMail(urlStr, function (error) {
      if (error) {
        console.log('error:', error);
      } else {
        console.log('Mail Sent Successfully !!!');
      }
    });
  }
}
