import { Module } from "@nestjs/common";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { PaginationUseCase } from "@use-cases/common/pagination/pagination.use-case";

@Module({
  imports: [ExceptionsModule],
  providers: [PaginationUseCase],
  exports: [PaginationUseCase]
})
export class PaginationModule {}
