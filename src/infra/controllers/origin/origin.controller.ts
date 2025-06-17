import { IdDto } from "@infra/commons/global-dtos/id.dto";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards
} from "@nestjs/common";
import { type OriginAuthenticatedRequest } from "@use-cases/origin/find-and-validate/find-and-validate.use-case";
import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { ApiCookieAuth } from "@nestjs/swagger";
import { OriginGuard } from "@infra/commons/guards/origin/origin-validation.guard";
import { CreateOriginBodyDto } from "./dto/create.dto";
import { CreateOriginUseCase } from "@use-cases/origin/create/create.use-case";
import { UpdateOriginUseCase } from "@use-cases/origin/update/update.use-case";
import { UpdateOriginBodyDto } from "./dto/update.dto";

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("origin")
export class OriginController {
  constructor(
    private readonly createOriginUseCase: CreateOriginUseCase,
    private readonly updateOriginUseCase: UpdateOriginUseCase
  ) {}

  @Post()
  async create(
    @Req() req: OriginAuthenticatedRequest,
    @Body() body: CreateOriginBodyDto
  ) {
    return this.createOriginUseCase.execute(req.user.id, body);
  }

  @UseGuards(OriginGuard)
  @Get(":id")
  async findById(@Req() req: OriginAuthenticatedRequest, @Param() _: IdDto) {
    return req.origin;
  }

  @UseGuards(OriginGuard)
  @Put(":id")
  async update(
    @Req() req: OriginAuthenticatedRequest,
    @Param() _: IdDto,
    @Body() body: UpdateOriginBodyDto
  ) {
    return this.updateOriginUseCase.execute(req.origin.id, req.user.id, body);
  }
}
