import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { OriginAuthenticatedRequest } from "@use-cases/origin/find-and-validate/find-and-validate.use-case";
import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { ApiCookieAuth } from "@nestjs/swagger";
import { OriginGuard } from "@infra/commons/guards/origin/origin-validation.guard";
import { CreateOriginBodyDto } from "./dto/create.dto";
import { CreateOriginUseCase } from "@use-cases/origin/create/create.use-case";
import { UpdateOriginUseCase } from "@use-cases/origin/update/update.use-case";
import { UpdateOriginBodyDto, UpdateOriginParamDto } from "./dto/update.dto";
import { FindOriginByIdParamDto } from "./dto/find-by-id.dto";
import { ExcludeFieldsInterceptor } from "@infra/commons/interceptors/exclude-fields.interceptor";
import { ExcludeFields } from "@infra/commons/decorators/fields-to-exclude.decorator";
import { DeleteOriginUseCase } from "@use-cases/origin/delete/delete.use-case";
import { DeleteOriginParamDto } from "./dto/delete.dto";

@ApiCookieAuth()
@UseGuards(AuthGuard)
@UseInterceptors(ExcludeFieldsInterceptor)
@Controller("origin")
export class OriginController {
  constructor(
    private readonly createOriginUseCase: CreateOriginUseCase,
    private readonly updateOriginUseCase: UpdateOriginUseCase,
    private readonly deleteOriginUseCase: DeleteOriginUseCase
  ) {}

  @Post()
  async create(
    @Req() req: OriginAuthenticatedRequest,
    @Body() body: CreateOriginBodyDto
  ) {
    return this.createOriginUseCase.execute(req.user.id, body);
  }

  @UseGuards(OriginGuard)
  @ExcludeFields("user")
  @Get(":originId")
  async findById(
    @Req() req: OriginAuthenticatedRequest,
    @Param() _: FindOriginByIdParamDto
  ) {
    return req.origin;
  }

  @UseGuards(OriginGuard)
  @Put(":originId")
  async update(
    @Req() req: OriginAuthenticatedRequest,
    @Param() _: UpdateOriginParamDto,
    @Body() body: UpdateOriginBodyDto
  ) {
    return this.updateOriginUseCase.execute(req.origin.id, req.user.id, body);
  }

  @UseGuards(OriginGuard)
  @Delete(":originId")
  async delete(
    @Req() req: OriginAuthenticatedRequest,
    @Param() _: DeleteOriginParamDto
  ) {
    return this.deleteOriginUseCase.execute(req.origin.id);
  }
}
