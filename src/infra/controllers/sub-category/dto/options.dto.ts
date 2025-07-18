import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import { SortableOrderDto } from "@infra/commons/decorators/dto-decorators/sort-dto.decorator";
import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min
} from "class-validator";

export class OptionsSubCategoryParamDto {
  @ApiProperty({
    description: "The category id",
    example: 1
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  categoryId: number;
}

export class OptionsSubCategoryQueryDto extends PaginationQueryDto {
  @SortableOrderDto(SortOrderEnum.ASC)
  sortOrder: SortOrderEnum;

  @ApiPropertyOptional({
    description: "Searching field for sub-categories",
    example: "Meat",
    type: String
  })
  @IsString()
  @IsOptional()
  search?: string;
}
