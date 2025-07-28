import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { Response } from "express";

export const generateResponseMock = () => {
  const res: Partial<Response> = {
    clearCookie: jest.fn(),
    cookie: jest.fn()
  };
  return res as Response;
};

export const LOGIN_PARAMS = {
  email: "john.doe@example.com",
  password: "Password123!"
};

export const AUTHENTICATED_REQUEST_MOCK = {
  headers: {
    cookie: "Authorization=some_token"
  }
} as AuthenticatedRequest;

export const NON_AUTHENTICATED_REQUEST_MOCK = {
  headers: {}
} as AuthenticatedRequest;
