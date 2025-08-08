import { Origin } from "@domain/entities/origin.entity";
import {
  OriginRepository,
  CreateOrUpdateAllOriginProps,
  OriginFindAllToRepositoryParams,
  OriginFindOptionsToRepositoryParams,
  OriginOption,
  type OriginRanking
} from "@domain/repositories/origin.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { USER_WITHOUT_PASSWORD_SELECT } from "../common/selects/user/user.selects";
import { RepositoryToPaginationReturn } from "@domain/entities/common/pagination.entity";
import { sortQuery } from "../common/queries/sort.query";
import { TransactionType } from "@domain/entities/transaction.entity";
import { getLastAndCurrentDates } from "src/utils/time/get-last-and-current-dates";

export class TypeOrmOriginRepository implements OriginRepository {
  constructor(
    @InjectRepository(Origin)
    private readonly originRepository: Repository<Origin>
  ) {}

  async findAll(
    userId: number,
    { name, skip, take, sortBy, sortOrder }: OriginFindAllToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<Origin>> {
    const [origins, total] = await this.originRepository.findAndCount({
      where: {
        user: { id: userId },
        ...(name && { name: ILike(`%${name}%`) })
      },
      skip,
      take,
      order: sortQuery(sortBy, sortOrder)
    });

    return {
      data: origins,
      total
    };
  }

  async options(
    userId: number,
    { skip, take, sortOrder, search }: OriginFindOptionsToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<OriginOption>> {
    const [origins, total] = await this.originRepository.findAndCount({
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
      data: origins,
      total
    };
  }

  async findById(id: number): Promise<Origin | null> {
    return this.originRepository.findOne({
      where: { id },
      relations: ["user"],
      select: {
        user: USER_WITHOUT_PASSWORD_SELECT
      }
    });
  }

  async create(
    userId: number,
    origin: CreateOrUpdateAllOriginProps
  ): Promise<void> {
    const originInstance = this.originRepository.create({
      ...origin,
      user: { id: userId },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await this.originRepository.save(originInstance);
  }

  async update(
    id: number,
    userId: number,
    origin: CreateOrUpdateAllOriginProps
  ): Promise<void> {
    await this.originRepository.update(id, {
      ...origin,
      user: { id: userId },
      updatedAt: new Date()
    });
  }

  async delete(id: number): Promise<void> {
    await this.originRepository.delete(id);
  }

  async getCurrentMonthTopFiveOrigins(
    userId: number,
    type?: TransactionType
  ): Promise<OriginRanking> {
    const { currentMonthStart, currentMonthEnd } = getLastAndCurrentDates();
    const TOP_FIVE_ORIGINS = 5;

    const query = await this.originRepository
      .createQueryBuilder("origin")
      .innerJoin("origin.user", "user")
      .innerJoin("origin.transactions", "transaction")
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
      .groupBy("origin.id")
      .addGroupBy("origin.name")
      .addGroupBy("origin.description")
      .addGroupBy("origin.color")
      .addGroupBy("origin.icon")
      .addGroupBy("transaction.type")
      .orderBy("SUM(transaction.amount)", "DESC")
      .limit(TOP_FIVE_ORIGINS)
      .select([
        "origin.id as id",
        "origin.name as name",
        "origin.description as description",
        "origin.color as color",
        "origin.icon as icon",
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
