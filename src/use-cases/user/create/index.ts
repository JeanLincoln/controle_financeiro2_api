import {
  CreateOrUpdatePutUserProps,
  UserRepository
} from "@domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: CreateOrUpdatePutUserProps): Promise<void> {
    await this.userRepository.create(user);
  }
}
