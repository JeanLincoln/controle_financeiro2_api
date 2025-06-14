import { SubCategory } from "@domain/entities/sub-category.entity";
import {
  SubCategoryRepository,
  CreateOrUpdateAllSubCategoryProps
} from "@domain/repositories/sub-category.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class TypeOrmSubCategoryRepository implements SubCategoryRepository {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>
  ) {}

  async create(subCategory: CreateOrUpdateAllSubCategoryProps): Promise<void> {
    const subCategoryInstance = this.subCategoryRepository.create({
      ...subCategory,
      category: { id: subCategory.categoryId }
    });
    await this.subCategoryRepository.save(subCategoryInstance);
  }

  async findAllByUserId(userId: number): Promise<SubCategory[]> {
    return await this.subCategoryRepository.find({
      where: {
        category: {
          user: { id: userId }
        }
      }
    });
  }

  async findById(id: number): Promise<SubCategory | null> {
    return await this.subCategoryRepository.findOne({
      where: { id },
      relations: ["category.user"]
    });
  }

  async update(
    id: number,
    subCategory: CreateOrUpdateAllSubCategoryProps
  ): Promise<void> {
    await this.subCategoryRepository.update(id, subCategory);
  }

  async delete(id: number): Promise<void> {
    await this.subCategoryRepository.delete(id);
  }
}
