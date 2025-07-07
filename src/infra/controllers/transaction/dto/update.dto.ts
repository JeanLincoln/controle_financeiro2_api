import { CreateTransactionDto } from "./create.dto";
import { FindTransactionByIdParamDto } from "./find-by-id.dto";

export class UpdateTransactionDto extends FindTransactionByIdParamDto {}
export class UpdateTransactionBodyDto extends CreateTransactionDto {}
