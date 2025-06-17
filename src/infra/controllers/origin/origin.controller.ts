import { IdDto } from "@infra/commons/global-dtos/id.dto";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";
import { type OriginAuthenticatedRequest } from "@use-cases/origin/find-and-validate/find-and-validate.use-case";
import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { ApiCookieAuth } from "@nestjs/swagger";
import { OriginGuard } from "@infra/commons/guards/origin/origin-validation.guard";
import { CreateOriginBodyDto } from "./dto/create.dto";
import { CreateOriginUseCase } from "@use-cases/origin/create/create.use-case";

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("origin")
export class OriginController {
  constructor(private readonly createOriginUseCase: CreateOriginUseCase) {}

  @Post()
  async create(
    @Req() req: OriginAuthenticatedRequest,
    @Body() body: CreateOriginBodyDto
  ) {
    return this.createOriginUseCase.execute({ ...body, userId: req.user.id });
  }

  @UseGuards(OriginGuard)
  @Get(":id")
  async findById(@Req() req: OriginAuthenticatedRequest, @Param() _: IdDto) {
    return req.origin;
  }
}
