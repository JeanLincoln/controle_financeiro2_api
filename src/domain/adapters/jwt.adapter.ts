export interface JwtSignOptions {
  expiresIn: string;
  subject: string;
  issuer: string;
  audience: string;
}

export type JwtSignPayload = Record<string, string>;

export abstract class JwtAdapter {
  abstract generateToken(
    payload: JwtSignPayload,
    options: JwtSignOptions
  ): Promise<string>;
  abstract verifyToken(token: string): Promise<Record<string, string> | void>;
}
