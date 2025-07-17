import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { FindAndValidateTransactionUseCase } from "@use-cases/transaction/find-and-validate/find-and-validate.use-case";

@Injectable()
export class TransactionValidationGuard implements CanActivate {
  constructor(
    private readonly findAndValidateTransactionUseCase: FindAndValidateTransactionUseCase
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return await this.findAndValidateTransactionUseCase.execute(request);
  }
}
