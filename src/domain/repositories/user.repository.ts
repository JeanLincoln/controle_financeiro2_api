import { User } from "../entities/user.entity";

export type CreateOrUpdateAllUserProps = Omit<
  User,
  "id" | "createdAt" | "updatedAt"
>;

export abstract class UserRepository {
  abstract findAll(): Promise<User[]>;
  abstract findById(id: number): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(user: CreateOrUpdateAllUserProps): Promise<void>;
  abstract update(id: number, user: CreateOrUpdateAllUserProps): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
