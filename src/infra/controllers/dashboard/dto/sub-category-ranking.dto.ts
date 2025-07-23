import { TransactionType } from "@domain/entities/transaction.entity";
import { TransactionTypeValidations } from "@infra/commons/decorators/dto-decorators/transaction-type-validation.decorator";
import { IsOptional } from "class-validator";

export class SubCategoryRankingQueryDto {
  @TransactionTypeValidations({
    description: "Type of transaction to filter the ranking.",
    required: false
  })
  @IsOptional()
  type?: TransactionType;
}
