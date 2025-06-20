import {
  UserRepository,
  UserWithoutPassword
} from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserWithoutPassword[]> {
    return await this.userRepository.findAll();
  }
}
