import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import slugify from 'slugify';
import { CategoriesService } from 'src/categories/categories.service';
import { User } from 'src/users/entities/user.entity';
import { Status } from 'src/utility/enums/status-enum';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductListSearchQueryDto } from './dto/product-list-search-query-dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
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

  async findAll(filter: ProductListSearchQueryDto) {
    try {
      filter = {
        ...filter,
        page: Number(filter.page || 1),
        page_size: Number(filter.page_size || 10),
      };
      const options: FindManyOptions<Product> = {
        skip: (filter.page - 1) * filter.page_size,
        take: filter.page_size,
        where: {
          category_id_info: {
            status: Status.ACTIVE,
          },
        },
        relations: {
          category_id_info: true,
        },
        select: {
          category_id_info: {
            id: true,
            title: true,
            description: true,
            status: true,
          },
        },
        order: {
          created_at: 'DESC',
        },
      };
      if (filter.search_term) {
        options.where = [
          {
            category_id_info: {
              status: Status.ACTIVE,
            },
            title: ILike(`%${filter.search_term.toLowerCase()}%`),
          },
          {
            category_id_info: {
              status: Status.ACTIVE,
            },
            description: ILike(`%${filter.search_term.toLowerCase()}%`),
          },
        ];
      }
      const [products, totalCount] =
        await this.productRepo.findAndCount(options);
      const totalPage = Math.ceil(totalCount / filter.page_size);
      const metaData = {
        current_page: filter.page,
        page_size: filter.page_size,
        total: totalCount,
        total_page: totalPage,
      };
      return {
        products,
        meta_data: metaData,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.productRepo.findOne({
        where: {
          id,
          category_id_info: {
            status: Status.ACTIVE,
          },
        },
        relations: {
          category_id_info: true,
        },
        select: {
          category_id_info: {
            id: true,
            title: true,
            description: true,
            status: true,
          },
        },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    currentUser: User,
  ) {
    try {
      const product = await this.findOne(id);
      if (!product) throw new NotFoundException('Product not found');
      Object.assign(product, updateProductDto);
      product.added_by = currentUser.id;
      if (updateProductDto.category_id) {
        const category = await this.categoryRepo.findOne({
          where: {
            id: updateProductDto.category_id,
            status: Status.ACTIVE,
          },
        });
        if (!category) throw new NotFoundException('Category not found');
        product.category_id = category.id;
      }
      return await this.productRepo.save(product);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const product = await this.findOne(id);
      if (!product) throw new NotFoundException('Product not found');
      const deletedProduct = await this.productRepo.softDelete(product.id);
      if (deletedProduct.affected > 0) {
        return product;
      } else {
        throw new BadRequestException('Product delete failed ');
      }
    } catch (error) {
      throw error;
    }
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
