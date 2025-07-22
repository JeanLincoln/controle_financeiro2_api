import { Category } from "@domain/entities/category.entity";
import { User } from "@domain/entities/user.entity";
import {
  CreateOrUpdateAllCategoryProps,
  CategoryRepository,
  CategoryFindAllToRepositoryParams,
  CategoryFindOptionsToRepositoryParams,
  CategoryOption,
  type CategoryRanking
} from "@domain/repositories/category.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In, ILike } from "typeorm";
import { USER_WITHOUT_PASSWORD_SELECT } from "../common/selects/user/user.selects";
import { RepositoryToPaginationReturn } from "@domain/entities/common/pagination.entity";
import { sortQuery } from "../common/queries/sort.query";
import { getLastAndCurrentDates } from "src/utils/get-last-and-current-dates/get-last-and-current-dates";

export class TypeOrmCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async findAll(
    userId: number,
    { skip, take, sortBy, sortOrder }: CategoryFindAllToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<Category>> {
    const [categories, total] = await this.categoryRepository.findAndCount({
      where: { user: { id: userId } },
      skip,
      take,
      order: sortQuery(sortBy, sortOrder)
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
    const [categories, total] = await this.categoryRepository.findAndCount({
      where: {
        user: { id: userId },
        ...(search && { name: ILike(`%${search}%`) })
      },
      select: ["id", "name"],
      skip,
      take,
      order: sortQuery("name", sortOrder)
    });

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
        user: USER_WITHOUT_PASSWORD_SELECT
      }
    });
  }

  async findByIds(ids: number[]): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { id: In(ids) },
      relations: ["user"],
      select: {
        user: USER_WITHOUT_PASSWORD_SELECT
      }
    });
  }

  async create(
    user: User,
    category: CreateOrUpdateAllCategoryProps
  ): Promise<void> {
    const categoryInstance = this.categoryRepository.create({
      ...category,
      user: user,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await this.categoryRepository.save(categoryInstance);
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

  async getCurrentMonthCategories(userId: number): Promise<CategoryRanking> {
    const { currentMonthStart, currentMonthEnd } = getLastAndCurrentDates();
    const TOP_FIVE_CATEGORIES = 5;

    return await this.categoryRepository
      .createQueryBuilder("category")
      .leftJoin("category.transactions", "transaction")
      .leftJoin("category.user", "user")
      .where("user.id = :userId", { userId })
      .andWhere("transaction.transactionDate >= :start", {
        start: currentMonthStart
      })
      .andWhere("transaction.transactionDate <= :end", { end: currentMonthEnd })
      .groupBy("category.id")
      .addGroupBy("category.name")
      .addGroupBy("category.icon")
      .addGroupBy("category.color")
      .orderBy("SUM(transaction.amount)", "DESC")
      .limit(TOP_FIVE_CATEGORIES)
      .select([
        "category.id",
        "category.name",
        "category.icon",
        "category.color",
        "SUM(transaction.amount) as totalAmount"
      ])
      .addSelect(
        `ROW_NUMBER() OVER (ORDER BY SUM(transaction.amount) DESC)`,
        "ranking"
      )
      .getRawMany();
  }
}
