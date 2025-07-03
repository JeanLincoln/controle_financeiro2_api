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
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { FindUserByIdParamDto } from "./dto/find-by-id.dto";

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

  @Get(":userId")
  async findById(
    @Req() req: AuthenticatedRequest,
    @Param() { userId }: FindUserByIdParamDto
  ) {
    return this.findByIdUserUseCase.execute(userId);
  }

  @Put()
  async update(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.updateUserUseCase.execute(req.user, updateUserDto);
  }

  @Delete()
  async delete(@Req() req: AuthenticatedRequest) {
    return this.deleteUserUseCase.execute(req.user.id);
  }
}
