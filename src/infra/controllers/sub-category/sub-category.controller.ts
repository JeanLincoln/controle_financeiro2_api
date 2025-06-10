import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { CreateSubCategoryUseCase } from "@use-cases/sub-category/create/create.use-case";
import { CreateSubCategoryBodyDto } from "./dto/create.dto";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { ApiCookieAuth } from "@nestjs/swagger";

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("sub-categories")
export class SubCategoryController {
  constructor(
    private readonly createSubCategoryUseCase: CreateSubCategoryUseCase
  ) {}

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() createSubCategoryDto: CreateSubCategoryBodyDto
  ) {
    return this.createSubCategoryUseCase.execute(
      req.user.id,
      createSubCategoryDto
    );
  }
}
