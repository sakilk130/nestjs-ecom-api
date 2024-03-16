import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { Roles } from 'src/utility/enums/user-roles.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    private readonly productService: ProductsService,
  ) {}

  async create(createReviewDto: CreateReviewDto, currentUser: User) {
    const product = await this.productService.findOne(
      createReviewDto.product_id,
    );
    if (!product) throw new NotFoundException('Product not found');
    const findExitingReview = await this.reviewRepo.findOne({
      where: {
        user_id: currentUser.id,
        product_id: createReviewDto.product_id,
      },
    });
    if (findExitingReview)
      throw new BadRequestException('Already reviewed this product');
    const review = await this.reviewRepo.create(createReviewDto);
    review.user_id = currentUser.id;
    return await this.reviewRepo.save(review);
  }

  findAll() {
    return this.reviewRepo.find({
      relations: {
        user_id_info: true,
        product_id_info: true,
      },
      select: {
        user_id_info: {
          id: true,
          name: true,
          email: true,
        },
        product_id_info: {
          id: true,
          title: true,
          description: true,
          price: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: {
        user_id_info: true,
        product_id_info: true,
      },
      select: {
        user_id_info: {
          id: true,
          name: true,
          email: true,
        },
        product_id_info: {
          id: true,
          title: true,
          description: true,
          price: true,
        },
      },
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
    currentUser: User,
  ) {
    const review = await this.findOne(id);
    if (!review) throw new NotFoundException('Review not found');
    if (review.user_id !== currentUser.id) {
      throw new BadRequestException("User don't have permission to update");
    }
    delete updateReviewDto.product_id;
    Object.assign(review, updateReviewDto);
    return await this.reviewRepo.save(review);
  }

  async remove(id: number, currentUser: User) {
    const review = await this.findOne(id);
    if (
      review.user_id === currentUser.id ||
      currentUser.roles.includes(Roles.ADMIN)
    ) {
      return await this.reviewRepo.remove(review);
    } else {
      throw new BadRequestException("User don't have permission to delete");
    }
  }
}
