import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";
import { TransactionsSortableFieldsEnum } from "@domain/repositories/transaction.repository";
import {
  SortableFieldDto,
  SortableOrderDto
} from "@infra/commons/decorators/dto-decorators/sort-dto.decorator";
import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Transform } from "class-transformer";
import { NumberArrayValidations } from "@infra/commons/decorators/dto-decorators/array-validations.decorator";
import { TransactionType } from "@domain/entities/transaction.entity";
import { TransactionTypeValidations } from "@infra/commons/decorators/dto-decorators/transaction-type-validation.decorator";

export class FindAllTransactionsQueryParamDto extends PaginationQueryDto {
  @SortableFieldDto({
    enumType: TransactionsSortableFieldsEnum,
    defaultValue: "updatedAt"
  })
  sortBy: TransactionsSortableFieldsEnum;

  @SortableOrderDto()
  sortOrder: SortOrderEnum;

  @ApiPropertyOptional({
    description:
      "Filter transactions that  match this name (case-insensitive).",
    example: "Supermarket",
    required: false,
    type: String,
    format: "string"
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description:
      "Filter transactions that  match this description (case-insensitive).",
    example: "Supermarket expenses",
    required: false,
    type: String,
    format: "string"
  })
  @IsString()
  @IsOptional()
  description?: string;

  @TransactionTypeValidations({
    description: "Type of transaction to filter the ranking.",
    required: false
  })
  @IsOptional()
  type?: TransactionType;

  @ApiPropertyOptional({
    description: "Filter transactions that  match this amount.",
    example: "100.20",
    required: false,
    type: Number,
    format: "number"
  })
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => (value ? Number(value) : value))
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({
    description:
      "Filter transactions that start from this date (inclusive). Format: YYYY-MM-DD",
    example: "2025-01-01",
    required: false,
    type: String,
    format: "date"
  })
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  @IsOptional()
  transactionDate?: Date;

  @ApiPropertyOptional({
    description: "Filter transactions that was originated from this origin id.",
    example: 1,
    type: Number,
    format: "number"
  })
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => (value ? Number(value) : value))
  @IsOptional()
  originId?: number;

  @NumberArrayValidations({
    description:
      "Filter transactions that belong to any of these categories. Provide an array of category IDs to filter by multiple categories.",
    example: [1, 2, 3],
    required: false
  })
  @IsOptional()
  categoriesIds?: number[];

  @NumberArrayValidations({
    description:
      "Filter transactions that belong to any of these sub-categories. Provide an array of sub-category IDs to filter by multiple sub-categories.",
    example: [1, 2, 3],
    required: false
  })
  @IsOptional()
  subCategoriesIds?: number[];

  @ApiPropertyOptional({
    description:
      "Filter transactions that was created on this date. Format: YYYY-MM-DD",
    example: "2025-01-01",
    required: false,
    type: String,
    format: "date"
  })
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiPropertyOptional({
    description:
      "Filter transactions that was updated on this date. Format: YYYY-MM-DD",
    example: "2025-01-01",
    required: false,
    type: String,
    format: "date"
  })
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
