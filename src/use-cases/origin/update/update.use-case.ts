import { Injectable } from "@nestjs/common";
import {
  OriginRepository,
  CreateOrUpdateAllOriginProps
} from "@domain/repositories/origin.repository";

@Injectable()
export class UpdateOriginUseCase {
  constructor(private readonly originRepository: OriginRepository) {}

  async execute(
    originId: number,
    userId: number,
    origin: CreateOrUpdateAllOriginProps
  ): Promise<void> {
    await this.originRepository.update(originId, userId, origin);
  }
}
