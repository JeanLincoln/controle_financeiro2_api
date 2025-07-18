import { SubCategory } from "@domain/entities/sub-category.entity";
import {
  SubCategoryRepository,
  CreateOrUpdateAllSubCategoryProps
} from "@domain/repositories/sub-category.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { USER_WITHOUT_PASSWORD_SELECT } from "../common/selects/user/user.selects";

export class TypeOrmSubCategoryRepository implements SubCategoryRepository {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>
  ) {}

  async create(
    categoryId: number,
    subCategory: CreateOrUpdateAllSubCategoryProps
  ): Promise<void> {
    const subCategoryInstance = this.subCategoryRepository.create({
      ...subCategory,
      category: { id: categoryId },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await this.subCategoryRepository.save(subCategoryInstance);
  }

  async findAllByCategory(categoryId: number): Promise<SubCategory[]> {
    return await this.subCategoryRepository.find({
      where: {
        category: {
          id: categoryId
        }
      }
    });
  }

  async findById(id: number): Promise<SubCategory | null> {
    return await this.subCategoryRepository.findOne({
      where: { id },
      relations: ["category.user"],
      select: {
        category: {
          user: USER_WITHOUT_PASSWORD_SELECT
        }
      }
    });
  }

  async findByIds(ids: number[]): Promise<SubCategory[] | null> {
    return await this.subCategoryRepository.find({
      where: { id: In(ids) },
      relations: ["category.user"],
      select: {
        category: {
          id: true,
          color: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          description: true,
          icon: true,
          user: USER_WITHOUT_PASSWORD_SELECT
        }
      }
    });
  }

  async update(
    id: number,
    categoryId: number,
    subCategory: CreateOrUpdateAllSubCategoryProps
  ): Promise<void> {
    await this.subCategoryRepository.update(id, {
      ...subCategory,
      category: { id: categoryId },
      updatedAt: new Date()
    });
  }

  async delete(id: number): Promise<void> {
    await this.subCategoryRepository.delete(id);
  }
}
