import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CategoryType } from "@domain/entities/category.entity";

export class CreateCategoryDto {
  @ApiProperty({ example: "Food" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "Food description" })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: CategoryType.EXPENSE })
  @IsString()
  @IsNotEmpty()
  type: CategoryType;

  @ApiProperty({ example: "#FF0000" })
  @IsString()
  @IsOptional()
  color: string;

  @ApiProperty({ example: "icon.png" })
  @IsString()
  @IsOptional()
  icon: string;
}
