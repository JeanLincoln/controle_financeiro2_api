import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";
import { TransactionsSortableFieldsEnum } from "@domain/repositories/transaction.repository";
import {
  SortableFieldDto,
  SortableOrderDto
} from "@infra/commons/decorators/sort-dto.decorator";
import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { DateRangeValidation } from "./transactions-custom-validations.decorator";

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
}
