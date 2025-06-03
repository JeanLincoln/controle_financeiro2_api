import { Module } from "@nestjs/common";
import { BcryptCryptographyAdapter } from "@infra/integrations/cryptography/cryptography.integration";
import { CryptographyAdapter } from "@domain/adapters/cryptography.adapter";

@Module({
  providers: [
    {
      provide: CryptographyAdapter,
      useClass: BcryptCryptographyAdapter
    }
  ],
  exports: [CryptographyAdapter]
})
export class CryptographyModule {}
