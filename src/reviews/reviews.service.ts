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
import { Status } from 'src/utility/enums/status-enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    private readonly productService: ProductsService,
  ) {}

  async create(createReviewDto: CreateReviewDto, currentUser: User) {
    try {
      const product = await this.productService.findOne(
        createReviewDto.product_id,
      );
      console.log(product);
      if (!product || product.status === Status.INACTIVE)
        throw new NotFoundException('Product not found');
      let review = await this.reviewRepo.findOne({
        where: {
          user_id: currentUser.id,
          product_id: createReviewDto.product_id,
        },
      });
      if (review) {
        review.comments = createReviewDto.comments;
        review.ratings = createReviewDto.ratings;
      } else {
        review = await this.reviewRepo.create(createReviewDto);
        review.user_id = currentUser.id;
        review.product_id = product.id;
      }
      return await this.reviewRepo.save(review);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.reviewRepo.find({
        where: {
          product_id_info: {
            status: Status.ACTIVE,
          },
        },
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
            status: true,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllByProduct(productId: number) {
    try {
      await this.productService.findOne(productId);
      return this.reviewRepo.find({
        where: {
          product_id: productId,
          product_id_info: {
            status: Status.ACTIVE,
          },
        },
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
            status: true,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
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
            status: true,
          },
        },
      });
      if (!review) throw new NotFoundException('Review not found');
      return review;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
    currentUser: User,
  ) {
    try {
      const review = await this.findOne(id);
      if (!review) throw new NotFoundException('Review not found');
      if (review.user_id !== currentUser.id) {
        throw new BadRequestException("User don't have permission to update");
      }
      delete updateReviewDto.product_id;
      Object.assign(review, updateReviewDto);
      return await this.reviewRepo.save(review);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, currentUser: User) {
    try {
      const review = await this.findOne(id);
      if (
        review.user_id === currentUser.id ||
        currentUser.roles.includes(Roles.ADMIN)
      ) {
        const deletedReview = await this.reviewRepo.softDelete(review.id);
        if (deletedReview.affected > 0) {
          return review;
        } else {
          throw new BadRequestException('Review deleted failed ');
        }
      } else {
        throw new BadRequestException("User don't have permission to delete");
      }
    } catch (error) {
      throw error;
    }
  }
}
