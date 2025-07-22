import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min
} from "class-validator";
import { NumberArrayValidations } from "@infra/commons/decorators/dto-decorators/array-validations.decorator";
import { TransactionType } from "@domain/entities/transaction.entity";

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

  @ApiProperty({ example: TransactionType.EXPENSE })
  @IsString()
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: "total amount of this transaction.",
    example: "100.20",
    required: false,
    type: Number,
    format: "number"
  })
  @IsNumber()
  @Min(1)
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
  transactionDate: Date;

  @ApiProperty({
    example: "1",
    description: "The ID of the origin associated with the transaction"
  })
  @IsNumber()
  @Min(1)
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
