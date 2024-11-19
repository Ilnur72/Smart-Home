import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { MessageService } from '../../i18n/message.service';
// import { EskizService } from '../eskiz/eskiz.service';
// import { UserRole } from '../../shared/types/enums';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  private verificationCodes: Map<string, string> = new Map();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UserService,
    // private readonly eskizService: EskizService,
    private readonly messageService: MessageService,

    private jwtService: JwtService,
  ) {}

  async validateUser(body: LoginDto) {
    const existing = await this.userService.findOneByPhone(body.phone);

    const token = this.jwtService.sign({
      user: { id: existing.id, role: existing.role },
    });
    return { token: token };
  }

  async register(createUserDto: CreateUserDto, language: string) {
    try {
      await this.userService.create(createUserDto, language);
      // const verificationCode = Math.floor(
      //   1000 + Math.random() * 9000,
      // ).toString();
      // await this.eskizService.sendSms(
      //   createUserDto.phone,
      //   `Код подтверждения для ketti.uz: ${verificationCode}`,
      // );
      this.verificationCodes.set(createUserDto.phone, '1111');
    } catch (error) {
      throw error;
    }
  }

  async login(body: LoginDto, language: string): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ phone: body.phone, isDeleted: false })
      .addSelect('user.password')
      .getOne();

    // if (user.role === UserRole.ADMIN) {
    const match =
      body?.password && (await compare(body?.password, user?.password));

    if (!match) {
      throw new HttpException(
        this.messageService.getMessage(
          'auth',
          language,
          'phone_or_password_incorrect',
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = await this.validateUser(body);
    return token;
    // }

    if (user) {
      // const verificationCode = Math.floor(
      //   1000 + Math.random() * 9000,
      // ).toString();
      // await this.eskizService.sendSms(
      //   phone,
      //   `Код подтверждения для ketti.uz: ${verificationCode}`,
      // );
      this.verificationCodes.set(body.phone, '1111');
    }
  }

  async verify(phone: string, code: number, language: string): Promise<any> {
    const storedCode = this.verificationCodes.get(phone);
    if (+code !== +storedCode)
      throw new HttpException(
        this.messageService.getMessage(
          'auth',
          language,
          'invalid_verification_code',
        ),
        HttpStatus.BAD_REQUEST,
      );
    this.verificationCodes.delete(phone);
    const token = await this.validateUser({ phone });
    return token;
  }
}
