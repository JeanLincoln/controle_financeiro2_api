import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { FindAndValidateFromParamTransactionUseCase } from "@use-cases/transaction/find-and-validate-from-param/find-and-validate-from-param.use-case";

@Injectable()
export class TransactionParamGuard implements CanActivate {
  constructor(
    private readonly findAndValidateTransactionUseCase: FindAndValidateFromParamTransactionUseCase
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return await this.findAndValidateTransactionUseCase.execute(request);
  }
}
