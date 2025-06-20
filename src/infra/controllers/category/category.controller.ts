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
import { CreateCategoryUseCase } from "@use-cases/category/create/create.use-case";
import { CreateCategoryDto } from "./dto/create.dto";
import { ApiCookieAuth } from "@nestjs/swagger";
import { AuthenticatedRequest } from "@use-cases/auth/route-auth/route-auth.use-case";
import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { FindAllCategoryUseCase } from "@use-cases/category/find-all/find-all.use-case";
import { UpdateCategoryDto, UpdateCategoryParamDto } from "./dto/update.dto";
import { UpdateCategoryUseCase } from "@use-cases/category/update/update.use-case";
import { DeleteCategoryUseCase } from "@use-cases/category/delete/delete.use-case";
import { CategoryGuard } from "@infra/commons/guards/category/category-validation.guard";
import { CategoryAuthenticatedRequest } from "@use-cases/category/find-and-validate/find-and-validate.use-case";
import { DeleteCategoryParamDto } from "./dto/delete.dto";
import { FindCategoryByIdParamDto } from "./dto/find-by-id.dto";
import { ExcludeFieldsInterceptor } from "@infra/commons/interceptors/exclude-fields.interceptor";
import { ExcludeFields } from "@infra/commons/decorators/fields-to-exclude.decorator";

@ApiCookieAuth()
@UseInterceptors(ExcludeFieldsInterceptor)
@UseGuards(AuthGuard)
@Controller("categories")
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly findAllCategoryUseCase: FindAllCategoryUseCase,
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

  @ExcludeFields("user")
  @UseGuards(CategoryGuard)
  @Get(":categoryId")
  async findById(
    @Req() req: CategoryAuthenticatedRequest,
    @Param() _: FindCategoryByIdParamDto
  ) {
    return req.category;
  }

  @UseGuards(CategoryGuard)
  @Put(":categoryId")
  async update(
    @Req() req: CategoryAuthenticatedRequest,
    @Param() _: UpdateCategoryParamDto,
    @Body() body: UpdateCategoryDto
  ) {
    return this.updateCategoryUseCase.execute(
      req.user.id,
      req.category.id,
      body
    );
  }

  @UseGuards(CategoryGuard)
  @Delete(":categoryId")
  async delete(
    @Req() req: CategoryAuthenticatedRequest,
    @Param() _: DeleteCategoryParamDto
  ) {
    return this.deleteCategoryUseCase.execute(req.user.id, req.category.id);
  }
}
