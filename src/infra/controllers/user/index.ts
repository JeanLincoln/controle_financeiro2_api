import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserUseCase } from "@use-cases/user/create";
import { CreateUserDto } from "./dto/create.dto";

@Controller("users")
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }
}
