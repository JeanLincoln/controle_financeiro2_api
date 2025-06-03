import type { Origin } from "@domain/entities/origin.entity";

export type CreateOrUpdateAllOriginProps = Omit<
  Origin,
  "id" | "createdAt" | "updatedAt"
>;

export abstract class OriginRepository {
  abstract findAll(): Promise<Origin[]>;
  abstract findById(id: number): Promise<Origin | null>;
  abstract create(origin: CreateOrUpdateAllOriginProps): Promise<void>;
  abstract update(
    id: number,
    origin: CreateOrUpdateAllOriginProps
  ): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
