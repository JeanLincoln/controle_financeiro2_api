import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";

interface SortableFieldProps<T> {
  enumType: T;
  defaultValue: string;
  description?: string;
}

const DEFAULT_FIELD_ERROR_MESSAGE = "Sort by must be a valid field name";
const DEFAULT_ORDER_ERROR_MESSAGE = "Sort order must be a valid value";

export function SortableFieldDto<T extends Record<string, string | number>>({
  enumType,
  defaultValue,
  description = "Field sorting"
}: SortableFieldProps<T>) {
  return function (target: object, propertyKey: string) {
    const enumValues = Object.values(enumType);

    ApiPropertyOptional({
      description,
      default: defaultValue || enumValues[0],
      example: defaultValue || enumValues[0],
      enum: enumValues
    })(target, propertyKey);

    IsEnum(enumType, {
      message: DEFAULT_FIELD_ERROR_MESSAGE
    })(target, propertyKey);
    IsString({
      message: DEFAULT_FIELD_ERROR_MESSAGE
    })(target, propertyKey);
  };
}

export function SortableOrderDto() {
  return function (target: object, propertyKey: string) {
    ApiPropertyOptional({
      description: "Crescent or descending sorting",
      default: SortOrderEnum.DESC,
      example: SortOrderEnum.DESC,
      enum: SortOrderEnum
    })(target, propertyKey);

    IsEnum(SortOrderEnum, {
      message: DEFAULT_ORDER_ERROR_MESSAGE
    })(target, propertyKey);
    IsString({
      message: DEFAULT_ORDER_ERROR_MESSAGE
    })(target, propertyKey);
  };
}
