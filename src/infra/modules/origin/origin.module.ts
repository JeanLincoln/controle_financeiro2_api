import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { CategoryModule } from "../category/category.module";
import { DatabaseModule } from "../database/database.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { FindAndValidateOriginUseCase } from "@use-cases/origin/find-and-validate/find-and-validate.use-case";
import { OriginController } from "@infra/controllers/origin/origin.controller";
import { CreateOriginUseCase } from "@use-cases/origin/create/create.use-case";
import { UpdateOriginUseCase } from "@use-cases/origin/update/update.use-case";

@Module({
  imports: [DatabaseModule, ExceptionsModule, CategoryModule, AuthModule],
  controllers: [OriginController],
  providers: [
    FindAndValidateOriginUseCase,
    CreateOriginUseCase,
    UpdateOriginUseCase
  ]
})
export class OriginModule {}
