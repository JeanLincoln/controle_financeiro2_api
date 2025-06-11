import { Category } from "@domain/entities/category.entity";

export type CreateOrUpdateAllCategoryProps = Omit<
  Category,
  "id" | "createdAt" | "updatedAt" | "userId" | "subCategories" | "transactions"
> & { userId: number };

export abstract class CategoryRepository {
  abstract findAll(userId: number): Promise<Category[]>;
  abstract findById(id: number): Promise<Category | null>;
  abstract create(category: CreateOrUpdateAllCategoryProps): Promise<void>;
  abstract update(
    id: number,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<void>;
  abstract delete(id: number): Promise<void>;
  abstract deleteByUserId(userId: number): Promise<void>;
}
