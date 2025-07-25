import { Category } from "@domain/entities/category.entity";
import { Origin } from "@domain/entities/origin.entity";
import { SubCategory } from "@domain/entities/sub-category.entity";
import {
  Transaction,
  TransactionType
} from "@domain/entities/transaction.entity";
import {
  TransactionRepository,
  CreateOrUpdateAllTransactionProps,
  TransactionFindAllToRepositoryParams,
  CurrentMonthTransactions,
  LastMonthTransactions,
  TransactionGraphFilters,
  TransactionGraphDataPoint
} from "@domain/repositories/transaction.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  FindOptionsWhere,
  ILike,
  In,
  And
} from "typeorm";
import { USER_WITHOUT_PASSWORD_SELECT } from "../common/selects/user/user.selects";
import { RepositoryToPaginationReturn } from "@domain/entities/common/pagination.entity";
import { sortQuery } from "../common/queries/sort.query";
import { getLastAndCurrentDates } from "src/utils/get-last-and-current-dates/get-last-and-current-dates";

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
      transactionDate,
      name,
      description,
      type,
      amount,
      createdAt,
      updatedAt,
      originId,
      categoriesIds,
      subCategoriesIds
    }: TransactionFindAllToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<Transaction>> {
    const whereClause: FindOptionsWhere<Transaction> = {
      user: { id: userId },
      ...(transactionDate && {
        transactionDate: MoreThanOrEqual(transactionDate)
      }),
      ...(name && { name: ILike(`%${name}%`) }),
      ...(description && { description: ILike(`%${description}%`) }),
      ...(type && { type }),
      ...(amount && { amount }),
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

  async getCurrentBalance(
    userId: number
  ): Promise<CurrentMonthTransactions & LastMonthTransactions> {
    const { currentMonthStart, currentMonthEnd, lastMonthStart, lastMonthEnd } =
      getLastAndCurrentDates();

    const currentMonthExpenses = await this.transactionRepository.findAndCount({
      where: {
        user: { id: userId },
        type: TransactionType.EXPENSE,
        transactionDate: And(
          MoreThanOrEqual(currentMonthStart),
          LessThanOrEqual(currentMonthEnd)
        )
      },
      select: {
        amount: true
      }
    });

    const currentMonthIncomes = await this.transactionRepository.findAndCount({
      where: {
        user: { id: userId },
        type: TransactionType.INCOME,
        transactionDate: And(
          MoreThanOrEqual(currentMonthStart),
          LessThanOrEqual(currentMonthEnd)
        )
      },
      select: {
        amount: true
      }
    });

    const lastMonthExpenses = await this.transactionRepository.findAndCount({
      where: {
        user: { id: userId },
        type: TransactionType.EXPENSE,
        transactionDate: And(
          MoreThanOrEqual(lastMonthStart),
          LessThanOrEqual(lastMonthEnd)
        )
      },
      select: {
        amount: true
      }
    });

    const lastMonthIncomes = await this.transactionRepository.findAndCount({
      where: {
        user: { id: userId },
        type: TransactionType.INCOME,
        transactionDate: And(
          MoreThanOrEqual(lastMonthStart),
          LessThanOrEqual(lastMonthEnd)
        )
      },
      select: {
        amount: true
      }
    });

    return {
      lastMonthExpenses,
      lastMonthIncomes,
      currentMonthExpenses,
      currentMonthIncomes
    };
  }

  async getCurrentMonthTopFiveTransactions(
    userId: number,
    type?: TransactionType
  ) {
    const { currentMonthStart, currentMonthEnd } = getLastAndCurrentDates();
    const TOP_FIVE_TRANSACTIONS = 5;

    const query = await this.transactionRepository
      .createQueryBuilder("transaction")
      .innerJoin("transaction.user", "user")
      .where("user.id = :userId", { userId })
      .andWhere("transaction.transactionDate >= :start", {
        start: currentMonthStart
      })
      .andWhere("transaction.transactionDate <= :end", {
        end: currentMonthEnd
      });

    if (type) {
      query.andWhere("transaction.type = :type", { type });
    }

    return query
      .limit(TOP_FIVE_TRANSACTIONS)
      .select([
        "transaction.name as name",
        "transaction.description as description",
        "transaction.type as type",
        "transaction.transactionDate as transaction_date",
        "transaction.amount as amount"
      ])
      .addSelect(
        `ROW_NUMBER() OVER (ORDER BY transaction.amount DESC)`,
        "ranking"
      )
      .getRawMany();
  }

  async getTransactionGraphData(
    userId: number,
    filters: TransactionGraphFilters
  ): Promise<TransactionGraphDataPoint[]> {
    const query = this.transactionRepository
      .createQueryBuilder("transaction")
      .where("transaction.userId = :userId", { userId })
      .andWhere("transaction.transactionDate >= :startDate", {
        startDate: filters.startDate
      })
      .andWhere("transaction.transactionDate <= :endDate", {
        endDate: filters.endDate
      });

    if (filters.type) {
      query.andWhere("transaction.type = :type", { type: filters.type });
    }

    const result = await query
      .select("TO_CHAR(transaction.transactionDate, 'MM-YYYY')", "date")
      .addSelect("SUM(transaction.amount)", "totalAmount")
      .addSelect("COUNT(transaction.id)", "transactionCount")
      .addSelect("transaction.type", "type")
      .groupBy("transaction.type")
      .addGroupBy("TO_CHAR(transaction.transactionDate, 'MM-YYYY')")
      .orderBy("TO_CHAR(transaction.transactionDate, 'MM-YYYY')", "ASC")
      .getRawMany();

    return result.map((row: TransactionGraphDataPoint) => ({
      date: row.date,
      type: row.type,
      totalAmount: Number(row.totalAmount) || 0,
      transactionCount: Number(row.transactionCount) || 0
    }));
  }
}
