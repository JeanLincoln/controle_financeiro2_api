import {
  Body,
  Controller,
  Delete,
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
import { FindAllSubCategoryUseCase } from "@use-cases/sub-category/find-all/find-all.find-all.use-case";
import { SubCategoryGuard } from "@infra/commons/guards/sub-category/sub-category-validation.guard";
import { SubCategoryAuthenticatedRequest } from "@use-cases/sub-category/sub-category-find-and-validate/sub-category-find-and-validate.use-case";
import { IdDto } from "@infra/commons/global-dtos/id.dto";
import { DeleteSubCategoryUseCase } from "@use-cases/sub-category/delete/delete.use-case";

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("sub-categories")
export class SubCategoryController {
  constructor(
    private readonly createSubCategoryUseCase: CreateSubCategoryUseCase,
    private readonly findAllSubCategoryUseCase: FindAllSubCategoryUseCase,
    private readonly deleteSubCategoryUseCase: DeleteSubCategoryUseCase
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

  @UseGuards(SubCategoryGuard)
  @Get(":id")
  async findById(
    @Req() req: SubCategoryAuthenticatedRequest,
    @Param() _: IdDto
  ) {
    return req.subCategory;
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.findAllSubCategoryUseCase.execute(req.user.id);
  }

  @UseGuards(SubCategoryGuard)
  @Delete(":id")
  async delete(@Req() req: SubCategoryAuthenticatedRequest, @Param() _: IdDto) {
    return this.deleteSubCategoryUseCase.execute(req.subCategory.id);
  }
}
