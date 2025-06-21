import { OriginRepository } from "@domain/repositories/origin.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteOriginUseCase {
  constructor(private readonly originRepository: OriginRepository) {}

  async execute(originId: number): Promise<void> {
    await this.originRepository.delete(originId);
  }
}
