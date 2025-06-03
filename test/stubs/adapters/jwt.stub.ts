import { JwtAdapter } from "@domain/adapters/jwt";

export class JwtAdapterStub extends JwtAdapter {
  async generateToken(): Promise<string> {
    return "token";
  }

  async verifyToken(): Promise<Record<string, string> | void> {
    return {};
  }
}
