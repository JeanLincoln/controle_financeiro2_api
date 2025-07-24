import { TransactionType } from "@domain/entities/transaction.entity";
import {
  OriginRepository,
  OriginRanking
} from "@domain/repositories/origin.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OriginRankingUseCase {
  constructor(private readonly originRepository: OriginRepository) {}

  async execute(
    userId: number,
    type?: TransactionType
  ): Promise<OriginRanking> {
    return this.originRepository.getCurrentMonthTopFiveOrigins(userId, type);
  }
}
