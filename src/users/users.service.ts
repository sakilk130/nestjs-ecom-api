import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { Roles } from 'src/utility/enums/user-roles.enum';
import { PasswordChangeDto } from './dto/password-change-dto';
import { Status } from 'src/utility/enums/status-enum';
import { UserListSearchQueryDto } from './dto/user-list-search-query-dto';

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
      if (findUser.status === Status.INACTIVE) {
        throw new BadRequestException('Your account is currently inactive');
      }
      const comparePassword = await compare(
        signInUserDto.password,
        findUser.password,
      );
      if (!comparePassword) {
        throw new BadRequestException('Invalid Email / Password');
      }
      delete findUser.password;
      delete findUser.deleted_at;
      return findUser;
    } catch (error) {
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const userExits = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
        withDeleted: true,
      });
      if (userExits.status === Status.INACTIVE) {
        throw new BadRequestException('Your account is currently inactive');
      }
      if (userExits && !userExits.deleted_at) {
        throw new BadRequestException('Email is already taken');
      }
      createUserDto.password = await hash(createUserDto.password, 10);
      let user: User | null = null;
      if (userExits.deleted_at) {
        Object.assign(userExits, { ...createUserDto, deleted_at: null });
        user = await this.userRepository.save(userExits);
      } else {
        user = this.userRepository.create(createUserDto);
        user = await this.userRepository.save(user);
      }
      delete user.password;
      delete user.deleted_at;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findAll(query: UserListSearchQueryDto) {
    try {
      query = {
        ...query,
        page: Number(query.page || 1),
        page_size: Number(query.page_size || 10),
      };
      const options: FindManyOptions<User> = {
        skip: (query.page - 1) * query.page_size,
        take: query.page_size,
        where: [],
        select: [
          'id',
          'name',
          'email',
          'roles',
          'status',
          'created_at',
          'updated_at',
        ],
      };
      if (query.search_term) {
        options.where = [
          {
            name: ILike(`%${query.search_term.toLowerCase()}%`),
          },
          {
            email: ILike(`%${query.search_term.toLowerCase()}%`),
          },
        ];
      }
      const [users, totalUsers] =
        await this.userRepository.findAndCount(options);
      const totalPage = Math.ceil(totalUsers / query.page_size);
      const metaData = {
        current_page: query.page,
        page_size: query.page_size,
        total: totalUsers,
        total_page: totalPage,
      };
      return { users, meta_data: metaData };
    } catch (error) {
      console.log(error);
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

  async update(currentUser: User, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOneById(currentUser.id);
      if (user.email !== updateUserDto.email && updateUserDto.email) {
        const exitingEmail = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
          withDeleted: true,
        });
        if (exitingEmail) {
          throw new BadRequestException('Email is already taken');
        }
      }
      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const user = await this.findOneById(id);
      const deletedUser = await this.userRepository.softDelete(user.id);
      if (deletedUser.affected > 0) {
        return user;
      } else {
        throw new BadRequestException('User delete failed');
      }
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
