import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDate } from "class-validator";

export class TransactionGraphQueryDto {
  @ApiProperty({
    description: "Start date for the graph data",
    example: "2025-01-01"
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: "End date for the graph data",
    example: "2025-01-31"
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
