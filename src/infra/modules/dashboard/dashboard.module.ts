import { Module } from "@nestjs/common";
import { BalanceUseCase } from "@use-cases/dashboard/balance/balance.use-case";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { DashboardController } from "@infra/controllers/dashboard/dashboard.controller";

@Module({
  imports: [DatabaseModule, AuthModule, ExceptionsModule],
  controllers: [DashboardController],
  providers: [BalanceUseCase]
})
export class DashboardModule {}
