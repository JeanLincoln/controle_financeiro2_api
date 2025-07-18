import { Category } from "@domain/entities/category.entity";
import { Origin } from "@domain/entities/origin.entity";
import { SubCategory } from "@domain/entities/sub-category.entity";
import { Transaction } from "@domain/entities/transaction.entity";
import {
  TransactionRepository,
  CreateOrUpdateAllTransactionProps,
  TransactionFindAllToRepositoryParams
} from "@domain/repositories/transaction.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  FindOptionsWhere,
  ILike,
  In
} from "typeorm";
import { USER_WITHOUT_PASSWORD_SELECT } from "../common/selects/user/user.selects";
import { RepositoryToPaginationReturn } from "@domain/entities/common/pagination.entity";
import { sortQuery } from "../common/queries/sort.query";

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

  async findAll(
    userId: number,
    {
      skip,
      take,
      sortBy,
      sortOrder,
      startDate,
      endDate,
      name,
      description,
      type,
      amount,
      isRecurring,
      createdAt,
      updatedAt,
      originId,
      categoriesIds,
      subCategoriesIds
    }: TransactionFindAllToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<Transaction>> {
    const whereClause: FindOptionsWhere<Transaction> = {
      user: { id: userId },
      ...(startDate && { startDate: MoreThanOrEqual(startDate) }),
      ...(endDate && { endDate: LessThanOrEqual(endDate) }),
      ...(name && { name: ILike(`%${name}%`) }),
      ...(description && { description: ILike(`%${description}%`) }),
      ...(type && { type }),
      ...(amount && { amount }),
      ...(isRecurring !== undefined && { isRecurring }),
      ...(createdAt && { createdAt }),
      ...(updatedAt && { updatedAt }),
      ...(originId && { origin: { id: originId } }),
      ...(categoriesIds && {
        categories: {
          id: In(Array.isArray(categoriesIds) ? categoriesIds : [categoriesIds])
        }
      }),
      ...(subCategoriesIds && {
        subCategories: {
          id: In(
            Array.isArray(subCategoriesIds)
              ? subCategoriesIds
              : [subCategoriesIds]
          )
        }
      })
    };

    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: whereClause,
        relations: ["origin", "categories", "subCategories"],
        skip,
        take,
        order: sortQuery(sortBy, sortOrder)
      }
    );

    return {
      data: transactions,
      total
    };
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

  async findByIds(id: number[]): Promise<Transaction[] | null> {
    return this.transactionRepository.find({
      where: { id: In(id) },
      relations: ["user"],
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
