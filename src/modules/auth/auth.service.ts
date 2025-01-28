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
import { UserAuth } from '../auth/entities/user-auth.entity';
import { UserRole } from '../../shared/types/enums';

@Injectable()
export class AuthService {
  private verificationCodes: Map<string, string> = new Map();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UserService,
    @InjectRepository(UserAuth)
    private userAuthRepository: Repository<UserAuth>,
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

  // async validateUser: LoginUserDto) {
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

  async login(body: LoginUserDto): Promise<any> {
    try {
      const verificationCode = Math.floor(1000 + Math.random() * 9000);

      const userAuth = await this.userAuthRepository.findOne({
        where: { phone: body.phone },
      });

      if (!userAuth) {
        const newUserAuth = this.userAuthRepository.create({
          phone: body.phone,
          sms_code: verificationCode,
        });
        const { phone, sms_code } = await this.userAuthRepository.save(
          newUserAuth,
        );
        return { phone, sms_code };
      } else {
        const updateUserAuth = this.userAuthRepository.merge(userAuth, {
          sms_code: verificationCode,
        });
        const { phone, sms_code } = await this.userAuthRepository.save(
          updateUserAuth,
        );
        return { phone, sms_code };
      }

      // await this.eskizService.sendSms(
      //   phone,
      //   `Код подтверждения для ketti.uz: ${verificationCode}`,
      // );

      // this.verificationCodes.set(body.phone, verificationCode);

      // return { code: existingUser.sms_code };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verify(phone: string, code: number, language: string): Promise<any> {
    const existingAuthUser = await this.userAuthRepository.findOne({
      where: { phone },
    });
    if (+code !== +existingAuthUser.sms_code)
      throw new HttpException(
        this.messageService.getMessage(
          'auth',
          language,
          'invalid_verification_code',
        ),
        HttpStatus.BAD_REQUEST,
      );

    interface existingUserInterface {
      id: string;
      status: 'NEW' | 'EXIST';
      phone: string;
      sms_code?: number;
    }
    let existingUser: existingUserInterface;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ phone: phone, is_deleted: false })
      .addSelect('user.password')
      .getOne();

    if (user) {
      existingUser = {
        id: user.id,
        phone: existingAuthUser.phone,
        status: 'EXIST',
      };
    } else {
      const newUser = this.userRepository.create({
        phone: phone,
        role: UserRole.USER,
      });
      const result = await this.userRepository.save(newUser);
      existingUser = {
        id: result.id,
        phone: result.phone,
        status: 'NEW',
      };
    }
    const token = this.generateToken(existingUser.id, UserRole.USER);
    return { ...token, status: existingUser.status };
  }

  async staffLogin(body: LoginStaffDto, language: string) {
    const staff = await this.baseUserRepository
      .createQueryBuilder('staff')
      .where({ email: body.email, is_deleted: false })
      .addSelect(['staff.password', 'staff.role'])
      .getOne();
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
    return this.generateToken(staff.id, staff.role);
  }

  private generateToken(id: string, role: string) {
    const token = this.jwtService.sign({ user: { id, role } });
    return { token };
  }
}
