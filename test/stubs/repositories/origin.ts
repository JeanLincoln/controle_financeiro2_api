import { Origin } from "@domain/entities/origin.entity";
import { OriginRepository } from "@domain/repositories/origin.repository";

export class OriginRepositoryStub implements OriginRepository {
  async findAll(): Promise<Origin[]> {
    return [];
  }

  async findById(): Promise<Origin | null> {
    return null;
  }

  async create(): Promise<void> {
    return;
  }

  async update(): Promise<void> {
    return;
  }

  async delete(): Promise<void> {
    return;
  }
}
