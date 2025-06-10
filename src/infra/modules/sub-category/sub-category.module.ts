import { Module } from "@nestjs/common";
import { DatabaseModule } from "@infra/modules/database/database.module";
import { CategoryModule } from "../category/category.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { CreateSubCategoryUseCase } from "@use-cases/sub-category/create/create.use-case";
import { SubCategoryController } from "@infra/controllers/sub-category/sub-category.controller";
import { AuthModule } from "../auth/auth.module";
import { FindSubCategoryByIdUseCase } from "@use-cases/sub-category/find-by-id/find-by-id.use-case";

@Module({
  imports: [DatabaseModule, ExceptionsModule, CategoryModule, AuthModule],
  controllers: [SubCategoryController],
  providers: [CreateSubCategoryUseCase, FindSubCategoryByIdUseCase]
})
export class SubCategoryModule {}
