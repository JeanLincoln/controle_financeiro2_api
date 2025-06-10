import { SubCategory } from "@domain/entities/sub-category.entity";
import { CreateOrUpdateAllSubCategoryProps } from "@domain/repositories/sub-category.repository";

type SubCategoryMockProps = Omit<SubCategory, "category">;

export const CREATE_SUB_CATEGORY_MOCK: CreateOrUpdateAllSubCategoryProps = {
  name: "Sub Category",
  description: "Sub Category Description",
  categoryId: 1,
  color: "#000000",
  icon: "🍎"
};

export const SUB_CATEGORIES_MOCK: SubCategoryMockProps[] = Array.from(
  { length: 10 },
  (_, index) => ({
    id: index + 1,
    name: `Sub Category ${index + 1}`,
    description: `Sub Category ${index + 1} Description`,
    categoryId: (index + 1) % 2 === 0 ? 1 : 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    color: "#000000",
    icon: "🍎"
  })
);

export const SUB_CATEGORY_MOCK_1: SubCategoryMockProps = SUB_CATEGORIES_MOCK[0];
export const SUB_CATEGORY_MOCK_2: SubCategoryMockProps = SUB_CATEGORIES_MOCK[1];
