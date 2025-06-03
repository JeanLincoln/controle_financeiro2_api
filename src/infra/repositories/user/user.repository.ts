import { User } from "@domain/entities/user.entity";
import {
  CreateOrUpdateAllUserProps,
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

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(user: CreateOrUpdateAllUserProps): Promise<void> {
    await this.userRepository.save(user);
  }

  async update(id: number, user: CreateOrUpdateAllUserProps): Promise<void> {
    await this.userRepository.update(id, user);
    await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
