import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";
import { CreateCategoryUseCase } from "@use-cases/category/create/create.use-case";
import { CreateCategoryDto } from "./dto/create.dto";
import { ApiCookieAuth } from "@nestjs/swagger";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { FindAllCategoryUseCase } from "@use-cases/category/find-all/find-all.use-case";
import { FindByIdCategoryUseCase } from "@use-cases/category/find-by-id/find-by-id.use-case";

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("categories")
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly findAllCategoryUseCase: FindAllCategoryUseCase,
    private readonly findByIdCategoryUseCase: FindByIdCategoryUseCase
  ) {}

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateCategoryDto
  ) {
    return this.createCategoryUseCase.execute(req.user.id, {
      ...body,
      userId: req.user.id
    });
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.findAllCategoryUseCase.execute(req.user.id);
  }

  @Get(":id")
  async findById(
    @Req() req: AuthenticatedRequest,
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.findByIdCategoryUseCase.execute(req.user.id, id);
  }
}
