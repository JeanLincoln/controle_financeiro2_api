import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";
import { TransactionsSortableFieldsEnum } from "@domain/repositories/transaction.repository";
import {
  SortableFieldDto,
  SortableOrderDto
} from "@infra/commons/decorators/sort-dto.decorator";
import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { DateRangeValidation } from "./decorators/transactions-custom-validations.decorator";

export class FindAllTransactionsQueryParamDto extends PaginationQueryDto {
  @SortableFieldDto({
    enumType: TransactionsSortableFieldsEnum,
    defaultValue: "updatedAt"
  })
  sortBy: TransactionsSortableFieldsEnum;

  @SortableOrderDto()
  sortOrder: SortOrderEnum;

  @ApiProperty({
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

  @ApiProperty({
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

  @ApiProperty({
    description: "Filter transactions that  match this amount.",
    example: "100.20",
    required: false,
    type: Number,
    format: "number"
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : value))
  amount?: number;

  @ApiPropertyOptional({
    description: "Filter transactions that are recurring."
  })
  @IsOptional()
  isRecurring?: boolean;

  @ApiProperty({
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
  @DateRangeValidation()
  startDate?: Date;

  @ApiProperty({
    description:
      "Filter transactions that start before or on this date (inclusive). Format: YYYY-MM-DD",
    example: "2025-02-01",
    required: false,
    type: String,
    format: "date"
  })
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
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
  @DateRangeValidation()
  createdAt?: Date;

  @ApiProperty({
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
  @DateRangeValidation()
  updatedAt?: Date;
}
