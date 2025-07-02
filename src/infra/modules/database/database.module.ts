import { Module } from "@nestjs/common";
import { TypeOrmUserRepository } from "../../repositories/user/user.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@domain/entities/user.entity";
import { TypeOrmCategoryRepository } from "@infra/repositories/category/category.repository";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { Category } from "@domain/entities/category.entity";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { TypeOrmSubCategoryRepository } from "@infra/repositories/sub-category/sub-category.repository";
import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { Origin } from "@domain/entities/origin.entity";
import { TypeOrmOriginRepository } from "@infra/repositories/origin/origin.repository";
import { OriginRepository } from "@domain/repositories/origin.repository";
import { Transaction } from "@domain/entities/transaction.entity";
import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { TypeOrmTransactionRepository } from "@infra/repositories/transaction/transaction.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, SubCategory, Origin, Transaction])
  ],
  providers: [
    {
      useClass: TypeOrmUserRepository,
      provide: UserRepository
    },
    {
      useClass: TypeOrmCategoryRepository,
      provide: CategoryRepository
    },
    {
      useClass: TypeOrmSubCategoryRepository,
      provide: SubCategoryRepository
    },
    {
      useClass: TypeOrmOriginRepository,
      provide: OriginRepository
    },
    {
      useClass: TypeOrmTransactionRepository,
      provide: TransactionRepository
    }
  ],
  exports: [
    UserRepository,
    CategoryRepository,
    SubCategoryRepository,
    OriginRepository,
    TransactionRepository
  ]
})
export class DatabaseModule {}
