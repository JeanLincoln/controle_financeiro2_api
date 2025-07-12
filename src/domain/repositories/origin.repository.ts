import { Origin } from "@domain/entities/origin.entity";
import {
  RepositoryPaginationParams,
  RepositoryToPaginationReturn,
  CommonPaginationParams
} from "@domain/entities/common/pagination.entity";
import { SortParams } from "@domain/entities/common/sort.entity";

export type CreateOrUpdateAllOriginProps = Omit<
  Origin,
  "id" | "createdAt" | "updatedAt" | "transactions" | "user"
>;

export enum OriginsSortableFieldsEnum {
  name = "name",
  description = "description",
  createdAt = "createdAt",
  updatedAt = "updatedAt"
}

export type OriginFindAllToUseCase = CommonPaginationParams &
  SortParams<OriginsSortableFieldsEnum>;

export type OriginFindAllToRepositoryParams = RepositoryPaginationParams &
  SortParams<OriginsSortableFieldsEnum>;

export abstract class OriginRepository {
  abstract findAll(
    userId: number,
    paginationParams: OriginFindAllToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<Origin>>;
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
