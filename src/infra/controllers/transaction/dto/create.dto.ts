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
    example: "2023-10-01T00:00:00Z",
    description: "The date when the transaction starts"
  })
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  startDate: Date;

  @ApiProperty({
    example: "2023-10-01T00:00:00Z",
    description: "The date when the transaction starts"
  })
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  @IsOptional()
  endDate: Date | null;

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
