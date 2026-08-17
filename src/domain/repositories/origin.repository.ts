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
import { TransactionType } from "@domain/entities/transaction.entity";

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

export type OriginFindAllFilters = {
  name?: string;
};

export interface OriginsSearchField {
  search?: string;
}

export type OriginFindAllToUseCase = CommonPaginationParams &
  SortParams<OriginsSortableFieldsEnum> &
  OriginFindAllFilters;

export type OriginFindAllToRepositoryParams = RepositoryPaginationParams &
  SortParams<OriginsSortableFieldsEnum> &
  OriginFindAllFilters;

export type OriginOptionsToUseCaseParams = CommonPaginationParams &
  SortOrderParam &
  OriginsSearchField;

export type OriginFindOptionsToRepositoryParams = RepositoryPaginationParams &
  SortOrderParam &
  OriginsSearchField;

interface RankedOrigin extends Omit<BaseOrigin, "createdAt" | "updatedAt"> {
  ranking: number;
  type: TransactionType;
  amount: number;
}

export type OriginRanking = RankedOrigin[];

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
  abstract getCurrentMonthTopFiveOrigins(
    userId: number,
    type?: TransactionType
  ): Promise<OriginRanking>;
}
