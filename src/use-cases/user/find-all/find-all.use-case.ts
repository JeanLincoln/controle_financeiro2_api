import { UserRepository } from "@domain/repositories/user.repository";
import { User } from "@domain/entities/user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
