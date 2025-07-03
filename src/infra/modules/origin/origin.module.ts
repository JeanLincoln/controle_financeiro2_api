import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { CategoryModule } from "../category/category.module";
import { DatabaseModule } from "../database/database.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { FindAndValidateOriginFromBodyUseCase } from "@use-cases/origin/find-and-validate-from-body/find-and-validate-from-body.use-case";
import { OriginController } from "@infra/controllers/origin/origin.controller";
import { CreateOriginUseCase } from "@use-cases/origin/create/create.use-case";
import { UpdateOriginUseCase } from "@use-cases/origin/update/update.use-case";
import { DeleteOriginUseCase } from "@use-cases/origin/delete/delete.use-case";
import { FindAllOriginUseCase } from "@use-cases/origin/find-all/find-all.use-case";
import { FindAndValidateOriginFromParamUseCase } from "@use-cases/origin/find-and-validate-from-param/find-and-validate-from-param.use-case";

@Module({
  imports: [DatabaseModule, ExceptionsModule, CategoryModule, AuthModule],
  controllers: [OriginController],
  providers: [
    FindAndValidateOriginFromParamUseCase,
    FindAndValidateOriginFromBodyUseCase,
    CreateOriginUseCase,
    UpdateOriginUseCase,
    DeleteOriginUseCase,
    FindAllOriginUseCase
  ],
  exports: [
    FindAndValidateOriginFromParamUseCase,
    FindAndValidateOriginFromBodyUseCase
  ]
})
export class OriginModule {}
