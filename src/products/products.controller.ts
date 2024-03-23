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
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/enums/user-roles.enum';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ProductListSearchQueryDto } from './dto/product-list-search-query-dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: User,
  ) {
    return {
      status: 200,
      message: 'Product created successfully',
      data: await this.productsService.create(createProductDto, currentUser),
    };
  }

  @Get()
  async findAll(@Query() filter: ProductListSearchQueryDto) {
    return {
      status: 200,
      message: 'Success',
      data: await this.productsService.findAll(filter),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      status: 200,
      message: 'Success',
      data: await this.productsService.findOne(id),
    };
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() currentUser: User,
  ) {
    return {
      status: 200,
      message: 'Product update successfully',
      data: await this.productsService.update(
        id,
        updateProductDto,
        currentUser,
      ),
    };
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return {
      status: 200,
      message: 'Product deleted successfully',
      data: await this.productsService.remove(id),
    };
  }
}
