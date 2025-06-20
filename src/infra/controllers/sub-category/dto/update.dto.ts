import { CreateSubCategoryBodyDto } from "./create.dto";
import { FindSubCategoryByIdParamDto } from "./find-by-id.dto";

export class UpdateSubCategoryParamDto extends FindSubCategoryByIdParamDto {}

export class UpdateSubCategoryBodyDto extends CreateSubCategoryBodyDto {}
