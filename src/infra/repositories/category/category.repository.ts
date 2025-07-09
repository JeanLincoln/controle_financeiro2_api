import { Category } from "@domain/entities/category.entity";
import { User } from "@domain/entities/user.entity";
import {
  CreateOrUpdateAllCategoryProps,
  CategoryRepository
} from "@domain/repositories/category.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { USER_WITHOUT_PASSWORD_SELECT } from "../common/selects/user/user.selects";
import {
  RepositoryToPaginationReturn,
  type RepositoryPaginationParams
} from "@domain/entities/pagination.entity";

export class TypeOrmCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async findAll(
    userId: number,
    { skip, take }: RepositoryPaginationParams
  ): Promise<RepositoryToPaginationReturn<Category>> {
    const [categories, total] = await this.categoryRepository.findAndCount({
      where: { user: { id: userId } },
      skip,
      take
    });

    return {
      data: categories,
      total
    };
  }

  async findById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ["user", "subCategories"],
      select: {
        user: USER_WITHOUT_PASSWORD_SELECT
      }
    });
  }

  async findByIds(ids: number[]): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { id: In(ids) },
      relations: ["user"],
      select: {
        user: USER_WITHOUT_PASSWORD_SELECT
      }
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
