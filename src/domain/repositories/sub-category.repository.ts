import { SubCategory } from "@domain/entities/sub-category.entity";

export type CreateOrUpdateAllSubCategoryProps = Omit<
  SubCategory,
  "id" | "createdAt" | "updatedAt" | "category"
>;

export type SubCategoryWithoutRelations = Omit<SubCategory, "category">;

export abstract class SubCategoryRepository {
  abstract findAllByUserId(
    userId: number
  ): Promise<SubCategoryWithoutRelations[]>;
  abstract findById(id: number): Promise<SubCategoryWithoutRelations | null>;
  abstract create(
    subCategory: CreateOrUpdateAllSubCategoryProps
  ): Promise<void>;
  abstract update(
    id: number,
    subCategory: CreateOrUpdateAllSubCategoryProps
  ): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
