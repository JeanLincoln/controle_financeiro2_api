import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteCategoryDto {
  @ApiProperty({ example: "1" })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
