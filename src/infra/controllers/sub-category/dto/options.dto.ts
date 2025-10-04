import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import { NumberArrayValidations } from "@infra/commons/decorators/dto-decorators/array-validations.decorator";
import { SortableOrderDto } from "@infra/commons/decorators/dto-decorators/sort-dto.decorator";
import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class OptionsSubCategoryQueryDto extends PaginationQueryDto {
  @SortableOrderDto(SortOrderEnum.ASC)
  sortOrder: SortOrderEnum;

  @NumberArrayValidations({
    description:
      "Filter sub-categories options that belong to any of these categories. Provide an array of category IDs to filter by multiple categories.",
    example: [1, 2, 3],
    required: false
  })
  @IsOptional()
  categoriesIds?: number[];

  @ApiPropertyOptional({
    description: "Searching field for sub-categories",
    example: "Meat",
    type: String
  })
  @IsString()
  @IsOptional()
  search?: string;
}
