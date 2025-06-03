import { Controller, Post, Body } from "@nestjs/common";
import { LoginUseCase } from "@use-cases/auth/login/login.use-case";
import { LoginDto } from "./dto/login.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post("login")
  async login(@Body() { email, password }: LoginDto) {
    return this.loginUseCase.execute(email, password);
  }
}
