import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { LoginApigateDto } from '../models/dto/LoginApigate.dto';
import { AuthService } from '../../auth/services/auth/auth.service';
import { RedisCacheService } from '../../redis/redis.service';
import { MailService } from '../../mail/mail.service';
import { MailTemplate } from '../../mail/templates/mail.templates';
import { MailDto } from '../../mail/templates/mail.dto';
import { AppConstants } from '../../app.constants';

@Injectable()
export class UserService {
    apigateToken: any;
    localToken: any;
    tokenData: any;
    token: any;
    mailOptions: any;
    userPermission:any;
    constructor(
        private http: HttpService,
        private authService: AuthService,
        private redisCacheService: RedisCacheService,
        private mailService: MailService,
        private mailTemplate: MailTemplate,
        private mailDto: MailDto
    ) {
    }

    getHeaders(tokens): any {
        const headersRequest = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens}`,
        };
        return headersRequest;
    }

    async getUsers() {
        this.token = await this.redisCacheService.get("apitoken");
        return this.http.get(process.env.SERVER_URL+'api/users', { headers: this.getHeaders(this.token) })
            .pipe(map(response => response.data));
    }

    loginUser(loginUserDto: LoginApigateDto) {
        return this.http.post(process.env.SERVER_URL+'api/users/login', loginUserDto).pipe(map(response => response.data));
    }

    async findUserByEmail(email: String) {
        this.token = await this.redisCacheService.get("apitoken");
        return this.http.get(process.env.SERVER_URL+'api/users/findByMail/' + email, { headers: this.getHeaders(this.token) }).pipe(map(response => response.data));
    }

    async generateApiGateToken(loginUserDto) {
        this.sendEmail(loginUserDto);
        this.authService.generateJwt(loginUserDto).pipe(map(user => {
            if (!user) {
                throw new NotFoundException();
            }
            this.localToken = user;
            return this.localToken;
        })).subscribe(response => {
            console.log("Retun with Local TOken");
        });
        return this.authenticateApiToken(loginUserDto);
    }

    sendEmail(value) {
        this.mailDto.from = AppConstants.app.testMail.fromEmail;
        this.mailDto.to = AppConstants.app.testMail.toEmail;
        this.mailDto.subject = AppConstants.app.testMail.subject;
        this.mailDto.body = AppConstants.app.testMail.body(value.email);
        this.mailOptions = this.mailTemplate.userEmailTemplate(this.mailDto);
    }

    async authenticateApiToken(loginUserDto) {
        var email = loginUserDto.email;
        return this.loginUser(loginUserDto).pipe(map(async response => {
            this.apigateToken = JSON.parse(JSON.stringify(response)).access_token;
            this.userPermission =JSON.parse(JSON.stringify(response)).user_Permission;
            await this.redisCacheService.set('email', email);
            await this.redisCacheService.set('localtoken', this.localToken);
            await this.redisCacheService.set('phoneNo', loginUserDto.phonenumber);
            await this.redisCacheService.set('apitoken', this.apigateToken);
            await this.redisCacheService.set('userPermission', this.userPermission);
            var userData = {
                access_token_local: this.localToken,
                token_type: AppConstants.app.jwt.type,
                user_permission: this.userPermission,
                expires_in: AppConstants.app.jwt.expiryTime
            };
            return userData;
        }));
    }

}