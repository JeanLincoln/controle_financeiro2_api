import { Origin } from "@domain/entities/origin.entity";
import {
  OriginRepository,
  CreateOrUpdateAllOriginProps
} from "@domain/repositories/origin.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class TypeOrmOriginRepository implements OriginRepository {
  constructor(
    @InjectRepository(Origin)
    private readonly originRepository: Repository<Origin>
  ) {}

  async findAll(): Promise<Origin[]> {
    return this.originRepository.find();
  }

  async findById(id: number): Promise<Origin | null> {
    return this.originRepository.findOne({
      where: { id },
      relations: ["user"]
    });
  }

  async create(origin: CreateOrUpdateAllOriginProps): Promise<void> {
    const originInstance = this.originRepository.create({
      ...origin,
      user: { id: origin.userId }
    });
    await this.originRepository.save(originInstance);
  }

  async update(
    id: number,
    origin: CreateOrUpdateAllOriginProps
  ): Promise<void> {
    await this.originRepository.update(id, origin);
  }

  async delete(id: number): Promise<void> {
    await this.originRepository.delete(id);
  }
}
