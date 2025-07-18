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
import { CreateCategoryUseCase } from "@use-cases/category/create/create.use-case";
import { CreateCategoryDto } from "./dto/create.dto";
import { ApiCookieAuth } from "@nestjs/swagger";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { FindAllCategoryUseCase } from "@use-cases/category/find-all/find-all.use-case";
import { UpdateCategoryDto, UpdateCategoryParamDto } from "./dto/update.dto";
import { UpdateCategoryUseCase } from "@use-cases/category/update/update.use-case";
import { DeleteCategoryUseCase } from "@use-cases/category/delete/delete.use-case";
import { DeleteCategoryParamDto } from "./dto/delete.dto";
import { FindCategoryByIdParamDto } from "./dto/find-by-id.dto";
import { ExcludeFields } from "@infra/commons/decorators/fields-to-exclude.decorator";
import { CategoryValidationGuard } from "@infra/commons/guards/category/category-validation.guard";
import { Category } from "@domain/entities/category.entity";
import { PaginatedResult } from "@domain/entities/common/pagination.entity";
import { FindAllCategoriesQueryParamDto } from "./dto/find-all.dto";
import { ParamCategoryAuthenticatedRequest } from "@use-cases/category/find-and-validate/find-and-validate.use-case";
import { OptionsCategoryDto } from "./dto/options.dto";
import { CategoryOption } from "@domain/repositories/category.repository";
import { OptionsCategoryUseCase } from "@use-cases/category/options/options.use-case";

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("categories")
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly findAllCategoryUseCase: FindAllCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly optionsCategoryUseCase: OptionsCategoryUseCase
  ) {}

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateCategoryDto
  ) {
    return this.createCategoryUseCase.execute(req.user, body);
  }

  @Get()
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query() queryParams: FindAllCategoriesQueryParamDto
  ): Promise<PaginatedResult<Category> | void> {
    return this.findAllCategoryUseCase.execute(req.user.id, queryParams);
  }

  @Get("options")
  async options(
    @Req() req: AuthenticatedRequest,
    @Query() queryParams: OptionsCategoryDto
  ): Promise<PaginatedResult<CategoryOption>> {
    return this.optionsCategoryUseCase.execute(req.user.id, queryParams);
  }

  @ExcludeFields("user")
  @UseGuards(CategoryValidationGuard)
  @Get(":categoryId")
  async findById(
    @Req() req: ParamCategoryAuthenticatedRequest,
    @Param() _: FindCategoryByIdParamDto
  ) {
    return req.category;
  }

  @UseGuards(CategoryValidationGuard)
  @Put(":categoryId")
  async update(
    @Req() req: ParamCategoryAuthenticatedRequest,
    @Param() _: UpdateCategoryParamDto,
    @Body() body: UpdateCategoryDto
  ) {
    return this.updateCategoryUseCase.execute(
      req.user.id,
      req.category.id,
      body
    );
  }

  @UseGuards(CategoryValidationGuard)
  @HttpCode(204)
  @Delete(":categoryId")
  async delete(
    @Req() req: ParamCategoryAuthenticatedRequest,
    @Param() _: DeleteCategoryParamDto
  ) {
    return this.deleteCategoryUseCase.execute(req.user.id, req.category.id);
  }
}
