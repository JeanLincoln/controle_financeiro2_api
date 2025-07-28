import { Injectable } from "@nestjs/common";
import { Response } from "express";

@Injectable()
export class LogoutUseCase {
  constructor() {}

  async execute(res: Response): Promise<void> {
    res.clearCookie("Authorization", {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });
  }
}
