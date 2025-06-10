import { Module } from "@nestjs/common";
import { DatabaseModule } from "@infra/modules/database/database.module";
import { CategoryModule } from "../category/category.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { CreateSubCategoryUseCase } from "@use-cases/sub-category/create/create.use-case";
import { SubCategoryController } from "@infra/controllers/sub-category/sub-category.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [DatabaseModule, ExceptionsModule, CategoryModule, AuthModule],
  controllers: [SubCategoryController],
  providers: [CreateSubCategoryUseCase],
  exports: [CreateSubCategoryUseCase]
})
export class SubCategoryModule {}
