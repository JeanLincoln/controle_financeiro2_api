import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import { OriginsSortableFieldsEnum } from "@domain/repositories/origin.repository";
import {
  SortableFieldDto,
  SortableOrderDto
} from "@infra/commons/decorators/dto-decorators/sort-dto.decorator";
import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FindAllOriginDto extends PaginationQueryDto {
  @SortableFieldDto({
    enumType: OriginsSortableFieldsEnum,
    defaultValue: OriginsSortableFieldsEnum.updatedAt,
    description: "Field sorting for origins"
  })
  sortBy: OriginsSortableFieldsEnum;

  @SortableOrderDto()
  sortOrder: SortOrderEnum;

  @ApiPropertyOptional({
    description: "Filter origins that  match this name (case-insensitive).",
    example: "Supermarket",
    required: false,
    type: String,
    format: "string"
  })
  @IsString()
  @IsOptional()
  name?: string;
}
