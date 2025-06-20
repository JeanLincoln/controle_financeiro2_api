import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class FindSubCategoryByIdParamDto {
  @ApiProperty({
    description: "The category id",
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  categoryId: number;

  @ApiProperty({
    description: "The sub-category id",
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  subCategoryId: number;
}
