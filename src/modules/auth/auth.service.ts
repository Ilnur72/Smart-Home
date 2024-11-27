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
import { SystemUser } from '../system-users/entities/systemUser.entity';
import { Operator } from '../operator/entities/operator.entity';
import { OperatorUser } from '../operator-users/entities/operatorUser.entity';

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
    @InjectRepository(SystemUser)
    private systemUserRepository: Repository<SystemUser>,
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
    @InjectRepository(OperatorUser)
    private operatorUserRepository: Repository<OperatorUser>,
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

    const token = this.generateToken(user.id, user.role);
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
    const [systemUser, operator, operatorUser] = await Promise.all([
      this.systemUserRepository
        .createQueryBuilder('system_user')
        .where({ login: body.login, is_deleted: false })
        .addSelect('system_user.password')
        .getOne(),

      this.operatorRepository
        .createQueryBuilder('operator')
        .where({ login: body.login, is_deleted: false })
        .addSelect('operator.password')
        .getOne(),

      this.operatorUserRepository
        .createQueryBuilder('operator_user')
        .where({ login: body.login, is_deleted: false })
        .addSelect('operator_user.password')
        .getOne(),
    ]);

    const user = systemUser || operator || operatorUser;
    if (!user) {
      throw new HttpException(
        this.messageService.getMessage('auth', language, 'user_not_found'),
        HttpStatus.NOT_FOUND,
      );
    }

    const match = await compare(body.password, user.password);
    if (!match) {
      throw new HttpException(
        this.messageService.getMessage('auth', language, 'invalid_credentials'),
        HttpStatus.BAD_REQUEST,
      );
    }

    let role = 'USER';
    if (systemUser) role = 'SYSTEM_USER';
    else if (operator) role = 'OPERATOR';
    else if (operatorUser) role = 'OPERATOR_USER';

    return this.generateToken(user.id, role);
  }

  private generateToken(id: string, role: string) {
    const token = this.jwtService.sign({ id, role });
    return { token };
  }
}
