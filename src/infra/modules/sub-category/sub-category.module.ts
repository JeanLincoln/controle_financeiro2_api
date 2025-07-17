import { Module } from "@nestjs/common";
import { DatabaseModule } from "@infra/modules/database/database.module";
import { CategoryModule } from "../category/category.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { CreateSubCategoryUseCase } from "@use-cases/sub-category/create/create.use-case";
import { SubCategoryController } from "@infra/controllers/sub-category/sub-category.controller";
import { AuthModule } from "../auth/auth.module";
import { FindAllSubCategoryUseCase } from "@use-cases/sub-category/find-all/find-all.use-case";
import { DeleteSubCategoryUseCase } from "@use-cases/sub-category/delete/delete.use-case";
import { UpdateSubCategoryUseCase } from "@use-cases/sub-category/update/update.use-case";
import { FindAndValidateSubCategoryUseCase } from "@use-cases/sub-category/find-and-validate/find-and-validate.use-case";

@Module({
  imports: [DatabaseModule, ExceptionsModule, CategoryModule, AuthModule],
  controllers: [SubCategoryController],
  providers: [
    CreateSubCategoryUseCase,
    FindAllSubCategoryUseCase,
    DeleteSubCategoryUseCase,
    UpdateSubCategoryUseCase,
    FindAndValidateSubCategoryUseCase
  ],
  exports: [FindAndValidateSubCategoryUseCase]
})
export class SubCategoryModule {}
