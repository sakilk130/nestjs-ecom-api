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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signup(createUserDto: UserSignupDto): Promise<User> {
    const userExits = await this.findUserByEmail(createUserDto.email);
    if (userExits) {
      throw new BadRequestException('Email is already taken');
    }
    createUserDto.password = await hash(createUserDto.password, 10);
    let user = this.userRepository.create(createUserDto);
    user = await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async signin(signInUserDto: UserSignInDto) {
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
  }

  create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return 'This action adds a new user';
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  accessToken(user: User) {
    return sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      },
    );
  }
}
