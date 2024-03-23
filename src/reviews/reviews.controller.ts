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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser: User,
  ) {
    return {
      status: 200,
      message: 'Review created successfully',
      data: await this.reviewsService.create(createReviewDto, currentUser),
    };
  }

  @Get('all')
  async findAll() {
    return {
      status: 200,
      message: 'Success',
      data: await this.reviewsService.findAll(),
    };
  }

  @Get('all/:productId')
  async findAllByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return {
      status: 200,
      message: 'Success',
      data: await this.reviewsService.findAllByProduct(productId),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      status: 200,
      message: 'Success',
      data: await this.reviewsService.findOne(id),
    };
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() currentUser: User,
  ) {
    return {
      status: 200,
      message: 'Review update successfully',
      data: await this.reviewsService.update(id, updateReviewDto, currentUser),
    };
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return {
      status: 200,
      message: 'Review deleted successfully',
      data: await this.reviewsService.remove(id, currentUser),
    };
  }
}
