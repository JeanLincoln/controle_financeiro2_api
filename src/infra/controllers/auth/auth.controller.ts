import { Controller, Post, Body, Res, HttpCode } from "@nestjs/common";
import { Response } from "express";
import { LoginUseCase } from "@use-cases/auth/login/login.use-case";
import { LoginDto } from "./dto/login.dto";
import { ApiTags } from "@nestjs/swagger";
import { LogoutUseCase } from "@use-cases/auth/logout/logout.use-case";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase
  ) {}

  @Post("login")
  @HttpCode(200)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() { email, password }: LoginDto
  ) {
    await this.loginUseCase.execute(email, password, res);
  }

  @Post("logout")
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.logoutUseCase.execute(res);
  }
}
