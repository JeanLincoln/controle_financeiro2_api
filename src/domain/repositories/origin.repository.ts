import { Origin } from "@domain/entities/origin.entity";
import {
  RepositoryPaginationParams,
  RepositoryToPaginationReturn,
  CommonPaginationParams
} from "@domain/entities/common/pagination.entity";
import {
  SortParams,
  SortOrderParam
} from "@domain/entities/common/sort.entity";

export type BaseOrigin = Omit<Origin, "transactions" | "user">;

export type CreateOrUpdateAllOriginProps = Omit<
  BaseOrigin,
  "id" | "createdAt" | "updatedAt"
>;

export type OriginOption = Pick<BaseOrigin, "id" | "name">;

export enum OriginsSortableFieldsEnum {
  name = "name",
  description = "description",
  createdAt = "createdAt",
  updatedAt = "updatedAt"
}

export interface OriginsSearchField {
  search?: string;
}

export type OriginFindAllToUseCase = CommonPaginationParams &
  SortParams<OriginsSortableFieldsEnum>;

export type OriginFindAllToRepositoryParams = RepositoryPaginationParams &
  SortParams<OriginsSortableFieldsEnum>;

export type OriginOptionsToUseCaseParams = CommonPaginationParams &
  SortOrderParam &
  OriginsSearchField;

export type OriginFindOptionsToRepositoryParams = RepositoryPaginationParams &
  SortOrderParam &
  OriginsSearchField;

export abstract class OriginRepository {
  abstract findAll(
    userId: number,
    paginationParams: OriginFindAllToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<Origin>>;
  abstract options(
    userId: number,
    paginationParams: OriginFindOptionsToRepositoryParams
  ): Promise<RepositoryToPaginationReturn<OriginOption>>;
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
