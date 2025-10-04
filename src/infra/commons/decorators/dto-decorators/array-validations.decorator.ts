import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNumber, Min } from "class-validator";

interface NumberArrayValidationsProps {
  required?: boolean;
  description?: string;
  example?: number[];
}

export const NumberArrayValidations =
  ({
    description,
    example = [],
    required = false
  }: NumberArrayValidationsProps) =>
  (target: object, propertyKey: string) => {
    Transform(({ value }: { value: number[] | number | string | string[] }) => {
      if (!value) return [];

      return Array.isArray(value)
        ? value.map((item) => Number(item))
        : [Number(value)];
    })(target, propertyKey);
    ApiProperty({
      required,
      description: description || "An array of numbers.",
      example,
      type: Number,
      isArray: true
    })(target, propertyKey);
    IsArray()(target, propertyKey);
    IsNumber({}, { each: true })(target, propertyKey);
    Min(1, { each: true })(target, propertyKey);
  };
