import { Module } from "@nestjs/common";
import { JwtModule } from "../jwt";
import { LoginUseCase } from "@use-cases/auth/login";
import { CryptographyModule } from "../cryptography";
import { ExceptionsModule } from "../exceptions";
import { DatabaseModule } from "../database";
import { AuthController } from "@infra/controllers/auth";
import { RouteAuthUseCase } from "@use-cases/auth/route-auth";

@Module({
  imports: [DatabaseModule, JwtModule, ExceptionsModule, CryptographyModule],
  providers: [LoginUseCase, RouteAuthUseCase],
  controllers: [AuthController],
  exports: [LoginUseCase, RouteAuthUseCase]
})
export class AuthModule {}
