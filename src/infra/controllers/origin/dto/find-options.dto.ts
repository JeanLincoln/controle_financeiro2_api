import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import { SortableOrderDto } from "@infra/commons/decorators/dto-decorators/sort-dto.decorator";
import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FindOptionsOriginDto extends PaginationQueryDto {
  @SortableOrderDto(SortOrderEnum.ASC)
  sortOrder: SortOrderEnum;

  @ApiPropertyOptional({
    description: "Searching field for origins",
    example: "Credit Card",
    type: String
  })
  @IsString()
  @IsOptional()
  search?: string;
}
