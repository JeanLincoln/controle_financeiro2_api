import { User } from "@domain/entities/user.entity";
import {
  BaseCreateOrUpdateUserProps,
  UserRepository,
  type UserWithAllPropsParams
} from "@domain/repositories/user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { USER_WITHOUT_PASSWORD_SELECT } from "../common/selects/user/user.selects";

export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ select: USER_WITHOUT_PASSWORD_SELECT });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: USER_WITHOUT_PASSWORD_SELECT
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: USER_WITHOUT_PASSWORD_SELECT
    });
  }

  async findUserWithAllProps({
    id,
    email
  }: UserWithAllPropsParams): Promise<User | null> {
    if (!id && !email) return null;

    return this.userRepository.findOne({
      where: { id: id ?? undefined, email: email ?? undefined }
    });
  }

  async create(user: BaseCreateOrUpdateUserProps): Promise<void> {
    await this.userRepository.save({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  async update(id: number, user: BaseCreateOrUpdateUserProps): Promise<void> {
    await this.userRepository.update(id, { ...user, updatedAt: new Date() });
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
