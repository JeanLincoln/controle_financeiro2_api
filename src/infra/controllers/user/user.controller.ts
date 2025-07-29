import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
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
import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";
import { PaginatedResult } from "@domain/entities/common/pagination.entity";
import { UserWithoutPassword } from "@domain/repositories/user.repository";
import type { Response } from "express";

@ApiTags("Users")
@Controller("users")
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findByIdUserUseCase: FindByIdUserUseCase,
    private readonly findAllUserUseCase: FindAllUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  @Post()
  async create(
    @Res({ passthrough: true }) Res: Response,
    @Body() createUserDto: CreateUserDto
  ) {
    return this.createUserUseCase.execute(createUserDto, Res);
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query() { page, limit }: PaginationQueryDto
  ): Promise<PaginatedResult<UserWithoutPassword>> {
    return this.findAllUserUseCase.execute(page, limit);
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get(":userId")
  async findById(
    @Req() req: AuthenticatedRequest,
    @Param() { userId }: FindUserByIdParamDto
  ) {
    return this.findByIdUserUseCase.execute(userId);
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Put()
  async update(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.updateUserUseCase.execute(req.user, updateUserDto);
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Delete()
  @HttpCode(204)
  async delete(@Req() req: AuthenticatedRequest) {
    return this.deleteUserUseCase.execute(req.user.id);
  }
}
