import { UserRepository } from "@domain/repositories/user.repository";
import { User } from "@domain/entities/user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindByEmailUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
