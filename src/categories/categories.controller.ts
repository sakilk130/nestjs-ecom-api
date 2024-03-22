import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/enums/user-roles.enum';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() currentUser: User,
  ) {
    const data = await this.categoriesService.create(
      createCategoryDto,
      currentUser,
    );
    return {
      status: 200,
      message: 'Category created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return {
      status: 200,
      message: 'Success',
      data: categories,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.findOne(id);
    return {
      status: 200,
      message: 'Success',
      data: category,
    };
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.update(id, updateCategoryDto);
    return {
      status: 200,
      message: 'Category udated successfully',
      data: category,
    };
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.remove(id);
    return {
      status: 200,
      message: 'Category deleted successfully',
      data: category,
    };
  }
}
