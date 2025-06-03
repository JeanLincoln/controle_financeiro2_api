import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CreateUserUseCase } from "@use-cases/user/create";
import { CreateUserDto } from "./dto/create.dto";
import { AuthGuard } from "@infra/commons/guards/auth";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@ApiCookieAuth()
@Controller("users")
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }
}
