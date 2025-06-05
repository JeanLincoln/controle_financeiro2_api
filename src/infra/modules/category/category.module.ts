import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CreateCategoryUseCase } from "@use-cases/category/create/create.use-case";
import { CategoryController } from "@infra/controllers/category/category.controller";
import { AuthModule } from "../auth/auth.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { FindAllCategoryUseCase } from "@use-cases/category/find-all/find-all.use-case";

@Module({
  imports: [DatabaseModule, AuthModule, ExceptionsModule],
  controllers: [CategoryController],
  providers: [CreateCategoryUseCase, FindAllCategoryUseCase],
  exports: [CreateCategoryUseCase, FindAllCategoryUseCase]
})
export class CategoryModule {}
