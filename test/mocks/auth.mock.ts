import type { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";

export const LOGIN_PARAMS = {
  email: "john.doe@example.com",
  password: "Password123!"
};

export const INVALID_TOKEN_MOCK = {
  headers: {
    cookie: undefined
  }
} as AuthenticatedRequest;

export const REQUEST_MOCK = {
  headers: {
    cookie: "authentication=token"
  }
} as AuthenticatedRequest;
