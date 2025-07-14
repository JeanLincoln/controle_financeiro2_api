import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";
import {
  SortableFieldDto,
  SortableOrderDto
} from "@infra/commons/decorators/dto-decorators/sort-dto.decorator";
import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import { CategoriesSortableFieldsEnum } from "@domain/repositories/category.repository";

export class FindAllCategoriesQueryParamDto extends PaginationQueryDto {
  @SortableFieldDto({
    enumType: CategoriesSortableFieldsEnum,
    defaultValue: CategoriesSortableFieldsEnum.updatedAt
  })
  sortBy: CategoriesSortableFieldsEnum;

  @SortableOrderDto()
  sortOrder: SortOrderEnum;
}
