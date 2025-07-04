import { Category } from "@domain/entities/category.entity";
import { User } from "@domain/entities/user.entity";

export type CreateOrUpdateAllCategoryProps = Omit<
  Category,
  "id" | "createdAt" | "updatedAt" | "subCategories" | "user" | "transactions"
>;

export abstract class CategoryRepository {
  abstract findAll(userId: number): Promise<Category[]>;
  abstract findById(id: number): Promise<Category | null>;
  abstract findByIds(ids: number[]): Promise<Category[] | null>;
  abstract create(
    user: User,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<void>;
  abstract update(
    id: number,
    userId: number,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<void>;
  abstract delete(id: number): Promise<void>;
  abstract deleteByUserId(userId: number): Promise<void>;
}
