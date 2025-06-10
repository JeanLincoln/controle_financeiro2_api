import { SubCategory } from "@domain/entities/sub-category.entity";

export type CreateOrUpdateAllSubCategoryProps = Omit<
  SubCategory,
  "id" | "createdAt" | "updatedAt"
>;

export abstract class SubCategoryRepository {
  abstract findAllByUserId(userId: number): Promise<SubCategory[]>;
  abstract findById(id: number): Promise<SubCategory | null>;
  abstract create(
    subCategory: CreateOrUpdateAllSubCategoryProps
  ): Promise<void>;
  abstract update(
    id: number,
    subCategory: CreateOrUpdateAllSubCategoryProps
  ): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
