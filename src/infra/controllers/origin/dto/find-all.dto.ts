import { SortOrderEnum } from "@domain/entities/common/sort.entity";
import { OriginsSortableFieldsEnum } from "@domain/repositories/origin.repository";
import {
  SortableFieldDto,
  SortableOrderDto
} from "@infra/commons/decorators/sort-dto.decorator";
import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";

export class FindAllOriginDto extends PaginationQueryDto {
  @SortableFieldDto({
    enumType: OriginsSortableFieldsEnum,
    defaultValue: OriginsSortableFieldsEnum.updatedAt,
    description: "Field sorting for origins"
  })
  sortBy: OriginsSortableFieldsEnum;

  @SortableOrderDto()
  sortOrder: SortOrderEnum;
}
