import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { DeleteCategoryUseCase } from "@use-cases/category/delete/delete.use-case";
import { IdDto } from "@infra/commons/global-dtos/id.dto";

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("categories")
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly findAllCategoryUseCase: FindAllCategoryUseCase,
    private readonly findByIdCategoryUseCase: FindByIdCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase
  ) {}

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateCategoryDto
  ) {
    return this.createCategoryUseCase.execute(req.user.id, body);
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.findAllCategoryUseCase.execute(req.user.id);
  }

  @Get(":id")
  async findById(@Req() req: AuthenticatedRequest, @Param() { id }: IdDto) {
    return this.findByIdCategoryUseCase.execute(req.user.id, id);
  }

  @Put(":id")
  async update(
    @Req() req: AuthenticatedRequest,
    @Param() { id }: IdDto,
    @Body() body: UpdateCategoryDto
  ) {
    return this.updateCategoryUseCase.execute(req.user.id, id, body);
  }

  @Delete(":id")
  async delete(@Req() req: AuthenticatedRequest, @Param() { id }: IdDto) {
    return this.deleteCategoryUseCase.execute(req.user.id, id);
  }
}
