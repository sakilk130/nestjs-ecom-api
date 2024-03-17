import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly categoryService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto, currentUser: User) {
    const category = await this.categoryService.findOne(
      createProductDto.category_id,
    );
    if (!category) throw new NotFoundException('Category not found');
    const product = await this.productRepo.create(createProductDto);
    product.added_by_info = currentUser;
    product.category_id_info = category;
    return this.productRepo.save(product);
  }

  findAll() {
    return this.productRepo.find({
      relations: {
        category_id_info: true,
        added_by_info: true,
        reviews: true,
      },
      select: {
        category_id_info: {
          id: true,
          title: true,
          description: true,
        },
        added_by_info: {
          id: true,
          name: true,
        },
        reviews: {
          id: true,
          ratings: true,
          comments: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: {
        id,
      },
      relations: {
        category_id_info: true,
        added_by_info: true,
      },
      select: {
        category_id_info: {
          id: true,
          title: true,
          description: true,
        },
        added_by_info: {
          id: true,
          name: true,
        },
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    currentUser: User,
  ) {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Product not found');
    Object.assign(product, updateProductDto);
    product.added_by = currentUser.id;
    if (updateProductDto.category_id) {
      const category = await this.categoryService.findOne(
        updateProductDto.category_id,
      );
      if (!category) throw new NotFoundException('Category not found');
      product.category_id = category.id;
    }
    return await this.productRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Product not found');
    return this.productRepo.remove(product);
  }
}
