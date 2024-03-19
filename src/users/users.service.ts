import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { Roles } from 'src/utility/enums/user-roles.enum';
import { PasswordChangeDto } from './dto/password-change-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signup(signupUserDto: UserSignupDto) {
    try {
      const user = await this.create({ ...signupUserDto, roles: [Roles.USER] });
      const generateToken = await this.accessToken(user);
      return {
        user: user,
        access_token: generateToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async signin(signInUserDto: UserSignInDto) {
    try {
      const findUser = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email=:email', {
          email: signInUserDto.email,
        })
        .getOne();
      if (!findUser) {
        throw new BadRequestException('Invalid Email / Password');
      }
      const comparePassword = await compare(
        signInUserDto.password,
        findUser.password,
      );
      if (!comparePassword) {
        throw new BadRequestException('Invalid Email / Password');
      }
      delete findUser.password;
      return findUser;
    } catch (error) {
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const userExits = await this.findUserByEmail(createUserDto.email);
      if (userExits) {
        throw new BadRequestException('Email is already taken');
      }
      createUserDto.password = await hash(createUserDto.password, 10);
      let user = this.userRepository.create(createUserDto);
      user = await this.userRepository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      throw error;
    }
  }

  async update(currentUser: User, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOneById(currentUser.id);
      if (user.email !== updateUserDto.email && updateUserDto.email) {
        const exitingEmail = await this.userRepository.findOneBy({
          email: updateUserDto.email,
        });
        if (exitingEmail) {
          throw new BadRequestException('Email is already taken');
        }
      }
      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const user = await this.findOneById(id);
      return await this.userRepository.remove(user);
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string) {
    try {
      return await this.userRepository.findOneBy({ email });
    } catch (error) {
      throw error;
    }
  }

  async accessToken(user: User) {
    try {
      return await sign(
        { id: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    passwordChangeDto: PasswordChangeDto,
    currentUser: User,
  ) {
    try {
      let user = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email=:email', {
          email: currentUser.email,
        })
        .getOne();
      const comparePassword = await compare(
        passwordChangeDto.currentPassword,
        user.password,
      );
      if (!comparePassword) {
        throw new BadRequestException("Current password can't match");
      }
      user.password = await hash(passwordChangeDto.newPassword, 10);
      user = await this.userRepository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
