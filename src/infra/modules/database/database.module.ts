import { Module } from "@nestjs/common";
import { TypeOrmUserRepository } from "../../repositories/user/user.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@domain/entities/user.entity";
import { TypeOrmCategoryRepository } from "@infra/repositories/category/category.repository";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { Category } from "@domain/entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Category])],
  providers: [
    {
      useClass: TypeOrmUserRepository,
      provide: UserRepository
    },
    {
      useClass: TypeOrmCategoryRepository,
      provide: CategoryRepository
    }
  ],
  exports: [UserRepository, CategoryRepository]
})
export class DatabaseModule {}
