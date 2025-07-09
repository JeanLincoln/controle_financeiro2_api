import { Origin } from "@domain/entities/origin.entity";
import {
  OriginRepository,
  CreateOrUpdateAllOriginProps
} from "@domain/repositories/origin.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { USER_WITHOUT_PASSWORD_SELECT } from "../common/selects/user/user.selects";
import {
  RepositoryToPaginationReturn,
  RepositoryPaginationParams
} from "@domain/entities/pagination.entity";

export class TypeOrmOriginRepository implements OriginRepository {
  constructor(
    @InjectRepository(Origin)
    private readonly originRepository: Repository<Origin>
  ) {}

  async findAll(
    userId: number,
    { skip, take }: RepositoryPaginationParams
  ): Promise<RepositoryToPaginationReturn<Origin>> {
    const [origins, total] = await this.originRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ["user"],
      select: {
        user: USER_WITHOUT_PASSWORD_SELECT
      },
      skip,
      take
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
}
