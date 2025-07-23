import { TransactionType } from "@domain/entities/transaction.entity";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

export class SubCategoryRankingQueryDto {
  @ApiPropertyOptional({
    description: "Type of transaction to filter the ranking",
    example: TransactionType.EXPENSE,
    enum: TransactionType,
    required: false
  })
  @IsEnum(TransactionType, { message: "Type must be a valid transaction type" })
  @IsOptional()
  type?: TransactionType;
}
