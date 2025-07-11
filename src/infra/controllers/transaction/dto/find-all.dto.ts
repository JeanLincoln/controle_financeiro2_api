import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";
import { TransactionsSortableFieldsEnum } from "@domain/repositories/transaction.repository";
import {
  SortableFieldDto,
  SortableOrderDto
} from "@infra/commons/decorators/sort-dto.decorator";
import { SortOrderEnum } from "@domain/entities/common/sort.entity";

export class FindAllTransactionsQueryParamDto extends PaginationQueryDto {
  @SortableFieldDto({
    enumType: TransactionsSortableFieldsEnum,
    defaultValue: "updatedAt"
  })
  sortBy: TransactionsSortableFieldsEnum;

  @SortableOrderDto()
  sortOrder: SortOrderEnum;
}
