import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";
import { CreateSubCategoryParams } from "./create.dto";
import {
  SortableFieldDto,
  SortableOrderDto
} from "@infra/commons/decorators/dto-decorators/sort-dto.decorator";
import { SubCategoriesSortableFieldsEnum } from "@domain/repositories/sub-category.repository";
import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { NumberArrayValidations } from "@infra/commons/decorators/dto-decorators/array-validations.decorator";

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
  categoriesIds: number[];
}
