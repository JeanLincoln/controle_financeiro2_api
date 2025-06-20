import {
  CreateOrUpdateAllSubCategoryProps,
  SubCategoryRepository
} from "@domain/repositories/sub-category.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateSubCategoryUseCase {
  constructor(private readonly subCategoryRepository: SubCategoryRepository) {}

  async execute(
    id: number,
    categoryId: number,
    data: CreateOrUpdateAllSubCategoryProps
  ) {
    return this.subCategoryRepository.update(id, categoryId, data);
  }
}
