import { CreateOrUpdateAllOriginProps } from "@domain/repositories/origin.repository";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateOriginBodyDto
  implements Omit<CreateOrUpdateAllOriginProps, "userId">
{
  @ApiProperty({ example: "Origin" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: "Origin description" })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: "#000000" })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({ example: "🌍" })
  @IsNotEmpty()
  @IsString()
  icon: string;
}
