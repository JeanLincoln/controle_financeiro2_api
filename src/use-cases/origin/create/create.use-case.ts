import {
  CreateOrUpdateAllOriginProps,
  OriginRepository
} from "@domain/repositories/origin.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateOriginUseCase {
  constructor(private readonly originRepository: OriginRepository) {}

  async execute(
    userId: number,
    origin: CreateOrUpdateAllOriginProps
  ): Promise<void> {
    await this.originRepository.create(userId, origin);
  }
}
