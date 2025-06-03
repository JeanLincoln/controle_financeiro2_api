import { Module } from "@nestjs/common";
import { JwtIntegration } from "@infra/integrations/jwt";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { JwtAdapter } from "@domain/adapters/jwt";
import { ConfigService } from "@nestjs/config";
import { ExceptionsModule } from "../exceptions";

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
