import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { Origin } from "@domain/entities/origin.entity";
import { OriginRepository } from "@domain/repositories/origin.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllOriginUseCase {
  constructor(
    private readonly originRepository: OriginRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(userId: number): Promise<Origin[] | void> {
    const origins = await this.originRepository.findAll(userId);

    if (!origins) {
      this.exceptionsAdapter.internalServerError({
        message: "There was an error while fetching origins"
      });
      return;
    }

    const atLeastOneOriginDoesntBelongToUser = origins.some(
      (origin) => origin.user.id !== userId
    );

    if (atLeastOneOriginDoesntBelongToUser) {
      this.exceptionsAdapter.forbidden({
        message: "You are not allowed to access this origin"
      });
      return;
    }

    return origins;
  }
}
