import { Module } from "@nestjs/common";
import { JwtIntegration } from "@infra/integrations/jwt/jwt.integration";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { JwtAdapter } from "@domain/adapters/jwt.adapter";
import { ConfigService } from "@nestjs/config";
import { ExceptionsModule } from "../exceptions/exceptions.module";

@Module({
  imports: [
    NestJwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET")
      })
    }),
    ExceptionsModule
  ],
  providers: [{ useClass: JwtIntegration, provide: JwtAdapter }],
  exports: [JwtAdapter]
})
export class JwtModule {}
