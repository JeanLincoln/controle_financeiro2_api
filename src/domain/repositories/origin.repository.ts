import { Origin } from "@domain/entities/origin.entity";

export type CreateOrUpdateAllOriginProps = Omit<
  Origin,
  "id" | "createdAt" | "updatedAt" | "transactions" | "user"
>;

export abstract class OriginRepository {
  abstract findAll(userId: number): Promise<Origin[]>;
  abstract findById(id: number): Promise<Origin | null>;
  abstract create(
    userId: number,
    origin: CreateOrUpdateAllOriginProps
  ): Promise<void>;
  abstract update(
    id: number,
    userId: number,
    origin: CreateOrUpdateAllOriginProps
  ): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
