import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { IsString } from "class-validator";

export class CreateSubCategoryParams {
  @ApiProperty({
    description: "The category id",
    example: 1
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  categoryId: number;
}

export class CreateSubCategoryBodyDto {
  @ApiProperty({
    description: "The name of the sub category",
    example: "Sub Category 1"
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "The description of the sub category",
    example: "Sub Category 1 description"
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "The color of the sub category",
    example: "#000000"
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    description: "The icon of the sub category",
    example: "fa-solid fa-house"
  })
  @IsString()
  @IsNotEmpty()
  icon: string;
}
