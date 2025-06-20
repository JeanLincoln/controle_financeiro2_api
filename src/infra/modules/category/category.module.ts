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
import { FindAndValidateCategoryUseCase } from "@use-cases/category/find-and-validate/find-and-validate.use-case";

@Module({
  imports: [DatabaseModule, AuthModule, ExceptionsModule, UserModule],
  controllers: [CategoryController],
  providers: [
    CreateCategoryUseCase,
    FindAllCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    FindAndValidateCategoryUseCase
  ],
  exports: [FindAndValidateCategoryUseCase]
})
export class CategoryModule {}
