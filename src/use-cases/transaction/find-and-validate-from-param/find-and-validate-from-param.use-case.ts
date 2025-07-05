import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { Transaction } from "@domain/entities/transaction.entity";
import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { Injectable } from "@nestjs/common";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";

export interface TransactionAuthenticatedRequest extends AuthenticatedRequest {
  params: {
    transactionId: number;
  };
  transaction: Transaction;
}

@Injectable()
export class FindAndValidateFromParamTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(request: TransactionAuthenticatedRequest): Promise<boolean> {
    const { user, params } = request;
    const transactionId = Number(params.transactionId);
    const userId = user.id;

    const transaction =
      await this.transactionRepository.findById(transactionId);

    if (!transaction) {
      this.exceptionsAdapter.notFound({
        message: "Transaction not found"
      });
      return false;
    }

    if (transaction.user.id !== userId) {
      this.exceptionsAdapter.forbidden({
        message: "You are not allowed to access this transaction"
      });
      return false;
    }

    request.transaction = transaction;

    return true;
  }
}
