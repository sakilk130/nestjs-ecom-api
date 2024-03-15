import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, currentUser: User) {
    const category = this.categoryRepo.create(createCategoryDto);
    category.added_by_info = currentUser;
    return await this.categoryRepo.save(category);
  }

  findAll() {
    return this.categoryRepo.find({
      relations: {
        added_by_info: true,
      },
      select: {
        added_by_info: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: {
        added_by_info: true,
      },
      select: {
        added_by_info: {
          id: true,
          name: true,
          email: true,
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: number, updateCategoryDto: Partial<UpdateCategoryDto>) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Category not found.');
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepo.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    return await this.categoryRepo.remove(category);
  }
}
