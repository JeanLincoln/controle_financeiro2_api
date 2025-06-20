import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { Origin } from "@domain/entities/origin.entity";
import { OriginRepository } from "@domain/repositories/origin.repository";
import { Injectable } from "@nestjs/common";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";

export interface OriginAuthenticatedRequest extends AuthenticatedRequest {
  params: {
    originId: string;
  };
  origin: Origin;
}

@Injectable()
export class FindAndValidateOriginUseCase {
  constructor(
    private readonly originRepository: OriginRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(request: OriginAuthenticatedRequest): Promise<boolean> {
    const { user, params } = request;
    const originId = Number(params.originId);
    const userId = user.id;

    const origin = await this.originRepository.findById(originId);

    if (!origin) {
      this.exceptionsAdapter.notFound({
        message: "Origin not found"
      });

      return false;
    }

    if (origin.user.id !== userId) {
      this.exceptionsAdapter.forbidden({
        message: "You are not allowed to access this origin"
      });
      return false;
    }

    request.origin = origin;

    return true;
  }
}
