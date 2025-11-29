import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from '../service/otp.service';
import { SendOtpDto } from '../models/send-otp.dto';
import { VerifyOtpDto } from '../models/verify-otp.dto';

@Controller('otp')
export class OtpController {
  constructor(private otpService: OtpService) {}

  @Post('send')
  sendOtp(@Body() body: SendOtpDto) {
    return this.otpService.sendOtp(body.email);
  }

  @Post('verify')
  verifyOtp(@Body() body: VerifyOtpDto) {
    return this.otpService.verifyOtp(body.email, body.otp);
  }
}
