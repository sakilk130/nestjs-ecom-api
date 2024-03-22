import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, currentUser: User) {
    try {
      const category = this.categoryRepo.create(createCategoryDto);
      category.added_by = currentUser.id;
      return await this.categoryRepo.save(category);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return this.categoryRepo.find({});
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoryRepo.findOne({
        where: { id },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return category;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateCategoryDto: Partial<UpdateCategoryDto>) {
    try {
      const category = await this.findOne(id);
      if (!category) {
        throw new NotFoundException('Category not found.');
      }
      Object.assign(category, updateCategoryDto);
      return await this.categoryRepo.save(category);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const category = await this.findOne(id);
      if (!category) throw new NotFoundException('Category not found');
      const deletedCategory = await this.categoryRepo.softDelete(category.id);
      if (deletedCategory.affected > 0) {
        return category;
      } else {
        throw new BadRequestException('Category delete failed');
      }
    } catch (error) {
      throw error;
    }
  }
}
