import { IdDto } from "@infra/commons/global-dtos/id.dto";
import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { type OriginAuthenticatedRequest } from "@use-cases/origin/find-and-validate/find-and-validate.use-case";
import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { ApiCookieAuth } from "@nestjs/swagger";
import { OriginGuard } from "@infra/commons/guards/origin/origin-validation.guard";

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("origin")
export class OriginController {
  constructor() {}

  @UseGuards(OriginGuard)
  @Get(":id")
  async findById(@Req() req: OriginAuthenticatedRequest, @Param() _: IdDto) {
    return req.origin;
  }
}
