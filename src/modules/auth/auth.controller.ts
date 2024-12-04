import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, LoginStaffDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { MessageService } from '../../i18n/message.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LanguageDto } from 'src/shared/types/enums';
import { Language } from 'src/shared/decorators/language.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'You have successfully registered.',
  })
  @Post('register')
  async register(
    @Body() body: CreateUserDto,
    @Language() language: LanguageDto,
  ) {
    try {
      await this.authService.register(body, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'auth',
          language,
          'registration_success',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  async login(@Body() body: LoginUserDto, @Language() language: LanguageDto) {
    try {
      const data = await this.authService.login(body, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'auth',
          language,
          'login_success',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('login-staff')
  async staffLogin(
    @Body() body: LoginStaffDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.authService.staffLogin(body, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'auth',
          language,
          'login_success',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  // @Post('verify')
  // async verify(
  //   @Body() body: VerifyDto,
  // @Language() language: LanguageDto,
  // ) {
  //   try {
  //     const data = await this.authService.verify(
  //       body.phone,
  //       body.code,
  //       language,
  //     );
  //     return {
  //       success: true,
  //       code: 201,
  //       data: data,
  //       message: this.messageService.getMessage(
  //         'auth',
  //         language,
  //         'phone_number_verified_successfully',
  //       ),
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
