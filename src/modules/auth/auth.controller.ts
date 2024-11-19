import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, VerifyDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { MessageService } from '../../i18n/message.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
  ) {}

  @Post('register')
  async register(
    @Body() body: CreateUserDto,
    @Headers('accept-language') language: string,
  ) {
    try {
      await this.authService.register(body, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'auth',
          language,
          'verification_code_sent',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Headers('accept-language') language: string,
  ) {
    try {
      const data = await this.authService.login(body, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'auth',
          language,
          'verification_code_sent',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('verify')
  async verify(
    @Body() body: VerifyDto,
    @Headers('accept-language') language: string,
  ) {
    try {
      const data = await this.authService.verify(
        body.phone,
        body.code,
        language,
      );
      return {
        success: true,
        code: 201,
        data: data,
        message: this.messageService.getMessage(
          'auth',
          language,
          'phone_number_verified_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }
}
