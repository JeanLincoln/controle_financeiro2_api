import { User } from "@domain/entities/user.entity";
import {
  CreateOrUpdatePutUserProps,
  UserRepository
} from "@domain/repositories/user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { id } });
  }

  async create(user: CreateOrUpdatePutUserProps): Promise<User> {
    return this.userRepository.save(user);
  }

  async update(id: number, user: CreateOrUpdatePutUserProps): Promise<User> {
    await this.userRepository.update(id, user);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
