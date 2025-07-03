import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { Origin } from "@domain/entities/origin.entity";
import { OriginRepository } from "@domain/repositories/origin.repository";
import { Injectable } from "@nestjs/common";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";

export interface OriginBodyData
  extends ReadableStream<Uint8Array<ArrayBufferLike>> {
  originId: number;
}

export interface OriginBodyAuthenticatedRequest extends AuthenticatedRequest {
  body: OriginBodyData;
  origin: Origin;
}

@Injectable()
export class FindAndValidateOriginFromBodyUseCase {
  constructor(
    private readonly originRepository: OriginRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(request: OriginBodyAuthenticatedRequest): Promise<boolean> {
    const { user, body } = request;
    const originId = Number(body.originId);
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
