import { Injectable } from '@nestjs/common';
import { MailDto } from './mail.dto';
import { EmailService } from '../service/email.service';
import { AppConstants } from '../../app.constants';

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

  async userOtpEmailTemplate(request: { email: string; otp: string }) {
    const html = `
      <div style="font-family: Arial; padding: 20px;">
        <h2>KLR Group Account</h2>
        <p>Your OTP is:</p>
        <h1>${request.otp}</h1>
        <p>This OTP is valid for 2 minutes.</p>
      </div>
    `;

    await this.emailService.sendMail({
      from: `"KLRGROUP" <${process.env.MAIL_FROM}>`,
      to: request.email,
      subject: "Your KLR Group OTP Code",
      html
    });

    return { message: 'Email sent successfully' };
  }
}