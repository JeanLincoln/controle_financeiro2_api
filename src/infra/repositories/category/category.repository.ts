import { Category } from "@domain/entities/category.entity";
import { User } from "@domain/entities/user.entity";
import {
  CreateOrUpdateAllCategoryProps,
  CategoryRepository
} from "@domain/repositories/category.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";

export class TypeOrmCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async findAll(userId: number): Promise<Category[]> {
    return this.categoryRepository.find({ where: { user: { id: userId } } });
  }

  async findById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ["user", "subCategories"]
    });
  }

  async findByIds(ids: number[]): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { id: In(ids) },
      relations: ["user"]
    });
  }

  async create(
    user: User,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<void> {
    const categoryInstance = this.categoryRepository.create({
      ...category,
      user: user,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await this.categoryRepository.save(categoryInstance);
  }

  async update(
    id: number,
    userId: number,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<void> {
    await this.categoryRepository.update(id, {
      ...category,
      user: { id: userId },
      updatedAt: new Date()
    });
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.categoryRepository.delete({ user: { id: userId } });
  }
}
