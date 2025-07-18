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
import { CreateSubCategoryUseCase } from "@use-cases/sub-category/create/create.use-case";
import {
  CreateSubCategoryBodyDto,
  CreateSubCategoryParams
} from "./dto/create.dto";
import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { ApiCookieAuth } from "@nestjs/swagger";
import { FindAllSubCategoryUseCase } from "@use-cases/sub-category/find-all/find-all.use-case";
import { DeleteSubCategoryUseCase } from "@use-cases/sub-category/delete/delete.use-case";
import {
  UpdateSubCategoryBodyDto,
  UpdateSubCategoryParamDto
} from "./dto/update.dto";
import { UpdateSubCategoryUseCase } from "@use-cases/sub-category/update/update.use-case";
import { DeleteSubCategoryParamDto } from "./dto/delete.dto";
import { FindSubCategoryByIdParamDto } from "./dto/find-by-id.dto";
import { FindAllSubCategoryParams } from "./dto/find-all.dto";
import { ExcludeFields } from "@infra/commons/decorators/fields-to-exclude.decorator";
import { CategoryValidationGuard } from "@infra/commons/guards/category/category-validation.guard";
import { ParamCategoryAuthenticatedRequest } from "@use-cases/category/find-and-validate/find-and-validate.use-case";
import { SubCategoryValidationGuard } from "@infra/commons/guards/sub-category/sub-category-validation.guard";
import { ParamSubCategoryAuthenticatedRequest } from "@use-cases/sub-category/find-and-validate/find-and-validate.use-case";
import {
  OptionsSubCategoryQueryDto,
  OptionsSubCategoryParamDto
} from "./dto/options.dto";
import { SubCategoryOption } from "@domain/repositories/sub-category.repository";
import { PaginatedResult } from "@domain/entities/common/pagination.entity";
import { OptionsSubCategoryUseCase } from "@use-cases/sub-category/options/options.use-case";

@ApiCookieAuth()
@UseGuards(AuthGuard, CategoryValidationGuard)
@Controller("sub-categories")
export class SubCategoryController {
  constructor(
    private readonly createSubCategoryUseCase: CreateSubCategoryUseCase,
    private readonly findAllSubCategoryUseCase: FindAllSubCategoryUseCase,
    private readonly deleteSubCategoryUseCase: DeleteSubCategoryUseCase,
    private readonly updateSubCategoryUseCase: UpdateSubCategoryUseCase,
    private readonly optionsSubCategoryUseCase: OptionsSubCategoryUseCase
  ) {}

  @Post(":categoryId")
  async create(
    @Req() req: ParamCategoryAuthenticatedRequest,
    @Param() _: CreateSubCategoryParams,
    @Body() createSubCategoryDto: CreateSubCategoryBodyDto
  ) {
    return this.createSubCategoryUseCase.execute(req, createSubCategoryDto);
  }

  @Get(":categoryId/options")
  async options(
    @Req() req: ParamCategoryAuthenticatedRequest,
    @Param() _: OptionsSubCategoryParamDto,
    @Query() queryParams: OptionsSubCategoryQueryDto
  ): Promise<PaginatedResult<SubCategoryOption>> {
    return this.optionsSubCategoryUseCase.execute(
      req.user.id,
      req.category.id,
      queryParams
    );
  }

  @Get(":categoryId")
  async findAll(
    @Req() req: ParamCategoryAuthenticatedRequest,
    @Param() _: FindAllSubCategoryParams
  ) {
    return this.findAllSubCategoryUseCase.execute(req);
  }

  @UseGuards(SubCategoryValidationGuard)
  @ExcludeFields("user")
  @Get(":categoryId/:subCategoryId")
  async findById(
    @Req() req: ParamSubCategoryAuthenticatedRequest,
    @Param() _: FindSubCategoryByIdParamDto
  ) {
    return req.subCategory;
  }

  @UseGuards(SubCategoryValidationGuard)
  @Put(":categoryId/:subCategoryId")
  async update(
    @Req()
    req: ParamSubCategoryAuthenticatedRequest &
      ParamCategoryAuthenticatedRequest,
    @Param() _: UpdateSubCategoryParamDto,
    @Body() updateSubCategoryDto: UpdateSubCategoryBodyDto
  ) {
    return this.updateSubCategoryUseCase.execute(
      req.subCategory.id,
      req.category.id,
      updateSubCategoryDto
    );
  }

  @UseGuards(SubCategoryValidationGuard)
  @HttpCode(204)
  @Delete(":categoryId/:subCategoryId")
  async delete(
    @Req() req: ParamSubCategoryAuthenticatedRequest,
    @Param() _: DeleteSubCategoryParamDto
  ) {
    return this.deleteSubCategoryUseCase.execute(req.subCategory.id);
  }
}
