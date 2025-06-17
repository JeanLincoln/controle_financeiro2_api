import { SubCategory } from "@domain/entities/sub-category.entity";

export type CreateOrUpdateAllSubCategoryProps = Omit<
  SubCategory,
  "id" | "createdAt" | "updatedAt" | "category" | "transactions"
>;

export abstract class SubCategoryRepository {
  abstract findAllByUserId(userId: number): Promise<SubCategory[]>;
  abstract findById(id: number): Promise<SubCategory | null>;
  abstract create(
    categoryId: number,
    subCategory: CreateOrUpdateAllSubCategoryProps
  ): Promise<void>;
  abstract update(
    id: number,
    categoryId: number,
    subCategory: CreateOrUpdateAllSubCategoryProps
  ): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
