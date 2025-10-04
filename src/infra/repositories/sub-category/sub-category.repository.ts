import { SubCategory } from "@domain/entities/sub-category.entity";
import {
  SubCategoryRepository,
  CreateOrUpdateAllSubCategoryProps,
  SubCategoryOption,
  SubCategoriesFindOptionsToRepositoryParams,
  type SubCategoryRanking
} from "@domain/repositories/sub-category.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { USER_WITHOUT_PASSWORD_SELECT } from "../common/selects/user/user.selects";
import { RepositoryToPaginationReturn } from "@domain/entities/common/pagination.entity";
import { getLastAndCurrentDates } from "src/utils/time/get-last-and-current-dates";
import { TransactionType } from "@domain/entities/transaction.entity";

export class TypeOrmSubCategoryRepository implements SubCategoryRepository {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>
  ) {}

  async create(
    categoryId: number,
    subCategory: CreateOrUpdateAllSubCategoryProps
  ): Promise<void> {
    const subCategoryInstance = this.subCategoryRepository.create({
      ...subCategory,
      category: { id: categoryId },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await this.subCategoryRepository.save(subCategoryInstance);
  }

  async findAllByCategory(categoryId: number): Promise<SubCategory[]> {
    return await this.subCategoryRepository.find({
      where: {
        category: {
          id: categoryId
        }
      }
    });
  }

  async options(
    userId: number,
    {
      skip,
      take,
      sortOrder,
      search,
      categoriesIds
    }: SubCategoriesFindOptionsToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<SubCategoryOption>> {
    const queryBuilder = this.subCategoryRepository
      .createQueryBuilder("subCategory")
      .innerJoin("subCategory.category", "category")
      .select(["subCategory.id", "subCategory.name"])
      .where("category.user_Id = :userId", { userId });

    if (search) {
      queryBuilder.andWhere(
        "unaccent(lower(subCategory.name)) ILIKE unaccent(lower(:search))",
        { search: `%${search}%` }
      );
    }

    if (categoriesIds && categoriesIds.length > 0) {
      queryBuilder.andWhere("subCategory.categoryId IN (:...categoriesIds)", {
        categoriesIds
      });
    }

    const [subCategories, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .orderBy("subCategory.name", sortOrder)
      .getManyAndCount();

    return {
      data: subCategories,
      total
    };
  }

  async findById(id: number): Promise<SubCategory | null> {
    return await this.subCategoryRepository.findOne({
      where: { id },
      relations: ["category.user"],
      select: {
        category: {
          user: USER_WITHOUT_PASSWORD_SELECT
        }
      }
    });
  }

  async findByIds(ids: number[]): Promise<SubCategory[] | null> {
    return await this.subCategoryRepository.find({
      where: { id: In(ids) },
      relations: ["category.user"],
      select: {
        category: {
          id: true,
          color: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          description: true,
          icon: true,
          user: USER_WITHOUT_PASSWORD_SELECT
        }
      }
    });
  }

  async update(
    id: number,
    categoryId: number,
    subCategory: CreateOrUpdateAllSubCategoryProps
  ): Promise<void> {
    await this.subCategoryRepository.update(id, {
      ...subCategory,
      category: { id: categoryId },
      updatedAt: new Date()
    });
  }

  async delete(id: number): Promise<void> {
    await this.subCategoryRepository.delete(id);
  }

  async getCurrentMonthTopFiveSubCategories(
    userId: number,
    type?: TransactionType
  ): Promise<SubCategoryRanking> {
    const { currentMonthStart, currentMonthEnd } = getLastAndCurrentDates();
    const TOP_FIVE_SUB_CATEGORIES = 5;

    const queryBuilder = this.subCategoryRepository
      .createQueryBuilder("subCategory")
      .innerJoin("subCategory.category", "categories")
      .innerJoin("subCategory.transactions", "transaction")
      .where("categories.user.id = :userId", { userId })
      .andWhere("transaction.transactionDate >= :start", {
        start: currentMonthStart
      })
      .andWhere("transaction.transactionDate <= :end", {
        end: currentMonthEnd
      });

    if (type) {
      queryBuilder.andWhere("transaction.type = :type", { type });
    }

    return await queryBuilder
      .groupBy("subCategory.id")
      .addGroupBy("subCategory.name")
      .addGroupBy("subCategory.icon")
      .addGroupBy("subCategory.color")
      .addGroupBy("transaction.type")
      .orderBy("SUM(transaction.amount)", "DESC")
      .limit(TOP_FIVE_SUB_CATEGORIES)
      .select([
        "subCategory.id as id",
        "subCategory.name as name",
        "subCategory.icon as icon",
        "subCategory.color as color",
        "transaction.type as type",
        "SUM(transaction.amount) as amount"
      ])
      .addSelect(
        `ROW_NUMBER() OVER (ORDER BY SUM(transaction.amount) DESC)`,
        "ranking"
      )
      .getRawMany();
  }
}
