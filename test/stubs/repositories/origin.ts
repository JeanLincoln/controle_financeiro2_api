import { Origin } from "@domain/entities/origin.entity";
import { RepositoryToPaginationReturn } from "@domain/entities/common/pagination.entity";
import { OriginRepository } from "@domain/repositories/origin.repository";

export class OriginRepositoryStub implements OriginRepository {
  async findAll(): Promise<RepositoryToPaginationReturn<Origin>> {
    return { data: [], total: 0 };
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
