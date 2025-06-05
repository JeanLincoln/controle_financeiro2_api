import { Category } from "@domain/entities/category.entity";

export type CreateOrUpdateAllCategoryProps = Omit<
  Category,
  "id" | "createdAt" | "updatedAt"
> & { userId: number };

export abstract class CategoryRepository {
  abstract findAll(userId: number): Promise<Category[]>;
  abstract findById(userId: number, id: number): Promise<Category | null>;
  abstract create(
    userId: number,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<void>;
  abstract update(
    userId: number,
    id: number,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<void>;
  abstract delete(userId: number, id: number): Promise<void>;
}
