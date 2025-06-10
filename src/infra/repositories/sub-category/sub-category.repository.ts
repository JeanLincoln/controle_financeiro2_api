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
    await this.subCategoryRepository.save(subCategory);
  }

  async findAllByUserId(userId: number): Promise<SubCategory[]> {
    return await this.subCategoryRepository
      .createQueryBuilder("subCategory")
      .innerJoin("subCategory.category", "category")
      .where("category.userId = :userId", { userId })
      .getMany();
  }

  async findById(id: number): Promise<SubCategory | null> {
    return await this.subCategoryRepository.findOne({ where: { id } });
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
