import { ExceptionsAdapter } from "@domain/adapters/exceptions";

export class ExceptionsAdapterStub implements ExceptionsAdapter {
  badRequest(): void {
    return;
  }
  internalServerError(): void {
    return;
  }
  forbidden(): void {
    return;
  }
  unauthorized(): void {
    return;
  }
  notFound(): void {
    return;
  }
  wrongCredentials(): void {
    return;
  }
}
