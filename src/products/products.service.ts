import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/users/entities/user.entity';
import { Product } from './entities/product.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { Status } from 'src/utility/enums/status-enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly categoryService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto, currentUser: User) {
    try {
      const category = await this.categoryService.findOne(
        createProductDto.category_id,
      );
      if (!category || category.status === Status.INACTIVE) {
        throw new NotFoundException('Category not found');
      }
      const slug = await this.generateUniqueSlug(createProductDto.title);
      if (!slug) {
        throw new BadRequestException('Product save failed');
      }
      const product = await this.productRepo.create({
        ...createProductDto,
        slug,
      });
      product.added_by = currentUser.id;
      product.category_id = category.id;
      return await this.productRepo.save(product);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.productRepo.find({
      relations: {
        category_id_info: true,
      },
      select: {
        category_id_info: {
          id: true,
          title: true,
          description: true,
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

  async generateUniqueSlug(title: string): Promise<string> {
    try {
      let slug = slugify(title, { lower: true });
      const existingProduct = await this.productRepo.findOne({
        where: { slug },
      });
      if (existingProduct) {
        let count = 1;
        while (true) {
          const newSlug = `${slug}-${count}`;
          const slugExists = await this.productRepo.findOne({
            where: { slug: newSlug },
          });
          if (!slugExists) {
            slug = newSlug;
            break;
          }
          count++;
        }
        return slug;
      }
      return slug;
    } catch (error) {
      throw error;
    }
  }
}
