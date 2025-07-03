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
import { CreateSubCategoryUseCase } from "@use-cases/sub-category/create/create.use-case";
import {
  CreateSubCategoryBodyDto,
  CreateSubCategoryParams
} from "./dto/create.dto";
import { AuthGuard } from "@infra/commons/guards/auth/auth.guard";
import { ApiCookieAuth } from "@nestjs/swagger";
import { FindAllSubCategoryUseCase } from "@use-cases/sub-category/find-all/find-all.find-all.use-case";
import { SubCategoryAuthenticatedRequest } from "@use-cases/sub-category/find-and-validate-from-param/find-and-validate-from-param.use-case";
import { DeleteSubCategoryUseCase } from "@use-cases/sub-category/delete/delete.use-case";
import {
  UpdateSubCategoryBodyDto,
  UpdateSubCategoryParamDto
} from "./dto/update.dto";
import { UpdateSubCategoryUseCase } from "@use-cases/sub-category/update/update.use-case";
import { CategoryAuthenticatedRequest } from "@use-cases/category/find-and-validate-from-param/find-and-validate-from-param.use-case";
import { DeleteSubCategoryParamDto } from "./dto/delete.dto";
import { FindSubCategoryByIdParamDto } from "./dto/find-by-id.dto";
import { FindAllSubCategoryParams } from "./dto/find-all.dto";

import { ExcludeFields } from "@infra/commons/decorators/fields-to-exclude.decorator";
import { CategoryParamGuard } from "@infra/commons/guards/category/category-param-validation.guard";
import { SubCategoryParamGuard } from "@infra/commons/guards/sub-category/sub-category-param-validation.guard";

@ApiCookieAuth()
@UseGuards(AuthGuard, CategoryParamGuard)
@Controller("sub-categories")
export class SubCategoryController {
  constructor(
    private readonly createSubCategoryUseCase: CreateSubCategoryUseCase,
    private readonly findAllSubCategoryUseCase: FindAllSubCategoryUseCase,
    private readonly deleteSubCategoryUseCase: DeleteSubCategoryUseCase,
    private readonly updateSubCategoryUseCase: UpdateSubCategoryUseCase
  ) {}

  @Post(":categoryId")
  async create(
    @Req() req: CategoryAuthenticatedRequest,
    @Param() _: CreateSubCategoryParams,
    @Body() createSubCategoryDto: CreateSubCategoryBodyDto
  ) {
    return this.createSubCategoryUseCase.execute(req, createSubCategoryDto);
  }

  @UseGuards(SubCategoryParamGuard)
  @ExcludeFields("user")
  @Get(":categoryId/:subCategoryId")
  async findById(
    @Req() req: SubCategoryAuthenticatedRequest,
    @Param() _: FindSubCategoryByIdParamDto
  ) {
    return req.subCategory;
  }

  @Get(":categoryId")
  async findAll(
    @Req() req: CategoryAuthenticatedRequest,
    @Param() _: FindAllSubCategoryParams
  ) {
    return this.findAllSubCategoryUseCase.execute(req);
  }

  @UseGuards(SubCategoryParamGuard)
  @Put(":categoryId/:subCategoryId")
  async update(
    @Req() req: SubCategoryAuthenticatedRequest & CategoryAuthenticatedRequest,
    @Param() _: UpdateSubCategoryParamDto,
    @Body() updateSubCategoryDto: UpdateSubCategoryBodyDto
  ) {
    return this.updateSubCategoryUseCase.execute(
      req.subCategory.id,
      req.category.id,
      updateSubCategoryDto
    );
  }

  @UseGuards(SubCategoryParamGuard)
  @Delete(":categoryId/:subCategoryId")
  async delete(
    @Req() req: SubCategoryAuthenticatedRequest,
    @Param() _: DeleteSubCategoryParamDto
  ) {
    return this.deleteSubCategoryUseCase.execute(req.subCategory.id);
  }
}
