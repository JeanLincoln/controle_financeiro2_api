import { User } from "../entities/user.entity";

export type CreateOrUpdateAllUserProps = Omit<
  User,
  "id" | "createdAt" | "updatedAt" | "transactions"
>;

export type OnlyUserProps = Omit<User, "transactions">;

export abstract class UserRepository {
  abstract findAll(): Promise<OnlyUserProps[]>;
  abstract findById(id: number): Promise<OnlyUserProps | null>;
  abstract findByEmail(email: string): Promise<OnlyUserProps | null>;
  abstract create(user: CreateOrUpdateAllUserProps): Promise<void>;
  abstract update(id: number, user: CreateOrUpdateAllUserProps): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
