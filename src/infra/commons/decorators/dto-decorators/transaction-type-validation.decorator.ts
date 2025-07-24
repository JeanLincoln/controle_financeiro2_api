import { TransactionType } from "@domain/entities/transaction.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

interface TransactionTypeValidationsProps {
  required?: boolean;
  description?: string;
}

export const TransactionTypeValidations =
  ({ description, required = false }: TransactionTypeValidationsProps) =>
  (target: object, propertyKey: string) => {
    ApiProperty({
      required,
      description: description || "Type of transaction.",
      example: TransactionType.EXPENSE,
      enum: TransactionType
    })(target, propertyKey);
    IsEnum(TransactionType, {
      message: "Type must be a valid transaction type"
    })(target, propertyKey);
  };
