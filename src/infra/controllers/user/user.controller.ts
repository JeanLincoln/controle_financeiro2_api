import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards
} from "@nestjs/common";
import { CreateUserUseCase } from "@use-cases/user/create/create.use-case";
import { CreateUserDto } from "./dto/create.dto";
import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { UpdateUserDto } from "./dto/update.dto";
import { UpdateUserUseCase } from "@use-cases/user/update/update.use-case";
import { FindByIdUserUseCase } from "@use-cases/user/find-by-id/find-by-id.use-case";
import { FindAllUserUseCase } from "@use-cases/user/find-all/find-all.use-case";
import { DeleteUserUseCase } from "@use-cases/user/delete/delete.use-case";
import { IdDto } from "@infra/commons/global-dtos/id.dto";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";

@ApiTags("Users")
@ApiCookieAuth()
@Controller("users")
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findByIdUserUseCase: FindByIdUserUseCase,
    private readonly findAllUserUseCase: FindAllUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get()
  async findAll() {
    return this.findAllUserUseCase.execute();
  }

  @Get(":id")
  async findById(@Param() { id }: IdDto) {
    return this.findByIdUserUseCase.execute(id);
  }

  @Put(":id")
  async update(@Param() { id }: IdDto, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, updateUserDto);
  }

  @Delete(":id")
  async delete(@Req() req: AuthenticatedRequest, @Param() { id }: IdDto) {
    return this.deleteUserUseCase.execute(req.user.id, Number(id));
  }
}
