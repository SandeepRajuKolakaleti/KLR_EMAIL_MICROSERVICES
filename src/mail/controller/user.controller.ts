import { Body, Controller, Get, HttpCode, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LoginApigateDto } from '../models/dto/LoginApigate.dto';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllUsers() {
        return this.userService.getUsers();
    }

    @Post('login')
    @HttpCode(200)
    async loginUser(@Body() loginUserDto: LoginApigateDto): Promise<Observable<Object>> {
        return await this.userService.generateApiGateToken(loginUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('findByEmail/:email')
    async findByEmail(@Param('email') email): Promise<any> {
        return this.userService.findUserByEmail(email);
    }

}
