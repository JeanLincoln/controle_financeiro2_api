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
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { PaginatedResult } from "@domain/entities/common/pagination.entity";
import { FindAllOriginDto } from "./dto/find-all.dto";
import {
  BodyOriginAuthenticatedRequest,
  ParamOriginAuthenticatedRequest
} from "@use-cases/origin/find-and-validate/find-and-validate.use-case";
import { OriginValidationGuard } from "@infra/commons/guards/origin/origin-validation.guard";

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
    @Req() req: BodyOriginAuthenticatedRequest,
    @Body() body: CreateOriginBodyDto
  ) {
    return this.createOriginUseCase.execute(req.user.id, body);
  }

  @UseGuards(OriginValidationGuard)
  @ExcludeFields("user")
  @Get(":originId")
  async findById(
    @Req() req: ParamOriginAuthenticatedRequest,
    @Param() _: FindOriginByIdParamDto
  ) {
    return req.origin;
  }

  @UseGuards(OriginValidationGuard)
  @Put(":originId")
  async update(
    @Req() req: ParamOriginAuthenticatedRequest,
    @Param() _: UpdateOriginParamDto,
    @Body() body: UpdateOriginBodyDto
  ) {
    return this.updateOriginUseCase.execute(req.origin.id, req.user.id, body);
  }

  @UseGuards(OriginValidationGuard)
  @HttpCode(204)
  @Delete(":originId")
  async delete(
    @Req() req: ParamOriginAuthenticatedRequest,
    @Param() _: DeleteOriginParamDto
  ) {
    return this.deleteOriginUseCase.execute(req.origin.id);
  }

  @Get()
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query() queryParams: FindAllOriginDto
  ): Promise<PaginatedResult<Origin> | void> {
    return this.findAllOriginUseCase.execute(req.user.id, queryParams);
  }
}
