import { Category } from "@domain/entities/category.entity";
import { User } from "@domain/entities/user.entity";
import {
  CreateOrUpdateAllCategoryProps,
  CategoryRepository,
  CategoryFindAllToRepositoryParams,
  CategoryFindOptionsToRepositoryParams,
  CategoryOption,
  type CategoryRanking,
  type CreateCategoryReturn
} from "@domain/repositories/category.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { USER_WITHOUT_PASSWORD_SELECT } from "../common/selects/user/user.selects";
import { RepositoryToPaginationReturn } from "@domain/entities/common/pagination.entity";
import { sortQuery } from "../common/queries/sort.query";
import { getLastAndCurrentDates } from "src/utils/time/get-last-and-current-dates";
import { TransactionType } from "@domain/entities/transaction.entity";

export class TypeOrmCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async findAll(
    userId: number,
    { skip, take, sortBy, sortOrder, name }: CategoryFindAllToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<Category>> {
    const categoryIdsQueryBuilder = this.categoryRepository
      .createQueryBuilder("category")
      .where("category.user_id = :userId", { userId });

    if (name) {
      categoryIdsQueryBuilder.andWhere(
        "(unaccent(lower(category.name)) ILIKE unaccent(lower(:name)) OR unaccent(lower(category.description)) ILIKE unaccent(lower(:name)))",
        { name: `%${name}%` }
      );
    }

    const [categoryIds, total] = await categoryIdsQueryBuilder
      .skip(skip)
      .take(take)
      .select("category.id")
      .getManyAndCount();

    const categories = await this.categoryRepository.find({
      where: { id: In(categoryIds.map((category) => category.id)) },
      relations: ["subCategories"],
      order: sortQuery(sortBy, sortOrder),
      select: {
        subCategories: {
          id: true,
          name: true,
          icon: true,
          color: true
        }
      }
    });

    return {
      data: categories,
      total
    };
  }

  async options(
    userId: number,
    { skip, take, sortOrder, search }: CategoryFindOptionsToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<CategoryOption>> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder("category")
      .select(["category.id", "category.name"])
      .where("category.user_id = :userId", { userId });

    if (search) {
      queryBuilder.andWhere(
        "unaccent(lower(category.name)) ILIKE unaccent(lower(:search))",
        { search: `%${search}%` }
      );
    }

    const [categories, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .orderBy(sortQuery("name", sortOrder))
      .getManyAndCount();

    return {
      data: categories,
      total
    };
  }

  async findById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ["user", "subCategories"],
      select: {
        subCategories: true,
        user: USER_WITHOUT_PASSWORD_SELECT
      }
    });
  }

  async findByIds(ids: number[]): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { id: In(ids) },
      relations: ["user", "subCategories"],
      select: {
        user: USER_WITHOUT_PASSWORD_SELECT
      }
    });
  }

  async create(
    user: User,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<CreateCategoryReturn | void> {
    const categoryInstance = this.categoryRepository.create({
      ...category,
      user: user,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await this.categoryRepository.save(categoryInstance);

    return { id: categoryInstance.id };
  }

  async update(
    id: number,
    userId: number,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<void> {
    await this.categoryRepository.update(id, {
      ...category,
      user: { id: userId },
      updatedAt: new Date()
    });
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.categoryRepository.delete({ user: { id: userId } });
  }

  async getCurrentMonthTopFiveCategories(
    userId: number,
    type?: TransactionType
  ): Promise<CategoryRanking> {
    const { currentMonthStart, currentMonthEnd } = getLastAndCurrentDates();
    const TOP_FIVE_CATEGORIES = 5;

    const query = await this.categoryRepository
      .createQueryBuilder("category")
      .innerJoin("category.user", "user")
      .innerJoin("category.transactions", "transaction")
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
      .groupBy("category.id")
      .addGroupBy("category.name")
      .addGroupBy("category.icon")
      .addGroupBy("category.color")
      .addGroupBy("transaction.type")
      .orderBy("SUM(transaction.amount)", "DESC")
      .limit(TOP_FIVE_CATEGORIES)
      .select([
        "category.id as id",
        "category.name as name",
        "category.icon as icon",
        "category.color as color",
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
