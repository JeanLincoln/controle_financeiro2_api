import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";
import { DateRangeValidation } from "./transactions-custom-validations.decorator";

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
    example: "100",
    description: "The amount of the transaction"
  })
  @IsNumber()
  @IsNotEmpty()
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

  @ApiProperty({
    example: [1, 2, 3],
    description: "The ID of the categories associated with the transaction"
  })
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : value))
  categoriesIds: number[];

  @ApiProperty({
    example: [1, 2, 3],
    description: "The ID of the sub-categories associated with the transaction"
  })
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : value))
  subCategoriesIds: number[];
}
