import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class FindTransactionByIdParamDto {
  @ApiProperty({ description: "The id of the transaction", example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value))
  transactionId: number;
}
