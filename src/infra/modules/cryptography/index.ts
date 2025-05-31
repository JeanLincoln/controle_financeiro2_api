import { Module } from "@nestjs/common";
import { BcryptCryptographyAdapter } from "@infra/integrations/cryptography";
import { CryptographyAdapter } from "@domain/adapters/cryptography";

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
