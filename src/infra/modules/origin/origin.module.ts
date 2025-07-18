import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { CategoryModule } from "../category/category.module";
import { DatabaseModule } from "../database/database.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { OriginController } from "@infra/controllers/origin/origin.controller";
import { CreateOriginUseCase } from "@use-cases/origin/create/create.use-case";
import { UpdateOriginUseCase } from "@use-cases/origin/update/update.use-case";
import { DeleteOriginUseCase } from "@use-cases/origin/delete/delete.use-case";
import { FindAllOriginUseCase } from "@use-cases/origin/find-all/find-all.use-case";
import { PaginationModule } from "../pagination/pagination.module";
import { FindAndValidateOriginUseCase } from "@use-cases/origin/find-and-validate/find-and-validate.use-case";
import { OptionsOriginUseCase } from "@use-cases/origin/options/options.use-case";

@Module({
  imports: [
    DatabaseModule,
    ExceptionsModule,
    CategoryModule,
    AuthModule,
    PaginationModule
  ],
  controllers: [OriginController],
  providers: [
    FindAndValidateOriginUseCase,
    CreateOriginUseCase,
    UpdateOriginUseCase,
    DeleteOriginUseCase,
    FindAllOriginUseCase,
    OptionsOriginUseCase
  ],
  exports: [FindAndValidateOriginUseCase]
})
export class OriginModule {}
