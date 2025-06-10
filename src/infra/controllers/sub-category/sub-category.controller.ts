import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";
import { CreateSubCategoryUseCase } from "@use-cases/sub-category/create/create.use-case";
import { CreateSubCategoryBodyDto } from "./dto/create.dto";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { ApiCookieAuth } from "@nestjs/swagger";
import { FindSubCategoryByIdUseCase } from "@use-cases/sub-category/find-by-id/find-by-id.use-case";
import { IdDto } from "@infra/commons/global-dtos/id.dto";

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("sub-categories")
export class SubCategoryController {
  constructor(
    private readonly createSubCategoryUseCase: CreateSubCategoryUseCase,
    private readonly findByIdSubCategoryUseCase: FindSubCategoryByIdUseCase
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

  @Get(":id")
  async findById(@Req() req: AuthenticatedRequest, @Param() { id }: IdDto) {
    return this.findByIdSubCategoryUseCase.execute(req.user.id, id);
  }
}
