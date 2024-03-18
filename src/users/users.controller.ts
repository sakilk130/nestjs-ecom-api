import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('single/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  getProfile(@CurrentUser() currentUser: User) {
    return currentUser;
  }
}
