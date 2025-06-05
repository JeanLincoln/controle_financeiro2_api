import { Category } from "@domain/entities/category.entity";
import {
  CreateOrUpdateAllCategoryProps,
  CategoryRepository
} from "@domain/repositories/category.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class TypeOrmCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async findAll(userId: number): Promise<Category[]> {
    return this.categoryRepository.find({ where: { userId } });
  }

  async findById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async create(
    userId: number,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<void> {
    await this.categoryRepository.save({
      ...category,
      userId
    });
  }

  async update(
    userId: number,
    id: number,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<void> {
    await this.categoryRepository.update(id, {
      ...category,
      userId
    });
    await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
