import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";
import {
  SortableFieldDto,
  SortableOrderDto
} from "@infra/commons/decorators/dto-decorators/sort-dto.decorator";
import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import { CategoriesSortableFieldsEnum } from "@domain/repositories/category.repository";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FindAllCategoriesQueryParamDto extends PaginationQueryDto {
  @SortableFieldDto({
    enumType: CategoriesSortableFieldsEnum,
    defaultValue: CategoriesSortableFieldsEnum.updatedAt
  })
  sortBy: CategoriesSortableFieldsEnum;

  @SortableOrderDto()
  sortOrder: SortOrderEnum;

  @ApiPropertyOptional({
    description: "Filter categories that match this name (case-insensitive).",
    example: "Meat",
    required: false,
    type: String,
    format: "string"
  })
  @IsString()
  @IsOptional()
  name?: string;
}
