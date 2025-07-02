import { Module } from "@nestjs/common";
import { DatabaseModule } from "@infra/modules/database/database.module";
import { CategoryModule } from "../category/category.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { CreateSubCategoryUseCase } from "@use-cases/sub-category/create/create.use-case";
import { SubCategoryController } from "@infra/controllers/sub-category/sub-category.controller";
import { AuthModule } from "../auth/auth.module";
import { FindAllSubCategoryUseCase } from "@use-cases/sub-category/find-all/find-all.find-all.use-case";
import { DeleteSubCategoryUseCase } from "@use-cases/sub-category/delete/delete.use-case";
import { UpdateSubCategoryUseCase } from "@use-cases/sub-category/update/update.use-case";
import { FindAndValidateFromParamSubCategoryUseCase } from "@use-cases/sub-category/find-and-validate-from-param/find-and-validate-from-param.use-case";
import { FindAndValidateManyFromBodySubCategoryUseCase } from "@use-cases/sub-category/find-and-validate-many-from-body/find-and-validate-many-from-body.use-case";

@Module({
  imports: [DatabaseModule, ExceptionsModule, CategoryModule, AuthModule],
  controllers: [SubCategoryController],
  providers: [
    CreateSubCategoryUseCase,
    FindAllSubCategoryUseCase,
    DeleteSubCategoryUseCase,
    UpdateSubCategoryUseCase,
    FindAndValidateFromParamSubCategoryUseCase,
    FindAndValidateManyFromBodySubCategoryUseCase
  ],
  exports: [
    FindAndValidateFromParamSubCategoryUseCase,
    FindAndValidateManyFromBodySubCategoryUseCase
  ]
})
export class SubCategoryModule {}
