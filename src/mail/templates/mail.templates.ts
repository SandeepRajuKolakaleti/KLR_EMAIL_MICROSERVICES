import { Injectable } from '@nestjs/common';
import { MailDto } from './mail.dto';
import { EmailService } from '../service/email.service';
import { AppConstants } from 'src/app.constants';

@Injectable()
export class MailTemplate {
  mailOptions: MailDto;
  constructor(private emailService: EmailService) {}
  async userEmailTemplate(mailDto: MailDto) {
    this.mailOptions = {
      from: process.env.MAIL_EMAILFROM,
      to: mailDto.to,
      cc: mailDto.cc,
      subject: AppConstants.app.Templates.sendEmail.KLRSubject + mailDto.subject,
      html: `<body>`+
        `<p>`+ mailDto.body + `</p><br/>
        <p><b>${AppConstants.app.Templates.sendEmail.KLRDescription}</b></p><br/>`+ 
      `</body>`
    };
    return await this.emailService.sendMail(this.mailOptions);
  };
}