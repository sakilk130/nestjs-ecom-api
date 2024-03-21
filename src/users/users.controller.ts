import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { Roles } from 'src/utility/enums/user-roles.enum';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { UserSignupDto } from './dto/user-signup.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { PasswordChangeDto } from './dto/password-change-dto';
import { UserListSearchQueryDto } from './dto/user-list-search-query-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() createUserDto: UserSignupDto) {
    const data = await this.usersService.signup(createUserDto);
    return {
      status: 200,
      message: 'Sign up successfully',
      data,
    };
  }

  @Post('signin')
  async signin(@Body() signInUserDto: UserSignInDto) {
    const user = await this.usersService.signin(signInUserDto);
    const accessToken = await this.usersService.accessToken(user);
    return {
      status: 200,
      message: 'Sign up successfully',
      data: {
        user,
        access_token: accessToken,
      },
    };
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      status: 200,
      message: 'User created successfully',
      data: await this.usersService.create(createUserDto),
    };
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get()
  async findAll(@Query() query: UserListSearchQueryDto) {
    return {
      status: 200,
      message: 'Success',
      data: await this.usersService.findAll(query),
    };
  }

  @Get('single/:id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return {
      status: 200,
      message: 'Success',
      data: await this.usersService.findOneById(id),
    };
  }

  @Patch('me')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    return {
      status: 200,
      message: 'Updated successfully',
      data: await this.usersService.update(currentUser, updateUserDto),
    };
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return {
      status: 200,
      message: 'Delete successfully',
      data: await this.usersService.remove(id),
    };
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  getProfile(@CurrentUser() currentUser: User) {
    return {
      status: 200,
      message: 'Success',
      data: currentUser,
    };
  }

  @UseGuards(AuthenticationGuard)
  @Patch('password-change')
  async passwordChange(
    @Body() passwordChange: PasswordChangeDto,
    @CurrentUser() currentUser: User,
  ) {
    return {
      status: 200,
      message: 'Password changed successfully',
      data: await this.usersService.changePassword(passwordChange, currentUser),
    };
  }
}
