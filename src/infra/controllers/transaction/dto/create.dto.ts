import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";
import { DateRangeValidation } from "./decorators/transactions-custom-validations.decorator";
import { NumberArrayValidations } from "@infra/commons/decorators/dto-decorators/array-validations.decorator";

export class CreateTransactionDto {
  @ApiProperty({
    example: "Salary",
    description: "The name of the transaction"
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "Monthly salary payment",
    description: "A brief description of the transaction"
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "total amount of this transaction.",
    example: "100.20",
    required: false,
    type: Number,
    format: "number"
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : value))
  amount: number;

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
  startDate: Date;

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
    example: "true",
    description: "Indicates if the transaction is recurring"
  })
  @IsNotEmpty()
  @IsBoolean()
  isRecurring: boolean;

  @ApiProperty({
    example: "1",
    description: "The ID of the origin associated with the transaction"
  })
  @IsNumber()
  @IsNotEmpty()
  originId: number;

  @NumberArrayValidations({
    description: "The ID of the categories associated with the transaction",
    example: [1, 2, 3],
    required: true
  })
  categoriesIds: number[];

  @NumberArrayValidations({
    description: "The ID of the sub-categories associated with the transaction",
    example: [1, 2, 3],
    required: true
  })
  subCategoriesIds: number[];
}
