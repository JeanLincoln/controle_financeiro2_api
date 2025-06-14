import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllSubCategoryUseCase {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(userId: number): Promise<SubCategory[] | void> {
    const subCategories =
      await this.subCategoryRepository.findAllByUserId(userId);

    if (!subCategories) {
      return this.exceptionAdapter.notFound({
        message: "Something went wrong while fetching sub-categories"
      });
    }

    return subCategories;
  }
}
