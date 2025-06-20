import { CreateCategoryDto } from "./create.dto";
import { FindCategoryByIdParamDto } from "./find-by-id.dto";

export class UpdateCategoryParamDto extends FindCategoryByIdParamDto {}

export class UpdateCategoryDto extends CreateCategoryDto {}
