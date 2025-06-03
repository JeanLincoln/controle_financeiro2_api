import { CryptographyAdapter } from "@domain/adapters/cryptography.adapter";

export class CryptographyAdapterStub implements CryptographyAdapter {
  async hash(): Promise<string> {
    return "";
  }

  async compare(): Promise<boolean> {
    return true;
  }
}
