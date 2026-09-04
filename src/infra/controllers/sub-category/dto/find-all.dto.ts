import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import { SubCategoriesSortableFieldsEnum } from "@domain/repositories/sub-category.repository";
import { NumberArrayValidations } from "@infra/commons/decorators/dto-decorators/array-validations.decorator";
import {
  SortableFieldDto,
  SortableOrderDto
} from "@infra/commons/decorators/dto-decorators/sort-dto.decorator";
import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayMinSize, IsOptional, IsString } from "class-validator";
import { CreateSubCategoryParams } from "./create.dto";

export class FindAllSubCategoryParams extends CreateSubCategoryParams {}

export class FindAllSubCategoryQueryDto extends PaginationQueryDto {
  @SortableFieldDto({
    enumType: SubCategoriesSortableFieldsEnum,
    defaultValue: SubCategoriesSortableFieldsEnum.updatedAt,
    description: "Field sorting for sub-categories"
  })
  sortBy: SubCategoriesSortableFieldsEnum;

  @SortableOrderDto()
  sortOrder: SortOrderEnum;

  @ApiPropertyOptional({
    description:
      "Filter sub-categories that match this name (case-insensitive).",
    example: "Meat",
    required: false,
    type: String,
    format: "string"
  })
  @IsString()
  @IsOptional()
  name?: string;

  @NumberArrayValidations({
    description:
      "Filter sub-categories that belong to any of these categories. Provide an array of category IDs to filter by multiple categories. At least one is required.",
    example: [1, 2, 3],
    required: true
  })
  @ArrayMinSize(1, { message: "At least one category ID is required" })
  categoriesIds: number[];
}
