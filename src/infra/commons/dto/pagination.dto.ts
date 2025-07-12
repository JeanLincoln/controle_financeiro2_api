import { IsOptional, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_MAX_LIMIT
} from "@use-cases/common/pagination/pagination.use-case";

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Número da página",
    minimum: 1,
    default: PAGINATION_DEFAULT_PAGE,
    example: PAGINATION_DEFAULT_PAGE
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Page must be an integer" })
  @Min(1, { message: "Page must be at least 1" })
  page?: number;

  @ApiPropertyOptional({
    description: "Número de itens por página",
    minimum: 1,
    maximum: PAGINATION_MAX_LIMIT,
    default: PAGINATION_DEFAULT_LIMIT,
    example: PAGINATION_DEFAULT_LIMIT
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Limit must be an integer" })
  @Min(1, { message: "Limit must be at least 1" })
  @Max(PAGINATION_MAX_LIMIT, { message: "Limit must be at most 50" })
  limit?: number;
}
