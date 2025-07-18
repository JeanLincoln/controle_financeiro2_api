import { ValidateBy, ValidationArguments } from "class-validator";
import { Transaction } from "@domain/entities/transaction.entity";

type DateRangeValidationArgs = ValidationArguments & {
  object: {
    startDate?: Transaction["startDate"];
    endDate?: Transaction["endDate"];
  };
};

export const DateRangeValidation = () =>
  ValidateBy({
    name: "dateRangeValidation",
    validator: {
      validate(value: Date, args: DateRangeValidationArgs) {
        if (!args) return true;

        const { endDate } = args.object;

        if (!value || !endDate) return true;

        return value <= endDate;
      },
      defaultMessage: () => "Start date must be before or equal to end date"
    }
  });
