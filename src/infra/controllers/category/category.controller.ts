import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import { UpdateCategoryDto } from "./dto/update.dto";
import { UpdateCategoryUseCase } from "@use-cases/category/update/update.use-case";

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("categories")
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly findAllCategoryUseCase: FindAllCategoryUseCase,
    private readonly findByIdCategoryUseCase: FindByIdCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase
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

  @Put(":id")
  async update(
    @Req() req: AuthenticatedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateCategoryDto
  ) {
    return this.updateCategoryUseCase.execute(req.user.id, id, {
      ...body,
      userId: req.user.id
    });
  }
}
