import {
  UserRepository,
  type OnlyUserProps
} from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindByEmailUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<OnlyUserProps | null> {
    return this.userRepository.findByEmail(email);
  }
}
