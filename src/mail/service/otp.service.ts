import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import { MailTemplate } from '../templates/mail.templates';
import { from, Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private mailTemplate: MailTemplate,
    ) {}
    private otpStore = new Map<string, { otpHash: string; expiresAt: number }>();

    generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    hashOtp(otp: string): string {
        return crypto.createHash('sha256').update(otp).digest('hex');
    }

    async sendOtp(email: string) {
        const user = await this.findUserByEmail(email).toPromise();

        if (!user) {
            throw new HttpException(
                { message: 'User not found' },
                HttpStatus.NOT_FOUND,
            );
        }
        const otp = this.generateOtp();
        const otpHash = this.hashOtp(otp);

        this.otpStore.set(email, {
        otpHash,
        expiresAt: Date.now() + 2 * 60 * 1000, // 2 minutes
        });

        this.mailTemplate.userOtpEmailTemplate({ email, otp });

        console.log(`OTP for ${email} = ${otp}`); // Replace with email/SMS provider

        return {
        message: 'OTP sent successfully',
        };
    }

    findUserByEmail(email: string): Observable<any> {
        return from(this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'name', 'password', 'phonenumber', 'image', 'permissionId', 'address', 'birthday', 'userRole'], 
        }));
    }

    async verifyOtp(email: string, otp: string) {
        const data = this.otpStore.get(email);

        if (!data) throw new BadRequestException('OTP not found');

        if (Date.now() > data.expiresAt) {
        this.otpStore.delete(email);
        throw new BadRequestException('OTP expired');
        }

        const otpHash = this.hashOtp(otp);

        if (otpHash !== data.otpHash) {
        throw new BadRequestException('Invalid OTP');
        }

        this.otpStore.delete(email);

        return { message: 'OTP verified successfully', status: true };
    }
}
