import { Origin } from "@domain/entities/origin.entity";
import { Injectable } from "@nestjs/common";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { OriginRepository } from "@domain/repositories/origin.repository";

export interface ParamOriginAuthenticatedRequest extends AuthenticatedRequest {
  params: {
    originId: string;
  };
  origin: Origin;
}

export interface QueryOriginAuthenticatedRequest extends AuthenticatedRequest {
  query: {
    originId: string;
  };
  origin: Origin;
}

export interface BodyOriginAuthenticatedRequest
  extends Omit<AuthenticatedRequest, "body"> {
  body: {
    originId: number;
  };
  origin: Origin;
}

type FindAndValidateRequestType =
  | BodyOriginAuthenticatedRequest
  | ParamOriginAuthenticatedRequest
  | QueryOriginAuthenticatedRequest;

export interface ValidateOriginUseCaseReturn {
  origin: Origin;
}

@Injectable()
export class FindAndValidateOriginUseCase {
  constructor(
    private readonly originRepository: OriginRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  isParamOriginRequest(request: FindAndValidateRequestType) {
    return (
      "params" in request &&
      typeof request.params === "object" &&
      "originId" in (request as ParamOriginAuthenticatedRequest).params
    );
  }

  isBodyOriginRequest(request: FindAndValidateRequestType) {
    return (
      "body" in request &&
      request.body &&
      typeof request.body === "object" &&
      "originId" in request.body
    );
  }

  isQueryOriginRequest(request: FindAndValidateRequestType) {
    return (
      "query" in request &&
      typeof request.query === "object" &&
      "originId" in request.query
    );
  }

  async handleParamOriginRequest(
    userId: number,
    request: ParamOriginAuthenticatedRequest
  ): Promise<boolean> {
    const { params } = request;
    const originId = Number(params.originId);

    const response = await this.validateRequest(userId, Number(originId));

    if (!response || !response.origin) {
      this.exceptionsAdapter.internalServerError({
        message: "There was an error while fetching the origin."
      });
      return false;
    }

    request.origin = response.origin;

    return true;
  }

  async handleQueryOriginRequest(
    userId: number,
    request: QueryOriginAuthenticatedRequest
  ): Promise<boolean> {
    const validatedRequest = request;
    const { originId } = validatedRequest.query;

    const response = await this.validateRequest(userId, Number(originId));

    if (!response || !response.origin) {
      this.exceptionsAdapter.internalServerError({
        message: "There was an error while fetching the origin."
      });
      return false;
    }

    request.origin = response.origin;

    return true;
  }

  async handleBodyOriginRequest(
    userId: number,
    request: BodyOriginAuthenticatedRequest
  ): Promise<boolean> {
    const originId = request.body.originId;

    const response = await this.validateRequest(userId, originId);

    if (!response || !response.origin) {
      this.exceptionsAdapter.internalServerError({
        message: "There was an error while fetching the origin."
      });
      return false;
    }

    request.origin = response.origin;
    return true;
  }

  async validateRequest(
    userId: number,
    originId: number
  ): Promise<ValidateOriginUseCaseReturn | void> {
    const origin = await this.originRepository.findById(originId);

    if (!origin) {
      this.exceptionsAdapter.notFound({
        message: "This origin was not found, please try again"
      });
      return;
    }

    const notOwsOrigin = origin.user.id !== userId;

    if (notOwsOrigin) {
      this.exceptionsAdapter.forbidden({
        message: "You are not allowed to access this origin"
      });
      return;
    }

    return { origin: origin };
  }

  async execute(request: FindAndValidateRequestType): Promise<boolean> {
    const { user } = request;
    const userId = user.id;

    const isAParamRequest = this.isParamOriginRequest(request);
    const isAQueryRequest = this.isQueryOriginRequest(request);
    const isABodyRequest = this.isBodyOriginRequest(request);

    if (!isAParamRequest && !isABodyRequest && !isAQueryRequest) return true;

    if (isAParamRequest)
      return this.handleParamOriginRequest(
        userId,
        request as ParamOriginAuthenticatedRequest
      );

    if (isAQueryRequest)
      return this.handleQueryOriginRequest(
        userId,
        request as QueryOriginAuthenticatedRequest
      );

    if (isABodyRequest)
      return this.handleBodyOriginRequest(
        userId,
        request as BodyOriginAuthenticatedRequest
      );

    this.exceptionsAdapter.internalServerError({
      message: "Invalid request type for origin validation"
    });
    return false;
  }
}
