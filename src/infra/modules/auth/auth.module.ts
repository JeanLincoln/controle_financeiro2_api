import { Module } from "@nestjs/common";
import { JwtModule } from "../jwt/jwt.module";
import { LoginUseCase } from "@use-cases/auth/login/login.use-case";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { ExceptionsModule } from "../exceptions/exceptions.module";
import { DatabaseModule } from "../database/database.module";
import { AuthController } from "@infra/controllers/auth/auth.controller";
import { RouteAuthUseCase } from "@use-cases/auth/route-auth/route-auth.use-case";
import { LogoutUseCase } from "@use-cases/auth/logout/logout.use-case";

@Module({
  imports: [DatabaseModule, JwtModule, ExceptionsModule, CryptographyModule],
  providers: [LoginUseCase, RouteAuthUseCase, LogoutUseCase],
  controllers: [AuthController],
  exports: [LoginUseCase, RouteAuthUseCase]
})
export class AuthModule {}
