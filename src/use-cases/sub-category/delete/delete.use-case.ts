import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteSubCategoryUseCase {
  constructor(private readonly subCategoryRepository: SubCategoryRepository) {}

  async execute(subCategoryId: number) {
    await this.subCategoryRepository.delete(subCategoryId);
  }
}
