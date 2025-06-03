import { Module } from "@nestjs/common";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsIntegration } from "@infra/integrations/exceptions/exceptions.integration";

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
