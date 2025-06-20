import { CreateOriginBodyDto } from "./create.dto";
import { FindOriginByIdParamDto } from "./find-by-id.dto";

export class UpdateOriginParamDto extends FindOriginByIdParamDto {}

export class UpdateOriginBodyDto extends CreateOriginBodyDto {}
