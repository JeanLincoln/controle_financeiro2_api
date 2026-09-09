import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { OriginRepository } from "@domain/repositories/origin.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteOriginUseCase {
  constructor(
    private readonly originRepository: OriginRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(originId: number): Promise<void> {
    const hasTransactions =
      await this.originRepository.hasTransactions(originId);

    if (hasTransactions) {
      return this.exceptionsAdapter.badRequest({
        message:
          "This origin cannot be deleted because it is used by transactions"
      });
    }

    await this.originRepository.delete(originId);
  }
}
