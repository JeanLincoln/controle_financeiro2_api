import { Transaction } from "@domain/entities/transaction.entity";
import { Injectable } from "@nestjs/common";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { TransactionRepository } from "@domain/repositories/transaction.repository";

export interface ParamTransactionAuthenticatedRequest
  extends AuthenticatedRequest {
  params: {
    transactionId: string;
  };
  transaction: Transaction;
}

export interface QueryTransactionAuthenticatedRequest
  extends AuthenticatedRequest {
  query: {
    transactionsIds: string | string[];
  };
  transactions: Transaction[];
}

export interface BodyTransactionsAuthenticatedRequest
  extends Omit<AuthenticatedRequest, "body"> {
  body: {
    transactionsIds: number[];
  };
  transactions: Transaction[];
}

type FindAndValidateRequestType =
  | BodyTransactionsAuthenticatedRequest
  | ParamTransactionAuthenticatedRequest
  | QueryTransactionAuthenticatedRequest;

export interface ValidateTransactionsUseCaseReturn {
  transactions: Transaction[];
}

@Injectable()
export class FindAndValidateTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  isParamTransactionRequest(request: FindAndValidateRequestType) {
    return (
      "params" in request &&
      typeof request.params === "object" &&
      "transactionId" in
        (request as ParamTransactionAuthenticatedRequest).params
    );
  }

  isBodyTransactionsRequest(request: FindAndValidateRequestType) {
    return (
      "body" in request &&
      request.body &&
      typeof request.body === "object" &&
      "transactionsIds" in request.body
    );
  }

  isQueryTransactionsRequest(request: FindAndValidateRequestType) {
    return (
      "query" in request &&
      typeof request.query === "object" &&
      "transactionsIds" in request.query
    );
  }

  async handleParamTransactionRequest(
    userId: number,
    request: ParamTransactionAuthenticatedRequest
  ): Promise<boolean> {
    const { params } = request;
    const transactionId = Number(params.transactionId);

    const response = await this.validateRequest(userId, [transactionId]);

    if (
      !response ||
      !response.transactions ||
      response.transactions.length === 0
    ) {
      this.exceptionsAdapter.internalServerError({
        message: "There was an error while fetching the transaction."
      });
      return false;
    }

    request.transaction = response.transactions[0];

    return true;
  }

  async handleQueryTransactionsRequest(
    userId: number,
    request: QueryTransactionAuthenticatedRequest
  ): Promise<boolean> {
    const validatedRequest = request;
    const { transactionsIds } = validatedRequest.query;
    const formattedTransactionsIds = Array.isArray(transactionsIds)
      ? transactionsIds.map(Number)
      : [Number(transactionsIds)];

    const response = await this.validateRequest(
      userId,
      formattedTransactionsIds
    );

    if (
      !response ||
      !response.transactions ||
      response.transactions.length === 0
    ) {
      this.exceptionsAdapter.internalServerError({
        message: "There was an error while fetching the transaction."
      });
      return false;
    }

    request.transactions = response.transactions;

    return true;
  }

  async handleBodyTransactionsRequest(
    userId: number,
    request: BodyTransactionsAuthenticatedRequest
  ): Promise<boolean> {
    const transactionsIds = request.body.transactionsIds;

    const response = await this.validateRequest(userId, transactionsIds);

    if (
      !response ||
      !response.transactions ||
      response.transactions.length === 0
    ) {
      this.exceptionsAdapter.internalServerError({
        message: "There was an error while fetching the transactions."
      });
      return false;
    }

    request.transactions = response.transactions;
    return true;
  }

  async validateRequest(
    userId: number,
    transactionsIds: number[]
  ): Promise<ValidateTransactionsUseCaseReturn | void> {
    const transactions =
      await this.transactionRepository.findByIds(transactionsIds);

    if (!transactions) {
      this.exceptionsAdapter.notFound({
        message:
          "There was an error while fetching transactions, please try again"
      });
      return;
    }

    const transactionsArraysDoNotMatch =
      transactionsIds.length !== transactions.length;

    if (transactionsArraysDoNotMatch) {
      this.exceptionsAdapter.notFound({
        message: "Some transactions were not found, please try again"
      });
      return;
    }

    const notOwsSomeTransaction = transactions.some(
      (transaction) => transaction.user.id !== userId
    );

    if (notOwsSomeTransaction) {
      this.exceptionsAdapter.forbidden({
        message:
          "You are not allowed to access one or more of these transactions"
      });
      return;
    }

    return { transactions: transactions };
  }

  async execute(request: FindAndValidateRequestType): Promise<boolean> {
    const { user } = request;
    const userId = user.id;

    const isAParamRequest = this.isParamTransactionRequest(request);
    const isAQueryRequest = this.isQueryTransactionsRequest(request);
    const isABodyRequest = this.isBodyTransactionsRequest(request);

    if (!isAParamRequest && !isABodyRequest && !isAQueryRequest) return true;

    if (isAParamRequest)
      return this.handleParamTransactionRequest(
        userId,
        request as ParamTransactionAuthenticatedRequest
      );

    if (isAQueryRequest)
      return this.handleQueryTransactionsRequest(
        userId,
        request as QueryTransactionAuthenticatedRequest
      );

    if (isABodyRequest)
      return this.handleBodyTransactionsRequest(
        userId,
        request as BodyTransactionsAuthenticatedRequest
      );

    this.exceptionsAdapter.internalServerError({
      message: "Invalid request type for transaction validation"
    });
    return false;
  }
}
