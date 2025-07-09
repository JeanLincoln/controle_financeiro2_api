import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CreateCategoryUseCase } from "@use-cases/category/create/create.use-case";
import { CategoryController } from "@infra/controllers/category/category.controller";
import { AuthModule } from "../auth/auth.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { FindAllCategoryUseCase } from "@use-cases/category/find-all/find-all.use-case";
import { UpdateCategoryUseCase } from "@use-cases/category/update/update.use-case";
import { UserModule } from "../user/user.module";
import { DeleteCategoryUseCase } from "@use-cases/category/delete/delete.use-case";
import { FindAndValidateFromParamCategoryUseCase } from "@use-cases/category/find-and-validate-from-param/find-and-validate-from-param.use-case";
import { FindAndValidateManyFromBodyCategoryUseCase } from "@use-cases/category/find-and-validate-many-from-body/find-and-validate-many-from-body.use-case";
import { PaginationModule } from "../pagination/pagination.module";

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ExceptionsModule,
    UserModule,
    PaginationModule
  ],
  controllers: [CategoryController],
  providers: [
    CreateCategoryUseCase,
    FindAllCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    FindAndValidateFromParamCategoryUseCase,
    FindAndValidateManyFromBodyCategoryUseCase
  ],
  exports: [
    FindAndValidateFromParamCategoryUseCase,
    FindAndValidateManyFromBodyCategoryUseCase
  ]
})
export class CategoryModule {}
