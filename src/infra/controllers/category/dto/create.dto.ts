import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ example: "Food" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "Food description" })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: "#FF0000" })
  @IsString()
  @IsOptional()
  color: string;

  @ApiProperty({ example: "icon.png" })
  @IsString()
  @IsOptional()
  icon: string;
}
