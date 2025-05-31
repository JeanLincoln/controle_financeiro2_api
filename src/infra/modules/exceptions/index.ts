import { Module } from "@nestjs/common";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { ExceptionsIntegration } from "@infra/integrations/exceptions";

@Module({
  providers: [
    {
      provide: ExceptionsAdapter,
      useClass: ExceptionsIntegration
    }
  ],
  exports: [ExceptionsAdapter]
})
export class ExceptionsModule {}
