import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto, LoginStaffDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { MessageService } from '../../i18n/message.service';
// import { EskizService } from '../eskiz/eskiz.service';
// import { UserRole } from '../../shared/types/enums';
import { compare } from 'bcryptjs';
import { BaseUser } from '../../shared/entities/base-staff.entity';

@Injectable()
export class AuthService {
  // private verificationCodes: Map<string, string> = new Map();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UserService,
    // private readonly eskizService: EskizService,
    private readonly messageService: MessageService,
    private jwtService: JwtService,
    // @InjectRepository(SystemUser)
    // private systemUserRepository: Repository<SystemUser>,
    // @InjectRepository(Operator)
    // private operatorRepository: Repository<Operator>,
    // @InjectRepository(OperatorUser)
    // private operatorUserRepository: Repository<OperatorUser>,
    @InjectRepository(BaseUser)
    private baseUserRepository: Repository<BaseUser>,
  ) {}

  // async validateUser(body: LoginUserDto) {
  //   const existing = await this.userService.findOneByPhone(body.phone);

  //   const token = this.generateToken(existing.id, existing.role);

  // return token;
  // }

  async register(createUserDto: CreateUserDto, language: string) {
    try {
      return await this.userService.create(createUserDto, language);
      // const verificationCode = Math.floor(
      //   1000 + Math.random() * 9000,
      // ).toString();
      // await this.eskizService.sendSms(
      //   createUserDto.phone,
      //   `Код подтверждения для ketti.uz: ${verificationCode}`,
      // );
      // this.verificationCodes.set(createUserDto.phone, '1111');
    } catch (error) {
      throw error;
    }
  }

  async login(body: LoginUserDto, language: string): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ phone: body.phone, is_deleted: false })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new HttpException(
        this.messageService.getMessage('auth', language, 'user_not_found'),
        HttpStatus.NOT_FOUND,
      );
    }

    const match =
      body?.password && (await compare(body?.password, user?.password));

    if (!match) {
      throw new HttpException(
        this.messageService.getMessage('auth', language, 'invalid_credentials'),
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = this.generateToken(user.id, user.role, user.fullname);
    return token;
    // }

    // if (user) {
    // const verificationCode = Math.floor(
    //   1000 + Math.random() * 9000,
    // ).toString();
    // await this.eskizService.sendSms(
    //   phone,
    //   `Код подтверждения для ketti.uz: ${verificationCode}`,
    // );
    //   this.verificationCodes.set(body.phone, '1111');
    // }
  }

  // async verify(phone: string, code: number, language: string): Promise<any> {
  //   const storedCode = this.verificationCodes.get(phone);
  //   if (+code !== +storedCode)
  //     throw new HttpException(
  //       this.messageService.getMessage(
  //         'auth',
  //         language,
  //         'invalid_verification_code',
  //       ),
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   this.verificationCodes.delete(phone);
  //   const token = await this.validateUser({ phone });
  //   return token;
  // }

  async staffLogin(body: LoginStaffDto, language: string) {
    const staff = await this.baseUserRepository
      .createQueryBuilder('staff')
      .where({ email: body.email, is_deleted: false })
      .addSelect(['staff.password', 'staff.role'])
      .getOne();
    console.log(staff);
    if (!staff) {
      throw new HttpException(
        this.messageService.getMessage('auth', language, 'user_not_found'),
        HttpStatus.NOT_FOUND,
      );
    }

    const match = await compare(body.password, staff.password);

    if (!match) {
      throw new HttpException(
        this.messageService.getMessage('auth', language, 'invalid_credentials'),
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.generateToken(staff.id, staff.role, staff.name);
  }

  private generateToken(id: string, role: string, fullname: string) {
    const token = this.jwtService.sign({ user: { id, role, fullname } });
    return { token };
  }
}
