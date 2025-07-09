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
  UseGuards
} from "@nestjs/common";
import { OriginAuthenticatedRequest } from "@use-cases/origin/find-and-validate-from-param/find-and-validate-from-param.use-case";
import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { ApiCookieAuth } from "@nestjs/swagger";
import { CreateOriginBodyDto } from "./dto/create.dto";
import { CreateOriginUseCase } from "@use-cases/origin/create/create.use-case";
import { UpdateOriginUseCase } from "@use-cases/origin/update/update.use-case";
import { UpdateOriginBodyDto, UpdateOriginParamDto } from "./dto/update.dto";
import { FindOriginByIdParamDto } from "./dto/find-by-id.dto";
import { ExcludeFields } from "@infra/commons/decorators/fields-to-exclude.decorator";
import { DeleteOriginUseCase } from "@use-cases/origin/delete/delete.use-case";
import { DeleteOriginParamDto } from "./dto/delete.dto";
import { FindAllOriginUseCase } from "@use-cases/origin/find-all/find-all.use-case";
import { Origin } from "@domain/entities/origin.entity";
import { OriginParamGuard } from "@infra/commons/guards/origin/origin-param-validation.guard";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { PaginationQueryDto } from "@infra/commons/dto/pagination.dto";
import { PaginatedResult } from "@domain/entities/pagination.entity";

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("origin")
export class OriginController {
  constructor(
    private readonly createOriginUseCase: CreateOriginUseCase,
    private readonly updateOriginUseCase: UpdateOriginUseCase,
    private readonly deleteOriginUseCase: DeleteOriginUseCase,
    private readonly findAllOriginUseCase: FindAllOriginUseCase
  ) {}

  @Post()
  async create(
    @Req() req: OriginAuthenticatedRequest,
    @Body() body: CreateOriginBodyDto
  ) {
    return this.createOriginUseCase.execute(req.user.id, body);
  }

  @UseGuards(OriginParamGuard)
  @ExcludeFields("user")
  @Get(":originId")
  async findById(
    @Req() req: OriginAuthenticatedRequest,
    @Param() _: FindOriginByIdParamDto
  ) {
    return req.origin;
  }

  @UseGuards(OriginParamGuard)
  @Put(":originId")
  async update(
    @Req() req: OriginAuthenticatedRequest,
    @Param() _: UpdateOriginParamDto,
    @Body() body: UpdateOriginBodyDto
  ) {
    return this.updateOriginUseCase.execute(req.origin.id, req.user.id, body);
  }

  @UseGuards(OriginParamGuard)
  @HttpCode(204)
  @Delete(":originId")
  async delete(
    @Req() req: OriginAuthenticatedRequest,
    @Param() _: DeleteOriginParamDto
  ) {
    return this.deleteOriginUseCase.execute(req.origin.id);
  }

  @Get()
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query() { page, limit }: PaginationQueryDto
  ): Promise<PaginatedResult<Origin> | void> {
    return this.findAllOriginUseCase.execute(req.user.id, page, limit);
  }
}
