import {
  CreateOrUpdateAllOriginProps,
  OriginRepository
} from "@domain/repositories/origin.repository";
import { Origin } from "@domain/entities/origin.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateOriginUseCase {
  constructor(private readonly originRepository: OriginRepository) {}

  async execute(
    userId: number,
    origin: CreateOrUpdateAllOriginProps
  ): Promise<Origin> {
    return this.originRepository.create(userId, origin);
  }
}
