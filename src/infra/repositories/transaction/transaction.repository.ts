import { Category } from "@domain/entities/category.entity";
import { Origin } from "@domain/entities/origin.entity";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { Transaction } from "@domain/entities/transaction.entity";
import {
  TransactionRepository,
  CreateOrUpdateAllTransactionProps
} from "@domain/repositories/transaction.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { USER_WITHOUT_PASSWORD_SELECT } from "../common/selects/user/user.selects";

@Injectable()
export class TypeOrmTransactionRepository implements TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>
  ) {}

  async create(
    userId: number,
    origin: Origin,
    categories: Category[],
    subCategories: SubCategory[],
    transactionData: CreateOrUpdateAllTransactionProps
  ): Promise<void> {
    const transaction = this.transactionRepository.create({
      ...transactionData,
      origin: origin,
      categories: categories,
      subCategories: subCategories,
      user: { id: userId },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.transactionRepository.save(transaction);
  }

  async findAll(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { user: { id: userId } },
      relations: ["origin", "categories", "subCategories"]
    });
  }

  async findById(id: number): Promise<Transaction | null> {
    return this.transactionRepository.findOne({
      where: { id },
      relations: ["user", "origin", "categories", "subCategories"],
      select: {
        user: USER_WITHOUT_PASSWORD_SELECT
      }
    });
  }

  async update(
    transactionToUpdate: Transaction,
    userId: number,
    origin: Origin,
    categories: Category[],
    subCategories: SubCategory[],
    updateData: CreateOrUpdateAllTransactionProps
  ): Promise<void> {
    Object.assign(transactionToUpdate, {
      ...updateData,
      origin: origin,
      user: { id: userId },
      updatedAt: new Date()
    });

    transactionToUpdate.categories = categories;
    transactionToUpdate.subCategories = subCategories;

    await this.transactionRepository.save(transactionToUpdate);
  }

  async delete(transactionToDelete: Transaction): Promise<void> {
    await this.transactionRepository.delete(transactionToDelete.id);
  }
}
