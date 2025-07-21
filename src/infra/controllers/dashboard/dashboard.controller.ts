import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiCookieAuth } from "@nestjs/swagger";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { BalanceUseCase } from "@use-cases/dashboard/balance/balance.use-case";

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly balanceUseCase: BalanceUseCase) {}

  @Get("balance")
  async getBalance(@Req() req: AuthenticatedRequest) {
    return this.balanceUseCase.execute(req.user.id);
  }
}
