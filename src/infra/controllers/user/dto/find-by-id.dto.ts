import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class FindUserByIdParamDto {
  @ApiProperty({ description: "The id of the user", example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  userId: number;
}
