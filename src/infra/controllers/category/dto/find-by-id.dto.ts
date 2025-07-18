import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class FindCategoryByIdParamDto {
  @ApiProperty({
    description: "The category id",
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value))
  categoryId: number;
}
